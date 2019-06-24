---
id: react-lifting-state-up
title: 状态提升
sidebar_label: 状态提升
---

## 组件数据形态

### props

当 React 元素为用户自定义组件时，它会将`JSX`所接收的属性（attributes）转换为单个对象传递给组件，这个对象被称之为 `props`,即**属性**。

```jsx
import React from 'react';

//自定义组件
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

// demo
function Demo(props) {
  return <Welcome name="张三" />;
}
```

### state

State 是组件内部维护的一组用于反映组件 UI 变化的状态集合.

```tsx
import React, { useState } from 'react';

function Example() {
  // 定义count状态
  const [count, setCount] = useState(0);

  //使用count渲染页面
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
```

## 组件间数据交互

组件间数据交互主要有以下三种方式：

- 父组件---->子组件 使用属性传递
- 子组件---->父组件 调用回调函数
- 兄弟组件 使用状态提升

此外，如果父子之间跨级别较多，建议使用 context。

### 父-->子

父子间的组件通信通常采用属性的方式传递，例如：

```jsx
import React from 'react';

//自定义组件
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

// demo
function Demo(props) {
  return <Welcome name="张三" />;
}
```

上述示例中：

- 子组件 Welcome 接收一个 name 属性来渲染页面
- 父组件`Demo`在使用 Welcome 时，指定 name 属性值

### 子-->父

子组件到父组件之间的数据交互通常通过调用回调函数的方式，子组件告诉父组件值要发生变化，例如：

```tsx
import React, { useState, ChangeEvent } from 'react';

function Child(props: any) {
  return <input value={props.vaue} onChange={props.onChange} />;
}

function Parent() {
  const [value, setValue] = useState('');

  // 监听子组件值的改变，从而改变value值
  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  return <Child value={value} onChange={onChange} />;
}
```

上述示例中：

- 子组件`Input`的值发生改变时,调用`onChange`回调函数属性通知父组件自己的值将发生改变
- 父组件`Parent`监听子组件值的改变，重新设定 value 值

### 兄弟组件之间的数据传递

兄弟组件之间的数据传递一般使用状态提升，比如：

```tsx
import React, { useState, ChangeEvent } from 'react';

//摄氏温度转为华氏温度
function toFahrenheit(celsius: number) {
  return (celsius * 9) / 5 + 32;
}

// 温度输入框组件
function TemperatureInput(props: any) {
  return (
    <div>
      <p>请在此处输入摄氏温度</p>
      <input value={props.celsius} onChange={props.onChange} />
    </div>
  );
}

//华氏温度展示组件
function FahrenheitComponent(props: { fahrenheit: number }) {
  return <div>此时的华氏温度为:{props.fahrenheit}</div>;
}

//父组件
function Parent() {
  const [celsius, setCelsius] = useState('');

  // 监听子组件值的改变，从而改变celsius值
  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCelsius(event.target.value);
  };

  const fahrenheit = toFahrenheit(celsius);
  return (
    <>
      <TemperatureInput celsius={celsius} onChange={onChange} />
      <FahrenheitComponent fahrenheit={fahrenheit} />
    </>
  );
}
```

上述示例中：

- 子组件`TemperatureInput`值发生改变时，通知父组件重新设定温度值
- 父组件监听到`TemperatureInput`值的变化，重新设定温度值，并且将其转换成华氏温度，传递给子组件`FahrenheitComponent`
- 子组件`FahrenheitComponent`接收父组件指定的`fahrenheit`来渲染页面
- 因此，每当`TemperatureInput`中输入框值发生变化时，`FahrenheitComponent`会重新渲染

### 跨级别组件之间的数据交互

跨级别组件之间的数据交互通常采用`Context`,比如下面这个主题定制的示例：

`ThemeContext.ts`

```ts
const ThemeContext = createContext({ color: 'red' });

export default ThemeContext;
```

`Button.tsx`

```tsx
import React, { useContext } from 'react';
import ThemeContext from './ThemeContext';

function Button(props: any) {
  const { color } = useContext(ThemeContext);

  return <button style={{ color }}>{props.children}</button>;
}
```

`Component.tsx`

```tsx
import React from 'react';
import Button from './Button';

function Component() {
  return <Button>自定义文本颜色按钮</Button>;
}
```

`Parent.tsx`

```tsx
import React, { useContext } from 'react';
import ThemeContext from './ThemeContext';
import Component from './Component';

function Parent() {
  return (
    <ThemeContext.Provider value={{ color: 'blue' }}>
      <Component />
    </ThemeContext.Provider>
  );
}
```

上述示例中：

- `Button`组件作为`Parent`的“孙子”组件，需要根据 Parent 中的 color 来渲染按钮文本颜色
- `Parent`作为祖先组件，提供 ThemeContext 的值
- `Button`组件使用 ThemeContext 提供的 color 值渲染按钮

## 总结

希望通过上述知识的了解，我们能够快速掌握组件之间的通讯方式，并且能够分辨清楚什么场景应该使用哪种通信方式，合理使用。
