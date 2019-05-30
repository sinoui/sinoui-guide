---
id: react-router
title: React Router 使用教程
sidebar_label: React Router 使用教程
---

> react-router 通过管理 URL,实现组件的切换和状态变化。

## 基本用法

React Router 的安装命令：

```shell
npm install --save react-router
// 或者
yarn add react-router
```

使用方式：

```jsx
import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

function Index() {
  return <h2>Home</h2>;
}

function About() {
  return <h2>About</h2>;
}

function Users() {
  return <h2>Users</h2>;
}

function AppRouter() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about/">About</Link>
            </li>
            <li>
              <Link to="/users/">Users</Link>
            </li>
          </ul>
        </nav>

        <Route path="/" exact component={Index} />
        <Route path="/about/" component={About} />
        <Route path="/users/" component={Users} />
      </div>
    </Router>
  );
}

export default AppRouter;
```

上述示例中：

- `Router`组件本身只是一个容器，真正的路由需要通过`Route`组件定义
- `Route`组件中，`path`属性是指跳转的`url`,`component`属性用来定义跳转到的页面组件

> 注意：`path`只需要配置 URL 中的路径就行，不需要理会请求参数部分。
>
> 如，你的路由配置如下:
>
> ```tsx
> <Route path="/list" component={ListPage} />
> ```
>
> 那么以下 URL 均匹配到这个路由配置，显示`ListPage`：
>
> - /list
> - /list?searchText=react
> - /list?searchText=react&beginTime=20180101&endTime=20190530

## 嵌套路由

```jsx
import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

// App组件中定义根路由
function App() {
  return (
    <Router>
      <div>
        <Header />

        <Route exact path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/topics" component={Topics} />
      </div>
    </Router>
  );
}

function Home() {
  return <h2>Home</h2>;
}

function About() {
  return <h2>About</h2>;
}

function Topic({ match }) {
  return <h3>Requested Param: {match.params.id}</h3>;
}

// 在Topics组件中定义子路由
function Topics({ match }) {
  return (
    <div>
      <h2>Topics</h2>

      <ul>
        <li>
          <Link to={`${match.url}/components`}>Components</Link>
        </li>
        <li>
          <Link to={`${match.url}/props-v-state`}>Props v. State</Link>
        </li>
      </ul>

      <Route path={`${match.path}/:id`} component={Topic} />
      <Route
        exact
        path={match.path}
        render={() => <h3>Please select a topic.</h3>}
      />
    </div>
  );
}

function Header() {
  return (
    <ul>
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/about">About</Link>
      </li>
      <li>
        <Link to="/topics">Topics</Link>
      </li>
    </ul>
  );
}

export default App;
```

上述示例是在 Topics 组件中嵌套了子路由：

- 在`Topics`组件中，传入一个`match`对象属性，然后我们继续在 Topics 组件定义 Link 在路径`to={`\${match.url}/components`}`其中`match.url`返回的就是`/topics`,这个跳转路径实际为`/topics/components`。
- 在 Topics 组件中定义<Route path={`${match.path}/:id`} component={Topic} />，这里的 id 对应 <Link to={`${match.url}/components`}>Components</Link>中的`components`。
- 其中<Route path={`${match.path}/:id`} component={Topic} />就是<Route path="/topics" component={Topics} />的子路由。

## Route 组件

`Route`是用于声明路由映射到应用程序的组件层。`Route`有两个特别重要的属性:`path`和`component`，其中`path`指定路由匹配的路径(url)；`component`定义路由对应的页面组件。

```jsx
import { Route } from 'react-router-dom';

const About = () => <div>About</div>;

// 当路径匹配到`/about`时，会渲染About组件
<Route path="/about" component={About} />;
```

### 其它属性

- exact

  完全匹配，路径必须完全一致，才能渲染对应页面

  ```jsx
  <Route exact path="/about" component={About} /> // 路径必须为`/about`时才能渲染About,如果为`/about/:id`则不渲染
  ```

