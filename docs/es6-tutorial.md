---
id: es6-tutorial
title: ES6简明教程
sidebar_label: ES6简明教程
---

## let vs const

`const`声明一个只读的常量。一旦声明，常量的值就不能改变。

`let`命令，用来声明变量。它的用法类似于`var`，但是所声明的变量，只在`let`命令所在的代码块内有效。

```ts
let userName = 'jacking';

console.log(userName); // 输出jacking

userName = 'ocean';

console.log(userName); // 输出ocean

const width = 100;

console.log(width); // 输出100

width = 120; // 报错，不能执行

{
  let a = 10;
  const b = 1;
}

console.log(a); // 报错： a is not defined.
console.log(b); // 1
```

## 字符串

### 创建

创建一个字符串，将一组字符串用引号包起来，将其赋值给一个字符串变量

```js
const string = 'Hello, JavaScript!';

const name = 'JavaScript';
const string = `Hello,${name}!`;
```

### 模板字符串

```ts
const firstName = 'Jacking';
const secondName = 'Liu';

const userName = `My name is: ${firstName} ${secondName}`; //My name is: Jacking Liu
```

### 字符串操作

#### 字符串查找方法

- charAt()函数
  返回指定位置的字符

  ```ts
  const str = 'Hello world!';
  console.log(str.charAt(1)); // 'e',如果参数取值不在0到str.length-1之间，则会返回空字符串
  ```

- charCodeAt()函数
  返回在指定的位置的字符的 Unicode 编码。

* fromCharCode()函数
  接受指定的 Unicode 值，然后返回一个字符串;

  ```ts
  console.log(String.fromCharCode(72, 69, 76, 76, 79)); // HELLO
  ```

#### 位置方法

- indexOf() 函数
  检索指定字符在字符串中首次出现的位置
- lastIndexOf() 函数
  检索指定字符在字符串中最后出现的位置
  indexOf() 和 lastIndexOf()函数存在共性，功能都是查找指定字符在字符串中的下标，参数要求相同，指定字符在字符串中时返回首次出现的下标，否则返回-1。
  除此之外还有：
- includes()：返回布尔值，表示是否找到了参数字符串。
- startsWith()：返回布尔值，表示参数字符串是否在原字符串的头部。
- endsWith()：返回布尔值，表示参数字符串是否在原字符串的尾部。

#### 匹配方法

- match()函数
  找到一个或多个正则表达式的匹配

  ```ts
  const str = '1 plus 2 equal 3';
  console.log(str.match(/\d+/g)); // 1,2,3
  ```

- search()函数
  检索字符串中指定的值或检索与正则表达式相匹配的字符串，返回第一个与正则表达式匹配的子字符串起始位置。

- replace() 函数
  用来查找某字符串并将其替换为另一个字符串

- split() 函数
  根据指定分隔符将字符串分割成多个子字符串，并返回数组

#### 拼接方法

​ concat()函数

​ 用于连接两个或多个字符串或两个和多个数组

#### 截取方法

- slice()函数
  根据下标截取字符串，返回新的字符串
- substring() 函数
  提取两个下标之间的字符
- substr()
  提取从开始下标的指定数目的字符

#### 空格处理

- 清除字符串前置和后缀空格方法 trim()
- 清除字符左边空格方法 trimLeft()
- 清除字符右边空格方法 trimRight()

#### 比较方法

localeCompare() 用本地特定顺序比较两个字符串

转换方法

- toUpperCase() 和 toLocaleUpperCase() 函数
  把小写字符转化为大写
- toLowerCase() 和 toLocaleLowerCase()函数
  把大写字符转换为小写字符

#### 扩展方法

