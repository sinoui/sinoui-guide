---
id: prevent-backspace-navigation
title: 防止按退格键页面返回
sidebar_label: 防止按退格键页面返回
---

在 IE、Firefox 中，有一个不太人性化的用户体验，即：在页面上按退格键（ `DELETE` 键），页面会返回。一般我们的项目中需要阻止这种默认行为。

## 方案

我们可以监听输入退格键来阻止这个行为。可以在页面上添加下面的 JS 脚本阻止默认行为：

```tsx
const BACKSPACE_KEYCODE = 8; // 退格键编号
const INPUT_TAGNAMES = ['INPUT', 'TEXTAREA'];

document.addEventListener(
  'keydown',
  (event) => {
    const { keyCode, target } = event;

    const isBackspace = keyCode === BACKSPACE_KEY_CODE;
    if (isBackspace) {
      const inputTarget = target;
      const isInput =
        INPUT_TAGS.indexOf(inputTarget.tagName.toUpperCase()) !== -1;
      const isEnable = !(inputTarget.disabled || inputTarget.readOnly);
      const isContentEditable =
        inputTarget.getAttribute('contenteditable') === 'true';

      if ((isInput && !isEnable) || (!isInput && !isContentEditable)) {
        event.preventDefault();
      }
    }
  },
  false,
);
```

## 在 React 项目中使用

[@sinouiincubator/use-disable-backspace-navigation]() 模块提供了阻止回格键页面回退的 hook，在 React 项目的根组件中使用即可。例如，在 `App` 组件使用。

```tsx
import React from 'react';
import useDisableBackspaceNavigation from '@sinouiincubator/use-disable-backspace-navigation';

function App() {
  useDisableBackspaceNavigation();

  return <div>app</div>;
}
```

## 参考

- [Stackoverflow 中关于退格键页面回退的讨论](https://stackoverflow.com/questions/1495219/how-can-i-prevent-the-backspace-key-from-navigating-back)
