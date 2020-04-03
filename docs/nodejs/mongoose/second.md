# Schema

[[toc]]

## Schema是什么

Mongoose 的一切始于 Schema。每个 schema 都会映射到一个 MongoDB collection ，并定义这个collection里的文档的构成。

可能我们从官网中的定义无法理解具体是什么含义，但我们在熟悉mongoDB后我们就可以记住其中的含义


| 关系型数据库 | mongoDB |
| --- | -------------- |
| table(`表`) | collection(`集合`) |
| row(`行`) | document(`文档`) |
| column(`列`) | index(`索引`) |
| table joins(`表连接`) | populate(`填充`) |
| primary key(`主键`) | _id(`唯一ID`) |

再翻译过来的话就是Schema就是用来描述数据库中的表的表结构

## 定义Schema

```javascript
const mongoose = require('mongoose)
const { Schema } = mongoose
const userSchema = new Schema({
  username: String,
  password: String,
  phone: String,
  age: Number
})
```

最终，MOngoDB的文档(`document`)结构都可以被SchemaType定义，具体有哪些SchemaType来让我们来使用呢。

允许使用的SchemaTypes有：

* String
* Number
* Date
* Buffer
* Mixed
* ObjectId
* Array
* Boolean

更多关于[SchemaTypes](https://mongoosejs.com/docs/schematypes.html)

## 例子

```javascript
const schema = new Schema({
  name:    String,
  binary:  Buffer,
  living:  Boolean,
  updated: { type: Date, default: Date.now },
  age:     { type: Number, min: 18, max: 65 },
  mixed:   Schema.Types.Mixed,
  _someId: Schema.Types.ObjectId,
  decimal: Schema.Types.Decimal128,
  array:      [],
  ofString:   [String],
  ofNumber:   [Number],
  ofDates:    [Date],
  ofBuffer:   [Buffer],
  ofBoolean:  [Boolean],
  ofMixed:    [Schema.Types.Mixed],
  ofObjectId: [Schema.Types.ObjectId],
  ofArrays:   [[]],
  ofArrayOfNumbers: [[Number]],
  nested: {
    stuff: { type: String, lowercase: true, trim: true }
  }
})
```

## SchemaType 选项

你可以直接声明 schema type 为某一种 type，或者赋值一个含有`type`属性的对象

```javascript
const schema1 = new Schema({
  test: String
})

const schema2 = new Schema({
  test: { type: String }
})
```

除了`type`属性，你还可以对这个字段指定其他属性。如果你要保存之前要把字母都改成小写：

```javascript
const schema = new Schema({
  test: {
    type: String,
    lowercase: true
  }
})
```

`lowercase`属性只属于字符串。以下有一些全部type可用的选项和一些限定部分type使用的选项。

**全部可用**

* `required`:布尔值或函数 如果为真，为此属性添加[require验证器](https://mongoosejs.com/docs/validation.html#built-in-validators)
* `default`:任何值或函数设置值的默认值。如果是函数，函数返回为默认值
* `select`:布尔值 指定query的默认
