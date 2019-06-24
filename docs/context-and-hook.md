---
id: context-and-hook
title: 使用Context和hook做状态管理
sidebar_label: 使用Context和hook做状态管理
---

## 目标

- 学习使用 Context 和 Hook 管理组件状态
- 学习状态管理逻辑复用的模式：自定义 Hook 和 unstated-next
- “hook 容器”模式
- 使用 unstated-next 来复用和共享状态、逻辑。

## 快速开始：计数器例子

大家学习过 React Hook，知道自定义 Hook 可以封装状态管理逻辑，并达到复用、共享的效果。这次从一个计数器例子开始。

```tsx
import React, { useState } from 'react';
import { render } from 'react-dom';

function CounterDisplay() {
  const [count, setCount] = useState(0);
  const decrement = () => setCount(count - 1);
  const increment = () => setCount(count + 1);

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
  const [count, setCount] = useState(0);
  const decrement = () => setCount(count - 1);
  const increment = () => setCount(count + 1);

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
  const [count, setCount] = useState(0);
  const decrement = () => setCount(count - 1);
  const increment = () => setCount(count + 1);

  return { count, decrement, increment };
}

function CounterDisplay(props: { counter: Counter }) {
  const { count, decrement, increment } = props.counter;

  return (
    <div>
      <button onClick={decrement}>-</button>
      <p>You clicked {count} times</p>
      <button onClick={increment}>+</button>
    </div>
  );
}

function AnotherCounterDisplay(props: { counter: Counter }) {
  const { count, decrement, increment } = props.counter;

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
  const [count, setCount] = useState(0);
  const decrement = () => setCount(count - 1);
  const increment = () => setCount(count + 1);

  return { count, decrement, increment };
}

const CounterContext = React.createContext<Counter>(null);

function CounterDisplay() {
  const { count, decrement, increment } = useContext(CounterContext);

  return (
    <div>
      <button onClick={decrement}>-</button>
      <p>You clicked {count} times</p>
      <button onClick={increment}>+</button>
    </div>
  );
}

function AnotherCounterDisplay() {
  const { count, decrement, increment } = useContext(CounterContext);

  return (
    <div>
      <button onClick={decrement}>-</button>
      <p>当前分数：{count}</p>
      <button onClick={increment}>+</button>
    </div>
  );
}

function CounterInfo() {
  const counter = useContext(CounterContext);

  return <div>当前计数：{counter.count}</div>;
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
  const [count, setCount] = useState(0);
  const decrement = () => setCount(count - 1);
  const increment = () => setCount(count + 1);

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
  const [count, setCount] = useState(0);
  const decrement = () => setCount(count - 1);
  const increment = () => setCount(count + 1);

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
  const [count, setCount] = useState(0);
  const decrement = () => setCount(count - 1);
  const increment = () => setCount(count + 1);

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

## 页面组件的状态管理与“hook 容器”模式

[Dan Abramov](https://mobile.twitter.com/dan_abramov)在 2015 年提出的[展示/容器组件模式](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)，主要目的是为了将状态管理逻辑与 UI 逻辑分离开，独立维护。但是这种模式已经过时了，不再适合大规模采用，引用 Dan Abramov 的原话：

> Update from 2019: I wrote this article a long time ago and my views have since evolved. In particular, I don’t suggest splitting your components like this anymore. If you find it natural in your codebase, this pattern can be handy. But I’ve seen it enforced without any necessity and with almost dogmatic fervor far too many times. The main reason I found it useful was because it const me separate complex stateful logic from other aspects of the component. Hooks const me do the same thing without an arbitrary division. This text is left intact for historical reasons but don’t take it too seriously.

大致的意思是：不再推荐按照展示/容器组件模式拆分组件。

虽然[展示/容器组件模式](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)已经过时，但是它要解决的问题：将状态管理逻辑与 UI 逻辑分离开，依然需要处理。幸运的是我们有了更好的解决方案：React Hooks。

对于一个页面组件来说，我们使用组件来处理 UI 渲染，使用 React Hooks 来处理状态。大概率下页面各个部分需要共享状态。这样分析，你会发现“hook 容器”模式非常适合页面组件的开发：将页面级别的状态管理放在页面自定义 hook 中，页面的各个子组件都可以通过上下文快速获取到需要的共享状态。

```tsx
function useXxxxPage() {
  ....
}

