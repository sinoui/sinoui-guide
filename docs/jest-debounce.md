---
id: jest-debounce
title: jest 测试 debounce (lodash/debounce)
sidebar_label: jest 测试 debounce
---

debounce 函数，即防抖函数是前端常用的优化函数之一，关于作用请参见 [节流与防抖](debounce-and-throttle-guide.md) 章节。本篇文章使用 Jest 测试使用了 `debounce` 方法的代码的两种方案：

- 模拟模块
- 模拟定制器

## 模拟模块

```ts
jest.mock('lodash/debounce', () => jest.fn((fn) => fn));
```

## 模拟定时器

jest 提供了定时器模拟方法，`debounce` 内部采用的是 `setTimeout` 实现的定时功能。

```ts
import debounce from 'lodash/debounce';

// 启用定时器模拟器
jest.useFakeTimers();

it('fails to mock Lodash timers correctly', () => {
  const test = jest.fn();
  const debounced = debounce(test, 1000);

  debounced();
  debounced();

  jest.runAllTimers();

  expect(test).toHaveBeenCalledTimes(1);
});
```

## 实例

防抖版本的查询输入框：

```tsx
import React, { useCallback, useState } from 'react';
import debounce from 'lodash/debounce';
import http from '@sinoui/http';

interface Item {
  id: string;
  title: string;
}

function SearchTextInput() {
  const [value, setValue] = useState();
  const [items, setItems] = useState<Item[]>([]);

  const search = useCallback(
    debounce(async (searchText: string) => {
      const result = await http.get<Item[]>('/api/search', {
        params: { searchText },
      });

      setItems(result);
    }),
    [],
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    setValue(newValue);
    search(newValue);
  };

  return (
    <div>
      <input
        type="text"
        data-testid="textinput"
        value={value}
        onChange={handleChange}
      />
      <ul>
        {items.map((item) => (
          <li key={item.id}>{item.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default SearchTextInput;
```

单元测试：

```tsx
import React from 'react';
import { render, cleanup, fireEvent, act } from '@testing-library/react';
import http from '@sinoui/http';
import SearchTextInput from './SearchTextInput';

jest.mock('@sinoui/http');
jest.useFakeTimers();

afterEach(cleanup);

afterEach(() => {
  (http.get as jest.Mock).mockReset();
});

it('输入多个字符，只查询一次', async () => {
  const { getByTestId } = render(<SearchTextInput />);

  const textinput = getByTestId('textinput');

  const fireChange = (text: string) =>
    fireEvent.change(textinput, {
      target: {
        value: text,
      },
    });

  act(() => {
    fireChange('z');
    fireChange('zh');
  });

  act(() => {
    fireChange('zha');
  });

  expect(http.get).not.toBeCalled();

  jest.runAllTimers();

  expect(http.get).toHaveBeenCalledTimes(1);
  expect(http.get).toBeCalledWith('/api/search', {
    params: {
      searchText: 'zha',
    },
  });
});
```
