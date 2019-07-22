---
id: interacting-with-the-black-end-guide
title: 与后端交互引用
sidebar_label: 与后端交互引用
---

经过大家共同努力，目前我们已经拥有若干支持前后端交互的、稳定的公共资源库，下面我们简单介绍几个主要库的使用场景：

- `@sinoui/http`, 是对[Axios](https://github.com/axios/axios)库中方法的轻量级无损封装。可以满足**所有场景前后端交互**的需求。具体使用方式，请参考[@sinoui/http 文档](https://sinoui.github.io/http/)。
- `@sinoui/use-data-api`是加载数据的 hook。主要用于**数据加载**。具体使用方式参考[use-data-api 官网](https://github.com/sinoui/use-data-api#sinouiuse-data-api)。
- `@sinoui/use-rest-item-api`是与单条数据的`RESTful`风格的增删改查`API`交互的 React Hook。主要用于**遵循`RESTful`风格的单条数据的增删改查**的前后端交互场景。具体使用方式请参考[use-rest-item-api 使用文档](https://github.com/sinoui/use-rest-item-api#sinouiuse-rest-item-api)。
- `@sinoui/use-rest-page-api`是简化分页列表与 RESTful CRUD API 交互的状态管理的 hook。主要适用于**分页列表的增删改查，排序、条件查询**等场景。更多`use-rest-page-api`的使用，请参考：[use-rest-page-api 使用说明](https://github.com/sinoui/use-rest-page-api#sinouiuse-rest-page-api)。
- `@sinoui/use-rest-list-api`是简化不分页列表与 RESTful CRUD API 交互的状态管理的 hook。主要适用于**不分页列表的数据增删改查，排序**等场景。更多详细使用方式请参考[use-rest-list-api 官方文档](https://github.com/sinoui/use-rest-list-api#use-rest-list-api)。
- `@sinouiincubator/editable-data-table`,可编辑数据表格。主要功能包括展现列表数据(不支持分页，但可以和分页功能组合使用)、编辑数据行、校对数据行、选择数据行等。具体使用方式请参考[@sinouiincubator/editable-data-table 官方文档](https://sinouiincubator.github.io/editable-data-table/)

除上述公共库外，我们还有一个特殊的 hook: `@sinoui/use-rest-table`,它的主要功能是简化`use-rest-page-api`与`@sinoui/data-table`结合的相关处理。主要适用于使用`@sinoui/data-table`来渲染列表并且使用`@sinoui/use-rest-page-api`来管理列表数据的增删改查及分页获取等场景。使用方式请参考[use-rest-table 官方文档](https://github.com/sinoui/use-rest-table#use-rest-table)。
