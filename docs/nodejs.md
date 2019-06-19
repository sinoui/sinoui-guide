---
id: nodejs
title: node.js操作文件
sidebar_label: Node.js
---

> Node.js 的 fs 模块提供了一个 API，用于模仿以标准的 POSIX 函数的方式与文件系统进行交互。推荐使用[fs-extra](https://github.com/jprichardson/node-fs-extra)

## 常用 API

# ensureDir(dir,options,callback)

确认目录是否存在，如果不存在，则创建一个，类似于`mkdir -p`。

```javascript
import fs from 'fs-extra';

const path = 'E:\\temp\\';
async function checkDir() {
  try {
    await fs.ensureDir(path);
    console.log('success!');
  } catch (err) {
    console.error(err);
  }
}
```

# pathExists(file,callback)

通过检查文件系统来测试给定路径是否存在。类似于`fs.exists`

```js
async function checkExists() {
  const exists = await fs.pathExists('E:\\temp\test.js');
  if (exists) {
    console.log('文件存在');
  } else {
    console.log('文件不存在');
  }
}
```

# move(src, dest,options,callback)

移动文件或目录,甚至可以跨设备，类似于`mv`

- `src` 源路径
- `dest` 目标路径
- options
  - **overwrite** : 覆盖现有文件或目录，默认为 false。
- `callback` 回调方法

```js
const srcpath = '/tmp/file.txt';
const dstpath = '/tmp/this/path/does/not/exist/file.txt';

async function moveFile() {
  try {
    await fs.move(srcpath, dstpath);
    console.log('success!');
  } catch (err) {
    console.error(err);
  }
}
```

# ensureFile(file,callback)

确认文件是否存在。如果请求创建的文件位于不存在的目录中，则会创建这些目录，如果该文件已经存在，则不进行修改。

```js
const file = '/tmp/this/path/does/not/exist/file.txt';

async function ensureFileFn() {
  try {
    await fs.ensureFile(file);
    console.log('success!');
  } catch (err) {
    console.error(err);
  }
}
```
