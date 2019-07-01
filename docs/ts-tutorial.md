---
id: ts-tutorial
title: TypeScript简明教程
sidebar_label: TypeScript简明教程
---

## 什么是 TypeScript

TODO: 敬请期待

## 基础类型

### 布尔值

```ts
const isDone: boolean = false;
```

### 数字

和 JavaScript 一样，`TypeScript`里的所有数字都是浮点数。 这些浮点数的类型是 `number`。 除了支持十进制和十六进制字面量，`TypeScript`还支持`ECMAScript 2015`中引入的二进制和八进制字面量。

```ts
const decLiteral: number = 6;
const hexLiteral: number = 0xf00d;
const binaryLiteral: number = 0b1010;
const octalLiteral: number = 0o744;
```

### 字符串

可以使用双引号`"`或单引号`'`表示字符串。

```ts
let name: string = 'bob';
name = 'smith';
```

还可以使用*模版字符串*，它可以定义多行文本和内嵌表达式。 这种字符串是被反引号(`)包围,并且使用(\${expr})这种形式嵌入表达式。

```ts
const name: string = 'Gene';
const age: number = 37;
const sentence: string = `Hello, my name is ${name}. I'll be ${age +
  1} years old next month.`;
```

### 数组

`TypeScript`像 JavaScript 一样可以操作数组元素。 有两种方式可以定义数组。 第一种，可以在元素类型后面接上`[]`，表示由此类型元素组成的一个数组：

```ts
let list: number[] = [1, 2, 3];
```

第二种方式是使用数组泛型，`Array<元素类型>`：

```ts
let list: Array<number> = [1, 2, 3];
```

### 元组(Tuple)

元组类型允许表示一个已知元素数量和类型的数组，各元素的类型不必相同。 比如，你可以定义一对值分别为`string`和`number`类型的元组。

```ts
// 定义元祖类型
let x: [string, number];
// 初始化
x = ['hello', 10]; // OK
x = [10, 'hello']; // 错误，类型不匹配
```

当访问一个已知索引的元素，会得到正确的类型：

```ts
console.log(x[0].substr(1)); // ello
console.log(x[1].substr(1)); // 错误, 'number'类型没有'substr'方法
```

### 枚举

`enum`类型是对 JavaScript 标准数据类型的一个补充。使用枚举我们可以定义一些带名字的常量。 使用枚举可以清晰地表达意图或创建一组有区别的用例。

```ts
enum Color {
  Red,
  Green,
  Blue,
}
const c: Color = Color.Green;
```

默认情况下，从`0`开始为元素编号。 你也可以手动的指定成员的数值。

```ts
enum Color {
  Red = 1,
  Green,
  Blue,
}
const c: Color = Color.Green;
```

或者，全部都采用手动赋值：

```ts
enum Color {
  Red = 1,
  Green = 2,
  Blue = 4,
}
const c: Color = Color.Green;
```

枚举类型提供的一个便利是你可以由枚举的值得到它的名字。 例如，我们知道数值为 2，但是不确定它映射到 Color 里的哪个名字，我们可以查找相应的名字：

```ts
enum Color {
  Red = 1,
  Green,
  Blue,
}
let colorName: string = Color[2];

console.log(colorName); // 显示'Green'因为上面代码里它的值是2
```

### 对象

`object`表示非原始类型，也就是除`number`，`string`，`boolean`，`symbol`，`null`或`undefined`之外的类型。

使用`object`类型，就可以更好的表示像`Object.create`这样的 API。例如：

```ts
declare function create(o: object | null): void;

create({ prop: 0 }); // OK
create(null); // OK

create(42); // Error
create('string'); // Error
create(false); // Error
create(undefined); // Error
```

### null 和 undefined

和`void`相似，它们的本身的类型用处不是很大。

```ts
let u: undefined = undefined;
let n: null = null;
```

默认情况下`null`和`undefined`是所有类型的子类型。 就是说你可以把 `null`和`undefined`赋值给`number`类型的变量。

### any

有时候，我们会想要为那些在编程阶段还不清楚类型的变量指定一个类型。 这些值可能来自于动态的内容，比如来自用户输入或第三方代码库。 这种情况下，我们不希望类型检查器对这些值进行检查而是直接让它们通过编译阶段的检查。 那么我们可以使用 `any`类型来标记这些变量：

```ts
let notSure: any = 4;
notSure = 'maybe a string instead';
notSure = false;
```

在对现有代码进行改写的时候，`any`类型是十分有用的，它允许你在编译时可选择地包含或移除类型检查。

```ts
let notSure: any = 4;
notSure.ifItExists(); // ifItExists在代码运行过程中可能存在
```

当你只知道一部分数据的类型时，`any`类型也是有用的。 比如，你有一个数组，它包含了不同的类型的数据：

```ts
const list: any[] = [1, true, 'free'];
```

### void

某种程度上来说，`void`类型像是与`any`类型相反，它表示没有任何类型。当一个函数没有返回值时，我们通常会把返回值的类型设为`void`:

```ts
function fn(): void {
  console.log('这是一个函数类型声明');
}
```

### never

`never`类型表示的是那些永不存在的值的类型。 例如， `never`类型是那些总是会抛出异常或根本就不会有返回值的函数表达式或箭头函数表达式的返回值类型； 变量被永不为真的类型保护所约束时,也可能是 `never`类型。

`never`类型是任何类型的子类型，也可以赋值给任何类型；然而，*没有*类型是`never`的子类型或可以赋值给`never`类型（除了`never`本身之外）。 即使 `any`也不可以赋值给`never`。

```ts
// 返回never的函数必须存在无法达到的终点
function error(message: string): never {
  throw new Error(message);
}

// 推断的返回值类型为never
function fail() {
  return error('Something failed');
}

// 返回never的函数必须存在无法达到的终点
function infiniteLoop(): never {
  while (true) {}
}
```

### 类型断言

类型断言有两种形式。其一是“尖括号”语法：

```ts
const someValue: any = 'this is a string';

const strLength: number = (<string>someValue).length;
```

另一个为`as`语法：

```ts
const someValue: any = 'this is a string';

const strLength: number = (someValue as string).length;
```

两种形式是等价的。至于使用哪个大多数情况下是凭个人喜好；然而，当在`TypeScript`里使用到`JSX`时，只有`as`形式的断言是被允许的。

### ts 非空断言关键字`!`

`!`和`?`是相对的，表示强制解析（也就是告诉 typescript 编译器，这里一定有值）。

```ts
const a!: number = 6;
```

## 接口

接口可以为对象定义结构信息。

```tsx
interface Props {
  userName: string;
}

function Hello(props: Props) {
  return <div>Hello, {props.userName}</div>;
}
```

### 可选属性

默认情况下，接口中的属性是必须的，不指定则会提示错误。如果属性不是必需的，则可以用`?`声明属性为可选属性：

```typescript
interface SquareConfig {
  color?: string;
  width?: number;
}

function createSquare(config: SquareConfig): { color: string; area: number } {
  let newSquare = { color: 'white', area: 100 };
  if (config.color) {
    newSquare.color = config.color;
  }
  if (config.width) {
    newSquare.area = config.width * config.width;
  }
  return newSquare;
}

let mySquare = createSquare({ color: 'black' });
```

### 只读属性

一些对象属性只能在对象刚刚创建的时候修改其值。 你可以在属性名前用 `readonly`来指定只读属性:

```typescript
interface Point {
  readonly x: number;
  readonly y: number;
}
```

你可以通过赋值一个对象字面量来构造一个`Point`。 赋值后， `x`和`y`再也不能被改变了。

```typescript
let p1: Point = { x: 10, y: 20 };
p1.x = 5; // error!
```

## 函数

我们可以为函数的参数和返回值指定类型，如下面的方法：

JavaScript 版本：

```js
function add(x, y) {
  return x + y;
}
```

添加上 TypeScript 类型后：

```ts
function add(x: number, y: number): number {
  return x + y;
}
```

给函数参数和返回值添加上类型后，我们在使用`add`方法后，不会指定了错误类型的参数：

```ts
const result = add(1, 2); // OK
const result2 = add(1, '2'); // error, '2'不是number类型的数据
```

### 函数类型

函数是 JavaScript 的一等公民——它可以作为值传递。既然函数可以作为值传递，那么就可以在 ts 中给变量指定函数类型。如下所示：

```typescript
let add: (x: number, y: number) => number; // 声明add变量为(x: number, y: number) => number这样的函数

add = (x: number, y: number) => number {
  return x + y;
};

const result: number = add(1, 2);
console.log(result); // 3
```

我们也可以在接口中定义函数类型的属性：

```typescript
interface Point {
  readonly x: number;
  readonly y: number;
  distinct(anotherPoint: Point): number;
}

const point: Point = {
  x: 100,
  y: 100,
  distinct(anotherPoint: Point) {
    return Math.sqrt(
      Math.abs(Math.pow(anotherPoint.x - this.x, 2)) +
        Math.abs(Math.pow(anotherPoint.y - this.y, 2)),
    );
  },
};

console.log(point.distinct(point)); // 0
```

我们在`Point`接口中定义了一个`distinct`属性，它的类型是一个接收`Point`类型参数并返回`number`类型值的函数。当然我们也可以这样定义函数类型的接口属性：

```typescript
interface Point {
  readonly x: number;
  readonly y: number;

  distinct: (anotherPoint: Point) => number;
}
```

### 可选与默认值参数

在 TypeScript 中函数中每个参数都是必须指定的，这些参数不能指定为`null`或者`undefined`。如下所示：

```typescript
function buildName(firstName: string, lastName: string) {
  return `${firstName} ${lastName}`;
}

const result1 = buildName('Bob'); // error, 传参不足
const result2 = buildName('Bob', 'Adams', 'Sr.'); // error, 传参太多
const result3 = buildName('Bob', 'Adams'); // ok
```

如果`lastName`参数可以为`undefined`，则我们可以使用`?`表示`lastName`是可选的参数：

```typescript
function buildNmae(firstName: string, lastName?: string) {
  if (lastName) {
    return `${firstName} ${lastName}`;
  } else {
    return firstName;
  }
}

let result1 = buildName('Bob'); // OK
let result2 = buildName('Bob', 'Adams', 'Sr.'); // error, 太多参数
let result3 = buildName('Bob', 'Adams'); // OK
```

需要注意的是，可选参数必须在必选参数之后定义。如果我们必须让`firstName`参数是可选的，也就是说它可以是`undefined`，那么你要么将`firstName`参数移到`lastName`参数之后，要么你使用`string | undefined`这样的联合类型：

```typescript
function buildName(lastName: string, firstName?: string) {
  if (firstName) {
    return `${firstName} ${lastName}`;
  } else {
    return lastName;
  }
}
```

或者：

```typescript
function buildName(firstName: string | undefined, lastName: string) {
  if (firstName) {
    return `${firstName} ${lastName}`;
  } else {
    return lastName;
  }
}
```

一个函数可以有多个可选参数，如下所示：

```typescript
function buildName(firstName?: string, lastName?: string) {
  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  } else {
    return firstName || lastName;
  }
}
```

我们可以用`lastName: string = 'Smith'`这样的方式指定一个默认值，这样当`lastName`参数为`undefined`或者没有指定该参数时，`lastName`参数就是默认值`Smith`：

```typescript
function buildName(firstName: string, lastName: string = 'Smith') {
  return `${firstName} ${lastName}`;
}

