---
id: react-hook
title: React Hook
sidebar_label: React Hook
---

> Hook 是一些可以让你在函数组件里“钩入” React state 及生命周期等特性的函数。

## 动机

- 难以复用组件中与状态相关的逻辑
- 逻辑复杂的组件难以开发和维护
- 类组件中的 this 增加学习成本
- 由于业务变动，已有的函数组件不得不改为类组件

## State Hook

> state hook 提供了一种可以在函数组件中添加状态的方式。通过 state hook，可以抽取状态逻辑，使组件变得可重用。开发者可以在不改变组件层次结构的情况下，去重用状态逻辑。

- `useState()`方法里面唯一的参数就是初始 state。该参数可以是数值、字符串，不一定必须是对象。
- `useState()`方法返回一个长度为 2 的数组，数组的第一个值是当前的 state,第二个是更新 state 的方法。

```jsx
import React, { useState } from 'react';

function Example() {
  // 声明一个叫 "count" 的 state 变量
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
```

上述示例中：

- 引入 React 中的`useState Hook`。他让我们在函数组件中存储内部 state。
- 在 `Example` 组件内部，我们通过调用 `useState` Hook 声明了一个新的 state 变量。它返回一对值给到我们命名的变量上。我们把变量命名为 `count`，因为它存储的是点击次数。我们通过传 `0` 作为 `useState` 唯一的参数来将其初始化为 `0`。第二个返回的值本身就是一个函数。它让我们可以更新 `count` 的值，所以我们叫它 `setCount`。
- 当用户点击按钮后，我们传递一个新的值给 `setCount`。React 会重新渲染 `Example` 组件，并把最新的 `count` 传给它。

**注意：**Hook 在 class 内部**不起作用**，但我们可以使用它们来取代 class。

### 使用多个 state 变量

最佳实践： 建议声明多个 state 的变量,因为它在更新 state 时总是替换它而非合并。

错误写法：

```jsx
function ExampleWithManyStates() {
  const [state, setState] = useState({age:42, fruit: 'banana'});
    ...
}
```

正确写法：

```jsx
function ExampleWithManyStates() {
  // 声明多个 state 变量
  const [age, setAge] = useState(42);
  const [fruit, setFruit] = useState('banana');
  const [todos, setTodos] = useState([{ text: '学习 Hook' }]);
    ...
}
```

## Effect Hook

> _Effect Hook_ 可以让你在函数组件中执行副作用操作。设置订阅以及手动更改 React 组件中的 DOM 都属于副作用。

在 React 组件中有两种常见副作用操作：需要清除的和不需要清除的。

### 无需清除的 effect

```jsx
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
```

上述示例中：

- 我们使用`useEffect`这个 Hook,告诉 React 组件需要在渲染后执行某些操作。React 会保存你传递的函数（我们将它称之为 “effect”），并且在执行 DOM 更新之后调用它。在这个 effect 中，我们设置了 document 的 title 属性，不过我们也可以执行数据获取或调用其他命令式的 API。
- 将 `useEffect` 放在组件内部让我们可以在 effect 中直接访问 `count` state 变量（或其他 props）。我们不需要特殊的 API 来读取它 —— 它已经保存函数作用域中。
- `useEffect`在第一次渲染之后*和*每次更新之后都会执行。React 保证了每次运行 effect 的时，DOM 都已经更新完毕。

### 需要清除的 Effect

刚刚我们研究了如何使用不需要清除的副作用，还有一些副作用是需要清除的。例如**订阅外部数据源**。这种情况下，清除工作是非常重要的，可以防止引起内存泄露！

```jsx
import React, { useState, useEffect } from 'react';

function ResizeLayout(props) {
  const [width, setWidth] = useState(200);

  useEffect(() => {
    function handleWidthChange(_width) {
      setWidth(_width);
    }

     document.body.addEventListener('resize', callback, props.width);
    // Specify how to clean up after this effect:
    return function cleanup() {
      document.body.removeEventListener('resize', callback, props.width);
    };
  });

  ...
}
```

上述示例中：

- `useEffect`中返回一个函数，React 将会在此执行清除操作。如此便可以将添加和移除订阅的逻辑放在一起。它们都属于 effect 的一部分。

- React 会在组件卸载的时候执行清除操作。

### 使用 Effect 的提示

#### 使用多个 Effect 实现关注点分离

使用 Hook 其中一个目的就是要解决 class 中生命周期函数经常包含不相关的逻辑，但又把相关逻辑分离到了几个不同方法中的问题。下述代码是将前述示例中的计数器和好友在线状态指示器逻辑组合在一起的组件：

```jsx
function ResizeLayoutWithCounter(props) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });

  const [width, setWidth] = useState(200);

  useEffect(() => {
    function handleWidthChange(_width) {
      setWidth(_width);
    }

    document.body.addEventListener('resize', callback, props.width);
    // Specify how to clean up after this effect:
    return function cleanup() {
      document.body.removeEventListener('resize', callback, props.width);
    };
  });
  // ...
}
```

**Hook 允许我们按照代码的用途分离他们，** 而不是像生命周期函数那样。React 将按照 effect 声明的顺序依次调用组件中的*每一个* effect。

#### 为什么每次更新都要运行 Effect

```jsx
function ResizeLayout(props) {
  //...
  useEffect(() => {
    //...
     document.body.addEventListener('resize', callback, props.width);
    // Specify how to clean up after this effect:
    return function cleanup() {
      document.body.removeEventListener('resize', callback, props.width);
    };
  });
  ...
}
```

