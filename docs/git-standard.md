---
id: git-standard
title: git提交注释规范
sidebar_label: git提交注释规范
---

## 格式说明

```shell
<type>(<scope>): <subject>
```

其中，`type`必需,`scope`可选,`subject`必需。

### type

type 表示提交类型，允许以下 7 种标识:

- `fix` - 修复缺陷
- `feat` - 新增功能
- `improve` - 用户体验提升、性能提升等优化工作
- `chore` - 日常事务
- `docs` - 文档
- `refactor` - 重构
- `test` - 增加测试

具体使用如下：

```shell
fix(sinoui-components): 修复CheckboxGroup选中数据类型不正确的bug
```

### scope

scope 用于说明 commit 影响的范围。
如果你的修改影响了不止一个 scope，你可以使用`*`代替

### subject

subject 是 commit 目的的简短描述，不超过 50 个字符。

注意：`subject`结尾不要添加标点符号。

例如：

```shell
chore(form-designer): 添加表单设计器模快
```

### 附注

如果是修复已经发布的公开库的 bug,并且有`issue`记录，我们可以在最后标注`issue`编号，例如

```shell
fix(@sinoui/use-rest-page-api): 修复删除数据之后没有更新数据状态的bug (#32)
```

如果是已经发布的资源，提交代码的同时要注意及时更新`CHANGELOG.md`。