const result1 = buildName('Bob'); // OK, result1 = Bob Smith
const result2 = buildName('Bob', 'Adams'); // OK, result2 = Bob Adams
```

注意，默认值参数不需要再指定`?`。

### 剩余参数

ES6 支持剩余参数语法，TypeScript 中可以为剩余参数指定类型，如下所示：

```typescript
function sum(x: number, y: number, ...rest: number[]) {
  return x + y + reduce((acc, value) => acc + value, 0);
}

const result1 = sum(1, 2); // OK, result1 = 3
const result2 = sum(1, 2, 3); // OK, result2 = 6
const result3 = sum(1, 2, 3, 4); // OK, result3 = 10
```

### 函数中的`this` （非重点）

对象中的函数属性的`this`是指向对象本身，如`Point`对象中的`distinct`，它内部的`this.x`指向的是对象本身的`x`属性，但是如果我们将这个函数定义为箭头函数的话，你会发现 TypeScript 会发出错误警告，这是因为箭头函数中的`this`指向的不再是对象本身，如下所示：

```typescript
interface Point {
  readonly x: number;
  readonly y: number;
  distinct(anotherPoint: Point): number;
}

const point: Point = {
  x: 100,
  y: 100,
  distinct: (anotherPoint: Point) => {
    return Math.sqrt(
      Math.abs(Math.pow(anotherPoint.x - this.x, 2)) + // error, The containing arrow function captures the global value of 'this'. ts(7041)
        Math.abs(Math.pow(anotherPoint.y - this.y, 2)), // error, The containing arrow function captures the global value of 'this'. ts(7041)
    );
  },
};
```

很多时候，我们需要明确告知某个对象函数的`this`不是指向本身，而是指向`void`或者其它对象。如我们在用一些库时需要指定选项对象。如下面的一个错误示例：

**错误示例**

```typescript
// 选项接口
interface Option {
  delay: number;
  callback: () => void;
}