const XxxxPageContainer = createContainer(useXxxxPage);

function XxxxPageHeader() {
  const xxxxPageState = XxxxPageContainer.useContainer();

  //....
}

function XxxxPageContent() {
  const xxxxPageState = XxxxPageContainer.useContainer();

  //...
}

function XxxxPageFooter() {
  const xxxxPageState = XxxxPageContainer.useContainer();

  //...
}

function XxxxPage() {
  return <XxxxPageContainer.Provider>
    <div>
      <XxxxPageHeader />
      <XxxxPageContent />
      <XxxxPageFooter />
    </div>
  </XxxxPageContainer.Provider>
}
```

**强调一点**：在页面级别需要共享的数据才需要放到`useXxxxPage`中。局部状态依然首推在局部组件级别解决。

页面组件也是组件，在 React 中没有任何特殊的设定，只是页面组件往往会面临状态的跨级共享，而且我们在开发应用时，一般会从页面组件开始，所以，我们可以选择一种状态管理模式作为状态管理的参考实现，“hook 容器”就是一种好的模式。但是页面组件的状态管理同样需要遵循组件状态管理的最佳实践，当发现“hook 容器”不适合时，应该考虑其他的最佳实践。

在做应用开发时，遵循以下几个要点：

- 用组件做 UI 渲染
- 用组件做 UI 渲染逻辑复用
- 用 React Hooks 做组件状态管理
- 用自定义 hook 做状态管理逻辑复用
- 用自定义 hook 做状态管理逻辑与 UI 渲染逻辑分离
- 遇到跨级共享状态时，用 React Context
- 如果用 React Context + custom hooks 做跨级共享状态，可以考虑用 unstated-next

## unstated-next 使用要点

### 要点#1: 保持 Containers 很小

这对于保持 containers 小而集中非常有用。 如果你想在 containers 中对代码进行逻辑拆分，那么这一点非常重要。只需将它们移动到自己的 hooks 中，仅保存 containers 的状态即可。

```tsx
function useCount() {
  return useState(0);
}

const CounterContainer = createContainer(useCount);

function useCounter() {
  const [count, setCount] = CounterContainer.useContainer();
  const decrement = () => setCount(count - 1);
  const increment = () => setCount(count + 1);
  const reset = () => setCount(0);
  return { count, decrement, increment, reset };
}
```

```tsx
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

function ResetCounter() {
  const { reset } = useCounter();

  return <button onClick={reset}>重置</button>;
}

function App() {
  <CounterContainer.Provider>
    <div>
      <CounterDisplay />
      <ResetCounter />
    </div>
  </CounterContainer.Provider>;
}
```

### 要点#2：组合 Containers

因为我们只使用了自定义 React hooks，所以可以在其他 hooks 内部组合 containers。

```typescript
function useCounter() {
  const [count, setCount] = useState(0);
  const decrement = () => setCount(count - 1);
  const increment = () => setCount(count + 1);
  return { count, decrement, increment, setCount };
}

const Counter = createContainer(useCounter);

