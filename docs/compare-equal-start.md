---
id: compare-equal-start
title: 相等性比较
sidebar_label: 相等性比较
---

相等性比较在日常开发中比较常见，这里我们主要介绍以下四种方式：

- === 严格相等
- Object.is
- shallowEqual 浅比较
- deepEqual 深度比较

## 比较方式

### ===

严格相等。严格相等在进行比较时，不进行隐式的类型转换。如果下列任何一项成立，则两个值相同：

- 两个值都是`undefined`
- 两个值都是`null`
- 两个值都是`true`或两个值都是`false`
- 两个值是由相同个数的字符按照相同的顺序组成的字符串
- 两个值指向同一个对象
- 两个值都是同一个数字
- +0 和 -0

```js
console(undefined, undefined); // true
console(undefined, null); // false
console(null, null); // true

// 特例
console(+0, -0); // true
console.log(NaN, NaN); // false
```

### Object.is()

判断两个值是否是相同的值。如果下列任何一项成立，则两个值相同：

- 两个值都是 `undefined`
- 两个值都是 `null`
- 两个值都是 `true` 或者都是 `false`
- 两个值是由相同个数的字符按照相同的顺序组成的字符串
- 两个值指向同一个对象
- 两个值都是数字并且
  - 都是正零 `+0`
  - 都是负零 `-0`
  - 都是 [`NaN`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/NaN)
  - 都是除零和 [`NaN`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/NaN) 外的其它同一个数字

```javascript
Object.is('foo', 'foo'); // true
Object.is(window, window); // true

Object.is('foo', 'bar'); // false
Object.is([], []); // false

// 特例
Object.is(0, -0); // false
Object.is(0, +0); // true
Object.is(-0, -0); // true
Object.is(NaN, 0 / 0); // true
```

### shallowEqual

浅比较，主要用于对引用数据类型的比较。具体实现：

```typescript
// 用原型链的方法
const hasOwn = Object.prototype.hasOwnProperty;

// 这个函数实际上是Object.is()的实现
function is(x, y) {
  if (x === y) {
    return x !== 0 || y !== 0 || 1 / x === 1 / y;
  } else {
    return x !== x && y !== y;
  }
}

export default function shallowEqual(objA, objB) {
  // 首先对基本数据类型的比较
  if (is(objA, objB)) return true;
  /**
   * 由于Obejct.is()可以对基本数据类型做一个精确的比较， 所以如果不等
   * 只有一种情况是误判的，那就是object,所以在判断两个对象都不是object
   * 之后，就可以返回false了
   */
  if (
    typeof objA !== 'object' ||
    objA === null ||
    typeof objB !== 'object' ||
    objB === null
  ) {
    return false;
  }

  // 过滤掉基本数据类型之后，就是对对象的比较了
  // 首先拿出key值，对key的长度进行对比
  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  // 长度不等直接返回false
  if (keysA.length !== keysB.length) return false;
  // key相等的情况下，再去循环比较key值对应的value
  for (let i = 0; i < keysA.length; i++) {
    // key值相等的时候
    // 借用原型链上真正的 hasOwnProperty 方法，判断ObjB里面是否有A的key的key值
    // 最后，对对象的value进行一个基本数据类型的比较，返回结果
    if (!hasOwn.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
      return false;
    }
  }

  return true;
}
```

简单示例

```typescript
const objA = { a: 1, b: 2 };
const objB = { a: 1, b: 2 };

Object.is(objA, objB); // false
shallowEqual(objA, objB); //true
```

从上面的示例可以看出，当对比的类型为 Object 的时候并且 key 的长度相等的时候，浅比较也仅仅是用 Object.is()对 Object 的 value 做了一个基本数据类型的比较，所以如果 key 里面是对象的话，有可能出现比较不符合预期的情况，所以浅比较是不适用于嵌套类型的比较的。

常用的浅比较的库：

- react-redux | shallowEqual

  上述代码实现与 react-redux 中的 shallowEqual 方法保持一致。