function delayExec(option: Option) {
  const { callback, delay } = option;
  setTimeout(() => {
    callback();
  }, delay);
}

const option: Option = {
  delay: 1000,
  callback() {
    console.log(this.delay);
  },
};
delayExec(option);
```

**正确示例**

```typescript
// 选项接口
interface Option {
  delay: number;
  callback: () => void;
}

function delayExec(option: Option) {
  const { callback, delay } = option;
  setTimeout(() => {
    callback();
  }, delay);
}

const option: Option = {
  delay: 1000,
  callback: () => {
    console.log(option.delay);
  },
};
delayExec(option);
```

为了避免出现错误示例的情况， 我们可以在接口类型声明中指定`callback`函数的`this`指向的是`void`，如下所示：

```typescript
// 选项接口
interface Option {
  delay: number;
  callback(this: void): void;
}
```

这样，如果我们的 callback 是下面的实现，TypeScript 就会发出错误警告：

```typescript
const option: Option = {
  delay: 1000,
  callback() {
    console.log(this.delay); // error, The containing arrow function captures the global value of 'this'. ts(7041)
  },
};
```

## 类

```ts
class Greeter {
  greeting: string;
  constructor(message: string) {
    this.greeting = message;
  }
  greet() {
    return 'Hello, ' + this.greeting;
  }
}

