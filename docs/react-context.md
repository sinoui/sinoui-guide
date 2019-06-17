---
id: react-context
title: React Context
sidebar_label: React Context
---

在一个典型的 React 应用中，数据是通过 props 属性自上而下（由父及子）进行传递的，但这种做法对于某些类型的属性而言是极其繁琐的（例如：地区偏好，UI 主题），这些属性是应用程序中许多组件都需要的。Context 提供了一种在组件之间共享此类值的方式，而不必显式地通过组件树的逐层传递 props。

## 目标

- 学习为什么要使用 React Context。
- 学习使用 React Context 解决跨级组件通信。
- 学习旧的 React Context 语法以及迁移指南。

## 背景

首先，我们来看看在应用开发中我们遇到的两个典型的需要跨级做组件通信的场景以及遇到的问题：

### 全局共享状态

在开发 React 应用程序时，往往需要在整个应用级别共享一些数据，如：

- 当前登录人信息
- UI 主题定制信息
- 购物车里的物品
- 全局的消息提示

需要在全局共享的数据还很多，而且这些共享的数据往往还会发生变化。这些全局的变化的数据，我们统称为**全局状态**。

我们之前在应用中是通过 Redux 方式来处理全局状态的。现在，我们还可以用 React Context 的方式来处理全局状态。

### 复杂的状态管理与深的 UI 组件层次

复杂的状态管理往往与比较深的 UI 组件层次同时出现。这种情况下，因 UI 组件层级非常深，则会出现需要将顶级组件中的状态或者回调函数通过组件属性的方式一层一层往下传递。

类似如：

```react
function Comp1(props) {
  return <div>
    <div>{props.value}</div>
    <button onClick={props.updateValue}>变更数据</button>
  </div>;
}

function Comp2(props) {
  return <div>
    <Comp1 value={props.value} updateValue={props.updateVale} />
    <div>这是其他的内容</div>
  </div>;
}

function Comp3(props) {
  return <div>
    <Comp2 value={props.value} updateValue={props.updateValue} />
    <div>这是其他的内容</div>
  </div>;
}

function PageComp() {
  const [value, setValue] = useState(0);

  const updateValue = () => {
    setValue(value + 1);
  };

  return <Comp3 value={value} updatValue={updateValue} />;
}
```

这个例子中，`PageComp`为了将状态`value`和回调函数`updateValue`传递给`Comp1`，需要通过`Comp3`和`Comp2`的属性一直往下传递。如果组件层级再深一些，状态管理再复杂一些，这种现象会愈发频繁和复杂。

在组件树中很多不同层级的组件需要访问同样的一批数据。Context 能让你将这些数据向组件树下所有的组件进行“广播”，所有的组件都能访问到这些数据，也能访问到后续的数据更新。

### 小结

以上描述的两个场景，我们不需要多余的技术，只需要掌握 React Context 就能很好地解决问题。那么首先让我们学习一下 React Context 吧。

## 使用 React Context

使用 React Context 一般分成三个部分：

- 创建 React Context
- 提供 Context 数据
- 使用 Context 数据

接下来，我们挨个说明。

### 创建 React Context

我们的应用程序可以有多个不同的上下文。如登录状态上下文、主题定制上下文、购物车上下文。React Context 推荐你为不同的数据创建不同的上下文。

我们可以用`React.createContext(initialValue)`创建上下文。

```typescript
import React from 'react';

const ThemeContext = React.createContext({ color: 'blue' });
```

上面的代码创建了一个 Context 对象。当 React 渲染一个订阅了这个 Context 对象的组件，这个组件会从组件树中离自身最近的那个匹配的`Provider`中读取当前的 context 值。

只要当组件所处的树中没有匹配到 Provider 时，其`defaultValue`参数才会生效。这有助于在不使用 Provider 包装组件的情况下对组件进行测试。

### 提供 Context 数据

我们使用`Context.Provider`提供 Context 值。如下所示：

```typescript
import ThemeContext from './ThemeContext';

<ThemeContext.Provider value={{ color: 'red' }}>...</ThemeContext.Provider>;
```

每个 Context 对象都会返回一个 Provider 组件，它可以设定上下文的值。

