---
id: about-id
title: 关于 id
sidebar_label: 关于 id
---

id ( **Id**entity document )，是唯一编码的意思。在日常编程中，为数据生成 `id` 是非常常见的事情。我们常常在后端生成 `id`，因为在后端更容易保证 `id` 的唯一性。但是有一些场景需要在前端为数据生成 `id`，今天这篇文章就是讨论在前端生成 `id` 的一些事情。

在做表单项组件时，我们需要为标签和表单域生成一个 `id`，让它们彼此之间能够关联上，如下所示：

```tsx
<FormItem>
  <Label>姓名</Label>
  <input type="text" name="userName" />
</FormItem>
```

我们期望生成的 DOM 如下：

```html
<div>
  <label for="1x3s81l">姓名</label>
  <input id="1x3s81l" type="text" name="userName" />
</div>
```

我们为 `input` 生成了 `1x3s81l` id，这个 `id` 需要确保在整个前端应用级别上是全局唯一的。

另一个场景，如表单设计器、流程设计器，它们会在设计的过程中产生很多数据，而这些数据是暂存在前端的，所以需要为这些暂存的数据在前端生成 `id`，以区分这些数据。

本章节将为大家介绍如何在前端生成 `id`，内容包括：

- 为数据生成 id
- 为组件产生 `id`
- 与服务器端渲染结合
- 一个应用自增长 id 的例子

## 为数据生成 id

首先我们来了解几种 id 生成方案：

### shortid 短码 id

```ts
import shortid from 'shortid';

console.log(shortid.generate());
// e3L4_xbA
```