let greeter = new Greeter('world');
```

上述示例中， 我们声明一个 `Greeter`类。这个类有 3 个成员：一个`greeting`属性，一个构造函数和一个 `greet`方法。

我们在引用任何一个类成员的时候都用了 `this`, 它表示我们访问的是类的成员。

### 继承

在 TypeScript 里，我们可以使用常用的面向对象模式。 基于类的程序设计中一种最基本的模式是允许使用继承来扩展现有的类。

```ts
class Animal {
  move(distanceInMeters: number = 0) {
    console.log(`Animal moved ${distanceInMeters}m.`);
  }
}

class Dog extends Animal {
  bark() {
    console.log('Woof! Woof!');
  }
}

const dog = new Dog();
dog.bark();
dog.move(10);
dog.bark();
```

上述示例展示了最基本的继承：类从基类中继承了属性和方法。这里，`Dog`是一个派生类，它派生自`Animal`基类，通过`extends`关键字。派生类通常被称为子类，基类通常被称作超类。

因为 `Dog`继承了 `Animal`的功能，因此我们可以创建一个 `Dog`的实例，它能够 `bark()`和 `move()`。

### 公有、私有与受保护的修饰符

#### 默认为`public`

在`TypeScript`里，成员都默认为`public`。

也可以明确的将一个成员标记成 `public`。 我们可以用下面的方式来重写上面的 `Animal`类：

```ts
class Animal {
  public name: string;
  public constructor(theName: string) {
    this.name = theName;
  }
  public move(distanceInMeters: number) {
    console.log(`${this.name} moved ${distanceInMeters}m.`);
  }
}
```

#### 理解`private`

当成员被标记成 `private`时，它就不能在声明它的类的外部访问。比如：

```ts
class Animal {
  private name: string;
  constructor(theName: string) {
    this.name = theName;
  }
}

new Animal('Cat').name; // 错误: 'name' 是私有的.
```

`TypeScript`使用的是结构性类型系统。 当我们比较两种不同的类型时，并不在乎它们从何处而来，如果所有成员的类型都是兼容的，我们就认为它们的类型是兼容的。

然而，当我们比较带有 `private`或 `protected`成员的类型的时候，情况就不同了。 如果其中一个类型里包含一个`private`成员，那么只有当另外一个类型中也存在这样一个 `private`成员， 并且它们都是来自同一处声明时，我们才认为这两个类型是兼容的。 对于 `protected`成员也使用这个规则。

```ts
class Animal {
  private name: string;
  constructor(theName: string) {
    this.name = theName;
  }
}

class Rhino extends Animal {
  constructor() {
    super('Rhino');
  }
}

class Employee {
  private name: string;
  constructor(theName: string) {
    this.name = theName;
  }
}

let animal = new Animal('Goat');
let rhino = new Rhino();
let employee = new Employee('Bob');