- repeat(num)
  返回指定重复次数的由元素组成的字符串对象。
  ES2017 引入了字符串补全长度的功能。如果某个字符串不够指定长度，会在头部或尾部补全。padStart()用于头部补全，padEnd()用于尾部补全。
  padStart 和 padEnd 一共接受两个参数，第一个参数用来指定字符串的最小长度，第二个参数是用来补全的字符串。
  如果原字符串的长度，等于或大于指定的最小长度，则返回原字符串。

  ```ts
  'x'.padStart(4, 'ab'); // 'abax'

  'x'.padEnd(5, 'ab'); // 'xabab'
  'xxx'.padStart(2, 'ab'); // 'xxx'
  'xxx'.padEnd(2, 'ab'); // 'xxx'
  ```

  如果用来补全的字符串与原字符串，两者的长度之和超过了指定的最小长度，则会截去超出位数的补全字符串。

  ```ts
  'abc'.padStart(10, '0123456789');
  // '0123456abc'
  ```

  如果省略第二个参数，默认使用空格补全长度。

  ```ts
  'x'.padStart(4); // '   x'
  'x'.padEnd(4); // 'x   '
  ```

## 数组

> 数组对象用于在单个变量中存储多个值。

### 数组创建

- 常规方法

  ```ts
  const myCarr = new Array();
  myCarr[0] = 'cat';
  myCarr[1] = 'dog';
  myCarr[3] = 'turkey';
  ```

- 简洁方式

  ```ts
  const myPets = new Array('cat', 'dog', 'turkey');
  const myPets = new Array(20); //创建一个长度为20的数组
  ```

- 隐式创建

  ```ts
  const myPets = ['cat', 'dog', 'turkey'];
  ```

### 数组访问

通过指定数组名以及索引号码，可以访问某个特定的元素。

```ts
const pet = myPets[0]; //获取数组的第一个元素值
myPets[1] = 'monkey'; //给数组的第二个元素重新赋值
```

### 数组解构

```ts
const numbers = [1, 2, 3];
const [first, ...rest] = numbers; // first = 1; rest=[2,3];
const [, second] = numbers; // second = 2;
```

### 数组展开操作符

```typescript
const items = [1, 3, 5];
const item1 = 2;
const item2 = 4;
const newItems = [...items, item1, items2]; // [1,3,5,2,4]数组操作方法
```

### 数组操作方法

#### 数组合并/向数组中添加元素

- `concat()` 连接两个或更多数组，并返回结果。

  ```ts
  const array = [1, 2, 3];
  const arr1 = ['a', 'b', 'c'];
  array.concat(arr1); // [1, 2, 3,"a","b", "c"]
  ```

- `push()` 向数组末尾添加一个或更多元素，并返回新的长度

  ```ts
  const array = [1, 2, 3];
  array.push(7, 8); // 5
  console.log(array); // [1,2,3,7,8]
  ```

- `unshift()` 向数组的开头添加一个或更多元素，并返回新的长度

  ```ts
  const array = [1, 2, 3];
  array.unshift('a', 'b'); // 5
  ```

- `splice()` 从数组中添加或删除元素

  ```js
  const fruits = ['Banana', 'Orange', 'Apple', 'Mango'];
  fruits.splice(2, 0, 'Lemon', 'Kiwi'); // 2规定从何处添加/删除，0规定应该删除多少元素，如果不设置，则删除从index开始到原数组结尾的所有元素
  console.log(fruits); //["Banana", "Orange","Lemon","Kiwi","Apple", "Mango"]
  ```

#### 数组元素的删除

- `pop()` 删除数组的最后一个元素并返回删除的元素

  ```ts
  const array = [1, 2, 3];
  array.pop(); // 3
  ```

- `shift()` 删除数组的第一个元素并返回该元素的值,数组中元素自动前移

  ```ts
  const fruits = ['Banana', 'Orange', 'Apple', 'Mango'];
  fruits.shift(); // Banana
  console.log(fruits); // ["Orange", "Apple","Mango"]
  ```

- `slice(start, end)` 截取数组的一部分并返回一个新的数组(包含从 start 到 end(不包括该元素))

  ```ts
  const fruits = ['Banana', 'Orange', 'Apple', 'Mango'];
  fruits.slice(1, 3); // ["Orange", "Apple"]
  ```

#### 查找