Provider 接收一个`value`属性，传递给消费组件。一个 Provider 可以和多个消费组件有对应关系。多个 Provider 也可以嵌套使用，里层的会覆盖外层的数据。

当 Provider 的`value`值发生变化时，它内部的所有消费组件都会重新渲染。

### 使用 Context 数据

使用 Context 数据，又称之为“消费 Context 值”。

```tsx
import { useContext } from 'React';
import ThemeContext from './ThemeContext';

function 子组件() {
  const theme = useContext(ThemeContext);

  return (
    <button style={{ color: theme.color }}>这是一个支持主题定制的按钮</button>
  );
}
```

在子组件中使用`useContext(ThemeContext)`就能获取到由`ThemeContext.Provider`提供的上下文数据。如果没有对应的 Provider，`theme`参数等同于传递给`createContext()`的`defaultValue`。

我们学习了 React Context 的基本用法。那么接下来我们就使用 Context 实战背景中提到的两个场景。

## 示例

### 简单的主题定制

假设我们的应用程序中，需要对文本颜色进行主题定制。我们可以这样实现。

首先创建主题定制上下文，`ThemeContet.ts`:

```ts
import React from 'react';

const ThemeContext = React.useContext({
  color: 'blue', // 默认的文本颜色为blue
});

export default ThemeContext;
```

在应用程序级别指定满足需求的主题定制颜色（如红色）：

`App.tsx`:

```tsx
import React from 'react';
import ThemeContext from './ThemeContext';
import Text from './Text';
import Button from './Button';
import H1 from './H1';

function App() {
  return (
    <ThemeContext value={{ color: 'red' }}>
      <div>
        <H1>主题定制</H1>
        <Text>使用React Context共享主题定制数据</Text>
        <Button>这是一个主题定制按钮</Button>
      </div>
    </ThemeContext>
  );
}

export default App;
```

`H1.tsx`:

```tsx
import React, { useContext } from 'react';
import ThemeContext from './ThemeContext';

function H1(props) {
  const { color } = useContext(ThemeContext);

  return <h1 {...props} style={{ ...props.style, color }} />;
}

export default H1;
```

`Text.tsx`:

```tsx
import React, { useContext } from 'react';
import ThemeContext from './ThemeContext';

function Text(props) {
  const { color } = useContext(ThemeContext);

  return <p {...props} style={{ ...props.style, color }} />;
}

export default Text;
```

`Button.tsx`:

```tsx
import React, { useContext } from 'react';
import ThemeContext from './ThemeContext';

function Button(props) {
  const { color } = useContext(ThemeContext);

  return <button {...props} style={{ ...props.style, color }} />;
}

export default Button;
```

### 共享登录状态

假设有整个应用有两个页面，即登录页（LoginPage）和主页面（MainPage）。在登录页登录后，进入主页面。主页面上有退出登录按钮，点击退出登录后，调到登录页。

`UserStateContext.ts`:

```typescript
import React from 'react';

interface UserState {
  // 当前登录人id
  userId: string;
  // 是否已经登录
  isLogged: boolean;
  // 以userId登录
  login: (userId: string) => void;
  // 退出登录
  logout: () => void;
}

const UserStateContext = React.createContext<UserState>(null);

export default UserStateContext;
```

`App.tsx`:

```tsx
import React, { useState } from 'react';
import UserStateContext from './UserStateContext';
import MainPage from './MainPage';
import LoginPage from './LoginPage';

function App() {
  const [userState, setUserState] = useState({
    isLogged: false,
  });

  const login = (userId: string) => {
    setUserState({
      isLogged: true,
      userId,
    });
  };

  const logout = () => {
    setUserState({
      isLogged: false,
    });
  };

  return (
    <UserStateContext.Provider
      value={{
        ...userState,
        login,
        logout,
      }}
    >
      {userState.isLogin ? <MainPgae /> : <LoginPage />}
    </UserStateContext.Provider>
  );
}
```

`LoginPage.tsx`:

