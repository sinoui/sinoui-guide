---
id: jest-introduction
title: 基于 Jest 的单元测试
sidebar_label: 基于 Jest 的单元测试
---

## 体验一下

使用[ts-lib-scripts](https://github.com/sinoui/ts-lib-scripts)创建一个 ts 项目：

```shell
npx ts-lib-scripts create jest-tutorial
```

打开项目，你就会看到有两个文件：`src/index.ts`和`src/index.spec.ts`，内容分别是：

`index.ts`:

```typescript
export const PI = 3.14;

/**
 * 求和
 *
 * @param a 相加的数字
 * @param b 相加的数字
 */
export function sum(a: number, b: number) {
  return a + b;
}
```

`index.spec.ts`:

```typescript
import { sum } from './index';

it('1 + 1 = 2', () => {
  expect(sum(1, 1)).toBe(2);
});
```

执行下面的命令行启动 jest 执行单元测试：

```shell
yarn test
```

你将会看到下面的执行结果：

```
PASS  src/index.spec.ts
  √ 1 + 1 = 2 (3ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        2.587s
Ran all test suites.

Watch Usage: Press w to show more.
```

`index.spec.ts`就是一个使用 Jest 编写的单元测试，核心内容是`expect(sum(1, 1)).toBe(2)`，也就是你期望个`sum()`两个参数`1`和`1`，它的返回结果是`2`。这个期望就是`sum()`这个函数的核心作用。

我们使用 jest 测试的是方法的作用——我们用单元测试代码来表达期望它能做什么事情。只要单元测试通过，说明被测试的代码也就符合我们的预期。

## 核心概念

### 匹配器 Matchers

我们可以使用匹配器验证值。如下所示：

```ts
test('two plus two is four', () => {
  expect(2 + 2).toBe(4);
});
```

这段代码的意图是期望`2 + 2`的结果是`4`。`2 + 2`与`4`之间的匹配器是`toBe`，表示这二者之间是相同的关系。

`toBe`使用`Object.is`测试相等性。如果你需要验证对象的值是否相同，则可以使用`toEqual`：

```ts
test('对象值相同', () => {
  const data = { one: 1 };
  data['two'] = 2;
  expect(data).toEqual({ one: 1, two: 2 });
});

test('数组值相同', () => {
  const items = [1, 2, 3, 4];
  items.push(5);

  expect(items).toEqual([1, 2, 3, 4, 5]);
});
```

如果表示不匹配，可以在使用`not`：

```ts
test('1 + 1 <> 3', () => {
  const a = 1;
  const b = 1;

  expect(a + b).not.toBe(3);
});
```

对于一些特定的值，如`true`, `false`, `null`, `undefined`，我们可以使用特定的匹配器：

- `toBeNull` - 只能匹配`null`
- `toBeUndefined` - 只能匹配`undefined`
- `toBeDefined` - 与`toBeUndefined`相反
- `toBeTruthy` - 匹配值为真的情况（与`if`语句判断真值的规则一样）
- `toBeFalsy` - 匹配值为假的情况（与`if`语句判断假值的规则一样）

```ts
test('null', () => {
  const n = null;
  expect(n).toBeNull();
  expect(n).toBeDefined();
  expect(n).not.toBeUndefined();
  expect(n).not.toBeTruthy();
  expect(n).toBeFalsy();
});

test('zero', () => {
  const z = 0;
  expect(z).not.toBeNull();
  expect(z).toBeDefined();
  expect(z).not.toBeUndefined();
  expect(z).not.toBeTruthy();
  expect(z).toBeFalsy();
});
```

`toMatch`允许我们使用正则表达式来验证字符串：

```ts
test('测试代码以代码结尾', () => {
  expect('测试代码').toMatch(/代码$/);
});
```

可以使用`toContain`来判断数组中是否包含指定的值：

```ts
test('购物清单中包含了啤酒', () => {
  expect(['剃须刀', '大米', '啤酒', '化妆品']).toContain('啤酒');
});
```

可以使用`toThrow`来测试异常信息：

```ts
function getUserInfo() {
  throw new Error('网络错误');
}

test('因网络错误无法获取用户信息', () => {
  expect(getUserInfo).toThrow();
  expect(getUserInfo).toThrow(Error);
  expect(getUserInfo).toThrow('网络错误');
  expect(getUserInfo).toThrow(/网络/);
});
```

还有很多匹配器。查看[Jest Expect API](https://jestjs.io/docs/en/expect)。

### 测试异步代码

异步是前端编程经常遇到的场景。这里重点讲解一下如何使用 Jest 测试`Promise`和`async/await`。

我们可能想到测试异步的方式如下：

```ts
test('获取数据失败', () => {
  fetchData().catch((e) => expect(e).toMatch('error'));
});
```

但是这样的测试是不正确的。我们需要告诉 jest 什么时候 promise 执行完成，我们可以使用`done`函数：

```ts
test('获取数据失败', (done) => {
  fetchData().catch((e) => {
    expect(e).toMatch('error');
    done();
  });
});
```

Jest 针对 promise 测试提供了一种更便捷的方式来代替`done`方式，即返回`promise`：

```ts
test('获取数据失败', () => {
  return fetchData().catch((e) => expect(e).toMatch('error'));
});
```

> 使用 Jest 测试 promise 时必须返回`promise`。

上面的例子如果`fetchData()`成功获取数据，则不会执行`catch()`的回调函数，也就不会执行`expect(e).toMatch('error')`。这不是我们期望的，我们可以使用`expect.assertions`来确保测试过程必须执行多少个断言：

```ts
test('获取数据失败', () => {
  epxect.assertions(1); // 必须有1个断言执行，
  // 也就是得有一个`expect`被执行。

  return fetchData().catch((e) => expect(e).toMatch('error'));
});
```

我们可以使用`resolves/rejects`来进一步简化 promise 的测试：

```ts
test('获取的数据是张三', () => {
  return epxect(fetchData(1)).resolves.toBe('张三');
});

test('获取数据失败', () => {
  return expect(fetchData('不存在的id')).rejects.toMatch('error');
});
```

说到 Promise，就不得不说`async`和`await`。Jest 同样支持：

```ts
test('获取的数据是张三', async () => {
  expect.assertions(1);
  const data = await epxect(fetchData(1));
  expect(data).toBe('张三');
});

test('获取数据失败', () => {
  expect.assertions(1);
  try {
    await fetchData('不存在的id');
  } catch (e) {
    expect(e).toMatch('error');
  }
});
```

`async`和`await`与`.resolves`和`.rejects`的结合：

```ts
test('获取的数据是张三', async () => {
  await epxect(fetchData(1)).resolves.toBe('张三');
});

test('获取数据失败', async () => {
  await expect(fetchData('不存在的id')).rejects.toMatch('error');
});
```

### setup 和 teardown

### 模拟

## 测试 React 应用
