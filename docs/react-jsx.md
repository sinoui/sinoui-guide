---
id: react-jsx
title: JSX概述
sidebar_label: JSX概述
---

看过[React 入门](react-getting-started.md)文档或者 React 项目源码，大家都会发现在 JavaScript 代码中有类似的 HTML 代码。看看下面的一个变量声明：

```jsx
const element = <h1>Hello, World!</h1>;
```

这个`h1`标签既不是字符串也不是 HTML。

它被称为**JSX**，是 JavaScript 的语法扩展。我们建议在 React 中配合使用 JSX，JSX 可以很好地描述 UI 应该呈现出它应有交互的本质形式。

JSX 可以生成**React 元素**。接下来，我们看看如何将 React 元素渲染为 DOM。

在开始之前，大家先通过[create-react-app](https://github.com/facebook/create-react-app)创建一个 React
项目，来练习接下来讲解到的代码。

```shell
npx create-react-app jsx-tutorial
```

## 元素渲染

> 元素是构成 React 应用的最小砖块。

假设我们的 HTML 页面上某处有一个`<div>`（通过 create-react-app 创建的 React 项目，`public/index.html`中就有这样的`<div>`）：

```html
<div id="root"></div>
```

我们将其称为“根”DOM 节点，因为 React 元素渲染成的 DOM 都会包含在这个 DOM 元素中。

我们通过 JSX 创建 React 元素，然后通过 React DOM 将 React 元素渲染成 DOM。

```jsx
import React from "react";
import ReactDOM from "react-dom";

const element = <h1>Hello, World!</h1>; // 创建React元素
ReactDOM.render(element, document.getElementById("root")); // 将React元素渲染成DOM，并放在`#root`DOM元素中
```

页面上会展示出 “Hello, world!”。

## 为什么使用 JSX？

React 认为渲染逻辑本质上与其他 UI 逻辑内在耦合，比如，在 UI 中需要绑定处理事件、在某些时刻状态发生变化时需要通知到 UI，以及需要在 UI 中展示准备好的数据。

React 并没有采用*将标记与逻辑进行分离到不同文件*这种人为地分离方式，而是通过将二者共同存放在称之为“组件”的松散耦合单元之中，来实现[关注点分离](https://en.wikipedia.org/wiki/Separation_of_concerns)。

React 不强制要求使用 JSX，但是大多数人发现，在 JavaScript 代码中将 JSX 和 UI 放在一起时，会在视觉上有辅助作用。它还可以使 React 显示更多有用的错误和警告消息。

## 在 JSX 中嵌入表达式

在下面的例子中，我们声明了一个名为`name`的变量，然后在 JSX 中使用它，并将它包裹在大括号中：

```jsx
const name = "Josh Perez";
const element = <h1>Hello, {name}</h1>;

ReactDOM.render(element, document.getElementById("root"));
```

在 JSX 语法中，你可以在大括号内放置任何有效的 JavaScript 表达式。例如，`2 + 2`、`user.firstName`或`formatName(user)`都是有效的 JavaScript 表达式。

在下面的示例中，我们将调用 JavaScript 函数`formatName(user)`的结果，并将结果嵌入到`<h1>`元素中。

```jsx
function formatName(user) {
  return user.firstName + " " + user.lastName;
}

const user = {
  firstName: "Harper",
  lastName: "Perez"
};

const element = <h1>Hello, {formatName(user)}!</h1>;

ReactDOM.render(element, document.getElementById("root"));
```

## JSX 本身就是一个表达式

在编译之后，JSX 表达式会被转为普通 JavaScript 函数调用，并且对其取值后得到 JavaScript 对象。

也就是说，你可以在`if`语句和`for`循环的代码块中使用 JSX，将 JSX 赋值给变量，把 JSX 当作参数传入，以及从函数中返回 JSX：

```jsx
function getGreeting(user) {
  if (user) {
    return <h1>Hello, {formatName(user)}!</h1>;
  }
  return <h1>Hello, Stranger.</h1>;
}
```

## JSX 属性

你可以通过使用引号，来将属性值指定为字符串字面量：

```jsx
const element = <div tabIndex="0" />;
```

也可以使用大括号，来在属性值中插入一个 JavaScript 表达式：

```jsx
const element = <img src={user.avatarUrl} />;
```

在属性中嵌入 JavaScript 表达式时，不要在大括号外面加上引号。你应该仅使用引号（对于字符串值）或大括号（对于表达式）中的一个，对于同一属性不能同时使用这两种符号。

## 使用 JSX 指定子元素

假如一个标签里面没有内容，你可以使用 /> 来闭合标签，就像 XML 语法一样：

```jsx
const element = <img src={user.avatarUrl} />;
```

JSX 标签里能够包含很多子元素：

```jsx
const element = (
  <div>
    <h1>Hello!</h1>
    <h2>Good to see you here.</h2>
  </div>
);
```

## JSX 是什么？

> JSX 表示的是对象。
>
> 实际上，JSX 仅仅只是`React.createElement(component, props, children)` 函数的语法糖。

Babel 会把 JSX 转译成一个名为`React.createElement()`函数调用。

以下两种示例代码完全等效：

```jsx
const element = <h1 className="greeting">Hello, world!</h1>;
```

```jsx
const element = React.createElement(
  "h1",
  { className: "greeting" },
  "Hello, world!"
);
```

`React.createElement()`会预先执行一些检查，以帮助你编写无错代码，但实际上它创建了一个这样的对象：

```jsx
// 注意：这是简化过的结构
const element = {
  type: "h1",
  props: {
    className: "greeting",
    children: "Hello, world!"
  }
};
```

这些对象被称为 “React 元素”。它们描述了你希望在屏幕上看到的内容。React 通过读取这些对象，然后使用它们来构建 DOM 以及保持随时更新。

## 条件渲染

> React 中的条件渲染和 JavaScript 中的一样，使用 JavaScript 运算符`if`或者条件运算符去创建元素来表现当前的状态，然后让 React 根据它们来更新 UI。

### if

我们创建一个`Greeting`组件，它会根据用户是否登录来决定显示不同的问候语：

```jsx
import React from "react";
import RectDOM from "react-dom";

function Greeting(props) {
  const { isLoggedIn } = props;

  if (isLoggedIn) {
    return <h1>欢迎回来！</h1>;
  } else {
    return <h1>请登录。</h1>;
  }
}

ReactDOM.render(
  <Greeting isLoggedIn={false} />,
  document.getElementById("root")
);
```

### 与运算符 &&

通过花括号包裹代码，你可以[在 JSX 中嵌入任何表达式](#在-jsx-中嵌入表达式)。这也包括 JavaScript 中的逻辑与 (&&) 运算符。它可以很方便地进行元素的条件渲染。

```jsx
function Mailbox(props) {
  const { unreadMessages } = props;
  return (
    <div>
      <h1>你好，张三！</h1>
      {unreadMessages.length > 0 && (
        <h2>你有{unreadMessages.length}条未读邮件。</h2>
      )}
    </div>
  );
}

const messages = ["React", "Re: React", "Re:Re: React"];
ReactDOM.render(
  <Mailbox unreadMessages={messages} />,
  document.getElementById("root")
);
```

这段代码会在页面上显示`你有3条未读邮件。`。

之所以能这样做，是因为在 JavaScript 中，`true && expression`总是会返回`expression`, 而`false && expression`总是会返回`false`。

因此，如果条件是`true`，`&&`右侧的元素就会被渲染，如果是`false`，`React`会忽略并跳过它。

### 三目运算符

另一种内联条件渲染的方法是使用 JavaScript 中的三目运算符[condition ? true : false](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Conditional_Operator)。

```jsx
function Greeting() {
  const { isLoggedIn } = props;
  return <div>{isLoggedIn ? <LogoutButton /> : <LoginButton />}</div>;
}
```

### 阻止组件渲染

当组件在某些条件下不需要渲染任何东西，就相当于隐藏了一样。这种情况下直接返回`null`，组件就不会进行任何渲染了。

```jsx
import React, { useState } from "react";
import ReactDOM from "react-dom";

function WarningBanner(props) {
  if (!props.warn) {
    return null;
  }

  return <div className="warning">警告!</div>;
}

function App() {
  const [showWarning, setShowWarning] = useState(false);

  return (
    <div>
      <WarningBanner warn={showWarning} />
      <button onClick={() => setShowWarning(!showWarning)}>
        {showWarning ? "隐藏" : "显示"}
      </button>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
```

## 列表 & key

在 JavaScript 中，我们使用[数组的 map()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/map)函数转换列表。如下代码，让数组中的每一项变成双倍，然后得到一个新列表`doubled`并打印出来：

```jsx
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(number => number * 2);
console.log(doubled);
```

代码打印出`[2, 4, 6, 8, 10]`。

在 JSX 中，把数组转化为元素列表的过程是相似的。

### 渲染多个组件

我们在页面上渲染一组数字：

```jsx
import React from "react";
import ReactDOM from "react-dom";

const numbers = [1, 2, 3, 4, 5];
const listItems = numbers.map(number => <li>{number}</li>); // 将数组转换成一组li元素

ReactDOM.render(<ul>{listItems}</ul>, document.getElementById("root")); // 将一组li元素包含在ul元素中，并在#root中渲染出来。
```

这段代码渲染出了 1 到 5 的项目符号列表。

### key

> key 帮助 React 识别哪些元素改变了，比如被添加或删除。因此你应当给数组中的每一个元素赋予一个确定的标识。

```jsx
const numbers = [1, 2, 3, 4, 5];
const listItems = numbers.map(number => (
  <li key={number.toString()}>{number}</li>
));
```

一个元素的 key 最好是这个元素在列表中拥有的一个独一无二的字符串。通常，我们使用来自数据 id 来作为元素的 key：

```jsx
const todoItems = todos.map(todo => <li key={todo.id}>{todo.text}</li>);
```

当元素没有确定 id 的时候，万不得已你可以使用元素索引 index 作为 key：

```jsx
const todoItems = todos.map((todo, index) => (
  // 只有在没有id时才这么做
  <li key={index}>{todo.text}</li>
));
```

如果列表项目的顺序可能会变化，我们不建议使用索引来用作 key 值，因为这样做会导致性能变差，还可能引起组件状态的问题。

### 用 key 提取组件

> 元素的 key 只有放在就近的数组上下文中才有意义。

比方说，如果你提取 出一个`ListItem`组件，你应该把 key 保留在数组中的这个`<ListItem />`元素上，而不是放在 `ListItem`组件中的`<li>`元素上。

**例子：不正确的使用 key 的方式**

```jsx
import React from "react";
import ReactDOM from "react-dom";

function ListItem(props) {
  const value = props.value;
  return (
    // 错误！你不需要在这里指定 key：
    <li key={value.toString()}>{value}</li>
  );
}

function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map(number => (
    // 错误！元素的 key 应该在这里指定：
    <ListItem value={number} />
  ));
  return <ul>{listItems}</ul>;
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById("root")
);
```

**例子：正确的使用 key 的方式**

```jsx
import React from "react";
import ReactDOM from "react-dom";

function ListItem(props) {
  // 正确！这里不需要指定 key：
  return <li>{props.value}</li>;
}

function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map(number => (
    // 正确！key 应该在数组的上下文中被指定
    <ListItem key={number.toString()} value={number} />
  ));
  return <ul>{listItems}</ul>;
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById("root")
);
```

一个好的经验法则是：在 map() 方法中的元素需要设置 key 属性。

### key 只是在兄弟节点之间必须唯一

数组元素中使用的 key 在其兄弟节点之间应该是独一无二的。然而，它们不需要是全局唯一的。当我们生成两个不同的数组时，我们可以使用相同的 key 值：

```jsx
import React from "react";
import ReactDOM from "react-dom";

function Blog(props) {
  const sidebar = (
    <ul>
      {props.posts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
  const content = props.posts.map(post => (
    <div key={post.id}>
      <h3>{post.title}</h3>
      <p>{post.content}</p>
    </div>
  ));
  return (
    <div>
      {sidebar}
      <hr />
      {content}
    </div>
  );
}

const posts = [
  { id: 1, title: "Hello World", content: "Welcome to learning React!" },
  { id: 2, title: "Installation", content: "You can install React from npm." }
];
ReactDOM.render(<Blog posts={posts} />, document.getElementById("root"));
```

key 会传递信息给 React ，但不会传递给你的组件。如果你的组件中需要使用 key 属性的值，请用其他属性名显式传递这个值：

```jsx
const content = posts.map(post => (
  <Post key={post.id} id={post.id} title={post.title} />
));
```

上面例子中，Post 组件可以读出`props.id`，但是不能读出`props.key`。

### 在 JSX 中嵌入 map()

在上面的例子中，我们声明了一个单独的 listItems 变量并将其包含在 JSX 中：

```jsx
function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map(number => (
    <ListItem key={number.toString()} value={number} />
  ));
  return <ul>{listItems}</ul>;
}
```

JSX 允许在大括号中[嵌入任何表达式](#在-jsx-中嵌入表达式)，所以我们可以内联 map() 返回的结果：

```jsx
function NumberList(props) {
  const numbers = props.numbers;
  return (
    <ul>
      {numbers.map(number => (
        <ListItem key={number.toString()} value={number} />
      ))}
    </ul>
  );
}
```

这么做有时可以使你的代码更清晰，但有时这种风格也会被滥用。就像在 JavaScript 中一样，何时需要为了可读性提取出一个变量，这完全取决于你。

## 参考文章

- [React 官方教程：JSX 简介](https://zh-hans.reactjs.org/docs/introducing-jsx.html)
- [React 官方教程：元素渲染](https://zh-hans.reactjs.org/docs/rendering-elements.html)
- [React 官方教程：条件渲染](https://zh-hans.reactjs.org/docs/conditional-rendering.html)
- [React 官方教程：列表 & Key](https://zh-hans.reactjs.org/docs/lists-and-keys.html)
