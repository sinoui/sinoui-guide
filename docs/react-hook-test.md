---
id: react-hook-test
title: 自定义react hook 测试
sidebar_label: 自定义react hook 测试
---

我们可以使用[@testing-library/react-hooks](https://github.com/mpeyper/react-hooks-testing-library)测试[自定义的 React Hook](https://zh-hans.reactjs.org/docs/hooks-custom.html)。

先安装依赖：

```shell
yarn add react-test-renderer @testing-library/react-hooks --dev
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
import { renderHook, act } from '@testing-library/react-hooks';
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
import { renderHook, act } from '@testing-library/react-hooks';
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
    "@testing-library/react-hooks": "^1.1.0",
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
import { renderHook, act } from '@testing-library/react-hooks';
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