animal = rhino;
animal = employee; // 错误: Animal 与 Employee 不兼容.
```

这个例子中有 `Animal`和 `Rhino`两个类， `Rhino`是 `Animal`类的子类。 还有一个 `Employee`类，其类型看上去与`Animal`是相同的。 我们创建了几个这些类的实例，并相互赋值来看看会发生什么。 因为 `Animal`和 `Rhino`共享了来自 `Animal`里的私有成员定义 `private name: string`，因此它们是兼容的。 然而 `Employee`却不是这样。当把 `Employee`赋值给 `Animal`的时候，得到一个错误，说它们的类型不兼容。 尽管 `Employee`里也有一个私有成员 `name`，但它明显不是 `Animal`里面定义的那个。

#### 理解 `protected`

`protected`修饰符与 `private`修饰符的行为很相似，但有一点不同， `protected`成员在派生类中仍然可以访问。

```ts
class Person {
  protected name: string;
  constructor(name: string) {
    this.name = name;
  }
}

class Employee extends Person {
  private department: string;

  constructor(name: string, department: string) {
    super(name);
    this.department = department;
  }

  public getElevatorPitch() {
    return `Hello, my name is ${this.name} and I work in ${this.department}.`;
  }
}

let howard = new Employee('Howard', 'Sales');
console.log(howard.getElevatorPitch());
console.log(howard.name); // 错误我们不能在 Person类外使用 name，但是我们仍然可以通过 Employee类的实例方法访问，因为 Employee是由 Person派生而来的。
```

我们不能在 `Person`类外使用 `name`，但是我们仍然可以通过 `Employee`类的实例方法访问，因为`Employee`是由 `Person`派生而来的。

构造函数也可以被标记成 `protected`。 这意味着这个类不能在包含它的类外被实例化，但是能被继承。比如:

```ts
class Person {
  protected name: string;
  protected constructor(theName: string) {
    this.name = theName;
  }
}

// Employee 能够继承 Person
class Employee extends Person {
  private department: string;

  constructor(name: string, department: string) {
    super(name);
    this.department = department;
  }

  public getElevatorPitch() {
    return `Hello, my name is ${this.name} and I work in ${this.department}.`;
  }
}

let howard = new Employee('Howard', 'Sales');
let john = new Person('John'); // 错误: 'Person' 的构造函数是被保护的.
```

## 类型推论

很多时候，一个变量的类型是显而易见的，如下所示：

```typescript
let x: number = 0;

x = 1; // OK
x = '1'; // error
```

`x`被赋值为`0`，所以我们一般会推测它的类型为`number`。对于这种显而易见的类型，TypeScript 允许我们省略类型声明，如下所示：

```typescript
let x = 0;

x = 1; // OK
x = '1'; // error
```

对于能够显而易见的推断出变量类型的，TypeScript 允许我们不显示指定类型，这就是**类型推论**。

下面多举几个例子：

```typescript
const x = [0, 1, null]; // x的类型推断为：Array<number | null>

const zoo = [new Rhino(), new Elephant(), new Snake()]; // zoo的类型推断为：Array<Rhino | Elephant | Snake>

window.onscroll = (uiEvent) => {
  // uiEvent的类型推断为：Event。TypeScript类型推论的依据是：这个函数是`onscroll`事件的监听器，所以它的参数类型就是Event。
  console.log(uiEvent);
};
```

看一个 React 的例子：

```tsx
<button
  onClick={(event) => {
    // event的类型被推断为：React.MouseEvent<HTMLButtonElement, MouseEvent>
    console.log(event);
  }}
>
  点击我
</button>
```

方法的返回值类型也可以推断：

```typescript
function add(x: number, y: number) {
  return x + y;
}

const result: number = add(x, y);
```

上面的`add`方法的返回值通过`return x + y`就能推导出是`number`类型的，所以它的返回值类型就是`number`。

但是有一些具有二义性的类型就无法正确推断出来，如下所示的函数，原本希望它的返回值类型是一个`[string, (newValue: string) => void]`这样的元组类型，但是它推断出来的类型却是`(string | ((newValue: string) => void))[]`：

```typescript
function useState(defaultValue: string) {
  let value = defaultValue;

  let setState = (newValue: string) => {
    value = newValue;
  };

  return [value, setState];
}
```

这种情况下，我们需要显示地声明函数返回值类型：

```typescript
function useState(defaultValue: string): [string, (newValue: string) => void] {
  let value = defaultValue;

  let setState = (newValue: string) => {
    value = newValue;
  };

  return [value, setState];
}
```

## 泛型

TODO: 敬请期待

## 高级类型

TODO: 敬请期待
