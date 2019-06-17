---
id: react-component-test-guide
title: 测试React组件
sidebar_label: 测试React组件
---

使用[react-testing-library](https://github.com/testing-library/react-testing-library)测试 React 组件。

## 指导原则

> [The more your tests resemble the way your software is used, the more confidence they can give you.](https://twitter.com/kentcdodds/status/977018512689455106)
>
> [你的测试越像你的软件使用方式，你就会对你的软件越有信心。](https://twitter.com/kentcdodds/status/977018512689455106)

按照终端用户使用组件的方式来编写测试。

## 基本方法

对于 React 组件，我们会使用 React DOM 来测试它。为了确保它表现得和浏览器中一样，我们会把代码渲染的部分包裹起来，并更新为`ReactTestUtils.act()`调用。我们可以使用[react-testing-library](https://github.com/testing-library/react-testing-library)简化 React 组件的单元测试。

## 准备

通过[ts-lib-scripts](https://github.com/sinoui/ts-lib-scripts)创建一个 TypeScript 项目，然后添加以下依赖：

```shell
yarn add @types/react @types/react-dom react react-dom @sinoui/http @sinoui/use-data-api
yarn add @testing-library/react jest-dom --dev
```

## 例子一枚

一个来自 React 官网的例子：计数器组件：

```tsx
function Example() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });
  return (
    <div>
      <p data-testid="label">You clicked {count} times</p>
      <button data-testid="button" onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

### 使用'react-dom/test-utils'测试

```tsx
import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import 'jest-dom/extend-expect';
import Counter from './Counter';

let container: HTMLDivElement;
beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

it('渲染并更新计数', () => {
  // 测试首次渲染和 effect
  act(() => {
    ReactDOM.render(<Counter />, container);
  });

  const button = container.querySelector('[data-testid="button"]');
  const label = container.querySelector('[data-testid="label"]');

  expect(label).toHaveTextContent('You clicked 0 times');
  expect(document.title).toBe('You clicked 0 times');

  // 测试第二次渲染和 effect
  act(() => {
    button!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
  expect(label).toHaveTextContent('You clicked 1 times');
  expect(document.title).toBe('You clicked 1 times');
});
```

### 使用'react-testing-library'测试

```tsx
import React from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react';
import 'jest-dom/extend-expect';
import Counter from './Counter';

afterEach(cleanup);

test('渲染并更新计数', () => {
  // 测试首次渲染和 effect
  const { getByTestId } = render(<Counter />);

  const label = getByTestId('label');
  const button = getByTestId('button');

  expect(label).toHaveTextContent('You clicked 0 times');
  expect(document.title).toBe('You clicked 0 times');

  // 测试第二次渲染和 effect
  fireEvent.click(button);
  expect(label).toHaveTextContent('You clicked 1 times');
  expect(document.title).toBe('You clicked 1 times');
});
```

使用`react-testing-library`测试 React 组件简洁多了。

### 分解一下

#### 在 DOM 环境中渲染被测试组件

在每次测试组件时，需要将组件渲染到 DOM 中。

react-dom/test-utils:

```tsx
import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import Counter from './Counter';

let container: HTMLDivElement;
beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

it('渲染并更新计数', () => {
  act(() => {
    ReactDOM.render(<Counter />, container);
  });
});
```

react-testing-library:

```tsx
import React from 'react';
import { render } from '@testing-library/react';
import Counter from './Counter';

test('渲染并更新计数', () => {
  const result = render(<Counter />);
}
```

#### 清除组件

在每个测试结束时，需要清除渲染出来的组件。

react-dom/test-utils:

```tsx
afterEach(() => {
  document.body.removeChild(container);
  container = null;
});
```

react-testing-library:

```tsx
import { cleanup } from '@testing-library/react';

afterEach(cleanup);
```

#### 获取组件内的 DOM 元素

在验证组件是否按照预期渲染出来或者模拟用户与组件进行交互，都需要获取组件内的 DOM 元素。推荐使用`data-testid="testid"`来定位 DOM 元素。

首先需要在 DOM 元素上添加`data-testid`，如下：

```tsx
<p data-testid="label">You clicked {count} times</p>
```

在单元测试中，我们可以通过 CSS 的属性选择器查找到这个元素：

react-dom/test-utils:

```tsx
const label = container.querySelector('[data-testid="label"]');
```

react-testing-library:

```tsx
const { getByTestId } = render(<Counter />);

const label = getByTestId('label');
```

#### 触发 DOM 事件

用户会与组件渲染出来的 UI 进行交互。我们需要模拟用户与组件的交互动作，也就是发送 DOM 事件，然后验证组件是否按照预期重新渲染了。

我们来看看怎么触发事件：

react-dom/test-utils:

```tsx
const button = container.querySelector('[data-testid="button"]');
act(() => {
  button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
});
```

react-testing-library:

```tsx
const button = getByTestId('button');
fireEvent.click(button);
```

#### 验证生成的 DOM

使用[jest-dom](https://github.com/testing-library/jest-dom)来验证生成的 DOM。

例子 1：`.toHaveTextContent`验证 DOM 节点是否包含指定的文本内容：

```tsx
const label = getByTestId('label');

expect(label).toHaveTextContent('You clicked 0 times');
```

例子 2：`.toHaveClass`验证 DOM 节点是否包含指定的`css class`：

```tsx
expect(getByTestId('button')).toHaveClass('btn', 'btn--disabled');
```

例子 3：`.toContainHTML`验证 DOM 节点是否包含指定的 HTML 内容：

```tsx
expect(getByTestId('button')).toContainHTML('<icon>button</icon>点击');
```

还有很多这样的方法，请参考[jest-dom](https://github.com/testing-library/jest-dom)的说明。

### 小结

测试一个 React 组件，大致分成这几个步骤：

1. 在 DOM 中渲染组件
2. 验证组件初始化渲染出的 DOM
3. 模拟用户与组件的交互，触发 DOM 事件
4. 验证组件重新渲染后的 DOM

[react-testing-library](https://github.com/testing-library/react-testing-library)能帮助我们简化 React 组件测试，推荐使用。

[jest-dom](https://github.com/testing-library/jest-dom)能帮助你快速写出 DOM 状态断言（即：快速验证 DOM 是否符合预期），推荐使用。

## 更复杂一点的例子

我们现在再来测试一个加载数据的例子——加载并展示一组人员的组件：

```tsx
import React from 'react';
import useDataApi from '@sinoui/use-data-api';

const url = '/users';

function UserList() {
  const { data, isLoading, doFetch } = useDataApi<string[]>(url, []);

  return (
    <div>
      <button type="button" onClick={() => doFetch(url)}>
        重新加载数据
      </button>
      {isLoading ? (
        <div>加载中</div>
      ) : (
        <ul>
          {data.map((user) => (
            <li key={user}>{user}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default UserList;
```

对应的单元测试：

```tsx
import React from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react';
import http from '@sinoui/http';
import UserList from './UserList';

jest.mock('@sinoui/http');

afterEach(cleanup);

test('初始加载并渲染数据', async () => {
  (http.get as jest.Mock)
    .mockResolvedValueOnce(['用户 0'])
    .mockResolvedValue(['用户 1', '用户 2', '用户 3', '用户 4']);

  // 初始加载数据
  const { findAllByText, getByText, queryByText } = render(<UserList />);

  expect(queryByText('加载中')).toBeDefined();

  const users = await findAllByText(/用户 [0-9]/);
  expect(users).toHaveLength(1);
  expect(queryByText('加载中')).toBeNull();

  // 重新加载数据
  fireEvent.click(getByText('重新加载数据'));
  expect(queryByText('加载中')).toBeDefined();

  await expect(findAllByText(/用户 [0-9]/)).resolves.toHaveLength(4);
  expect(queryByText('加载中')).toBeNull();
});
```

这个例子出现了一些新的东西，主要是两点：

- 等待元素出现：等待异步事件完成，检查 DOM 情况。如等待加载用户数据完成后，我们需要检查 DOM 中显示了一组用户。
- 判断 DOM 节点是否存在。

### 等待元素出现

如果需要测试加载数据完成后组件新渲染出来的 DOM 元素，则需要用到这一小节用到的知识点：

首先介绍一个基础函数——`waitForElement`：

```jsx
import { waitForElement } from '@testing-library/react';

it('等待元素出现', async () => {
  const { getAllByText } = render(<UserList />);

  const users = await waitForElement(() => getAllByText(/用户 [0-9]/));
});
```

`waitForElement`会等待`getAllByText(/用户 [0-9]/)`获取到元素时结束。否则它会一直等待。它是怎么实现的呢？

首先掌握一个知识点：调用`getAllByText()`方法，如果没找到符合条件的 DOM 元素，会抛出异常，找到则返回符合条件的所有 DOM 元素。

调用`waitForElement(callback)`，它首先会调用一次`callback`，如果捕捉到`callback`的异常，则进入等待环节；否则直接将`callback`的执行结果返回。在等待环节，`waitForElement`会使用[Mutation Observer](https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver)开启 DOM 变更监听，只要 DOM 元素发生变化，则再次调用`callback`，尝试获取到元素。除非超时，否则会一直处于等待环节。

react-testing-library 提供了更便捷的`find`系列方法，如`getAllByText()`有对应的`findAllByText()`，用法如下：

```tsx
import { waitForElement } from '@testing-library/react';

it('等待元素出现', async () => {
  const { findAllByText } = render(<UserList />);

  const users = await findAllByText(/用户 [0-9]/);
});
```

`find`系列方法内部使用的是`waitForElement`方法。

### 判断 DOM 节点是否存在

在上一小节，我们已经知道，`getAllByText()`方法在获取不到 DOM 元素时，会抛出异常，所以，如果要判断 DOM 节点不存在，有一种写法：

```tsx
expect(() => getByText('加载中')).toThrow();
```

但是这样的写法实在别扭。我们可以使用`query`系列的方法获取 DOM 节点，如果没找到，则会返回`null`：

```txt
const { queryByText } = render(<UserList />);

expect(queryByText('加载中')).toBeNull();
```

### 小结

react-testing-library 提供了很多便捷的查找 DOM 元素的方法。这些方法有一个规则：

- `query`系列 - 查询 DOM 元素，如果没找到 DOM 元素，则会返回`null`，否则返回找到的 DOM 元素。
- `get`系列 - 查询 DOM 元素，如果没有找到 DOM 元素，则抛出异常，否则返回找到的 DOM 元素。
- `find`系列 - 查询 DOM 元素，如果没有找到 DOM 元素，则一直等待，直到有 DOM 元素返回或者超时。

还有一个小规则：

- 查询单个元素 - 方法中不带上`All`的，则是查询单个元素的。等同于`querySelector`。
- 查询一组元素 - 方法中带上`All`的，则是查询一组元素的。等同于`querySelectorAll`。

我们可以通过以下途径查找元素：

- `ByText` - 通过文本查找元素
- `ByTestId` - 通过`data-testid`属性查找元素
- `ByLabelText` - 通过`label`或者`aria-label`属性查找元素
- `ByPlaceholder` - 通过输入框的`placehoder`属性查找元素
- `ByDisplayValue` - 通过表单项元素的可见值（大约等同于表单项值）查找元素
- `ByTitle` - 通过`title`属性查找元素
- `ByRole` - 通过`aria-role`属性查找元素
- `ByAltText` - 通过`img`的`alt`属性查找元素

## 结束语

今天我们学习了 React 组件的单元测试之术。对于 UI 组件的单元测试，我们应站在使用者的角度，不要让测试代码过分关注组件内部实现。这样的单元测试才会更健壮、稳固，在未来会起到更大的作用：比如我需要优化组件的实现，但是不能改变它的使用方式和功能，这时我们的单元测试就会起到极大的作用，不需要做测试代码调整，只要修改的代码通过这些测试，则表明这些修改没有影响到组件使用者。

之前我们在内部使用[Enzyme](https://github.com/airbnb/enzyme)对组件进行单元测试，很容易让测试代码陷入到组件的内部实现细节中去，这样的测试代码很脆弱，只要我们修改一点组件代码，就有可能需要同步修改测试代码。到后期，我们发现很难坚持这样的 React 组件单元测试。

可能你觉得今天介绍的不再是单元测试，更像集成测试。但不管怎样，找到适合我们自身的测试之道，并对我们自身的工作流程有益处，才是我们需要考虑的。

让我们站在使用者的角度，一起用[react-testing-library](https://github.com/testing-library/react-testing-library)来测试 React 组件吧。
