---
id: context-and-reducer-hook
title: 使用Context和reducer hook做状态管理
sidebar_label: 使用Context和reducer hook做状态管理
---

## 目标

- 学习使用 Context 和 Hook 管理页面组件级别的状态
- 学习状态管理逻辑复用的模式：自定义 Hook 和 unstated-next

## 快速开始：计数器例子

大家学习过 React Hook，知道自定义 Hook 可以封装状态管理逻辑，并达到复用、共享的效果。这次从一个计数器例子开始。

```tsx
import React, { useState } from 'react';
import { render } from 'react-dom';

function CounterDisplay() {
  let [count, setCount] = useState(0);
  let decrement = () => setCount(count - 1);
  let increment = () => setCount(count + 1);

  return (
    <div>
      <button onClick={decrement}>-</button>
      <p>You clicked {count} times</p>
      <button onClick={increment}>+</button>
    </div>
  );
}

render(<CounterDisplay />, document.getElementById('root'));
```

如果我们要复用计数器状态管理这部分代码，我们可以使用自定义 hook：

```tsx
import React, { useState } from 'react';
import { render } from 'react-dom';

function useCounter() {
  let [count, setCount] = useState(0);
  let decrement = () => setCount(count - 1);
  let increment = () => setCount(count + 1);

  return { count, decrement, increment };
}

function CounterDisplay() {
  const { count, decrement, increment } = useCounter();

  return (
    <div>
      <button onClick={decrement}>-</button>
      <p>You clicked {count} times</p>
      <button onClick={increment}>+</button>
    </div>
  );
}

function AnotherCounterDisplay() {
  const { count, decrement, increment } = useCounter();

  return (
    <div>
      <button onClick={decrement}>-</button>
      <p>当前分数：{count}</p>
      <button onClick={increment}>+</button>
    </div>
  );
}

render(
  <>
    <CounterDisplay />
    <AnotherCounterDisplay />
  </>,
  document.getElementById('root'),
);
```

通过努力，`CounterDisplay`和`AnotherCounterDisplay`两个组件共享了计数状态管理逻辑。但如果要求这两个组件共享状态怎么办？这时候，我们可能会想到状态提升，如下所示：

```tsx
import React, { useState } from 'react';
import { render } from 'react-dom';

interface Counter {
  count: number;
  decrement: () => void;
  increment: () => void;
}

function useCounter(): Counter {
  let [count, setCount] = useState(0);
  let decrement = () => setCount(count - 1);
  let increment = () => setCount(count + 1);

  return { count, decrement, increment };
}

function CounterDisplay(props: { counter: Counter }) {
  const { count, decrement, increment } = useCounter();

  return (
    <div>
      <button onClick={decrement}>-</button>
      <p>You clicked {count} times</p>
      <button onClick={increment}>+</button>
    </div>
  );
}

function AnotherCounterDisplay(props: { counter: Counter }) {
  const { count, decrement, increment } = useCounter();

  return (
    <div>
      <button onClick={decrement}>-</button>
      <p>当前分数：{count}</p>
      <button onClick={increment}>+</button>
    </div>
  );
}

function App() {
  const counter = useCounter();

  return (
    <>
      <CounterDisplay counter={counter} />
      <AnotherCounterDisplay counter={counter} />
    </>
  );
}

render(<App />, document.getElementById('root'));
```

如果需要共享状态的组件与共同父组件层级比较深，那么我们可以使用 React Context 简化状态提升需要逐级传输组件属性：

```tsx
import React, { useState, useContext } from 'react';
import { render } from 'react-dom';

interface Counter {
  count: number;
  decrement: () => void;
  increment: () => void;
}

function useCounter(): Counter {
  let [count, setCount] = useState(0);
  let decrement = () => setCount(count - 1);
  let increment = () => setCount(count + 1);

  return { count, decrement, increment };
}

const CounterContext = React.createContext<Counter>(null);

function CounterDisplay() {
  const counter = useContext(CounterContext);

  return (
    <div>
      <button onClick={decrement}>-</button>
      <p>You clicked {count} times</p>
      <button onClick={increment}>+</button>
    </div>
  );
}

function AnotherCounterDisplay() {
  const counter = useCounter(CounterContext);

  return (
    <div>
      <button onClick={decrement}>-</button>
      <p>当前分数：{count}</p>
      <button onClick={increment}>+</button>
    </div>
  );
}

function CounterInfo() {
  const counter = useCounter(CounterContext);

  return <div>当前计数：{counter}</div>;
}

function Header() {
  return (
    <div>
      <h1>计数器</h1>
      <CounterInfo />
    </div>
  );
}

function App() {
  const counter = useCounter();

  return (
    <CounterContext.Provider value={counter}>
      <div>
        <Header />
        <CounterDisplay />
        <AnotherCounterDisplay />
      </div>
    </CounterContext.Provider>
  );
}

render(<App />, document.getElementById('root'));
```

现在要求`AnotherCounterDisplay`的状态单独管理，依然可以用 Context：

