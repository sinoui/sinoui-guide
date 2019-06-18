---
id: immutable-getting-started
title: 不可变数据
sidebar_label: 不可变数据
---

## 目标

学习使用[immer](https://github.com/immerjs/immer)来做不可变数据变更。

## 背景

React 推崇函数式编程，React 的状态更新、Redux、React 的优化技巧等，都在强调数据的不可变性带来的好处。所以学会以不可变的方式更新数据是一门必修课。本章将会向大家介绍[immer](https://github.com/immerjs/immer)这个可以使用同步代码来做不可变数据的变更。

也许大家比较迷糊的是，既然是不可变数据，为何还能变更。这里说的不可变是指不能改变数据本身，如果需要改变数据，是先创建一个该数据的副本，然后在这个副本上进行修改操作，这样就在没有改变原始数据的基础上做了数据变更。此技术称之为**写时复制**。例如我们更新组件的状态是这样的：

```tsx
const [todos, setTodos] = useState([
  {
    id: '1',
    name: 'learn immer',
  },
]);

function addTodo(todo) {
  const newTodos = [...todos, todo]; // 这里不是直接修改todos，而是创建了一个newTodos。

  setTodos(newTodos);
}
```

## 常规操作

安装 immer:

```shell
yarn add immer
```

首先我们看一些常见的不可变数据变更。

### 更新对象

更新对象属性：

```ts
const state = { id: '1', name: '张三' };

const newState = { ...state, name: '李四', age: 25 };
```

immer 的方式：

```ts
import produce from 'immer';

const state = { id: '1', name: '张三' };

const newState = produce(state, (draft) => {
  draft.name = '李四';
  draft.age = 25;
});
```

更新多层级的对象：

```ts
const state = {
  id: '1',
  name: '张三',
  address: {
    city: '北京',
  },
};

const newState = {
  ...state,
  address: {
    ...state.address,
    city: '上海',
  },
};
```

immer 的方式：

```ts
import produce from 'immer';
const state = {
  id: '1',
  name: '张三',
  address: {
    city: '北京',
  },
};

const newState = produce(state, (draft) => {
  draft.address.city = '北京';
});

console.log(state);
/*输出：
{
  id: '1',
  name: '张三',
  address: {
    city: '北京',
  },
}
*/
console.log(newState);
/*输出：
{
  id: '1',
  name: '张三',
  address: {
    city: '上海',
  },
}
*/
```

大家看到了，使用 immer 使用同步更新数据的方式来做不可变数据变更。它能消灭掉“展开符地狱”问题。

### 更新数组

简单数组操作：

```ts
const nums = [1, 2, 3, 5];

const newNums = [...nums, 6]; // 在数组的末尾添加6
const newNums2 = [...nums.slice(0, 1), ...nums.slice(2)]; //删除数字2
const newNums3 = [...nums.slice(0, 1), 7, ...nums.slice(2)]; // 将数字2替换为7
```

immer 的方式：

```ts
import produce from 'immer';
const nums = [1, 2, 3, 5];

const newNums = produce(nums, (draft) => {
  draft.push(6);
}); // 在数组的末尾添加6
const newNums2 = produce(nums, (draft) => {
  draft.splice(1, 1);
}); //删除数字2
const newNums3 = produce(nums, (draft) => {
  draft.splice(1, 1, 7);
}); // 将数字2替换为7
```

对象数组操作：

```ts
const todos = [
  {
    id: 1,
    text: 'learn react',
  },
  {
    id: 2,
    text: 'learn redux',
  },
  {
    id: 3,
    text: 'learn immer',
  },
];

function addTodo(todo) {
  return [...todos, todo];
}

function toggleTodo(index) {
  todos.map((todo, idx) => {
    if (idx === index) {
      return { ...todo, completed: !todo.completed };
    }
    return todo;
  });
}
```

immer 的方式：

```ts
const todos = [
  {
    id: 1,
    text: 'learn react',
  },
  {
    id: 2,
    text: 'learn redux',
  },
  {
    id: 3,
    text: 'learn immer',
  },
];

function addTodo(todo) {
  return produce(todos, (draft) => {
    draft.push(todo);
  });
}

function toggleTodo(index) {
  return produce(todos, (draft) => {
    draft[index].completed = !draft[index].completed;
  });
}
```

immer 采用的思路就是写时复制，如下图所示：

![immer写时复制](assets/images/immer.png)

在底层，immer 使用了[ES6 Proxy](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy)对现有的状态（即 JavaScript 对象）做了代理，形成了 draft 对象。对 draft 对象的任何同步赋值操作都会被代理捕捉到，等变更操作完成后，immer 会根据捕捉到的变更操作，来生成新的 JavaScript 对象。

## 与 React 的状态更新结合使用

使用 immer 可以简化深层的状态更新操作。如下所示：

```tsx
import { useState } from 'React';
import produce from 'immer';

const [user, setUser] = useState({
  userName: '张三',
  age: 16,
});

// 常规方式
const handleBirthDayClick = () => {
  setUser((prevUser) => ({
    ...prevUser,
    age: prevUser.age + 1,
  }));
};

// immer方式
const handleBirthDayClick2 = () => {
  setUser(
    produce((draft) => {
      draft.age += 1;
    }),
  );
};
```

当然，如果真的遇到很深层次的 React 组件状态，就需要看看是否真的有必要设计出这么深层次的数据结构。

immer 更常见的是与`useReducer`结合使用：

```tsx
import { useReducer } from 'React';
import produce from 'immer';

const todoReducers = produce((draft, action) => {
  switch (action.type) {
    case 'ADD_TOOD':
      draft.push(action.payload);
      return;
    case 'TOGGLE_TODO':
      draft[action.payload].completed = !draft[action.payload].completed;
      return;
    default:
  }
});

const [todos, dispatch] = useReducer(todoReducers, []);
```

## 小结

immer 的基本用法就说到这。immer 是一个非常小（4.35KB 大小）的库，而且非常小巧，提供的不可变变更数据方案也非常优雅，与函数式编程的结合也相得益彰。所以推荐给大家在日常开发中使用。

后期还会讲到 immer 的原理，以及在各种场景下的使用甚至是再次封装以进一步简化数据变更处理。

## 参考资料

- [immer](https://github.com/immerjs/immer)
