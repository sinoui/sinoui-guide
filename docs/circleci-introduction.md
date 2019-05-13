---
id: circleci-introduction
title: CircleCI入门指南
sidebar_label: CircleCI
---

软件开发复杂度在不断提升，我们现在越来越关注软件开发的“最后一公里”：从功能开发完成到成功部署。关注软件工程这一阶段的同学，应该经常会看到“持续集成（CI, Continuous intergration）”和“持续部署（CD, Continuous Deployment）”，这是完成“最后一公里”的理论指导。今天给大家介绍的[CircleCI](https://circleci.com/)是一款易用的“持续集成”和“持续部署”工具。

## 目标

本篇文章会向大家介绍 CircleCI 的基本概念和基本用法。

本篇文章会向大家介绍如何用 CircleCI 完成一个通过[create-react-app](https://facebook.github.io/create-react-app/)创建的 React 项目的持续集成：在 master 分支上有提交时，自动执行编译，并发布到[Github Pages](https://pages.github.com/)上。
