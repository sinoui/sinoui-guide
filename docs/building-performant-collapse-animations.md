---
id: building-performant-collapse-animations
title: 实现高效的收缩动画
sidebar_label: 实现高效的收缩动画
---

以前我们采用改变元素的`width`和`height`来实现菜单展开、收缩动画。但是这会带来非常严重的性能问题。可以阅读 [渲染性能](https://developers.google.com/web/fundamentals/performance/rendering) 这篇文章，了解 css 性能。这篇文章记录如何使用 css 变换来实现高效的展开、收缩动画。

> 备注：文章采用的技术来自 [Building performant expand & collapse animations](https://developers.google.com/web/updates/2017/03/performant-expand-and-collapse)。

## 使用 scale

我们可以使用 scale 来实现展开、收缩动画。本章节以在垂直方向展开、收缩为例讲解如何实现。

### 第一步：收缩内容

我们的页面如下：

```html
<div>
  <button>收缩</button>
  <div class="container">
    <div class="content">
      这是内容区域
    </div>
  </div>
</div>
```

点击“收缩”按钮时，收缩内容区域。我们的第一版 css 如下：

```css
.container {
  display: inline-block;
  transition: transform 200ms ease-out;
}

.content {
  width: 200px;
  height: 400px;
  background-color: red;
}

.container--collapsed {
  display: inline-block;
  transform: scale(1, 0);
}
```

在点击收缩按钮时，给`.container`新增样式`container--collapsed`，这样内容区域就会收缩起来。但是在收缩过程中内容会被压扁，这不是我们想要的效果。

在动画过程中内容因`scale`的变化而被压扁，那么我们就可以反其道而行之，即通过`scale`放大内容的倍数。例如，在动画运行到 50ms 时，内容收缩为以前的`1/2`，那么可以将内容放大到`2倍`，就可以抵消压扁的情况。

有一个难点是：**我们必须按帧计算放大倍数**。如果使用了缓动函数，那么往往很难推导出它的反转函数，保证每一帧的**放大倍数 \* 缩小倍数 = 1**。

### 第二步：动态创建 css 动画

既然我们很难推导出缓动函数的反转函数，那我们可以通过 [JavaScript 缓动函数](http://gizma.com/easing/) 创建出每一帧对应的放大、缩小比例，然后动态创建类似下面的 css animation：

```css
@keyframes containerCollapseAnimation {
  0% {
    transform: scale(1, 1);
  }
  8.333% {
    transform: scale(1, 0.74655);
  }
  /** 省去其它比例的代码 */
  100% {
    tarnsform: scale(1, 0);
  }
}

@keyframes contentCollapseAnimation {
  0% {
    transform: scale(1, 1);
  }
  8.333% {
    transform: scale(1, 1.3395);
  }
  /** 省去其它比例的代码 */
  100% {
    transform: scale(1, 100);
  }
}
```

实现步骤：

- 选择合适的缓动函数的 js 实现
- 通过 js 计算出每一帧的收缩和展开比例
- 动态构建 css 动画

这里选用`ease-in-out`的 js 实现：

```ts
function easeInOut(
  elapsed: number,
  initialValue: number,
  amountOfChange: number,
  duration: number,
): number {
  if ((elapsed /= duration / 2) < 1) {
    return (amountOfChange / 2) * elapsed * elapsed * elapsed + initialValue;
  }
  return (
    (amountOfChange / 2) * ((elapsed -= 2) * elapsed * elapsed + 2) +
    initialValue
  );
}
```

然后动画创建 css 动画：

```tsx
import easInOut from './ease-in-out';

const duration = 200; // 动画时长。
function createKeyframeAnimation() {
  const steps = Math.ceil(duration / 16); // 帧数 = 步数
  const y = 0; // 元素最终缩小的比例
  const invertY = 100; // 元素最终放大的比例
  let animation = '';
  let inverseAnimation = '';

  for (let step = 0; step <= 100; step++) {
    let easedStep = easInOut(step / 100);

    const yScale = y + (1 - y) * easedStep;

    animation += `${step}% {
      transform: scale(1, ${yScale});
    }`;

    const invYScale = yScale === 0 ? invertY : Math.min(1 / yScale, invertY);
    inverseAnimation += `${step}% {
      transform: scale(1, ${invYScale});
    }`;
  }

  return `
    @keyframes containerCollapseAnimation {
      ${animation}
    }

    @keyframes contentCollapseAnimation {
      ${inverseAnimation}
    }`;
  }
}
```

### 第三步：启用 css animation

创建完动画后，就可以在元素中启用：

```css
.container--expanded {
  animation-name: containerCollapseAnimation;
  animation-duration: 0.2s;
  animation-timing-function: linear;
}

.container--expanded .content {
  animation-name: contentCollapseAnimation;
  animation-duration: 0.2s;
  animation-timing-function: linear;
}
```

## 总结

本篇文档介绍了垂直方向的收缩动画。掌握了这个思路，可以扩展到展开动画，以及水平方向或者水平、垂直同时缩放的场景。

## 参考资料

- [Building performant expand & collapse animations](https://developers.google.com/web/updates/2017/03/performant-expand-and-collapse)
