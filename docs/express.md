---
id: express-guide
title: Express入门
sidebar_label: Express入门
---

Express 是一个简洁而灵活的 node.js Web 应用框架, 提供了一系列强大特性帮助你创建各种 Web 应用，和丰富的 HTTP 工具。

Express 框架核心特性：

- 可以设置中间件来响应 HTTP 请求。
- 定义了路由用于执行不同的 HTTP 请求动作。
- 可以通过向模板传递参数来动态渲染 HTML 页面。

## Hello，World

`server.js`

```js
const express = require('express');
const app = express(); // （1）

app.get('/', (req, res) => res.send('Hello World!')); // (2)

app.listen(3000, () => console.log('Example app listening on port 3000!'));
```

上述示例中：

1. 代码(1)创建 express
2. 代码(2)设定 API
3. app.listen(3000)设置端口号为 3000
4. 使用 node server.js 启动，访问http://localhost:3000/将看到页面显示`Hello World`

## 路由映射

### 基本路由

路由是指确定应用程序如何响应对特定端点的客户端请求，该请求是路径和特定的 HTTP 请求。每个路由都可以有一个或多个处理函数，这些函数在路由匹配时执行。

定义路由结构：

```js
app.METHOD(PATH, HANDLER);
```

这里：

- app 是一个实例 express
- METHOD 是一个 HTTP 请求方法，小写
- PATH 是服务器上的路径
- HANDLER 是路由匹配时执行的功能

```js
var express = require('express');
var app = express();

//  主页输出 "Hello World"
app.get('/', function(req, res) {
  res.send('Hello World');
});

// post请求
app.post('/', function(req, res) {
  res.send('Hello World');
});

//  /list_user 页面 GET 请求
app.get('/list_user', function(req, res) {
  res.send('用户列表页面');
});

// 响应对/user路由的PUT请求：
app.put('/user', function(req, res) {
  res.send('Got a PUT request at /user');
});

// 响应对/user路由的DELETE请求
app.delete('/user', function(req, res) {
  res.send('Got a DELETE request at /user');
});
```

有一种特殊的路由方法，app.all()用于在路径上为所有 HTTP 请求方法和加载中间件函数

```js
app.all('/secret', function(req, res, next) {
  console.log('Accessing the secret section ...');
  next(); // 转到下一个url处理
});
```

上述代码无论是使用 GET，POST，PUT，DELETE 还是[http 模块](https://nodejs.org/api/http.html#http_http_methods)支持的任何其他 HTTP 请求方法，都会对路由“/ secret”的请求执行处理程序。

### app.route()

可以使用 app.route()为路由路径创建可链接的路由处理程序。因为路径是在单个位置指定的，所以创建模块化路由很有帮助，可以减少了冗余和拼写错误。有关路由的更多信息，请参阅：[Router()文档](http://www.expressjs.com.cn/en/4x/api.html#router)。

以下是使用定义的链接路由处理程序的示例`app.route()`。

```javascript
app
  .route('/book')
  .get(function(req, res) {
    res.send('Get a random book');
  })
  .post(function(req, res) {
    res.send('Add a book');
  })
  .put(function(req, res) {
    res.send('Update the book');
  });
```

### express.Router

使用 express.Router 类创建模块化，可安装的路由处理程序。 Router 实例是一个完整的中间件和路由系统;因此，它通常被称为“迷你 app”。

以下示例将路由器创建为模块，在其中加载中间件功能，定义一些路由，并将路由器模块安装在主应用程序中的路径上。

`birds.js`

```js
var express = require('express');
var router = express.Router();

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});
// 定义首页路由
router.get('/', function(req, res) {
  res.send('Birds home page');
});
// 定义about页面路由
router.get('/about', function(req, res) {
  res.send('About birds');
});

module.exports = router;
```

在应用程序中加载路由器模块：

```js
var birds = require('./birds');
// ...
app.use('/birds', birds);
```

该应用程序现在能够处理请求`/birds`和`/birds/about`，以及调用`timeLog`中间件功能。

## 请求数据处理

- 路径参数

  ```js
  app.get('/user/:name',(req,res)=>
      const {name} = req.params; // 获取路径参数
  })
  ```

- 请求参数

  ```js
  app.get('/todo/:userId?page=0&size=15', (req, res) => {
    const { page, size } = req.query; // 获取请求参数
  });
  ```

- 表单数据

  ```js
  const express = require('express');
  const app = express();

  const bodyParser = require('body-parser');
  app.use(bodyParser.json()); //数据JSON类型
  app.use(bodyParser.urlencoded({ extended: true })); //解析post请求数据,返回键值对中的值可以是任何类型

  // 新增人员信息
  app.post('/form-data', (req, res) => {
    const formData = req.body; // 获取表单数据
  });
  ```

- JSON 数据

  ```js
  const express = require('express');
  const app = express();

  const bodyParser = require('body-parser');
  app.use(bodyParser.json()); //数据JSON类型
  app.use(bodyParser.urlencoded({ extended: false })); //解析post请求数据,返回键值对中的值就为'String'或'Array'形式

  // 新增人员信息
  app.post('/user', (req, res) => {
    const user = req.body; // 人员数据
  });
  ```

- 文件上传

  ```js
  const express = require('express');
  const app = express();
  const multipart = require('connect-multiparty');
  const multipartMiddleware = multipart();

  // 文件上传
  app.post('/upload/file', multipartMiddleware, (req, res) => {
    const file = req.files.file; // 获取文件信息
  });
  ```

## 响应数据处理

- JSON 数据

  ```js
  app.get("/test/users", (req, res) => {
      const { page = 0, size = 15 } = req.query;
      const pageNo = parseInt(page, 10);
      const pageSize = parseInt(size, 10);
      res.json({
        totalElements: items.length,
        number: pageNo,
        totalPages: Math.ceil(items.length / size),
        size: pageSize,
        content: items.slice(pageNo * size, (pageNo + 1) * size)
      });

      // 返回500并输出错误信息
      res.status(500).json({ error: 'message' });
  ```

- 只发响应状态：`status(200).end()`。别忘记`end()`。

  ```js
  app.delete('/user/:id', (req, res) => {
    res.status(204).end();
  });
  ```

- 下载文件：`sendFile`

  res.sendFile(path [，options][，fn])：传送指定路径的文件 -会自动根据文件 extension 设定 Content-Type

  ```js
  app.get('/file/:name', function(req, res, next) {
    var options = {
      root: __dirname + '/public/', // 设置路径
      dotfiles: 'deny', //
      headers: {
        'x-timestamp': Date.now(), // 设置请求头
        'x-sent': true,
      },
    };

    var fileName = req.params.name;
    res.sendFile(fileName, options, function(err) {
      //此回调函数是在发生错误或者发送完成时调用
      if (err) {
        next(err);
      } else {
        console.log('Sent:', fileName);
      }
    });
  });
  ```

  简单用法：

  ```js
  app.get('/index.htm', function(req, res) {
    res.sendFile(__dirname + '/' + 'index.htm');
  });
  ```

## 总结

此篇文档只是简单的 Express 入门，希望我们可以从中对如何创建 express 实例，如何设置访问 IP 和端口号，如何处理路由映射以及请求数据及响应数据的处理有一定的了解。

## 参考文章

- [Express-基于 Node.js 平台的 Web 应用开发框架](http://www.expressjs.com.cn/)