```tsx
function App() {
  const counter = useCounter();

  const anotherCounter = useCounter();

  return (
    <CounterContext.Provider value={counter}>
      <div>
        <Header />
        <CounterDisplay />
        <CounterContext.Provider value={anotherCounter}>
          <AnotherCounterDisplay />
        </CounterContext.Provider>
      </div>
    </CounterContext.Provider>
  );
}
```

diff：

```diff
function App() {
  const counter = useCounter();

+  const anotherCounter = useCounter();

  return (
    <CounterContext.Provider value={counter}>
      <div>
        <Header />
        <CounterDisplay />
+        <CounterContext.Provider value={anotherCounter}>
          <AnotherCounterDisplay />
+        </CounterContext.Provider>
      </div>
    </CounterContext.Provider>
  );
}
```

我们也可以将再创建一个组件，专门用来提供计数状态管理的上下文：

```tsx
function CounterContextProvider({ children }: { children: React.ReactNode }) {
  const counter = useCounter();

  return (
    <CounterContext.Provider value={counter}>
      {children}
    </CounterContext.Provider>
  );
}
```

这样我们的代码如下所示：

```tsx
function App() {
  return (
    <CounterContextProvider>
      <div>
        <Header />
        <CounterDisplay />
        <CounterContextProvider>
          <AnotherCounterDisplay />
        </CounterContextProvider>
      </div>
    </CounterContextProvider>
  );
}
```

diff:

```diff
function App() {
- const counter = useCounter();
  return (
-    <CounterContext.Provider value={counter}>
+    <CounterContextProvider>
      <div>
        <Header />
        <CounterDisplay />
+        <CounterContextProvider>
          <AnotherCounterDisplay />
+        </CounterContextProvider>
      </div>
-    </CounterContext.Provider>
+    </CounterContextProvider>
  );
}
```

稍微实践一下，我们会发现：为自定义 hook 创建的上下文这种模式很有用。我们来整理一下这种模式的计数器例子：

```tsx
interface Counter {
  count: number;
  decrement: () => void;
  increment: () => void;
}

// 首先定义一个React Hook

function useCounter() {
  let [count, setCount] = useState(0);
  let decrement = () => setCount(count - 1);
  let increment = () => setCount(count + 1);

  return { count, decrement, increment };
}

// 然后定义一个上下文：

const CounterContext = React.createContext<Counter>(null);

// 之后我们创建一个提供上下文的Provider组件：

function CounterContextProvider({ children }: { children: React.ReactNode }) {
  const counter = useCounter();

  return (
    <CounterContext.Provider value={counter}>
      {children}
    </CounterContext.Provider>
  );
}

// 之后，我们就可以尽情地使用了：

function App() {
  <CounterContextProvider>
    <CounterDisplay />
  </CounterContextProvider>;
}

function CounterDisplay() {
  const counter = useContext(CounterContext);

  return <div>{counter.count}</div>;
}
```

这种模式的核心点就是需要自定义 hook。然后都会有第二步和第三步，那么我们可以继续提炼一下（第二步和第三步）：

```tsx
function createContainer<T>(useCustomHookFn: () => T) {
  const ContainerContext = React.createContext<T | null>(null);
  const Provider = ({ children }: { children: React.ReactNode }) => {
    const result = useCustomHookFn();

    return (
      <ContainerContext.Provider value={result}>
        {children}
      </ContainerContext.Provider>
    );
  };

  const useContainer = () => {
    return useContext(ContainerContext);
  };

  return { Provider, useContainer };
}
```

我们使用`createContainer`来简化自定义 hook 上下文这种模式：

```tsx
// 首先定义一个React Hook

function useCounter() {
  let [count, setCount] = useState(0);
  let decrement = () => setCount(count - 1);
  let increment = () => setCount(count + 1);

  return { count, decrement, increment };
}

// 然后定义计数容器
const CounterContainer = createContainer(useCounter);

// 之后，我们就可以尽情地使用了：

function App() {
  <CounterContainer.Provider>
    <CounterDisplay />
  </CounterContainer.Provider>;
}

function CounterDisplay() {
  const counter = CounterContainer.useContainer();

  return <div>{counter.count}</div>;
}
```

这里，我们引入了一个`container`名词，用来表示包装自定义 hook 到上下文，我们姑且称之为“**hook 容器**”，或者简称为“**容器**”。

刚刚的`createContainer`已经由[unstated-next](https://github.com/jamiebuilds/unstated-next)实现：

```shell
yarn add unstated-next
```

```tsx
import { createContainer } from 'unstated-next';

// 首先定义一个React Hook

function useCounter() {
  let [count, setCount] = useState(0);
  let decrement = () => setCount(count - 1);
  let increment = () => setCount(count + 1);

  return { count, decrement, increment };
}

// 然后定义计数容器
const CounterContainer = createContainer(useCounter);

// 之后，我们就可以尽情地使用了：

function App() {
  <CounterContainer.Provider>
    <CounterDisplay />
  </CounterContainer.Provider>;
}

function CounterDisplay() {
  const counter = CounterContainer.useContainer();

  return <div>{counter.count}</div>;
}
```

## 页面组件的状态管理与**hook 容器**模式

TODO: 待补充