```tsx
import React, { useContext } from 'react';
import UserStateContext from './UserStateContext';

function LoginPage() {
  const { login } = useContext(UserStateContext);

  const handleLogin = async () => {
    const userId = await login(); // 这里login()方法自己实现，可以直接替换成一个固定的值，如: `userId = '1';`
    login(userId);
  };

  return <button onClick={handleLogin}>登录</button>;
}

export default LoginPage;
```

`MainPage.tsx`:

```tsx
import React, { useContext, useState, useEffect } from 'react';
import UserStateContext from './UserStateContext';

function MainPage() {
  const { userId, logout } = useContext(UserStateContext);
  const [todos, setTodos] = useState([]);

  useEffec(() => {
    fetch(`/todos/${userId}`)
      .then((response) => response.json())
      .then((result) => setTodos(result));
  }, [userId]);

  return (
    <div>
      <div>
        <h2>这是头部区域</h2>
        <div>欢迎{userId}</div>
        <button onClick={logout}>退出登录</button>
      </div>
      <div>
        <h3>我的待办</div>
        <ul>
          {todos.map(todo => <li key={todo.id}>{todo.title}</li>)}
        </ul>
      </div>
    </div>
  );
}
```

### 使用多个 Context

我们可以同时获取多个上下文的值，如登录按钮可能需要同时获取登录状态和主题定制：

```tsx
import React, { useContext } from 'react';
import LoginContext from './LoginContext';
import ThemeContext from './ThemeContext';

function LoginButton() {
  const { login } = useContext(LoginContext);
  const theme = useContext(ThemeContext);

  // ....
}
```

### 页面状态：待办列表页

以我的待办列表为例说明如何使用 React Context 和`useReducer`来做页面状态管理。

定义页面状态：

`TodoContext.ts`:

```typescript
import React from 'react';

interface Todo {
  id: string;
  title: string;
}

interface TododContextInterface {
  todos: Todo[];
  dispatch: (action: any) => void;
}

const TododContext = React.createContext<TododContextInterface>(null);

export default TododContext;
```

待办页：

```tsx
import React, { useReducer } from 'react';
import TodoContext from './TodoContext';
import TodoPageHeader from './TodoPageHeader';
import TodoList from './TodoList';

function todoReducer(state, action) {
  switch (action.type) {
    case 'ADD_TODO':
      return [action.payload, ...state];
    case 'REMOVE_TODO':
      return state.filter((todo, index) => index !== action.index);
    default:
      return state;
  }
}

function TodoPage() {
  const [todos, dispatch] = useReducer(todoReducer, []);

  return (
    <TodoContext.Provider value={{ todos, dispatch }}>
      <div>
        <TodoPageHeader />
        <TodoList />
      </div>
    </TodoContext.Provider>
  );
}

export default TodoPage;
```

`TododPageHeader.tsx`:

```tsx
import React, { Context } from 'react';
import TodoContext from './TodoContext';
import AddTodo from './AddTodo';

function TodoPageHeader() {
  const { todos } = useContext(TodoContext);

  return (
    <div>
      <h1>待办列表</h1>
      <h2>您有{todos.length}条待办</h2>
      <AddTodo />
    </div>
  );
}

export default TododPageHeader;
```

`AddTodo.tsx`:

```tsx
import React, { useContext, useState } from 'react';
import TodoContext from './TodoContext';

let id = 100;

function AddTodo() {
  const { dispatch } = useContext(TodoContext);
  const [todoText, setTodoText] = useState('');

  function handleTextChange(event) {
    setTodoText(event.target.value);
  }

  function handleAdd() {
    dispatch({
      type: 'ADD_TODO',
      payload: {
        id: id++,
        title: todoText,
      },
    });
    setTodoText('');
  }

  return (
    <div>
      <input type="text" value={todoText} onChange={handleTextChange} />
      <button onClick={handleAdd}>新增</button>
    </div>
  );
}

export default AddTodo;
```

`TodoList.tsx`:

```tsx
import React from 'react';
import TodoContext from './TodoContext';
import TodoItem from './TodoItem';

function TodoList() {
  const { todos } = useContext(TodoContext);

  return (
    <div>
      {todos.map((todo, index) => (
        <TodoItem todoIndex={index} todo={todo} key={todo.id} />
      ))}
    </div>
  );
}

export default TodoList;
```

`TodoItem.tsx`:

```tsx
import React, { useContext } from 'react';
import TodoContext from './TodoContext';

function TodoItem(props) {
  const { dispatch } = useContext(TodoContext);

  const handleRemove = () =>
    dispatch({ type: 'REMOVE_TODO', payload: props.todoIndex });

  return (
    <div>
      {props.todoItem.title}
      <button onClick={handleRemove}>删除</button>
    </div>
  );
}

export default TodoItem;
```

## 注意事项

因为 context 会使用[Object.is](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is#Description)来决定何时进行渲染，这里可能会有一些陷阱，当 provider 的父组件重渲染时，可能会在 consumers 组件中触发意外的渲染。举个例子，当每一次 Provider 重渲染时，以下的代码会重渲染所有下面的 consumers 组件，因为`value`属性总是被赋值为新的对象：

```tsx
function App() {
  return (
    <Provider value={{ something: 'something' }}>
      <Toolbar />
    </Provider>
  );
}
```

为了防止这种情况，我们可以使用`useMemo`来缓存 context 值：

```tsx
import React, { useMemo } from 'react';
function App() {
  const conext = useMemo(() => ({ someting: 'something' }), []);

  return (
    <Provider value={context}>
      <Toolbar />
    </Provider>
  );
}
```

## 在类组件中使用 Context 值

`useContext`只能在函数组件中使用，如果需要在类组件中使用 Context，则需要使用`Context.Consumer`来获取 Context 值：

```tsx
class TodoContext extends React.Component {
  public render() {
    return;
    <TodoContext.Consumer>
      {({ todos }) => (
        <div>
          {todos.map((todo, index) => (
            <TodoItem todo={todo} todoIndex={index} key={todo.id} />
          ))}
        </div>
      )}
    </TodoContext.Consumer>;
  }
}
```

## 废弃的 API

React 目前还支持一个即将废弃的上下文语法。如果你在应用程序中遇到这样的代码，可以列一个迁移计划。

本小结以主题定制介绍废弃的 Context API。

在废弃的 Context API 中，只能在类组件中定义上下文并提供上下文的值，如下所示：

```tsx
import React from 'react';
import PropTypes from 'prop-types';

class App extends React.Component {
  getChildContext() {
    return { color: 'red' };
  }

  render() {
    <div>
      <Button>这是一个主题定制按钮</Button>
    </div>;
  }
}

App.childContextType = {
  color: PropTypes.string,
};
```

必不可少的部分：

- `App.childContextType` - 定义上下文，相当于`React.createContext()`。
- `App.getChildContext()` - 提供上下文的值，相当于`Context.Provider`。

`Button.tsx`:

```typescript
import React from 'react';
import PropTypes from 'prop-types';

function Button(props, context) {
  return (
    <button
      {...props}
      style={{
        color: context.color,
      }}
    />
  );
}

Button.contextTypes = {
  color: PropTypes.string,
};

export default Button;
```

要点：

- `Button.contextTypes` - 定义组件需要获取上下文的数据，相当于`useContext(ThemeContext)`。

## 总结

> Context 提供了一个无需为每层组件手动添加 props，就能在组件树间进行数据传递的方法。

React Context 主要用来解决跨多个级别共享状态。在决定使用 React Context 之前，先分析一下是否有必要使用它。要谨慎使用 React Context，因为它会降低组件的复用性。

**如果你只是想避免层层传递一些属性，[组件组合（component composition）](https://zh-hans.reactjs.org/docs/composition-vs-inheritance.html)有时候是一个比 context 更好的解决方案。**

但是有也有可能组件组合会带来更多的复杂度，这时也许采用 React Context 能降低复杂度。大家可以在实践中掌握这种权衡。

本章介绍的是基本的 React Context 用法，也介绍了 React Context 与`useReducer`的结合使用。接下来的文章会介绍更多 React 状态管理的技巧中会用到 React Context。

## 参考资料

- [React Context](https://zh-hans.reactjs.org/docs/context.html)
- [组合组件](https://zh-hans.reactjs.org/docs/composition-vs-inheritance.html)
- [React useContext](https://zh-hans.reactjs.org/docs/hooks-reference.html#usecontext)