我们并不需要写特定的代码来处理更新逻辑，因为 `useEffect` *默认*就会处理。它会在调用一个新的 effect 之前对前一个 effect 进行清理。为了说明这一点，下面按时间列出一个可能会产生的订阅和取消订阅操作调用序列：

```jsx
document.body.addEventListener('resize', callback, 100); // 运行第一个 effect

document.body.removeEventListener('resize', callback, 100); // 清除上一个 effect
document.body.addEventListener('resize', callback, 200); // 运行下一个 effect

document.body.removeEventListener('resize', callback, 200); // 清除上一个 effect
document.body.addEventListener('resize', callback, 300); // 运行下一个 effect

document.body.removeEventListener('resize', callback, 300); // 清除最后一个 effect
```

此默认行为保证了一致性，避免了在 class 组件中因为没有处理更新逻辑导致页面不会重新渲染的 bug。

#### 通过跳过 Effect 进行性能优化

在某些情况下，每次渲染后都执行清理或者执行 effect 可能会导致性能问题。这是很常见的需求，所以它被内置到了 `useEffect` 的 Hook API 中。如果某些特定值在两次重渲染之间没有发生变化，你可以通知 React **跳过**对 effect 的调用，只要传递数组作为 `useEffect` 的第二个可选参数即可：

```jsx
useEffect(() => {
  document.title = `You clicked ${count} times`;
}, [count]); // 仅在 count 更改时更新
```

上面这个示例中，我们传入 `[count]` 作为第二个参数。这个参数是什么作用呢？如果 `count`的值是 `5`，而且我们的组件重渲染的时候 `count` 还是等于 `5`，React 将对前一次渲染的 `[5]` 和后一次渲染的 `[5]` 进行比较。因为数组中的所有元素都是相等的(`5 === 5`)，React 会跳过这个 effect，这就实现了性能的优化。

对于有清除操作的 effect 同样适用：

```jsx
useEffect(() => {
  function handleWidthChange(_width) {
    setWidth(_width);
  }

  document.body.addEventListener('resize', callback, props.width);
  // Specify how to clean up after this effect:
  return function cleanup() {
    document.body.removeEventListener('resize', callback, props.width);
  };
}, [props.width]); // 仅在 props.width 发生变化时，重新订阅
```

> **注意：**
>
> 如果你要使用此优化方式，请确保数组中包含了**所有外部作用于中会随时间变化并且在 effect 中使用的变量**，否则你的代码会引用到先前渲染的旧变量。
>
> 如果想执行只运行一次的 effect(仅在组件挂载和卸载时运行)，可以传递一个空数组([])作为第二个参数，这就告诉 React,你的 effect 不依赖于 props 或 state 中的任何值，所以它永远都不需要重复执行。
>
> React 会等待浏览器完成画面渲染之后才会延迟调用`useEffect`,因此会使得额外操作很方便。

## 自定义 Hook

> 自定义 Hook 是一个函数，其名称以 “use” 开头，函数内部可以调用其他的 Hook。

下面我们自定义一个记录点击次数的 hook,每次点击，count 都会自动增加 1 次，且支持自定义点击事件：

```react
function useButtonClick({count,onCick}){
    const [num,setNum] = useState(count||0);

    const handleClick = useCallback((curNum)=>{
        if(onClick){
            setNum(curNum+1);
            onClick(curNum+1);
        }
    });
    return [num, handleClick]
}
```

与 React 组件不同的是，自定义 Hook 不需要的具有特殊标识。我们可以自由的决定它的参数是什么，以及它应该返回什么。

### 使用自定义 Hook

文章开头的例子可以用下面的方式实现：

```jsx
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useButtonClick({
    count: 0,
    onClick: (value) => console.log(value),
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={setCount}>Click me</button>
    </div>
  );
}
```

- 自定义 Hook 是一种自然遵循 Hook 设计的约定，并不是 React 的特性
- 自定义 Hook 必须以 “use”
- 在两个组件中使用相同的 Hook 不会共享状态，每次使用自定义 Hook 时，其中的所有 state 和副作用都是完全隔离的。

## Hook 使用规则

Hook 本质就是 JavaScript 函数，但是在使用它时需要遵循两条规则。我们提供了一个 [linter 插件](https://www.npmjs.com/package/eslint-plugin-react-hooks)来强制执行这些规则：

- 只在最顶层使用 Hook

  不要在循环，条件或嵌套函数中调用 Hook,确保总是在你的 React 函数的最顶层调用他们。遵守这条规则，你就能确保 Hook 在每一次渲染中都按照同样的顺序被调用。这让 React 能够在多次的`useState`和`useEffect`调用之间保持 Hook 状态的正确。

- 只在 React 函数中调用 Hook，包括在自定义的 Hook 中调用其它 Hook。遵循此规则，确保组件的状态逻辑在代码中清晰可见。

## 总结

希望此篇文章能让我们快速了解 Hook 概念、useState、useEffect、自定义 Hook 等一系列的概念，了解 Hook 的以下优点：

- Hooks 可以帮助我们在不重写组件结构的情况下复用状态处理逻辑
- Hooks 允许我们根据相关需求(例如设置订阅或获取数据)将一个组件分割成更小的函数
- Hooks 允许我们在 class 之外使用 state 和其它 react 特性

## 参考资料

- [Hook](https://zh-hans.reactjs.org/docs/hooks-intro.html)
- [React-hook 简介](https://segmentfault.com/a/1190000019061074#articleHeader2)
- [理解 React-hook](https://www.cnblogs.com/qcloud1001/p/9930781.html)
