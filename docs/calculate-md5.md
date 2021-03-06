---
id: calculate-md5
title: 计算md5
sidebar_label: 计算md5
---

## 计算文件 md5

### 基于 Web 获取文件 md5

使用[browser-md5-file](https://github.com/forsigner/browser-md5-file)可以快速生成文件或者 Blob 的 md5，browser-md5-file 内部采用的是[spark-md5](https://github.com/satazor/js-spark-md5)，是速度、效率非常快的 MD5 生成库。

```typescript
import BMF from 'browser-md5-file';

const file: Blob = ....;
const bmf = new BMF();
bmf.md5(file, (err: Error, md5: string) => {
    if (err) {
        console.log('获取文件md5失败');
    } else {
        console.log('获取到的文件md5是', md5);
    }
});
```

### 基于 node 获取文件 md5

使用[md5-file](https://github.com/roryrjb/md5-file)获取指定文件的 md5 值，给定文件路径即可，内存使用率低，即便很大的文件也能快速计算。

```typescript
const md5File = require('md5-file');

const filePath = '.....'; // 文件路径

md5File(filePath, (err, hash) => {
  if (err) {
    console.error('计算文件md5失败', err);
  } else {
    console.log('文件md5是', hash);
  }
});
```

## 计算字符串的 md5

[blueimp-md5](https://github.com/blueimp/JavaScript-MD5)兼容 Node.js 等服务器端环境，RequireJS，Browserify 或 webpack 等模块加载器以及所有 Web 浏览器。

### 基于 web 计算字符串的 md5 值

```typescript
import md5 from 'blueimp-md5';

const content = 'Hello World';
const md5Hash = md5(str);
console.log(md5Hash);
```

### 基于 Node 计算字符串的 md5 值

方式一：

```js
import md5 from 'blueimp-md5';

const content = 'Hello, World';
const md5Hash = md5(content);
console.log(md5Hash);
```

方式二：

使用 node.js 原生模块`crypto`:

```js
const crypto = require('crypto');

const content = 'Hello, World';
const md5 = crypto.createHash('md5');
const md5Hash = md5.update(content).digest('hex');
console.log(md5Hash);
```
