---
id: js-is-number
title: 数值判断
sidebar_label: 数值判断
---

如果你在代码中编写`isNaN(arg)`这样的代码，很有可能得到类似下面的提示错误：

![isNaN的eslint提示](assets/images/is-nan-eslint-error.jpg)

上图是一个 eslint 错误提示，警告我们不要使用`isNaN`。这是怎么回事呢？本篇文章就是从这个错误提示开始的，介绍如何正确处理数值判断。

（注：上图是 eslint 配置了[eslint-config-airbnb](https://www.npmjs.com/package/eslint-config-airbnb-base)之后产生的错误提示。）

## NaN

全局属性`NaN`的值表示不是一个数字（`Not-A-Number`）。按照规范定义，`NaN`是一种特殊的数值，表示的是非数字的数值。当你在执行任何数学运算时无法得到数字时，我们就用`NaN`表示结果。比如`parseInt('babala')`是无法解析出数字的，这时会返回`NaN`。再比如`10 / 'foo'`是无法得到数字结果的，这时会返回`NaN`。注意`10 / 0`并不会返回`NaN`，而是返回`Infinity`，表示无穷大。

示例 1：

```js
const result = parseInt('babala'); // NaN

typeof result === 'number'; // true
```

示例 2：

```js
const result = 10 / 'foo'; // NaN

typeof result === 'number'; // true
```

示例 3：

```js
const result = 10 / 0; // Infinity
```

### 犯了错误的`isNaN`

> 不要使用全局方法`isNaN()`来判断一个值是否是`NaN`。

先来看几行代码：

```js
isNaN(10 / 'foo'); // true
```

## 判断是否是数字

## 参考资料

- [You-Dont-Know-JS: The Not Number, Number](https://github.com/getify/You-Dont-Know-JS/blob/master/types%20%26%20grammar/ch2.md#the-not-number-number)
- [Airbnb JavaScript: Standard Library](https://github.com/airbnb/javascript#standard-library)
- [eslint-config-airbnb](https://www.npmjs.com/package/eslint-config-airbnb)
- [eslint: no-restricted-globals](https://eslint.org/docs/rules/no-restricted-globals)
- [MDN: NaN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/NaN)
- [ECMAScript 5.1 Spec: NaN](https://www.ecma-international.org/ecma-262/5.1/#sec-15.1.1.1)
- [百度百科: NaN](https://baike.baidu.com/item/nan/7455322?fr=aladdin)