它会生成 7 位短码。大家可能会有疑惑，7 位短码，它不会重复么？从实现上来说，shortid 是由 `时间戳`、`计数器`、`随机字符串` 组合而生成的，从这些因子来看是不会重复的，可以看看 [专业人士的解释](https://github.com/dylang/shortid/issues/36#issuecomment-92437011)。7 位短码不会被穷举吧？估算一下，每一位短码都有 64 种可能，那么就会有 `64^7` 个 shortid，大概是四万亿。足以应付日常数据的 `id` 唯一性了。如果需要更强唯一性的 `id`，那么接着往下看 uuid。

### uuid 通用唯一识别码

uuid 由一组 32 位数的十六进制数字组成，从理论上来说， UUID 的总数有 16^32 = 2^128，约等于 3.4 x 10^123，相较于短码， uuid 更能够确保唯一性。

```ts
import uuid from 'uuid/v4';

console.log(uuid());
// a296394c-cc86-470e-afec-1aa1592dca71
```

或者：

```ts
import nanoid from 'nanoid';

console.log(nanoid());
```

### 自增长 id

自增长 id，又称为序列 id。大部分数据库支持的序列，主要作用就是为了生成 id。如果数据只是在前端范围使用，不需要传递到后端，那么使用自增长 id 是一个不错的选择。如我们可以为表单项生成 `id`。它一般如下实现：

uuid.ts:

```ts
let count = 0;

/**
 * 生成新的标签id
 */
function uuid() {
  const id = count;
  count += 1;
  return `tab-${id}`;
}
```

### 选择哪种方案为数据生成 id ？

我们可以根据具体情况选择上面的三种 id 方案：

- 如果我们要生成需要后端存储的数据的 id，我们需要采用 `shortid` 或者 `uuid`，（具体是 `shortid` 还是 `uuid`，看后端要求，或者看唯一性要求）
- 如果我们要生成只是在前端页面级别确保唯一性的数据的 id，我们采用 `shortid` 或者 `自增长id` 均可
- 如果我们生成的前端级别的 id 需要方便开发人员阅读、调试，建议采用 `自增长id`
- 如果我们生成的前端级别的 id 需要保证序列的语义，就需要采用 `自增长id`

另外，自增长 id 实现的代码量最少。这个也可以作为选择的一个指标。

## 为 React 组件生成 id

为 React 组件生成 id，需要确保在整个组件生命周期内，id 是不变的。

看一个实例：

```tsx
import React, { useState } from 'react';
import uuid from './uuid'; // 采用自增长id

function FormItem({ children }) {
  const [id] = useState(uuid);
  const { label, input } = splitChildren(children); // splitChildren 会从 children 中识别出 label 和 input 元素

  return (
    <div>
      {React.cloneElement(label, { htmlFor: id })}
      {React.cloneElement(input, { id })}
    </div>
  );
}
```

上面的实例采用了 `useState(fn)` 方案，这个方案优于 `useMemo()`，因为 React 官网已经明确表示：

> 你可以把 useMemo 作为性能优化的手段，但不要把它当成语义上的保证。

也就是说，下面的代码并不保证 `在整个组件生命周期内，id 是不变的` 这个规则：

```ts
const id = useMemo(() => uuid(), []);
```

但是 `useState(fn)` 不一样，它只会在初始化状态时调用初始化函数 `fn`。而组件只会在创建时初始化状态。这样我们就确保了 `id` 的不变性。

但是在 [React concurrent](https://zh-hans.reactjs.org/docs/concurrent-mode-intro.html) 模式下，你会发现会在组件初始化时执行两遍 `uuid` 方法，但是这不会破坏 `在整个组件生命周期内，id 是不变的` 这个规则。

在非并发模式下，可能生成的 DOM 如下：

```html
<form>
  <div>
    <label for="input_1">姓名</label>
    <input type="text" id="input_1" name="userName" />
  </div>
  <div>
    <label for="input_2">年龄</label>
    <input type="number" id="input_2" name="age" />
  </div>
</form>
```

在并发模式下，生成的 DOM 则如下：

```html
<form>
  <div>
    <label for="input_2">姓名</label>
    <input type="text" id="input_2" name="userName" />
  </div>
  <div>
    <label for="input_4">年龄</label>
    <input type="number" id="input_4" name="age" />
  </div>
</form>
```

如果你的程序对于序列的连续性不关注，则不用理会这个细节。如果你的程序非关注这个细节，你做出抉择吧，等到 React 正式推出并发模式再考虑，还是现在就往下看一下一种可能的解决方案：

```tsx
import React from 'react';
import React, { useState } from 'react';
import uuid from './uuid'; // 采用自增长id

function InnerFormItem({ id, children }) {
  const { label, input } = splitChildren(children); // splitChildren 会从 children 中识别出 label 和 input 元素

  return (
    <div>
      {React.cloneElement(label, { htmlFor: id })}
      {React.cloneElement(input, { id })}
    </div>
  );
}

function FormItem(props) {
  const [id, setId] = useState(null);

  useEffect(() => {
    setId(uuid());
  }, []);

  if (id === null) {
    return null;
  }
  return <InnerFormItem id={id} {...props} />;
}
```

当然，你可以将它包装成一个 hook：

```ts
function useId(render: (id: string) => React.ReactNode) {
  const [id, setId] = useState(null);

  useEffect(() => {
    setId(uuid());
  }, []);

  if (id === null) {
    return null;
  }
  return render(id);
}
```

```tsx
import React from 'react';
import useId from './useId';

function FormItem(props) {
  const { label, input } = splitChildren(children); // splitChildren 会从 children 中识别出 label 和 input 元素

  return useId((id) => (
    <div>
      {React.cloneElement(label, { htmlFor: id })}
      {React.cloneElement(input, { id })}
    </div>
  ));
}
```

> 谨记，当你的程序关注自增长 id 的连续性，才需要考虑在 `useEffect(fn, [])` 中生成 id，否则采用 `useState(fn)` 方案生成 id。

## 服务器端渲染

为 React 组件生成 id，需要考虑服务器端渲染与浏览器端渲染是否能够保持生成的 id 一致。对于 shortid 和 uuid，基本上没有可能做到这一点，但是对于自增长 id 还是可以努力一下的。

首先解释一下为什么需要考虑服务器端与浏览器端渲染保持生成的 id 一致。

例如下面的代码：

```tsx
import React, { useState } from 'react';
import shortid from 'shortid';

function App() {
  const [id] = useState(() => shortid.generate());

  return <div id={id}>{id}</div>;
}
```

由服务器端生成的 html 如下：

```html
<div id="x1212xa">x1212xa</div>
```

但是你最终在浏览器上会发现它的 DOM 如下：

```html
<div id="x1212xa">112x1x</div>
```

这是为什么呢？看一下 [React 官方的解释](https://zh-hans.reactjs.org/docs/react-dom.html#hydrate)：

> React 希望服务端与客户端渲染的内容完全一致。React 可以弥补文本内容的差异，但是你需要将不匹配的地方作为 bug 进行修复。

也就是说，React 可以修复文本内容的差异，如`<div>`中不同的 id 内容，但是 React 不会去检查属性的不匹配，所以就出现上面的 bug。

这个 bug 会不会带来真正的问题，需要看实际场景。如果你的程序逻辑依赖 `id` 属性，而且你的程序又想支持服务器端渲染，那么你就必须处理这个 bug。

提供几种解决思路，依照实际情况抉择。

### 思路 1：程序逻辑不要依赖 DOM 的 id

如果你的程序能够做到不依赖 DOM 的 id，那么这种不同步的 bug 可以置之不理。如上面的 FormItem 的例子，它生成 id 只是为了能够将标签和输入框进行关联。

### 思路 2：采用自增长 id，并提供复位方法

这是在思路 1 受阻的情况下通常采纳的方法。很多依赖 DOM id 的库采纳了这种方法，如：

- [react-tabs](https://github.com/reactjs/react-tabs) 提供的 [resetIdCount()](https://github.com/reactjs/react-tabs#resetidcounter-void) 方法
- [react-beautiful-dnd](https://github.com/atlassian/react-beautiful-dnd) 提供的 [resetServerContext](https://github.com/atlassian/react-beautiful-dnd/blob/master/docs/api/reset-server-context.md)
- [@sinouiincubator/tab-group](https://github.com/sinouiincubator/tab-group) 提供的 [resetIdCount()](https://sinouiincubator.github.io/tab-group/api-reset-id-count)

这种方案采用的是自增长 id，并相对应的 `reset()` 方法。在服务器端每次渲染页面前调用 `reset()`，让 id 计数器从 `0` 开始计数，这样就能确保服务器端生成的 id 与浏览器端生成的 id 保持一致。

### 思路 3：采用预编译，提前为组件生成固定的 id

这是 [styled-components](http://localhost:3000/sinoui-guide/docs/about-id) 为组件生成唯一性的且支持服务器端渲染的 css 类名而采用的方法。它提供了 [styled-components-babel-plugin](https://www.styled-components.com/docs/tooling#serverside-rendering) 这个 Babel 插件，在编译时为每个 styled 组件生成唯一的组件 id（通过此组件 id 能够生成确定的 css 类名），从而确保在服务器端生成的样式代码能够在浏览器端直接用上。

通过 styled-components-babel-plugin 编译后的代码类似如下的代码：

```tsx
const RedButton = styled.button.withConfig({
  displayName: 'RedButton',
  componentId: 'leiajw-0',
})(['color:red;']);
```

在页面中展现此组件，可能会是类似如下的 DOM：

```html
<button class="RedButton-leiajw-0 iyoQNP">点击我</button>
```

思路 3 有比较严格的要求，必须是基于静态代码才能在编译期做一些事情，如类似 styled-components 这类包装组件样式的库。

## 案例分析

分析一个表单设计器的例子。拖拽式、所见即所得的表单设计器中，需要为每个表单字段生成一个在表单级别唯一的 id，并且不能与已经删除的表单字段的 id 重复，而且生成的表单字段具有一定的可读性。如果不考虑可读性，我们可以选择 shortid 或者 uuid。因为需要考虑到可读性，所以就选择了自增长 id。它的实现方案如下：

```tsx
function Demo() {
  const [formConfig, setFormConfig] = useState({
    count: 0, // 表单字段 id 的计数器
    fieldItems: [], // 表单字段
  });

  const addField = (field) => {
    setFormConfig(
      produce((draft) => {
        const id = `field-item-${draft.count}`;
        draft.count += 1;
        draft.fieldItems.push({
          ...fieldItem,
          id,
        });
      }),
    );
  };

  return <FormDesigner data={formConfig} addField={addField} />;
}
```

如果需要将表单设计器生成的表单保存到后端服务器上，需要同时保存 `count` 和 `fieldItems`。保存 `count` 至关重要。

## 小结

关于的 id 的知识就介绍到这。我们学习了通过 `shortid`、`uuid` 和 `序列` 来生成 id，如何为 React 组件生成 id，并学习了服务器端渲染中如何处理 id 一致性问题，最后通过一个简单的表单设计器的实例讲解了如何应用 id。
