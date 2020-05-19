---
id: element-width
title: 元素宽度
sidebar_label: 元素宽度
---

我们可以通过多种方式获取元素宽度，如：

- `offsetWidth`
- `clientWidth`
- `scrollWidth`
- `getBoundingClientRect()`

这篇文章介绍这几个宽度之间的差别。

## `offsetWidth` vs `clientWidth` vs `scrollWidth`

这三个属性都是用来获取元素的宽度。它们三者的区别是：

- `clientWith` - 元素可见内容区域的宽度（不包括边线和滚动条宽度）
- `offsetWidth` - 元素自身的宽度（包括边线和滚动条宽度）
- `scrollWidth` - 元素包含内容的宽度，不包括 padding 区域。

这三者是元素的“固定”宽度，即无论针对元素做什么变换操作，如`scale(0.7)`，这三个属性返回的值都是不变的。若想获取元素变换后的实际宽度，则需要使用 `getBoundingClientRect()`。

## `getBoundingClientRect()`

通过`getBoundingClientRect()`方法，可以返回元素“矩形区域”的尺寸和位置信息。

```tsx
const rect = element.getBoundingClientRect();
const { width, height, left, top } = rect;
```

在无变换情况下，`rect.width` 等于 `offsetWidth`。在有变换的情况下，就不相等了。

```css
div {
  width: 400px;
  transform: scale(0.7);
}
```

以上的`div`元素：

- `offsetWidth` = `400px`
- `clientWidth` = `400px`
- `rect.width` = `280px`

> 在实际开发过程中，需注意这些细微的差别。否则有可能引入 bug。
