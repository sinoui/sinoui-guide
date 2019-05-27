---
id: package-manage
title: 包管理工具：npm、npx和yarn
sidebar_label: 包管理工具：npm、npx和yarn
---

在开发 Web、[Node.js](https://nodejs.org/)应用程序时，我们可以从[npmjs](https://www.npmjs.com/)上下载其他人共享的开源库，我们也可以将我们的库发布到[npmjs](https://www.npmjs.com/)上分享给其他人。本篇文章介绍的 npm、npx 和 yarn 就是用来下载、分享 node 包的工具。

## 安装

### npm 和 npx

- npm

  由于`nodejs` 8.9.1 及其之后的版本已经集成 npm,我们只需要通过安装[Nodejs](https://nodejs.org/en/download/)的方式安装 npm。安装完成后，执行以下命令确认是否成功

  ```shell
  npm -v
  ```

  版本升级

  ```shell
  npm install npm@latest -g
  ```

- npx

  npm 从 5.2 版本开始，新增了 npx 命令，无需单独安装，万一不能用，我们需要手动安装

  ```shell
  npm install -g npx
  ```

### yarn

这里我们只描述通过安装程序安装，这种方式安装的前提是先要安装[node.js](https://nodejs.org/en/download/),可直接点击此处完成安装程序包的[下载](https://yarnpkg.com/latest.msi)。

## 用途

### npm

npm 是 node 内置的包管理工具，主要功能就是管理 node 包，包括：安装、卸载、更新、查看、搜索、发布等。它的很重要的一个作用是：将开发者从繁琐的包管理工作（版本、依赖等）中解放出来，更加专注于功能开发。

### npx

`npx`会帮助我们执行依赖包里的二进制文件，引入这个命令的目的是为了提升开发者使用包内提供的命令行工具的体验。

`npx`不需要安装即可执行 node 包里的二进制文件。

使用`npm`执行 node 包中的二进制文件的部署是：

```shell
npm add ts-lib-scripts --dev

ts-lib-scripts create my-ts-lib
```

而`npx`则只需要一个步骤即可执行：

```shell
npx ts-lib-scripts create my-ts-lib
```

### yarn

与 npm 的作用一样，但是在使用体验上做了很多优化，对开发者更友好一些。

## 包管理

### 安装依赖包

比如我们要在项目中安装`react`和`react-dom`依赖。

yarn 的方式：

```shell
yarn add react react-dom
```

npm 的方式：

```shell
npm add react react-dom --save
```

### 安装全局包

比如我们要在全局安装 TypeScript。

yarn 的方式：

```shell
yarn global add typescript
```

npm 的方式：

```shell
yarn add typescript --global
```

### 安装一个项目的依赖

比如我们安装一个项目`package.json`中配置的所有依赖。

yarn 的方式：

```shell
yarn install
```

npm 的方式:

```shell
npm install
```

### 升级项目依赖

比如我们要升级一个项目的依赖。

yarn 的方式:

```shell
yarn upgrade
```

npm 的方式：

```shell
npm update
```

### 卸载指定的依赖包

比如我们要从项目中移除`husky`的依赖。

yarn 的方式：

```shell
yarn remove husky
```

npm 的方式：

```shell
npm uninstall husky
```

### 发布包

比如我们要发布`@sinoui/http`。

yarn 的方式：

```shell
yarn publish
```

npm 的方式：

```shell
npm publish
```

## scripts

### 执行 scripts

可以在 node 项目的 package.json`文件中定义与项目相关的脚本，如编译、打包、测试、lint、清除等。类似如：

```json
{
  "name": "@sinoui/http-send-file",
  "version": "0.1.0",
  "license": "MIT",
  "main": "dist/index.js",
  "umd:main": "dist/http-send-file.umd.production.js",
  "module": "dist/http-send-file.es.production.js",
  "typings": "dist/index.d.ts",
  "scripts": {
    "start": "ts-lib-tools watch",
    "test": "ts-lib-tools test",
    "build": "ts-lib-tools build",
    "format": "ts-lib-tools format",
    "lint": "ts-lib-tools lint"
  }
}
```

可以通过 npm、yarn 执行这些脚本。如编译：

```shell
yarn build

// 或者

npm run build
```

### 内置的 scripts hook

npm 脚本有 pre 和 post 两个钩子。例如：

```json
{
  "scripts": {
    "prebuild": "echo I run before the build script",
    "build": "cross-env NODE_ENV=production webpack",
    "postbuild": "echo I run after the build script"
  }
}
```

当我们执行`npm run build`时，会自动按照下面的顺序执行

```shell
npm run prebuild && npm run build && npm run postbuild
```

除此之外，`npm`还提供了以下钩子：

- prepublish、postpublish（发布前执行、发布后执行）
- preinstall、postinstall （依赖安装开始前执行、依赖安装完成后执行）
- pretest、posttest（测试开始前执行、测试完成后执行）

## npx 特点

相较于 npm 与 yarn，npx 具有以下特点：

1. 临时安装可执行依赖包，不用全局安装，不用担心长期的污染。

   ```shell
   npx ts-lib-scripts create my-ts-demo
   ```

   这条命令会临时安装 `ts-lib-scripts` 包，命令完成后`ts-lib-scripts` 会删掉，不会出现在 global 中。下次再执行，还是会重新临时安装。

2. 可以执行依赖包中的命令，安装完成自动运行。

3. 自动加载 node_modules 中依赖包，不用指定\$PATH。

   之前我们可能会这么写命令：

   ```shell
   npm i -D webpack
   ./node_modules/.bin/webpack -v
   ```

   使用 npx,我们只需这么写

   ```shell
   npm i -D webpack
   npx webpack -v
   ```

   也就是说 npx 会自动查找当前依赖包中的可执行文件。如果找不到，就会去 PATH 里找。如果依然找不到，就会自动安装。

4. 可以指定 node 版本、命令的版本，解决了不同项目使用不同版本的命令的问题

   ```shell
   npx -p node@8 npm run build
   ```
