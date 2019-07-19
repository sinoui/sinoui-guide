---
id: debounce-and-throttle-guide
title: 节流和防抖
sidebar_label: 节流和防抖
---

节流和防抖都是为了解决短时间内大量触发某函数而导致的性能问题，比如触发频率过高导致的响应速度跟不上触发频率，出现延迟、假死或卡顿的现象。但二者应对的业务需求不一样。下面会以 lodash 的 debounce 和 throttle 方法来进行说明。

## 防抖（debounce）

在事件被触发 n 秒后在执行回调函数，如果在这 n 秒内又被触发，则重新计时。

### debounce 应用场景

1. 用户在输入框中连续输入一串字符后，只会在输入完后执行最后一次的查询 ajax 请求，这样可以有效减少请求次数，节约请求资源
2. window 的 resize，scroll 事件，不断地调整浏览器的窗口大小，或者滚动式会触发对应事件，防抖让其只触发一次

## 节流（throttle）

规定一个单位时间，在这个单位时间内，只能有一次触发事件的回调函数执行，如果在同一个单位时间内某时间被触发多次，只有一次能生效

### throttle 应用场景

1. 鼠标连续不断的触发某事件（如点击），只在单位时间内触发一次
2. 在页面的无限加载场景下，需要用户在滚动页面时，每隔一段时间触发一次 ajax 请求，而不是在用户停下滚动页面操作时才去请求数据
3. 监听滚动事件，比如是否滑到底部自动加载更多，用 throttle 来判断

## 示例代码

下面示例简单描述一个根据输入框内容去获取后端查询结果的场景。对于 throttle 和 debounce 方法均适用

```tsx
import React, { useState, useCallback } from 'react';
import debounce from 'lodash/debounce';

const sourceArr = Array.from({ length: 20 }).map(
  (item, idx) => `测试数据${idx}`,
);

// 模拟后端查询的接口与返回数据
const doSomeQuery = async (text) => {
  return sourceArr.filter(() => Math.random() > 0.7);
};

export default function App() {
  const [text, setText] = useState('');
  const [queryResult, setQueryResult] = useState([]);

  const handleChange = useCallback((e) => {
    const value = e.target.value;
    setText(value);
    query(value);
  }, []);

  const query = useCallback(
    debounce((value) => {
      doSomeQuery(value).then((newValue) => setQueryResult(newValue));
    }, 1000),
    [],
  );

  return (
    <>
      <input type="text" value={text} onChange={handleChange} />
      {queryResult.map((item) => (
        <div key={item}>{item}</div>
      ))}
    </>
  );
}
```

## 与 hooks 的配合使用过程中遇到的问题

### 直接使用 throttle 不起作用

```ts
const handleChange = throttle((e) => {
  // 每次change事件都会触发此方法，设置的delay没有效果
  setText(e.target.value);
}, 1000);
```

### debounce 方法使用 event 事件对象做为参数

触发 handleChange 事件， event 对象会发生变化，导致程序报错

```ts
const handleChange = debounce((e) => {
  // 下面的代码执行会报错: TypeError: Cannot read property 'value' of null
  setText(e.target.value);
}, 1000);
```

### 与 useCallback 方法结合使用。throttle 方法使用 event 事件对象做为参数

时间间隔之内多次触发 handleChange 事件， event 对象会发生变化，导致程序报错

```ts
const handleChange = useCallback(
  throttle((e) => {
    // 下面的代码执行会报错: TypeError: Cannot read property 'value' of null
    setText(e.target.value);
  }, 1000),
  [],
);
```

### 相应的解决方案

1. 使用明确的值替换 event 事件对象。
2. 可以将整个大方法进行切割，只对性能影响最大的部分进行防抖或节流的处理
3. 使用 useCallback 来缓存方法。在 hook 函数中单独使用 throttle 方法不起作用是因为每次 hooks 引起 function 组件重新渲染的时候，throttle 方法会被重新生成，导致方法失效,所以可以使用 useCallback 来缓存方法

具体方式可参考[示例代码](#示例代码)

## 小结

- 效果

  函数防抖就是触发事件后在 n 秒内只能执行一次，如果在 n 秒内又触发了该事件，则会重新计算函数执行时间；而函数节流是间隔时间执行，不管事件触发有多频繁，都会保证在规定时间内只执行一次

- 原理

  防抖是维护一个计时器，规定在 delay 时间后触发函数，但是在 delay 时间内再次触发的话，都会清除当前的 timer 然后重新设置超时调用，即重新计时。这样只有最后一次操作能被触发。
  节流是通过判断是否达到一定时间来触发函数，若没到规定时间则使用计时器延后，而下一次事件则会重新设定计时器