function useResettableCounter() {
  const counter = Counter.useContainer();
  const reset = () => counter.setCount(0);
  return { ...counter, reset };
}
```

### 要点#3：优化组件

`unstated-next`无需优化。所有你要做的优化，都是标准的 React 优化。

#### 1) 通过拆分组件来优化耗时的子树

优化前:

```tsx
function CounterDisplay() {
  const counter = Counter.useContainer();
  return (
    <div>
      <button onClick={counter.decrement}>-</button>
      <p>You clicked {counter.count} times</p>
      <button onClick={counter.increment}>+</button>
      <div>
        <div>
          <div>
            <div>SUPER EXPENSIVE RENDERING STUFF</div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

优化后:

```tsx
function ExpensiveComponent() {
  return (
    <div>
      <div>
        <div>
          <div>SUPER EXPENSIVE RENDERING STUFF</div>
        </div>
      </div>
    </div>
  );
}

const MemoExpensiveComponent = React.memo(ExpensiveComponent);

function CounterDisplay() {
  const counter = Counter.useContainer();
  return (
    <div>
      <button onClick={counter.decrement}>-</button>
      <p>You clicked {counter.count} times</p>
      <button onClick={counter.increment}>+</button>
      <MemoExpensiveComponent />
    </div>
  );
}
```

#### 2) 使用 useMemo() 优化耗时的操作

优化前：

```tsx
function CounterDisplay(props) {
  const counter = Counter.useContainer();

  // 每次 `counter` 改变都要重新计算这个值，非常耗时
  const expensiveValue = expensiveComputation(props.input);

  return (
    <div>
      <button onClick={counter.decrement}>-</button>
      <p>You clicked {counter.count} times</p>
      <button onClick={counter.increment}>+</button>
    </div>
  );
}
```

优化后：

```tsx
function CounterDisplay(props) {
  const counter = Counter.useContainer();

  // 仅在输入更改时重新计算这个值
  const expensiveValue = useMemo(() => {
    return expensiveComputation(props.input);
  }, [props.input]);

  return (
    <div>
      <button onClick={counter.decrement}>-</button>
      <p>You clicked {counter.count} times</p>
      <button onClick={counter.increment}>+</button>
    </div>
  );
}
```

#### 3) 使用 React.memo()、useCallback() 减少重新渲染次数

优化前：

```tsx
function useCounter() {
  const [count, setCount] = useState(0);
  const decrement = () => setCount(count - 1);
  const increment = () => setCount(count + 1);
  return { count, decrement, increment };
}

const Counter = createContainer(useCounter);

function CounterDisplay(props) {
  const counter = Counter.useContainer();
  return (
    <div>
      <button onClick={counter.decrement}>-</button>
      <p>You clicked {counter.count} times</p>
      <button onClick={counter.increment}>+</button>
    </div>
  );
}
```

优化后：

```tsx
function useCounter() {
  const [count, setCount] = useState(0);
  const decrement = useCallback(() => setCount(count - 1), [count]);
  const increment = useCallback(() => setCount(count + 1), [count]);
  return { count, decrement, increment };
}

const Counter = createContainer(useCounter);

const CounterDisplayInner = React.memo((props) => {
  return (
    <div>
      <button onClick={props.decrement}>-</button>
      <p>You clicked {props.count} times</p>
      <button onClick={props.increment}>+</button>
    </div>
  );
});

function CounterDisplay(props) {
  const counter = Counter.useContainer();
  return <CounterDisplayInner {...counter} />;
}
```

#### 4) 使用 React.memo()、useReducer() 减少重新渲染次数

优化前：

```tsx
function useCounter() {
  const [count, setCount] = useState(0);
  const decrement = () => setCount(count - 1);
  const increment = () => setCount(count + 1);
  return { count, decrement, increment };
}

const Counter = createContainer(useCounter);

function CounterDisplay(props) {
  const counter = Counter.useContainer();
  return (
    <div>
      <button onClick={counter.decrement}>-</button>
      <p>You clicked {counter.count} times</p>
      <button onClick={counter.increment}>+</button>
    </div>
  );
}
```

优化后：

```tsx
function counterReducer(state = 0, action) {
  switch (action.type) {
    case 'DECREMENT':
      return state - 1;
    case 'INCREMENT':
      return state + 1;
    default:
      return state;
  }
}

function useCounter() {
  const [count, dipatch] = useReducer(counterReducer);
  return { count, dispatch };
}

const Counter = createContainer(useCounter);

const CounterDisplayInner = React.memo((props) => {
  const decrement = () =>
    props.dispatch({
      type: 'DECREMENT',
    });
  const increment = () =>
    props.dispatch({
      type: 'INCREMENT',
    });
  return (
    <div>
      <button onClick={decrement}>-</button>
      <p>You clicked {props.count} times</p>
      <button onClick={increment}>+</button>
    </div>
  );
});

function CounterDisplay(props) {
  const counter = Counter.useContainer();
  return <CounterDisplayInner {...counter} />;
}
```

<!-- // TODO: 这里放上React组件优化的文章链接 -->

## 总结

本篇文章通过计数器示例，向大家演示了：

- 如何使用自定义 hook 将状态管理与 UI 分离开，并可复用状态管理逻辑。
- 如何使用 React Context 做跨级组件间通信。
- 如何使用 unstated-next 简化 React Hooks 共享状态和逻辑。

React Hooks 带来了状态管理逻辑分离与复用的新方式，鼓励大家在日常项目中使用 React 本身来处理复杂的状态管理。

## 参考文章

- [React Context](react-context.md)
- [unstated-next](https://github.com/jamiebuilds/unstated-next)
- [展示/容器组件模式](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)
- [React Hooks](https://reactjs.org/docs/hooks-intro.html)
