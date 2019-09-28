---
id: mouse-event
title: 鼠标事件
sidebar_label: 鼠标事件
---

`MouseEvent` 接口指用户与指针设备（ 如鼠标 ）交互时发生的事件。使用此接口的常见事件包括：`click`, `dblclick`, `mouseup`, `mousedown`, `mousemove`, `mouseleave`。

这篇文章将介绍在日常开发中关于鼠标事件容易混淆的知识点，包括：

- 事件目标
- 鼠标事件位置
- 取消与阻止事件

最后会介绍鼠标事件在 `React` 和 `TypeScript` 中使用的一些知识点。

## `target` vs `currentTarget`

在日常开发中，很容易混淆事件对象的 `target` 和 `currentTarget` 这两个指向事件目标的属性，它们的区别还是非常明显的：

- `target` - 指向触发事件的 DOM 元素
- `currentTarget` - 指向事件绑定的 DOM 元素。当事件沿着 DOM 触发时事件的当前目标。

大部分情况下，`target` 和 `currentTarget` 是相同的，如下面的例子：

```html
<button onclick="handleClick(event)">按钮</button>
<script>
  function handleClick(event) {
    const { target, currentTarget } = event;
    assert(target === currentTarget); // target, currentTarget 同时指向 button 元素
  }
</script>
```

但是事件是可以捕捉和冒泡的。所以，`target` 和 `currentTarget` 也有不相同的情况，如下所示：

```html
<div onclick="handleClick(event)">
  <button>按钮</button>
</div>

<script>
  function handleClick(event) {
    const { target, currentTarget } = event;

    assert(target !== currentTarget); // ⚠️ target 指向 div 元素， currentTarget 指向 button 元素
  }
</script>
```

## `relatedTarget`

有一些事件，如 `mouseleave`, `mouseenter`, `mouseout`，我们还关心它们的次要目标，如 关注 `mouseleave` 事件离开主目标（ `target` ）后进入了哪个 DOM 元素。 `event` 事件的 `relatedTarget` 指向次要目标。

## 鼠标位置

鼠标事件中表示鼠标位置的属性有：

- `pageX` / `pageY`
- `offsetX` / `offsetY` ⚠️ 有兼容性问题，慎用。[can i use](https://caniuse.com/#search=offsetX)
- `clientX` / `clientY`
- `screenX` / `screenY`

上面的鼠标位置相对的起点目标是不一样的：

- `clientX` / `clientY` 鼠标指针点击位置相对于页面可视区域（ viewport ）左上角的偏移
- `offsetX` / `offsetY` 鼠标指针点击位置相对于目标元素（ target ）左上角的偏移
- `pageX` / `pageY` 鼠标指针点击位置相对于 `document.body` 左上角的偏移
- `screenX` / `screenY` 鼠标指针点击位置相对于屏幕左上角的偏移

在日常开发中，最常用的 `clientX` / `/clientY` 和 `pageX` / `pageY`，注意它们之间的细微区别。它们之间也是可以换算的：

```ts
const pageScrollTop = document.documentElement.scrollTop; // 页面滚动高度
assert(pageY === clientY + pageScrollTop);
```

## 取消与阻止事件

有三个方法与事件取消与阻止冒泡相关的：

- `preventDefault()` - 阻止事件的默认行为，如阻止 `a` 的点击事件，则点击 `a` 页面不会跳转链接。
- `stopPropagation()` - 阻止事件冒泡。
- `stopImmediatePropagation()` - 阻止事件冒泡以及当前 DOM 元素同一事件的其他事件监听器。

## 在 React 和 TypeScript 中使用

```tsx
import React from 'react';

function Demo() {
  const handleClick = (event: React.MouseEvent) => {
    const {
      pageX,
      clientX,
      screenX,
      nativeEvent: { offsetX },
    } = event;

    console.log(pageX, clientX, screenX, offsetX);
  };
  return <button onClick={handleClick}>按钮</button>;
}
```

## 参考

- [MDN: Event API](https://developer.mozilla.org/zh-CN/docs/Web/API/Event)
- [MDN: UIEvent API](https://developer.mozilla.org/zh-CN/docs/Web/API/UIEvent)
- [MDN: 鼠标事件](https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent)
