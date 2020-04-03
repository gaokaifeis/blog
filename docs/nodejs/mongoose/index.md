# Mongoose框架使用

[[toc]]

## 快速上手
首先需要先安装 [MongoDB](https://www.mongodb.com/) 和 [nodejs](https://nodejs.org/en/)

> mongoDB的下载地址可以在[MongoDB下载地址](http://dl.mongodb.org/dl/win32/x86_64)里进行下载

下一步，我们可以通过 `npm` 或者 `yarn` 来安装Mongoose

```shell
npm install mongoose
# 或者
yarn add mongoose
```

安装完成后我们就可以在node中引入它了， 我们可以进行一下简单的测试， 比如新建一个`test.js`文件

```javascript
const mongoose = require('mongoose')
// 数据库地址
const connectionUrl = 'mongodb://localhost:27017/mongoosesample'
mongoose.connect(connectionUrl)
const db = mongoose.connection
db.on('error', console.error)
db.once('open', () => {
  console.log('连接成功')
})
```
如果控制台中输出`连接成功`，就代表数据库连接成功了

接下来我们需要了解mongoose中的几个概念

* Schema
* Model

