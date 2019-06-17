---
id: npm-dependencies-and-version
title: npm依赖与版本号
sidebar_label: npm依赖与版本号
---

在日常开发中，经常需要依赖，在发布公共库时，也需要管理依赖和版本号。这篇文章会介绍在 Node 中我们如何管理依赖和版本号。

## 摘要

咱们将学会：

- 如何管理版本号
- 如何管理应用依赖
- 如何管理公共库依赖
- 区分`dependencies`、`devDependencies`、`peerDependencies`

学习的内容是`package.json`中的四个配置：

```json
{
  "version": "1.0.0",
  "dependencies": {
    "react": "^16.8.6"
  },
  "devDependencies": {
    "prettier": "^1.17.1"
  },
  "peerDependencies": {
    "some-lib": ">=16.8.0"
  }
}
```

## 项目版本号

我们在`package.json`的`version`中定义包版本号。如果你要发布包，`version`的定义就必须遵循[语义化版本号](semver.md)规则。如果是内部项目，也推荐遵循[语义化版本号](semver.md)规则。

可以使用[node-semver](https://github.com/npm/node-semver)来检验版本号是否符合[语义化版本号](semver.md)规则。

语义化版本号规则：

> 版本格式：主版本号.次版本号.修订号，版本号递增规则如下：
>
> 1. 主版本号：当你做了不兼容的 API 修改，
> 2. 次版本号：当你做了向下兼容的功能性新增，
> 3. 修订号：当你做了向下兼容的问题修正。
>
> 先行版本号及版本编译信息可以加到“主版本号.次版本号.修订号”的后面，作为延伸。

如： `1.0.0`，`1.0.1`，`1.0.0-alpha.1`。

## `dependencies`

当我们的包依赖第三方包时，我们可以在`package.json`的`dependencies`中添加依赖关系。依赖关系是由包名称和版本范围组成的，或者由包名称和 git URL 或者本地路径组成的。

> **千万不要将项目用到的工具包依赖添加到`dependencies`中。**如不能将打包工具`webpack`、代码格式化工具`prettier`、测试工具`jest`添加到`dependencies`中。见`devDependencies`。

看看版本范围都有哪些语法：

- `version` - 直接指定的版本号，必须精确匹配。如`1.0.2`，只能匹配到`1.0.2`，不能是`1.0.3`、`1.1.0`或者`2.0.0`。
- `>version` - 必须大于指定版本号。如`>1.0.2`，能够匹配到`1.0.3`、`1.1.0`、`2.0.0`，但是不能匹配到`1.0.2`、`1.0.0`、`0.9.0`。
- `>=version` - 必须大于等于指定版本号。
- `<version` - 必须小于指定版本号。
- `<=version` - 必须小于等于指定版本号。
- `~version` - “大致相当的版本号”，只能匹配到修订号大于指定版本号的修订号，但主版本号和次版本号必须一致。如`~1.1.3`，能够匹配到`1.1.5`、`1.1.8`，但是不能匹配到`1.2.0`、 `2.0.0`、`1.1.0`。
- `^version` - “兼容版本号”。匹配到的版本号要大于指定版本号，但是主版本号必须一致。如`^1.1.3`，能够匹配到`1.1.5`、`1.1.8`、`1.2.0`、`1.8.5`，但是不能匹配到`2.0.0`、`1.1.0`。
- `1.2.x` - `1.2.0`、`1.2.1`等，但不能是`1.3.0`。
- `1.x` - `1.1.0`、`1.2.1`等，但不能是`2.0.0`。
- `http://...` - 可下载安装包的 URL。
- `*` - 匹配任何版本。
- `version1 ~ version2` - 相当于`>=version1 <=version2`。
- `range1 || range2` - 范围 1 或者是范围 2。
- `tag` - 指定包的发布标签。如`docz@latest`。
- `path` - 指定本地路径。

例子：

```json
{
  "dependencies": {
    "foo": "1.0.0 - 2.9999.9999",
    "bar": ">=1.0.2 <2.1.2",
    "baz": ">1.0.2 <=2.3.4",
    "boo": "2.0.1",
    "qux": "<1.0.0 || >=2.3.1 <2.4.5 || >=2.5.2 <3.0.0",
    "asd": "http://asdf.com/asdf.tar.gz",
    "til": "~1.2",
    "elf": "~1.2.3",
    "two": "2.x",
    "thr": "3.3.x",
    "lat": "latest",
    "dyl": "file:../dyl"
  }
}
```

我们可以通过下面的命令行添加依赖：

```shell
yarn add react
```

或者

```shell
npm i --save react
```

在安装时，也可以指定版本号范围：

```shell
yarn add react@16.8.6
```

我们也可以直接在`package.json`手动添加依赖关系，然后通过`yarn install`或者`npm install`安装依赖。

如果我们的库需要发布给其他人用，推荐手动维护依赖关系。

## `devDependencies`

如果有人计划在他们的程序中下载并使用你的模块，那么他们可能不希望下载你的模块用到的构建工具、测试工具、文档工具、代码检测工具等依赖。

这种情况，你的模块最好将使用到的工具依赖定义在`package.json`的`devDependencies`中。

例子：

```json
{
  "devDependencies": {
    "prettier": "^1.17.1",
    "eslint": "^5.16.0",
    "jest": "^24.8.0"
  }
}
```

`devDependencies`的语法与`dependencies`一致。

## `peerDependencies`

在插件开发的场景下，你的插件需要某些依赖的支持，但是你又没必要去安装，因为插件的宿主会去安装这些依赖，你就可以用`peerDependencies`去声明一下需要依赖的插件和版本，如果出问题 npm 就会有警告来提醒使用者去解决版本冲突问题。

也就是说`peerDependencies`是用来定义使用你的模块的应用程序必须自己安装的依赖，而且这些依赖需要符合`peerDependencies`中定义的版本规则，否则会发出警告。

比如，我们有一个 React 组件模块，它就没必要安装`react`依赖，但是使用 React 组件库的项目必须安装`react`才能将项目运行起来。

my-react-lib:

```json
{
  "name": "my-react-lib",
  "version": "1.1.0",
  "peerDependencies": {
    "react": ">16.8.0"
  }
}
```

my-react-app:

```json
{
  "name": "my-react-app",
  "dependencies": {
    "my-react-lib": "^1.1.0",
    "react": "^16.8.6",
    "react-dom": "^16.8.6"
  }
}
```

为什么需要`peerDependencies`呢？不能直接使用`dependencies`么？

首先，我们看一个情况：还是拿 React 组件库举例：

my-react-lib1:

```json
{
  "name": "my-react-lib1",
  "version": "1.1.0",
  "dependencies": {
    "react": "^16.0.0"
  }
}
```

my-react-lib2:

```json
{
  "name": "my-react-lib2",
  "version": "1.0.0",
  "dependencies": {
    "react": "^16.8.0"
  }
}
```

然后我们在 my-react-app 中先添加`my-react-lib1`，而且此刻最新的 react 版本是`16.4.0`：

```json
{
  "name": "my-react-app",
  "version": "1.0.0",
  "dependencies": {
    "react": "^16.4.0",
    "my-react-lib1": "^1.1.0"
  }
}
```

过了一段时间后，再添加`my-react-lib2`，此刻最新的 react 版本是`16.8.6`：

```json
{
  "name": "my-react-app",
  "version": "1.0.0",
  "dependencies": {
    "react": "^16.4.0",
    "my-react-lib1": "^1.1.0",
    "my-react-lib2": "^1.0.0"
  }
}
```

如果你用的是`yarn.lock`，搜索`react@16`，你会发现它很有可能有两处，类似如下：

```
react@^16.4.0:
  version "16.4.0"
  resolved "https://registry.yarnpkg.com/react/-/react-16.4.0.tgz#ad6c3a9614fd3a4e9ef51117f54d888da01f2bbe"
  integrity sha512-pC0uMkhLaHm11ZSJULfOBqV4tIZkx87ZLvbbQYunNixAAvjnC+snJCg0XQXn9VIsttVsbZP/H/ewzgsd5fxKXw==
  dependencies:
    loose-envify "^1.1.0"
    object-assign "^4.1.1"
    prop-types "^15.6.2"
    scheduler "^0.13.6"

react@^16.8.0:
  version "16.8.6"
  resolved "https://registry.yarnpkg.com/react/-/react-16.8.6.tgz#ad6c3a9614fd3a4e9ef51117f54d888da01f2bbe"
  integrity sha512-pC0uMkhLaHm11ZSJULfOBqV4tIZkx87ZLvbbQYunNixAAvjnC+snJCg0XQXn9VIsttVsbZP/H/ewzgsd5fxKXw==
  dependencies:
    loose-envify "^1.1.0"
    object-assign "^4.1.1"
    prop-types "^15.6.2"
    scheduler "^0.13.6"
```

（注明：以上例子可能不太容易复现，或者不太对，这是我根据以往工作中遇到的类似情况整理的。）

这种情况，我们可以手动调整一下`yarn.lock`，然后重新安装一下，或者调整一下`dependencies.react`版本号。

我们在实际项目中就遇到过一次因错误使用依赖关系，导致项目中存在多个版本的`styled-components`，程序出现莫名其妙的错误。虽然 npm、yarn 已经在不停地改善依赖管理，上面列举的情况也许不会再存在，但是我们还是应遵循约定，对于类似插件的库，将符合条件的依赖放在`peerDependencies`中定义。

## 参考资料

- [npm package.json](https://docs.npmjs.com/files/package.json)
