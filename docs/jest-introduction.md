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

单元测试技术上来说，有几个必须掌握的核心概念，包括：匹配器（编写断言必备技能）、setup 和 teardown、模拟、测试异步代码。接下来 4 个篇章将一一道来。

## 匹配器 Matchers

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

## 测试异步代码

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

test('获取数据失败', async () => {
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

## setup 和 teardown

TODO

## 模拟

模拟函数通过屏蔽函数的实际实现来轻松实现测试代码之间的链接。比如你的代码需要请求 API 获取数据，但是执行单元测试时又无法保证有相应的服务器启动并可访问到。这时你就可以使用模拟函数，屏蔽掉真实 API 请求，而模拟其行为：如果你的测试预期请求真实 API 成功并返回数据，那么你就模拟这个行为，并返回数据。

模拟函数，可以捕获到对函数的调用（以及在这些调用中传递的参数），在使用 new 实例化时捕获构造函数的实例，并允许返回值的测试时配置（根据测试需要指定返回值）。

有两种方式来模拟函数：

1. 在测试代码级别上创建模拟函数
2. 编写手工模拟来覆盖模块依赖

### 使用模拟函数

> 通过`jest.fn()`创建模拟函数。

我们有一个`forEach`实现，会使用指定数组中的每一项挨个调用回调函数：

```ts
function forEach<T>(items: T[], callback: (item: T) => void) {
  for (let index = 0; index < items.length; index++) {
    callback(items[index]);
  }
}
```

为了测试这个函数，我们可以使用模拟函数，并且检查模拟状态以确保回调函数按照期望被执行了：

```ts
it('test forEach', () => {
  const mockCallback = jest.fn((x) => 42 + x);
  forEach([0, 1], mockCallback);

  // 模拟函数被调用了两次
  expect(mockCallback.mock.calls.length).toBe(2);

  // 第一次调用的第一个参数是0
  expect(mockCallback.mock.calls[0][0]).toBe(0);

  // 第二次调用的第一个参数是1
  expect(mockCallback.mock.calls[1][0]).toBe(1);

  // 第一次调用回调函数时返回值是42
  expect(mockCallback.mock.results[0].value).toBe(42);
});
```

每一个模拟函数都有`.mock`属性，它会记录模拟函数调用和返回值情况。它的用法如上面的例子所示。

### Mock 的返回值

我们有个`map`实现，它会将一个数组的每一项调用回调函数，将回调函数的返回值组成一个新的数组：

```ts
function map<T, U>(items: T[], callback: (item: T, index: number) => U): U[] {
  const result = [];
  for (let index = 0; index < items.length; index++) {
    result.push(callback(item[index], index));
  }
  return result;
}
```

我们使用模拟函数作为回调函数来测试这个`map`：

```ts
const callbackMock = jest.fn();

callbackMock
  .mockReturnValueOnce(10)
  .mockReturnValueOnce(20)
  .mockReturnValue(1);

const result = map([1, 2, 3, 4], callbackMock);

expect(callbackMock.mock.calls.length).toBe(4);
expect(result).toEqual([10, 20, 1, 1]);
```

### 模拟模块

我们常常需要对外部依赖的模块进行模拟，才能快速有效地测试我们的代码。比如我们获取用户数据的方法用到了[@sinoui/http](https://github.com/sinoui/http)：

```ts
import http from '@sinoui/http';

function getUsers() {
  return http.get('/users.json');
}
```

现在为了不真的发送 API 请求而测试我们的代码，我们需要用到`jest.mock(...)`函数来自动模拟@sinoui/http 模块。备注：如果真的发送 API 请求来测试我们的代码，这样的测试是很慢的而且是脆弱的，一旦 API 停止服务或者网络访问不了了，那么测试就无法进行。

```ts
import http from '@sinoui/http';
import getUsers from './users';

jest.mock('@sinoui/http');

test('获取用户数据', () => {
  const users = [{ name: 'Jacking' }];

  // 模拟`http.get`的返回值为`Promise.resolve(uers)`。
  http.get.mockResolvedValue(users);

  return getUsers().then((result) => expect(result).toEqual(users));
});
```

### 模拟实现

如果你需要模拟一个模块默认导出的函数，那么你需要用到`mockImplementation`：

```ts
// foo.js
module.exports = function() {
  // 实现代码
};

// test.js
jest.mock('../foo');
const foo = require('../foo');

foo.mockImplementation(() => 42);
foo();
// > 42
```

## 测试 React

TODO

## 测试自定义 React Hook

我们可以使用[react-hooks-testing-library](https://github.com/mpeyper/react-hooks-testing-library)测试[自定义的 React Hook](https://zh-hans.reactjs.org/docs/hooks-custom.html)。

先安装依赖：

```shell
yarn add react-test-renderer react-hooks-testing-library --dev
```

### 例子：计数 hook

看一个计数 hook 的例子：

`useCouner.ts`:

```ts
import { useState, useCallback } from 'react';

function useCounter() {
  const [count, setCount] = useState(0);

  const increment = useCallback(() => setCount((x) => x + 1), []);
  const decrement = useCallback(() => setCount((x) => x - 1), []);

  return { count, increment, decrement };
}

export default useCounter;
```

单元测试如下：

`useCounter.spec.ts`:

```ts
import { renderHook, act } from 'react-hooks-testing-library';
import useCounter from './useCounter';

it('增加计数', () => {
  // 初始化useCounter。
  // 相当于创建了一个使用useCounter的组件。
  const { result } = renderHook(() => useCounter());

  // 调用useCounter hook的`increment()`。
  // 记住：千万别丢了`act`。
  // 必须在`act`中执行hook中的方法
  act(() => result.current.increment());

  // 期望count从0增加到了1
  expect(result.current.count).toBe(1);
});

it('减少计数', () => {
  const { result } = renderHook(() => useCounter());

  act(() => result.current.decrement());

  expect(result.current.count).toBe(-1);
});
```

### API: `renderHook(callback[, options])`

渲染一个用于测试的组件，这个组件会调用包含 hook 的`callback`。

参数说明：

- `callback` (`() => any`) - 测试组件每次渲染时调用的方法。这个方法应该调用需要测试的 hook。
- `options` (`object`) - 配置对象。有以下配置项：
  - `initialProps` (`object`) - 传递给`callback`函数的初始值
  - `wrapper` (`componenet`) - pass a React Component as the wrapper option to have it rendered around the inner element. This is most useful for creating reusable custom render functions for common data providers

返回值：

- `result` (`object`)
  - `current` (`any`) - `callback`函数返回的值
  - `error` (Error) - `callback`函数抛出的错误。
- `waitForNextUpdate` (`function`) - 返回一个 Promise，它在下次组件渲染时结束。一般用于由于异步操作导致状态更新的情况。
- `rerender` (`function([newProps])`) - 重新渲染测试组件的方法。重新渲染测试组件时，会再次调用`callback`函数。如果指定了`newProps`，则会将`newProps`传递给`callback`。
- `unmount` (`function()`) - 卸载测试组件。一般用于触发`useEffect` hook 的清除动作。

### API: `act(callback)`

与[react-test-renderer 的 act()](https://zh-hans.reactjs.org/docs/test-utils.html#act)方法是一样的作用。

为断言准备一个组件，包裹要渲染的代码并在调用`act()`时执行更新。这会使得测试更接近 React 在浏览器中的工作方式。

### 测试含有 http 请求的 hook

`useFetchUsers.ts`:

```ts
import http from '@sinoui/http';
import { useState, useEffect } from 'react';

interface User {
  userId: string;
  userName: string;
}

function useFetchUsers() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const result = await http.get<User[]>('/users');
      setUsers(result);
    };

    fetchUsers();
  }, []);

  return users;
}

export default useFetchUsers;
```

`useFetchUsers.spec.ts`:

```ts
import http from '@sinoui/http';
import { renderHook, act } from 'react-hooks-testing-library';
import useFetchUsers from './useFetchUsers';

jest.mock('@sinoui/http');

it('获取用户数据', async () => {
  (http.get as jest.Mock).mockResolvedValue([
    { userId: '1', userName: '张三' },
  ]);

  const { result, waitForNextUpdate } = renderHook(() => useFetchUsers());

  expect(result.current).toEqual([]);

  await waitForNextUpdate();

  expect(result.current[0]).toEqual({ userId: '1', userName: '张三' });
});
```

上面的测试代码有两个要点：

1. 使用`jest.mock('@sinoui/http')`模拟了`@sinoui/http`模块，并使用`http.get.mockResolvedValue(users)`模拟`get`请求的响应。
2. `await waitForNextUpdate()`等待 HTTP 请求 promise 的完成时更新 hook 中的状态的时机。

测试代码可以测试通过，但是在`react@16.8.0`版本中会有下面的警告：

```log
    console.error node_modules/react-test-renderer/cjs/react-test-renderer.development.js:102
      Warning: An update to TestHook inside a test was not wrapped in act(...).

      When testing, code that causes React state updates should be wrapped into act(...):

      act(() => {
        /* fire events that update state */
      });
      /* assert on the output */

      This ensures that you're testing the behavior the user would see in the browser. Learn more at https://fb.me/react-wrap-tests-with-act
          in TestHook
          in Suspense
          in ErrorBoundary
```

这种情况可以升级到`react@16.9.0-alpha.0`解决问题。如果是 React 应用，建议等待`React@16.9.0`再更新。如是库项目，则可以用类似下面的方式来处理：

`package.json`:

```json
{
  "name": "@sinoui/use-rest-page-api",
  "devDependencies": {
    "react-hooks-testing-library": "^0.5.0",
    "react-test-renderer": "^16.9.0-alpha.0",
    "react": "^16.9.0-alpha.0"
  },
  "peerDependencies": {
    "react": "^16.8.0"
  }
}
```

注意：确保`dependencies`中没有`react`依赖。

然后执行`yarn intall`，安装依赖。

最后，将单元测试中的`await waitForNextUpdate()`更换成`await act(waitFormNextUpdate)`，如下所示：

```ts
import http from '@sinoui/http';
import { renderHook, act } from 'react-hooks-testing-library';
import useFetchUsers from './useFetchUsers';

jest.mock('@sinoui/http');

it('获取用户数据', async () => {
  (http.get as jest.Mock).mockResolvedValue(
    Promise.resolve([{ userId: '1', userName: '张三' }]),
  );

  const { result, waitForNextUpdate } = renderHook(() => useFetchUsers());

  expect(result.current).toEqual([]);

  await act(waitForNextUpdate);

  expect(result.current[0]).toEqual({ userId: '1', userName: '张三' });
});
```

## 测试使用了 React Hook 的组件

TODO