- [shallowEqual](https://www.npmjs.com/package/shallowequal)

### deepEqual

深度比较。不仅能对一般数据进行比较还能比较数组和 json 等数据，可以进行更深层次的数据比较。

```typescript
const objA = { a: 1, b: { c: 1 } };
const objB = { a: 1, b: { c: 1 } };

deepEqual(objA === objB); // true
deepEqual([1, 2], [1, 2]); // true
deepEqual([[1, 2], [2]], [[1, 2], [2]]); // true
```

深度比较常用的库：

- [react-fast-compare](https://www.npmjs.com/package/react-fast-compare)

  ```typescript
  const isEqual = require('react-fast-compare');

  console.log(isEqual({ foo: 'bar' }, { foo: 'bar' })); //true
  ```

## 不同比较方式之间区别

以上四种方式都是判断相等，但是`===`和`Object.is`只能判断基本数据类型之间的相等，不能判断引用类型之间的相等。`shallowEqual`可以判断引用类型之间的相等，但是并不能准确判断嵌套类型的数据。而`deepEqual`不仅能进行基本数据类型之间的比较，还能进行更深层次的比较。

### ===和 Object.is()

===和 Object.is()都是用来判断两个值是否相等，并且判断逻辑基本保持一致。主要区别在于以下两点：

- +0 、-0

  `===`将数值`+0`和`-0`视为相等，而 Object.is(
  +0,-0)则会返回 false。

- NaN

  `===`将 NaN 与 NaN 视为不等，而 Object.is(NaN,NaN)则返回 true。

```javascript
+0 === -0; // true
Object.is(+0, -0); // false

NaN === NaN; // false
Object.is(NaN, NaN); //true
```

从上述示例来看，显然`Object.is()`的判断结果更符合我们的预期，这是因为它的实现对`+0`,`-0`,`NaN`的情况做了特殊处理。

```javascript
function(x, y) {
    // SameValue algorithm
    if (x === y) {
     // 处理为+0 != -0的情况
      return x !== 0 || 1 / x === 1 / y;
    } else {
    // 处理 NaN === NaN的情况
      return x !== x && y !== y;
    }
};
```

### ===、Object.is()和 shallowEqual

`===`和`Object.is()`在比较对象类型的数据时，只要不是同一个对象，均会判定为 false,而`shallowEqual`会比较两个对象的`key`及其对应的值，如果都相等，则会判定为 true。

```typescript
const arrA = [1, 2];
const arrB = [1, 2];
const objA = { a: 1, b: 2 };
const objB = { a: 1, b: 2 };

arrA === arrB; // false
Object.is(arrA, arrB); //false
shallowEqual(arrA, arrB); // true

objA === objB; //false
Object.is(objA, objB); // false
shallowEqual(objA, objB); // true
```

### shallowEqual 与 deepEqual

`shallowEqual`与`deepEqual`都可以对基本数据类型进行比较还可以对引用数据类型进行比较，但是`shallowEqual`只能满足一层比较，不能进行嵌套数据的比较，而`deepEqual`支持更深层次的比较。

```typescript
const objA = { a: 1, b: 2 };
const objB = { a: 1, b: 2 };
const objC = { a: 1, b: { c: 3 } };
const objD = { a: 1, b: { c: 3 } };

shallowEqual(objA, objB); // true
deepEqual(objA, objB); // true

shallowEqual(objC, objD); // false
deepEqual(objC, objD); // true
```

通过上述对比可以发现：

- `===`和`Object.is`主要用于基本数据类型的比较，对于性能的影响不大。
- `shallowEqual`和`deepEqual`主要用于复杂数据结构的相等比较，性能损耗较大。

## 主要用途

目前我们在项目中用到相等性比较，一般都与缓存计算以性能优化相关。比如`React.memo`、`React.useMemo`等的实现其实都是依赖相等性比较。下面我们来分析一下项目中常用的几个方法所用的比较方式。

- React.memo

  默认情况下只会对复杂的对象进行`Object.is`形式的相等比较，如果我们想要控制比较过程，可以自定义比较方法通过第二个参数传入。

  ```tsx
  function MyComponent(props) {
    /* 使用 props 渲染 */
  }
  function areEqual(prevProps, nextProps) {
    /*
    如果把 nextProps 传入 render 方法的返回结果与
    将 prevProps 传入 render 方法的返回结果一致则返回 true，
    否则返回 false
    */
  }
  export default React.memo(MyComponent, areEqual);
  ```

- React.useMemo

  默认使用`Object.is`的方式将新传入的值与缓存的`memoized`的值进行相等比较。

- React.useCallback

  同 React.useMemo 一样都是默认`Object.is`形式的相等比较。

- react-redux 中的 useSelector

  默认使用`Object.is()`比较方式，但是支持传入第二个参数进行`shallowEqual`浅比较。

  ```tsx
  import { shallowEqual, useSelector } from 'react-redux';

  // later
  const selectedData = useSelector(selectorReturningObject, shallowEqual);
  ```

- lodash/memorize

  使用`Object.is()`进行相等比较，且缓存一直存在。

通过上述描述，我们可以看出目前常用方法中用到的比较方式基本都是`Object.is`,其中`React.memo`支持自定义比较逻辑，而`useSelector`可以传入第二个参数进行浅比较。

由于浅比较和深度比较非常耗费性能，所以在日常开发中我们应尽量避免使用这两种比较方式。为了更好地避免浅比较和深度比较，我们可以在日常开发中使用[`不可变数据`](https://sinoui.github.io/sinoui-guide/docs/immutable-getting-started)的小技巧处理数据，这里我们主要依赖[`immer`](https://immerjs.github.io/immer/docs/introduction)来做数据不可变。

```tsx
import React,{useState} from 'react';

function TodoList({items,onItemTitleChange}){
  return items.map(item=><Item key={item.id}>{item.title}</Item>)
}

const MemoTodoList = React.memo(TodoList);

const defaultState = [{id:1,title:'篮球'}]；
function TodoPage(){
  const [items,setItems]= useState(defaultState);

  const changeItemTitle=(title,index)=>{
    const newState=[
      ...items.slice(0,index),
      {...items[index],title},
      ...items.slice(index+1);
    ]

    setState(newItems);
  }

  return (
    <MemoTodoList items={items} onItemTitleChange={changeItemTitle} />
  )
}
```

运行时我们会发现，对于 TodoList 的缓存实际上是没有用的，因为我们在改变 title 的时候相当于新建了一个复制了之前的数组并改写，破坏了 memo 的缓存规则。

为了保证缓存有效，我们可以使用`immer`改写上述代码：

```tsx
import React,{useState} from 'react';
import produce from 'immer';

function TodoList({items,onItemTitleChange}){
  return items.map(item=><Item key={item.id}>{item.title}</Item>)
}

const MemoTodoList = React.memo(TodoList);

const defaultState = [{id:1,title:'篮球'}]；
function TodoPage(){
  const [items,setItems]= useState(defaultState);

  const changeItemTitle=(title,index)=>{
    setState(items,(draft)=>{
      draft[index].title = title;
    })
  }

  return (
    <MemoTodoList items={items} onItemTitleChange={changeItemTitle} />
  )
}
```

## 总结

通过对上述相等比较的了解，希望我们在以后的日常开发中能够准确使用不同的比较方式。需要注意的是，为了性能考量，应尽量避免使用浅比较和深层比较的方式进行数据相等比较。尽可能的使用`immer`进行数据处理，以满足 Object.is()和`===`比较的条件。