- `find()` 返回符合传入测试（函数）条件的数组元素

  该方法为数组中的每个元素都调用一次函数执行：

  - 当数组中的元素满足测试条件时返回`true`，find()返回符合条件的元素，之后的值不会再调用执行函数
  - 如果没有符合条件的元素，则返回`undefined`
  - 对于空数组，函数不会执行
  - 该方法不会改变数组的原始值

  ```ts
  const ages = [32, 33, 16, 40];

  function checkAdult(age) {
    return age >= 18;
  }

  ages.find(checkAdult); // 32
  ```

- `findIndex()` 方法返回传入一个测试条件（函数）符合条件的数组第一个元素位置

  该方法为数组中的每个元素都调用一次函数执行：

  - 当数组中的元素在测试条件返回`true`时，该方法返回符合条件的元素的索引位置，之后的值不会再调用执行函数。
  - 如果没有符合条件的元素则返回-1
  - 对于空数组，函数不会执行
  - 该方法不会改变数组的原始值

  ```ts
  const ages = [32, 33, 16, 40];

  function checkAdult(age) {
    return age <= 18;
  }

  ages.findIndex(checkAdult); // 2
  ```

- `indexOf()` 方法可返回某个指定的字符串值在字符串中首次出现的位置。

  `array.indexOf(item,start)`:

  - `item` 必须。查找的元素
  - `start` 可选的整数参数。规定在字符串中开始检索的位置。它的合法取值是 0 到`stringObject.length - 1`。如省略该参数，则将从字符串的首字符开始检索。

- `includes()`方法返回一个布尔值，表示某个数组是否包含给定的值，与字符串的`includes`方法类似

#### 遍历

- `map()` 通过指定函数处理数组的每个元素，并返回处理之后的数组

  ```ts
  const nums = [1, 2, 3, 4];

  const newNums = nums.map((num) => num * 2); // [2,4,6,8]
  ```

- `forEach()` 方法用于调用数组的每个元素，并将元素传递给回调函数

  ```ts
  const nums = [1, 2, 3, 4];

  let result = 0;
  nums.forEach((num) => (result += num)); // 10
  ```

- `filter()` 创建一个新数组，新数组中的元素是通过检查指定数组中符合条件的所有元素。不会对空数组进行检测，不会改变原始数组。

  ```ts
  const ages = [32, 33, 16, 40];

  function checkAdult(age) {
    return age >= 18;
  }

  ages.filter(checkAdult); // [32,33,40]
  ```

- `reduce()` 方法接收一个函数作为累加器，数组中的每个值（从左到右）开始缩减，最终计算为一个值。

  ```ts
  const nums = [1, 2, 3, 4];

  const sum = nums.reduce((acc, num) => acc + num, 0); //10
  ```