- strict

  严格匹配。如果为`true`，则具有尾部斜杠的路径将仅匹配具有尾部斜杠的`location.pathname`。当`location.pathname`中有其他 URL 段时，这不起作用。

- sensitive

  是否需要区分大小写，如果为 true,则在匹配路径时会区分大小写。

  ```jsx
  <Route sensitive path="/about" component={About} /> // 路径必须为`/about`时才能渲染About,如果为`/About`则不渲染
  ```

## Switch

`Switch`组件将迭代其所有子元素，并且仅渲染与当前位置匹配的第一个子元素，避免重复渲染。

```jsx
<BrowserRouter>
  <div>
    <div>
      <ul>
        <li>
          <Link to="/Guide/ContactUs">ContactUs</Link>
        </li>
      </ul>
    </div>
    <Switch>
      <Route path="/Guide/ContactUs" component={ContactUs} />
      <Route path="/Guide/ContactUs" component={ContactUs} />
    </Switch>
  </div>
</BrowserRouter>
```

此时只会渲染一个 ContactUs 组件，而不是重复渲染两次。

## Router

`Router`能够保持 UI 和 URL 的同步。

### 属性

- children

  一个或多个`Route`。当`history`改变时，`Router`会匹配出`Route`的一个分支，并且渲染这个分支中配置的组件，渲染时保持父`route`组件中嵌套的子`route`组件。

- history

  `Router`监听的`history`对象

## 页面跳转

这里我们简单介绍两种页面跳转方式：`Link`、`push`、`goBack`等方法调用。

### Link

允许路由跳转的主要方式。以适当的`href`去渲染匹配到的路由组件。可以接收到`Router`的状态。

```jsx
<Link to="/about">About</Link> // 点击渲染`/about`匹配到的页面
```

上述示例，当我们点击<Link>时，`URL`会更新，组件会被重新渲染。其中，`to`指定链接到的路径。

`to`不仅可以是字符串，还可以 location 是对象。

除此之外，`Link`的`replace`属性如果为 true，则单击该链接将替换历史堆栈中的当前条目，而不是添加新条目。

```jsx
<Link to="/courses" replace /> //此时历史堆栈中的当前条目会被替换
```

### 调用方法

#### history.push()

```jsx
import React from 'react';
import { withRouter } from 'react-router';

function Button() {
  const { history } = props;
  return <button onClick={() => history.push('/about')}>点击跳转</button>;
}

export default withRouter(Button);
```

点击`Button`，页面将会渲染`/about`路径匹配到的组件

#### history.goBack()

```jsx
import React from 'react';
import { withRouter } from 'react-router';

function Button() {
  const { history } = props;
  return <button onClick={() => history.goBack()}>点击回退</button>;
}

export default withRouter(Button);
```

点击按钮，页面将会回退，渲染前一个组件。

### 附: 重定向（Redirect）

<Redirect>将导航到新位置。新位置将覆盖历史堆栈中的当前位置。即用户访问一个路由，会自动跳转到另一个路由。

```jsx
import { Route, Redirect } from 'react-router';

<Route
  exact
  path="/"
  render={() => (loggedIn ? <Redirect to="/dashboard" /> : <PublicHomePage />)}
/>;
```

上述示例中，如果路由匹配到`/`时，`loggedIn`为`true`时,路由就会重定向至`/dashboard`。

```jsx
<Switch>
  <Redirect from="/old-path" to="/new-path" />
  <Route path="/new-path" component={Place} />
</Switch>
```

上述示例，当路由匹配到`/old-path`时，会被重定向到`/new-path`，渲染`Place`组件。

## 数据传递

页面之间通过路由参数进行数据交互主要有三种方式：

- 路径参数
- 请求参数
- `history state`

### 1. 路径参数

> 用于传递数据的 id。注意不要因为需要传递一些查询条件等临时数据，不要使用路径参数，而是使用下一节介绍的请求参数。

