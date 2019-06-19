---
id: redux-getting-started
title: Redux入门
sidebar_label: Redux入门
---

## 目标

Redux 是管理复杂状态的库，也可以说是一种管理状态的模式。

学习 Redux 的动机、核心概念和三个基本原则。学会如何使用 Redux 来清晰地、可预测的 管理 React 程序中的状态。

本章还会用 redux 搭配 react 构建出一个[待办列表](https://github.com/sinoui/todo-list-redux)：

- [待办列表演示效果](https://sinoui.github.io/todo-list-redux/)
- [待办列表源码](https://github.com/sinoui/todo-list-redux)

## 动机

随着 JavaScript 单页应用开发日趋复杂，**JavaScript 需要管理比任何时候都要多的 state （状态）**。 这些 state 可能包括服务器响应、缓存数据、本地生成尚未持久化到服务器的数据，也包括 UI 状态，如激活的路由，被选中的标签，是否显示加载动效或者分页器等等。

管理不断变化的 state 非常困难。如果一个 model 的变化会引起另一个 model 变化，那么当 view 变化时，就可能引起对应 model 以及另一个 model 的变化，依次地，可能会引起另一个 view 的变化。直至你搞不清楚到底发生了什么。**state 在什么时候，由于什么原因，如何变化已然不受控制**。 当系统变得错综复杂的时候，想重现问题或者添加新功能就会变得举步维艰。

如果这还不够糟糕，考虑一些来自前端开发领域的新需求，如更新调优、服务端渲染、路由跳转前请求数据等等。前端开发者正在经受前所未有的复杂性。

这里的复杂性很大程度上来自于：**我们总是将两个难以理清的概念混淆在一起：变化和异步**。如果把二者分开，能做的很好，但混到一起，就变得一团糟。React 试图在视图层禁止异步和直接操作 DOM 来解决这个问题。美中不足的是，React 依旧把处理 state 中数据的问题留给了你。Redux 就是为了帮你解决这个问题。

跟随 Flux、CQRS 和 Event Sourcing 的脚步，通过限制更新发生的时间和方式，**Redux 试图让 state 的变化变得可预测**。这些限制条件反映在 Redux 的三大原则中。

## 核心概念

Redux 是管理**状态**的，它管理的状态就是一个普通的 JavaScript 对象，可能长成这样：

```ts
{
  todos: [{
    id: 1,
    text: 'Eat food',
    completed: true
  }, {
    id: 2,
    text: 'Exercise',
    completed: false
  }],
  visibilityFilter: 'SHOW_COMPLETED'
}
```

这个普通的 JavaScript 对象没有 setter 方法，且其他代码不能随意修改它，造成难以复现的 bug。

要想更新 state 中的数据，你需要**发起一个 action**。Action 就是一个普通的 JavaScript 对象，用来描述发生了什么。下面是一些 action 的示例：

```ts
{ type: 'ADD_TODO', payload: 'Go to swimming pool' }
{ type: 'TOGGLE_TODO', payload: 1 }
{ type: 'SET_VISIBILITY_FILTER', payload: 'SHOW_ALL' }
```

强制使用 action 来描述所有变化带来的好处是可以清晰地知道应用中到底发生了什么。如果一些东西改变了，就可以知道为什么变。action 就像是描述发生了什么的指示器。最终，为了把 action 和 state 串起来，开发一些函数，这就是**reducer**。reducer 只是一个接收 state 和 action，并返回新的 state 的函数。对于大的应用来说，不大可能仅仅只写一个这样的函数，所以我们编写很多小函数来分别管理 state 的一部分：

```ts
function visibilityFilter(state = 'SHOW_ALL', action) {
  if (action.type === 'SET_VISIBILITY_FILTER') {
    return action.filter;
  } else {
    return state;
  }
}

function todos(state = [], action) {
  switch (action.type) {
    case 'ADD_TODO':
      return state.concat([{ text: action.text, completed: false }]);
    case 'TOGGLE_TODO':
      return state.map((todo, index) =>
        action.index === index
          ? { text: todo.text, completed: !todo.completed }
          : todo,
      );
    default:
      return state;
  }
}
```

再开发一个 reducer 调用这两个 reducer，进而来管理整个应用的 state：

```ts
function todoApp(state = {}, action) {
  return {
    todos: todos(state.todos, action),
    visibilityFilter: visibilityFilter(state.visibilityFilter, action),
  };
}
```

这差不多就是 Redux 思想的全部：状态、Action、reducer。

## 三大原则

### 单一数据源

> 整个应用的状态被储存在一棵 object tree 中，并且这个 object tree 只存在与唯一一个 store 中。

这样做有多方面的好处：

- 开发同构应用变得非常容易（SSR）。
- 调试也变得非常容易。
- 可轻松实现如“撤销/重做”这类功能。

```ts
console.log(store.getStore());

/* 输出
{
  visibilityFilter: 'SHOW_ALL',
  todos: [
    {
      text: 'Consider using Redux',
      completed: true,
    },
    {
      text: 'Keep all state in a single tree',
      completed: false
    }
  ]
}
*/
```

### 状态是只读的

> 唯一改变 state 的方法是触发 action，action 是一个用于描述已发生事件的普通对象。

这样确保了视图和网络都不能直接修改 state，相反它们只能表达想要修改的意图。因为所有的修改都被集中化处理，且严格按照一个接一个的顺序执行，因此不用担心 race condition 的出现。Action 就是普通对象而已，因此它们可以被日志打印、序列化、储存、后期调试或测试时回放出来。

```ts
store.dispatch({
  type: 'COMPLETE_TODO',
  index: 1,
});

store.dispatch({
  type: 'SET_VISIBILITY_FILTER',
  filter: 'SHOW_COMPLETED',
});
```

### 使用纯函数来执行修改

> 为了描述 action 如何改变状态树，你需要编写 reducers。

Reducer 只是一些纯函数，它接收先前的 state 和 action，并返回新的 state。刚开始你可以只有一个 reducer，随着应用变大，你可以把它拆成多个小的 reducers，分别独立地操作 state tree 的不同部分，因为 reducer 只是函数，你可以控制它们被调用的顺序，传入附加数据，甚至编写可复用的 reducer 来处理一些通用任务，如分页器。

```ts
function visibilityFilter(state = 'SHOW_ALL', action) {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter;
    default:
      return state;
  }
}

function todos(state = [], action) {
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        {
          text: action.text,
          completed: false,
        },
      ];
    case 'COMPLETE_TODO':
      return state.map((todo, index) => {
        if (index === action.index) {
          return Object.assign({}, todo, {
            completed: true,
          });
        }
        return todo;
      });
    default:
      return state;
  }
}

import { combineReducers, createStore } from 'redux';
let reducer = combineReducers({ visibilityFilter, todos });
let store = createStore(reducer);
```

## 示例：待办列表

你可以直接从[待办列表站点](https://github.com/sinoui/todo-list-redux)下载示例源码，也可以自己通过`npx create-react-app todo-list-redux --typescript`创建一个空项目来做这个示例的练习。

首先看一下[待办列表最终效果](https://sinoui.github.io/todo-list-redux/)。

注意：本次示例主要演示 Redux 的用法，所以示例讲解先从 Redux 部分开始。日常开发时建议还是从 UI 和模拟数据开始，然后逐渐用 Redux 的部分替换掉模拟数据，实现功能。

### 定义状态和动作的数据结构

确认完需求后，就可以分析出该应用程序有哪些状态和动作，并且用 TypeScript 类型定义出来：

`react-app-env.d.ts`:

```ts
/**
 * 待办事项
 */
interface Todo {
  id: number;
  /**
   * 标题
   */
  text: string;
  /**
   * 是否已完成
   */
  completed?: boolean;
}

/**
 * 应用程序状态
 *
 * @interface State
 */
interface State {
  /**
   * 待办列表
   */
  todos: Todo[];
  /**
   * 可见性过滤条件
   */
  visibilityFilter: VISIBILITY_FILTER;
}

// 接下来是三个动作的类型

/**
 * 添加待办事项动作
 */
interface AddTodoAction {
  type: 'ADD_TODO';
  /**
   * 需要添加的待办事项对象
   */
  payload: TODO;
}

/**
 * 设置过滤条件动作
 */
interface SetVisibilityFilterAction {
  type: 'SET_VISIBILITY_FILTER';
  /**
   * 过滤条件
   */
  payload: VISIBILITY_FILTER;
}

/**
 * 切换待办事项状态的动作
 */
interface ToggleTodoAction {
  type: 'TOGGLE_TODO';
  /**
   * 需要切换状态的待办事项id
   */
  payload: number;
}

/**
 * 可见性过滤条件
 *
 * * SHOW_ALL - 显示全部
 * * SHOW_ACTIVE - 显示未完成的待办事项
 * * SHOW_COMPLETED - 显示已完成的待办事项
 */
type VISIBILITY_FILTER = 'SHOW_ALL' | 'SHOW_ACTIVE' | 'SHOW_COMPLETED';
```

### 动作创建器

接着定义一些动作创建器，来辅助我们创建动作：

`actions/index.ts`:

```ts
let nextTodoId = 0;

/**
 * 创建添加待办事项的动作
 *
 * @param text 待办事项标题
 */
function addTodo(text: string): AddTodoAction {
  return {
    type: 'ADD_TODO',
    payload: {
      id: nextTodoId++,
      text,
    },
  };
}

/**
 * 创建设置可见性过滤条件的动作
 *
 * @param filter 过滤条件
 */
function setVisibilityFilter(
  filter: VISIBILITY_FILTER,
): SetVisibilityFilterAction {
  return {
    type: 'SET_VISIBILITY_FILTER',
    payload: filter,
  };
}

/**
 * 创建切换待办事项状态的动作
 *
 * @param id 待办事项id
 */
function toggleTodo(id: number): ToggleTodoAction {
  return {
    type: 'TOGGLE_TODO',
    payload: id,
  };
}

export { addTodo, setVisibilityFilter, toggleTodo };
```

### reducers

定义完动作和状态后，就需要考虑由动作引发的状态变更的实现，也就是 reducer：

`reducers/todos.ts`:

```ts
/**
 * 待办事项列表reducer
 *
 * @param {Todo[]} [state=[]]
 * @param {(AddTodoAction | ToggleTodoAction)} action
 * @returns
 */
function todos(state: Todo[] = [], action: AddTodoAction | ToggleTodoAction) {
  switch (action.type) {
    case 'ADD_TODO':
      return [...state, action.payload];
    case 'TOGGLE_TODO':
      return state.map((todo) =>
        todo.id === action.payload
          ? { ...todo, completed: !todo.completed }
          : todo,
      );
    default:
      return state;
  }
}

export default todos;
```

`reducers/visibilityFilter.ts`:

```ts
/**
 * 过滤条件reducer
 *
 * @param {VISIBILITY_FILTER} [state='SHOW_ALL']
 * @param {SetVisibilityFilterAction} action
 * @returns
 */
function visibilityFilter(
  state: VISIBILITY_FILTER = 'SHOW_ALL',
  action: SetVisibilityFilterAction,
) {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.payload;
    default:
      return state;
  }
}

export default visibilityFilter;
```

`reducers/index.ts`:

```ts
import { combineReducers } from 'redux';
import todos from './todos';
import visibilityFilter from './visibilityFilter';

const todoApp = combineReducers({
  todos,
  visibilityFilter,
});

export default todoApp;
```

### 初始化应用程序

`index.ts`文件中使用 ReactDOM 将整个应用程序渲染到 DOM 中。这里不再讲解。

在`App.ts`中创建 Redux store，并采用 React Redux 托管 Redux store：

```tsx
import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import TodoApp from './todo-app';
import todoApp from './reducers';
import './primitive.css';

const store = createStore(todoApp);

function App() {
  return (
    <Provider store={store}>
      <TodoApp />
    </Provider>
  );
}

export default App;
```

`todo-app/TodoApp.tsx`，待办列表应用的 UI 分成三部分，即添加、待办列表和页脚:

```tsx
import React from 'react';
import AddTodo from './AddTodo';
import TodoList from './TodoList';
import Footer from './Footer';

function TodoApp() {
  return (
    <div>
      <AddTodo />
      <TodoList />
      <Footer />
    </div>
  );
}

export default TodoApp;
```

接下来分别介绍这三个 UI 部分的实现。

### 展示待办列表

`todo-app/Todo.tsx`，展示单条待办事项：

```tsx
import React from 'react';
import { useDispatch } from 'react-redux';
import { toggleTodo } from '../actions';

interface Props {
  /**
   * 待办事项
   */
  todo: Todo;
}

/**
 * 待办事项
 *
 * @param {Props} props
 */
function Todo(props: Props) {
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(toggleTodo(props.todo.id));
  };

  return (
    <li
      onClick={handleClick}
      style={{
        textDecoration: props.todo.completed ? 'line-through' : 'none',
      }}
    >
      {props.todo.text}
    </li>
  );
}

export default React.memo(Todo);
```

这里用到了 react redux 的[useDispatch](https://react-redux.js.org/api/hooks#usedispatch)，获取到由 react redux 托管的 Redux Store 的`dispatch`方法。在点击待办事项时，发送切换待办事项状态的 Action。

`todo-app/TodoList.tsx`，展示待办事项列表：

```tsx
import React from 'react';
import { useSelector } from 'react-redux';
import Todo from './Todo';

/**
 * 获取可见的待办事项
 *
 * @param todos 待办事项列表
 * @param filter 过滤条件
 */
const getVisibleTodos = (todos: Todo[], filter: VISIBILITY_FILTER) => {
  switch (filter) {
    case 'SHOW_COMPLETED':
      return todos.filter((t) => t.completed);
    case 'SHOW_ACTIVE':
      return todos.filter((t) => !t.completed);
    case 'SHOW_ALL':
    default:
      return todos;
  }
};

/**
 * 待办事项列表
 */
function TodoList() {
  const todos = useSelector((state: State) =>
    getVisibleTodos(state.todos, state.visibilityFilter),
  );

  return (
    <>
      <h2>待办事项清单</h2>
      <ul>
        {todos.map((todo) => (
          <Todo key={todo.id} todo={todo} />
        ))}
      </ul>
    </>
  );
}

export default React.memo(TodoList);
```

这里用到了 React Redux 的[useSelector](https://react-redux.js.org/api/hooks#useselector)方法，用来获取由 React Redux 托管的 Redux Store 的状态。`useSelector(selector)`方法的`selector`参数是一个函数，用来从 Redux store 的整个状态中获取到需要用到的数据，比如这里通过

```tsx
(state: State) => getVisibleTodos(state.todos, state.visibilityFilter);
```

这个 selector 函数，从 Redux Store 中获取到了可见的待办事项列表。

### 显示过滤条件

`todo-app/FilterLinker.tsx`:

```tsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setVisibilityFilter } from '../actions';

interface Props {
  /**
   * 过滤条件
   */
  filter: VISIBILITY_FILTER;
  /**
   * 链接显示的内容
   */
  children: React.ReactNode;
}

/**
 * 过滤链接组件
 */
function FilterLink(props: Props) {
  const dispatch = useDispatch();
  const currentFilter = useSelector((state: State) => state.visibilityFilter);
  const isActive = currentFilter === props.filter;

  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault();
    dispatch(setVisibilityFilter(props.filter));
  };

  if (isActive) {
    return <span>{props.children}</span>;
  }

  return (
    <a href={`#${props.filter}`} onClick={handleClick}>
      {props.children}
    </a>
  );
}

export default React.memo(FilterLink);
```

`todo-app/Footer.tsx`:

```tsx
import React from 'react';
import FilterLink from './FilterLink';

const Footer = () => (
  <p>
    显示: <FilterLink filter="SHOW_ALL">所有</FilterLink>
    {', '}
    <FilterLink filter="SHOW_ACTIVE">未完成</FilterLink>
    {', '}
    <FilterLink filter="SHOW_COMPLETED">已完成</FilterLink>
  </p>
);

export default React.memo(Footer);
```

### 添加待办事项

`todo-app/AddTodo.tsx`:

```tsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTodo } from '../actions';

/**
 * 添加待办事项组件
 */
function AddTodo() {
  const dispatch = useDispatch();
  const [todoText, setTodoText] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoText(event.target.value);
  };

  const handleSubmit = () => {
    dispatch(addTodo(todoText));
    setTodoText('');
  };

  return (
    <div style={{ display: 'flex' }}>
      <input
        type="text"
        value={todoText}
        onChange={handleChange}
        style={{ width: 'auto', flex: 1 }}
      />
      <button type="button" onClick={handleSubmit}>
        添加
      </button>
    </div>
  );
}

export default React.memo(AddTodo);
```

这就完成了待办事项的开发。

这个示例程序采用 Redux 管理待办事项的状态，并使用 React Redux 将 Redux 状态与 React 紧密结合在一起。

程序中用了一个缓存小技巧`React.memo`，来缓存组件，可以避免组件不必要的重新渲染。

## 何时采用 Redux

在采用 Redux 之前，首先问自己，真的有必要引入 Redux 么？如果你的功能状态管理非常复杂，才需要考虑是否需要引入 Redux。可以这样说，Redux 库是非常规武器，可以定位为“核武器”，但是 Redux 模式可以作为常规武器，比如可以使用`React useReducer`管理组件局部状态。

在使用 Redux 时，需要做一些权衡。它不是设计为以最快或者最短的方式编写代码。它旨在帮助回答“何时某个状态发生变化，数据来自何处？”这一问题，具有可预测的行为。它要求您遵循应用程序中特定约束来实现：将应用程序的状态存储为纯数据，将更改描述为普通对象，并使用不可变式更新数据的纯函数来处理这些变更。这往往是关于“样板”的投诉的来源。这些约束需要开发人员的努力，但也开辟了许多其他可能性（例如存储持久化和同步）。

## 参考

- [Redux 官网](https://redux.js.org/)
- [Redux 源码](https://github.com/reduxjs/react-redux)
- [React Redux 官网](https://react-redux.js.org/)
- [Redux 中文官网](https://www.redux.org.cn/)
- [Flex 标准 Action](https://github.com/redux-utilities/flux-standard-action)
- [React Redux Hook API](https://react-redux.js.org/api/hooks)