- `reduceRight()` 方法的功能和 [reduce()](http://www.runoob.com/jsref/jsref-reduce.html) 功能是一样的，不同的是`reduceRight()` 从数组的末尾向前将数组中的数组项做累加。

#### 其它方法

- `every()` 用于检测数组所有元素是否都符合指定条件

  ```ts
  const ages = [32, 33, 16, 40];

  function checkAdult(age) {
    return age >= 18;
  }

  ages.every(checkAdult); //false
  ```

  - 如果数组中检测到有一个元素不满足，则整个表达式返回`false`，且剩余的元素不会再进行检测。
  - 如果所有元素都满足条件，则返回`true`
  - every()不会对空数组进行检测，并且不会改变原始数组

- `fill()` 用于将一个固定值替换数组的元素

  语法：`array.fill(value, start, end)`

  - `value` 必需。填充的值
  - `start` 可选。开始填充的位置
  - `end` 可选。停止填充的位置（默认为 array.length）

  ```ts
  const fruits = ['Banana', 'Orange', 'Apple', 'Mango'];
  fruits.fill('Runoob', 2, 4); // ["Banana", "Orange", "Runoob", "Runoob"]
  ```

- `slice()`获取子数组

  ```ts
  const numbers = [1, 2, 3, 4, 5];

  const newItems = numbers.slice(0, 3); // [1,2,3]
  ```

- `join()` 把数组的所有元素放入一个字符串

  ```ts
  const numbers = ['1', '2', '3'];

  numbers.join(','); // "1,2,3“
  ```

- `reverse()` 反转数组的元素顺序

- `some()` 检测数组中是否有元素符合指定条件

- `sort()` 对数组元素进行排序

- `toString()` 把数组转换为字符串，并返回结果

- `valueOf()` 返回数组对象的原始值

#### 扩展方法

- Array.of 方法用于将一组值，转换为数组

```ts
Array.of(3, 11, 8); // [3,11,8]
Array.of(3); // [3]
Array.of(3).length; // 1
```

> 这个方法的主要目的，是弥补数组构造函数 Array()的不足。因为参数个数的不同，会导致 Array()的行为有差异。

```ts
Array(); // []
Array(3); // [, , ,]
Array(3, 11, 8); // [3, 11, 8]
```

- 数组实例的 copyWithin()

  > 数组实例的 copyWithin 方法，在当前数组内部，将指定位置的成员复制到其他位置（会覆盖原有成员），然后返回当前数组。也就是说，使用这个方法，会修改当前数组。

Array.prototype.copyWithin(target, start = 0, end = this.length)
它接受三个参数。

target（必需）：从该位置开始替换数据。如果为负值，表示倒数。
start（可选）：从该位置开始读取数据，默认为 0。如果为负值，表示倒数。
end（可选）：到该位置前停止读取数据，默认等于数组长度。如果为负值，表示倒数。
这三个参数都应该是数值，如果不是，会自动转为数值。

```ts
[1, 2, 3, 4, 5].copyWithin(0, 3);
// [4, 5, 3, 4, 5]
```

## 对象

### 对象创建

```ts
const from = new Point(0, 1);
const to = new Point(1, 1);

// 定义对象line
const line = {
  from,
  to,
  length() {
    return this.from.distinct(this.to);
  },
};

// 调用line对象中的length方法
line.length(); // 1;
```

### 对象合并

```typescript
const defaultConfig = {
  width: 100,
  height: 100,
};

const config = { ...defaultConfig, height: 150 }; // {width: 100, height: 150}
const newConfig = { ...config, count: 2 }; // {width: 100, height: 150, count: 2}
```

### 对象解构

```typescript
const config = {
  width: 100,
  height: 100,
  length: 100,
};

const config2 = {
  width: 100,
  height: 100,
  length: 100,
  area: 100,
};

const { width, height, length } = config; // width = 100; height = 100; length = 100;
const size = width * height * length; // 1000000
const { width: newWidth } = config; // newWidth = 100;
console.log(newWidth); // 100;
```

解构变量的默认值：

```typescript
// 指定参数的默认值
const { area = 200 } = config; // area = 200;
```

相当于：

```typescript
area = config.area || 200;
```

嵌套用法：

```typescript
const config = {
  width: 100,
  height: 100,
  config2: {
    size: 300,
  },
};

const {
  config2: { size },
} = config;

console.log(size); // 300
```

### 对象的可计算属性名

- {[name]:value} 对象字面量里的属性名和方法名可以用属性名表达式的方式指定

```javascript
const suffix = ' name';
const person = {
  ['first' + suffix]: 'Nicholas',
  ['last' + suffix]: 'Zakas',
};

person['first name']; // "Nicholas"
person['last name']; // "Zakas"
```

### 对象操作

#### 遍历

- `Object.keys()`返回一个表示给定对象的所有可枚举属性的字符串数组。

  ```typescript
  const data = { a: 1, b: 2, c: 9, d: 4, e: 5 };

  Object.keys(data); // ["a","b","c","d","e"]
  ```

- `Object.values()`返回一个包含对象自身的所有可枚举属性值的数组。

  ```typescript
  const data = { a: 1, b: 2, c: 9, d: 4, e: 5 };

  Object.values(data); // [1,2,3,4,5]
  ```

- `Object.entries()`返回给定对象自身可枚举属性的键值对数组。

  ```typescript
  const obj = { foo: 'bar', baz: 42 };
  Object.entries(obj); // [ ["foo", "bar"], ["baz", 42] ]
  ```

#### 删除对象属性

```typescript
const obj = {
  userId: '001',
  userName: '张三',
};

delete obj.userName; // obj.userName=undefind
```

## 函数

### 箭头函数

```typescript
const sum = (a, b) => {
  return a + b;
};
```

等价于：

```typescript
const sum = (a, b) => a + b;
```

备注：省略`=>`后面的`{`和`}`，只适合方法体只有一条语句，且此语句的返回值作为整个函数的返回值。

相当于：

```typescript
function sum(a, b) {
  return a + b;
}
```

如果箭头函数只有一个参数，可以省略参数声明部分的`(`和`)`。

```typescript
const nums = [1, 2, 3, 4];

const newNums = nums.map((num) => num * 2); // [2, 4, 6, 8];
```

### `{}`语义发生冲突

```ts
const zip = (a, b) => {
  a, b;
}; // 报错
```

正确的方式一：

```typescript
const zip = (a, b) => {
  return { a, b };
};
```

正确的方式二：

```typescript
const zip = (a, b) => ({
  a,
  b,
});
```

### 参数

rest 参数（剩余参数）：

```typescript
function sum(...nums) {
  return nums.reduce((acc, item) => acc + item, 0);
}

sum(); //0
sum(1); //1
sum(1, 2); //3
sum(1, 2, 3); //6
sum(1, 2, 3, 4); //10
```

```typescript
function sum(a, b, ...nums) {
  return a + b + nums.reduce((acc, item) => acc + item, 0);
}

sum(); //提示错误
sum(1); //提示错误
sum(1, 2); //3
sum(1, 2, 3); //6
sum(1, 2, 3, 4); // 10
```

参数默认值：

```typescript
function area(width = 0, height = 0) {
  return width * height;
}

area(); //0
area(2, 5); //10
```

可选参数：

```typescript
function getItemById(id, items) {
  return items ? items.find((item) => item.id === id) : null;
}

getItemById('1'); // null;
getItemById('1', [{ id: '1', text: '阅读' }]); // {id: '1', text: '阅读'}
```

## 类

### 定义

基本上，`ES6` 的`class`可以看作只是一个语法糖，它的绝大部分功能，`ES5` 都可以做到，新的`class`写法只是让对象原型的写法更加清晰、更像面向对象编程的语法而已。

```typescript
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  toString() {
    return '(' + this.x + ', ' + this.y + ')';
  }
}
```

上面代码定义了一个“类”，可以看到里面有一个`constructor`方法，这就是构造方法，而`this`关键字则代表实例对象。

`Point`类除了构造方法，还定义了一个`toString`方法。注意，定义“类”的方法的时候，前面不需要加上`function`这个关键字，直接把函数定义放进去就可以了。另外，方法之间不需要逗号分隔，加了会报错。

### 构造方法（constructor）

`constructor`方法是类的默认方法，通过`new`命令生成对象实例时，自动调用该方法。一个类必须有`constructor`方法，如果没有显式定义，一个空的`constructor`方法会被默认添加。

```ts
class Point {}

// 等同于
class Point {
  constructor() {}
}
```

上面代码中，定义了一个空的类`Point`，JavaScript 引擎会自动为它添加一个空的`constructor`方法。

`constructor`方法默认返回实例对象（即`this`），完全可以指定返回另外一个对象。

```typescript
class Foo {
  constructor() {
    return Object.create(null);
  }
}

new Foo() instanceof Foo;
// false
```

### 方法

```typescript
class Point {
  constructor() {}

  methodA() {}
  methodB() {}
}
```

### 属性

```typescript
userName: string = '张三';
methodC = () => {}; // 属性方法
```

### 创建

```typescript
const classA = new Point();
// 通过new关键字，创建一个类实例对象，会调用类的构造方法
```

### 继承

Class 可以通过`extends`关键字实现继承。

```typescript
class Point {}

class ColorPoint extends Point {}
```

上面代码定义了一个`ColorPoint`类，该类通过`extends`关键字，继承了`Point`类的所有属性和方法。但是由于没有部署任何代码，所以这两个类完全一样，等于复制了一个`Point`类。下面，我们在`ColorPoint`内部加上代码。

```typescript
class ColorPoint extends Point {
  constructor(x, y, color) {
    super(x, y); // 调用父类的constructor(x, y)
    this.color = color;
  }

  toString() {
    return this.color + ' ' + super.toString(); // 调用父类的toString()
  }
}
```

上面代码中，`constructor`方法和`toString`方法之中，都出现了`super`关键字，它在这里表示父类的构造函数，用来新建父类的`this`对象。

子类必须在`constructor`方法中调用`super`方法，否则新建实例时会报错。这是因为子类自己的`this`对象，必须先通过父类的构造函数完成塑造，得到与父类同样的实例属性和方法，然后再对其进行加工，加上子类自己的实例属性和方法。如果不调用`super`方法，子类就得不到`this`对象。

```typescript
class Point {
  /* ... */
}

class ColorPoint extends Point {
  constructor() {}
}

let cp = new ColorPoint(); // ReferenceError
```

上面代码中，`ColorPoint`继承了父类`Point`，但是它的构造函数没有调用`super`方法，导致新建实例时报错。

**注意：**在子类的构造函数中，只有调用`super`之后，才可以使用`this`关键字，否则会报错。这是因为子类实例的构建，基于父类实例，只有`super`方法才能调用父类实例。

父类的静态方法，也会被子类继承。

```typescript
class A {
  static hello() {
    console.log('hello world');
  }
}

class B extends A {}

B.hello(); // hello world
```

上面代码中，`hello()`是`A`类的静态方法，`B`继承`A`，也继承了`A`的静态方法。

## 模块

一个 js 文件（ts 文件）就是一个模块。可以从模块中导出多个元素。

> .js -> es6
>
> .jsx -> es6 + jsx
>
> .ts -> typescript
>
> .tsx -> typescript + jsx

导出：

```typescript
// lib/math.ts

export function sum(x: number, y: number): number {
  return x + y;
}

export function pow(x: number, y: number): number {
  return x * y;
}

export const pi = 3.141593;
```

导入：

```typescript
// app.ts
import * as math from './lib/math';

console.log('2π = ' + math.sum(math.pi, math.pi));
```

导入：

```typescript
// another-app.ts
import { sum, pi } from './lib/math';

console.log('2π = ' + sum(pi, pi));
```

异步导入：

```typescript
// app3.ts
function log() {
  return import('./lib/math').then((math) => {
    console.log('2π = ' + math.sum(math.pi, math.pi));
  });
}

<button onClick={log} />;
```

异步导入：

```typescript
// app4.ts
import('./lib/math').then(({ sum, pi }) => {
  console.log('2π = ' + sum(pi, pi));
});
```

## Promise

promise 是用于异步编程的 api。

```typescript
function timeout(duration: number = 0) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
}

const onPromiseSuccess = () => {
  return timeout(2000);
};
const p = timeout(1000)
  .then(onPromiseSuccess)
  .then(() => {
    throw new Error('hmm');
  })
  .catch((err) => {
    return Promise.all([timeout(100), timeout(200)]);
  });
```

## async/await

对 promise 的封装。

```typescript
import http from '@sinoui/http';

async function loadTodos() {
  const userId = await http.get('/oa/current-user-id');
  const todos = await http.get(`/oa/todos?userId=${userId}`);

  return todos;
}

loadTodos().then((todos) => {
  console.log(todos);
});
```

相当于：

```typescript
import http from '@sinoui/http';

function loadTodos() {
  return http
    .get('/oa/current-user-id')
    .then((userId) => http.get(`/oa/todos?userId=${userId}`));
}

loadTodos().then((todos) => {
  console.log(todos);
});
```

#### 按照顺序执行异步操作

```typescript
import http from '@sinoui/http';

const urls = ['/oa/todos', '/oa/status', '/oa/todos/1', '/oa/todos/2'];

async function loadUrls(urls: string[]) {
  for (const url of urls) {
    const result = await http.get(url);
    console.log(result);
  }
}

loadUrls(urls);
```

#### 并行执行异步操作

```typescript
import http from '@sinoui/http';

const urls = ['/oa/todos', '/oa/status', '/oa/todos/1', '/oa/todos/2'];

async function loadUrls(urls: string[]) {
  await Promise.all(urls.map((url) => http.get(url)));
  console.log('执行完');
}

loadUrls(urls);
```