```react

//通过路由传递gwlx和recordId参数
<Route path='/archive/dispatch/:gwlxId' component={XxxDetailPage} />


// HelloWorldPage.tsx中参数获取

import { withRouter } from 'react-router';

function HelloWorldPage(props){
    const {gwlxId,recordId} = props.match.params;
    return (<>
        <div>公文类型为：{gwlxId}</div>
        <div>数据ID为：{recordId}</div>
        </>)
}

export default withRouter(HelloWorldPage);
```

### 2. 请求参数

> 请求参数可以用来传递除数据 id 之外的数据。如查询条件。
>
> 首先看一下一个普通的 URL：
>
> `/archive/dispatch-list?userId=123&userName=张三`
>
> 其中`/archive/dispatch-list`是路径部分，而`?userId=123&userName=张三`是查询参数，也称之为请求参数。
>
> 我们可以通过`location.search`获取到查询参数。可以使用`qs`模块解析查询参数。
>
> ```ts
> const searchParams = qs.parse(
>   props.location.search ? props.location.search.substr(1) : '',
> );
> ```
>
> 在创建这样的 URL 时，也可以用`qs`模块格式化请求参数：
>
> ```ts
> const searchParams = { userId: '123', userName: '张三' };
> const url = `/archive/dispatch-list?${qs.stringify(searchParams)}`;
> ```

```tsx
// Button.tsx

import { withRouter } from 'react-router';

function Button(props) {
  return (
    <button
      onClick={() =>
        props.history.push(`/archive/dispatch-list?userId=123&userName=张三`)
      }
    >
      点击跳转页面
    </button>
  );
}

export default withRouter(Button);

// HelloWorldPage.tsx中参数获取

import { withRouter } from 'react-router';
import qs from 'qs';

function HelloWorldPage(props) {
  const { userId, userName } = qs.parse(
    props.location.search ? props.location.search.substr(1) : '',
  );
  return (
    <>
      <div>用户名为：{userName}</div>
      <div>用户ID为：{userId}</div>
    </>
  );
}

export default withRouter(HelloWorldPage);
```

### 3. `history state`

使用请求参数可以传递很多数据，但是同时也会污染 URL。有时，我们只想向新页面传递一些临时的数据，又不想让用户在浏览器地址栏上看到非常长的 URL，或者不想让用户收藏这个链接，再次打开这个链接时还带着这些临时数据。如果是这样的情况，我们可以使用[history state](https://developer.mozilla.org/zh-CN/docs/Web/API/History)来传递数据。

> 请注意：如果是给列表页传递查询条件，使用请求参数。
>
> 千万注意：刷新页面或者重新打开页面，不会再有之前的`history state`数据。浏览器的历史回退、前进会保持页面的`history state`。

```react
// Button.tsx

import { withRouter } from "react-router";

function Button(props) {
  return (
    <button
      onClick={() =>
        props.history.push("url", { gwlxId: "hfw", recordId: "123" })
      }
    >
      点击跳转页面
    </button>
  );
}

export default withRouter(Button);

// HelloWorldPage.tsx中参数获取

import { withRouter } from "react-router";

function HelloWorldPage(props) {
  const { gwlxId, recordId } = props.location.state || {};
  return (
    <>
      <div>公文类型为：{gwlxId}</div>
      <div>数据ID为：{recordId}</div>
    </>
  );
}

export default withRouter(HelloWorldPage);
```

### 小结

路径参数和请求参数的方式适合传递少量的数据，history state 适合传递完整的数据对象。

## 总结

此教程通过描述 react-router 中的基本组件及其简单用法。更多用法请移步至[react-router 官网](https://reacttraining.com/react-router/web/guides/quick-start)希望我们能够快速掌握路由定义、路由配置、路由跳转、路由传参等相关技能。

## 参考资料

- [react-router 官网](https://reacttraining.com/react-router/web/guides/quick-start)
- [React Router 4 简易入门](https://segmentfault.com/a/1190000010174260?utm_source=tag-newest#articleHeader14)
- [React Router 中文文档](http://react-guide.github.io/react-router-cn/index.html)
- [React Router 使用教程](http://www.ruanyifeng.com/blog/2016/05/react_router.html)
