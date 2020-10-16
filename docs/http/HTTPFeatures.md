# HTTP各种特性概览

## 认识HTTP客户端

只要实现了发送HTTP请求的报文的工具就为HTTP客户端，最简单的HTTP客户端就是浏览器、curl

## CORS跨域请求的限制与解决

跨域是浏览器自己内置的功能，进行跨域请求时，浏览器也发送了请求，服务器也返回了请求，只不过是浏览器识别到服务器未设置允许跨域时进行了内部处理而已。

解决方式为：

  1. 在响应头里加上`Access-Control-Allow-Origin: '*'`

  2. jsonp方式，因为浏览器允许像 `link`标签、`img`标签、 `script`标签等在标签上写路径内容时时允许跨域的。

  3. 代理

:::tip
`Access-Control-Allow-Origin: '*'` 代表的含义时允许所有的访问请求，这样的设置是不安全的，因为别人的第三方的服务也可以访问到。因此我们可以设定确定的url来进行访问，比如：`Access-Control-Allow-Origin: 'http://www.baidu.com'`,这个头我们只能设置一个值，如果想实现多个域的话就需要在服务端进行逻辑判断来解决。
:::

## CORS跨域限制以及预请求验证

### CORS的一些限制

跨域默认允许的:

* 方法只有GET，HEAD，POST。其他的方法默认都是不允许的

* Content-Type有 `text/plain`、`multipart/form-data`， `application/x-www-form-urlencoded`

* 其他限制

  1. 请求头限制，具体可查看[这里](https://fetch.spec.whatwg.org/#cors-safelisted-request-header)

  2. XMLHttpRequestUpload对象均没有注册任何事件监听器

  3. 请求中没有使用ReadableStream对象

### CORS预请求

如何设置自定义的头允许发送，就需要服务端返回新的头来允许，也就是设置`Access-Control-Allow-Header`为你规定好的自定义头即可。

```js
fetch('http://localhost:8887/, {
  method: 'POST',
  headers: {
    'X-Test-Cors': '123'
  }
})
```

浏览器执行上面的代码后，会先发送一个OPTION请求，OPTION请求会预先去验证你需要发送的方法是否允许，该方法跨域是否允许。

还可以设置允许跨域的方法`Access-Control-Allow-Methods`,  
以逗号分隔即可，如： `Access-Control-Allow-Methods='PUT, DELETE'`

`Access-Control-Max-Age`是设置允许请求在验证后多少秒之内不用发起预请求来验证是否可以跨域，例如： `Access-Control-Max-Age: '1000'`

## 缓存头Cache-Control的含义和使用

* 可缓存性
  1. public 是指HTTP请求返回的过程中，返回的内容所经过的任何路径中，包括HTTP代理服务器，以及发出请求的客户端浏览器都可以进行缓存。
  2. private 只有发起请求的客户端可进行缓存
  3. no-cache 所有地方都能缓存，但是都需要向服务器进行验证，如果服务器允许使用本地的缓存客户端就可以使用

* 到期
  1. max-age='seconds'设置过期日期
  2. s-maxage='seconds' 会代替max-age, 但是只有在代理服务器中才能生效
  3. max-stale='seconds' 设置后哪怕缓存（max-age）已经过期，但是还未超过max-stale的时间，还是可以使用过期的缓存

* 重新验证
  1. must-revalidate 在已经设置max-age,且缓存过期后，必须到源服务端重新发起请求重新获取数据再来验证数据是否真的过期
  2. proxy-revalidate 指定缓存服务器在缓存过期后需要重新向源服务器请求一遍

* 其他
  1. no-store 任何地方都不能存储缓存
  2. no-transform 不要进行改变数据格式

服务端例子：

`Cache-Control: 'max-age=20, public'`

## 缓存验证Last-Modified和Etag的使用

![缓存验证](~@image/cacheVilidate.png)

当浏览器设置`no-cache`后如何进行验证? 主要有两个头设置

* Last-Modified

  意思就是上次修改时间，主要配合If-Modified-Since或者If-Unmodified-Since使用。对比上次修改时间以验证资源需要更新。

* Etag

  数据签名，对资源进行数据签名，配合If-Match或者If-None-Match使用。对比资源的签名判断是否使用缓存。

服务端例子：

```js
const http = require('http')
const fs = require('fs')

http.createServer(function (request, response) {
  console.log('request come', request.url)

  if (request.url === '/') {
    const html = fs.readFileSync('test.html', 'utf8')
    response.writeHead(200, {
      'Content-Type': 'text/html'
    })
    response.end(html)
  }

  if (request.url === '/script.js') {
    
    const etag = request.headers['if-none-match']
    if (etag === '777') {
      response.writeHead(304, {
        'Content-Type': 'text/javascript',
        'Cache-Control': 'max-age=2000000, no-cache',
        'Last-Modified': '123',
        'Etag': '777'
      })
      response.end()
    } else {
      response.writeHead(200, {
        'Content-Type': 'text/javascript',
        'Cache-Control': 'max-age=2000000, no-cache',
        'Last-Modified': '123',
        'Etag': '777'
      })
      response.end('console.log("script loaded twice")')
    }
  }
}).listen(8888)
```

## cookie和session

### cookie

cookie是通过Set-Cookie进行设置的，下次请求就会自动带上

包括的属性：

* max-age和expires设置过期时间

  max-age是设置多少时间后过期， expires是设置到那个时间点过期

* Secure只在https的时候发送

* HttpOnly设置后将无法通过document.cookie进行访问

* domain 访问域的权限设置


```js
const http = require('http')
const fs = require('fs')

http.createServer(function (request, response) {
  console.log('request come', request.url)

  if (request.url === '/') {
    const html = fs.readFileSync('test.html', 'utf8')
    response.writeHead(200, {
      'Content-Type': 'text/html',
      'Set-Cookie': [
        'id=123; max-age=2; HttpOnly',
        'abc=456;domain=test.com'
      ]
    })
    response.end(html)
  }

}).listen(8888)
```

HTTP headers并未限制键名只能有一个，因此Set-Cookie是可以多个的，在nodejs中当把Set-Cookie设置为数组时就会有多个Set-Cookie的头进行设置。

cookie是有存在时效的，当没有设置过期时间的话，浏览器关掉后就会删除掉。

### session

session 有很多种实现方法，在网站当中最经常用的是使用 Cookie 来保存 session

## HTTP长连接

当设置`Connection: keep-alive`时，chrome最多发起6个TCP连接，当超过次连接数时就会一直等待其他TCP连接空闲出来才能请求。

当设置`Connection: close`时,浏览器请求完成后就会关闭TCP连接，因此所有的请求都会创建新的连接。

## 数据协商

客户端发送请求给服务端，客户端会声明请求希望拿到的数据的格式和限制，服务端会根据请求头信息，来决定返回的数据

### 分类
  1. 客户端 请求 Accept
      * Accept 声明想要的数据类型
      * Accept-Encoding 数据以哪种编码方式进行传输，限制服务器如何进行数据压缩
      * Accept-Language 展示语言
      * User-Agent 浏览器相关信息，移动端，pc端的浏览器的User-Agent的不同

  2. 服务端 返回 Content
      * Content-Type 对应 Accept，从Accept中选择数据类型返回
      * Content-Encoding 对应 Accept-Encoding，声明服务端数据压缩方式
      * Content-Language 对应 Accept-Language，是否根据请求返回语言

### 浏览器请求 html 时的头信息

```js
// server.js
const http = require('http')
const fs = require('fs')

http.createServer(function (request, response) {
  console.log('request come', request.url)

  const html = fs.readFileSync('test.html')
  response.writeHead(200, {
    'Content-Type': 'text/html'
  })
  response.end(html)
}).listen(8888)
```

查看 network 的 localhost 文件的请求信息，浏览器会自动加上这些头信息

```
Response Headers

Connection: keep-alive
Content-Type: text/html
Date: Fri, 10 Apr 2020 01:32:43 GMT
Transfer-Encoding: chunked

Request Headers

Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8
Accept-Encoding: gzip, deflate, br
Accept-Language: zh-CN,zh;q=0.9
Cache-Control: max-age=0
Connection: keep-alive
Cookie: 
Host: localhost:8888
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36
```

:::tip
`Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8`: 浏览器可以接收这些格式的数据，可以进行设置

`Accept-Encoding: gzip, deflate, br`: 数据编码方式，gzip 使用最多；br 使用比较少，但压缩比高

`Accept-Language: zh-CN,zh;q=0.9`: 浏览器会判断本系统的语言，自动加上。q 代表权重，数值越大权重越大，优先级越高

`User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36`:

* Mozilla/5.0 浏览器最早是网景公司出的，当时默认头是 Mozilla/5.0，很多老的 http 服务器只支持这个头，所以加上兼容老的 web 服务器

* AppleWebKit/537.36 浏览器内核 ，chrome 和 safari 等现代浏览器大部分使用 webkit 内核，webkit 内核是苹果公司开发的

* KHTML 渲染引擎版本，类似于 Gecko，火狐浏览器渲染引擎

* Chrome/80.0.3987.163 chrome 版本号

* Safari/537.36 因为使用了 webkit 内核，所以会加上
:::

### Accept-Encoding

数据压缩

请求文件大小 933B，使用 gzip 压缩后是 609B

```js
// server.js
const http = require('http')
const fs = require('fs')
const zlib = require('zlib') // 引入包

http.createServer(function (request, response) {
  console.log('request come', request.url)

  const html = fs.readFileSync('test.html') // 这里不加 utf8，加了返回的就是字符串格式了
  response.writeHead(200, {
    'Content-Type': 'text/html',
    // 'X-Content-Options': 'nosniff'
    'Content-Encoding': 'gzip'
  })
  response.end(zlib.gzipSync(html)) // 压缩
}).listen(8888)

console.log('server listening on 8888')
```

请求文件响应头

```
Connection: keep-alive
Content-Encoding: gzip // 返回的压缩算法方式
Content-Type: text/html
Date: Fri, 21 Sep 2018 02:58:54 GMT
Transfer-Encoding: chunked
```

### Content-type

用来协商客户端和服务端的数据格式和声明

发送请求时，会有不同的请求内容，根据内容不同设置不同的 content-type

chorme浏览器设置，勾选 Preserve log，当页面跳转后，也会把之前的请求打印出来

发送表单数据

```html
<body>
  <form action="/form" method="POST" id="form" enctype="application/x-www-form-urlencoded">
    <input type="text" name="name">
    <input type="password" name="password">
    <input type="submit">
  </form>
</body>
</html>
```

```
Request Headers
Content-Type: application/x-www-form-urlencoded // content-type 就是 form表单中设置的

Form Data
name=sf&password=sfs
```

服务端根据 content-type 是 x-www-form-urlencoded来对body 中的数据进行转化即可

如果表单数据中有文件

```html
<body>
  <form action="/form" method="POST" id="form" enctype="multipart/form-data">
    <input type="text" name="name">
    <input type="password" name="password">
    <input type="file" name="file">
    <input type="submit">
  </form>
  <script>
    var form = document.getElementById('form')
    form.addEventListener('submit', function (e) {
      e.preventDefault()
      var formData = new FormData(form)
      fetch('/form', {
        method: 'POST',
        body: formData
      })
    })
  </script>
</body>
```

`multipart/form-data`代表请求是有多个部分的，有时通过表单上传文件时，必须要把文件部分单独拆分出来，文件不能作为字符串进行传输的，要作为二进制的数据进行传输；使用 x-www-form-urlencoded 这种拼接字符串的方式 是不对的

```
Request Headers
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary39Ug3FSPIBvDYZd6

Request Payload
------WebKitFormBoundary39Ug3FSPIBvDYZd6
Content-Disposition: form-data; name="name"

sdfs
------WebKitFormBoundary39Ug3FSPIBvDYZd6
Content-Disposition: form-data; name="password"

sdfs
------WebKitFormBoundary39Ug3FSPIBvDYZd6
Content-Disposition: form-data; name="file"; filename="1536973449110.png"
Content-Type: image/png


------WebKitFormBoundary39Ug3FSPIBvDYZd6--
```

`boundary=----WebKitFormBoundary39Ug3FSPIBvDYZd6`用来分割表单提交数据的各个部分

服务端拿到表单数据后，根据这个分割字符串，进行数据分割

## Redirect

通过 url 访问某个路径请求资源时，发现资源不在 url 所指定的位置，这时服务器要告诉浏览器，新的资源地址，浏览器再重新请求新的 url，从而拿到资源。

若服务器指定了某个资源的地址，现在需要更换地址，不应该立刻废弃掉 url，如果废弃掉可能直接返回 404，这时应该告诉客户端新的资源地址。

### Redirect 的使用

```js
// server.js
const http = require('http')

http.createServer(function (request, response) {
  console.log('request come', request.url)

  if (request.url === '/') {
    response.writeHead(302, {  // or 301
      'Location': '/new' // 这里是同域跳转，只需要写路由
    })
    response.end()
  }
  if (request.url === '/new') {
    response.writeHead(200, {
      'Content-Type': 'text/html',
    })
    response.end('<div>this is content</div>')
  }
}).listen(8888)

console.log('server listening on 8888')
```

查看network localhost

请求发现是302后，浏览器自动根据响应头中的 Location 路径进行跳转

```js
General
Status Code: 302 Found (from disk cache)

Request Headers
Location: /new
```

### Redirect 301 和 302 的区别

302 临时跳转，每次请求仍然需要经过服务端指定跳转地址

301 永久跳转

302的情况

每次访问 locahost:8888，都要经过服务端跳转，服务端通过 console.log 可以看到 / /new 两次请求

```js
const http = require('http')

http.createServer(function (request, response) {
  console.log('request come', request.url)

  if (request.url === '/') {
    response.writeHead(302, {  
      'Location': '/new' 
    })
    response.end()
  }
  if (request.url === '/new') {
    response.writeHead(200, {
      'Content-Type': 'text/html',
    })
    response.end('<div>this is content</div>')
  }
}).listen(8888)

console.log('server listening on 8888')
```

301 的情况

访问 locahost:8888，第一次经过服务端跳转，服务端通过 console.log 可以看到 / /new 两次请求；第二次 服务端 console.log 只显示 /new ，没有再次经过服务器指定新的 Location

```js
response.writeHead(301, {
  'Location': '/new'
})
```

:::tip 注意
使用 301 要慎重，一旦使用，服务端更改路由设置，用户如果不清理浏览器缓存，就会一直重定向。
:::

设置了 301，locahost 会从缓存中读取，并且这个缓存会保留到浏览器，当我们访问 8888 都会进行跳转。此时，就算服务端改变设置也是没有用的，浏览器还是会从缓存中读取。


## CSP （Content-Security-Policy）

* 作用
  1. 限制资源获取
  2. 报告资源获取越权
* 限制方式
  1. default-scr限制全局
  2. 指定资源类型
* 资源类型
  1. connect-src
  2. img-src
  3. mainfest-src
  4. font-src
  5. style-src
  6. media-src
  7. frame-src
  8. script-src

### 限制内联脚本

server

```js
const http = require('http')
const fs = require('fs')
http.createServer(function(request, response) {
    console.log('request come', request.url)
    const html = fs.readFileSync('test.html')
    response.writeHead(200, {
        'Content-Type': 'text/html',
        'Content-Security-Policy': 'default-src http: https:'
    })
     response.end(html)
}).listen(8888)
console.log('server listening on 8888')
```

html

```html

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Title</title>
</head>
<body>
<div>This is content</div>
<script>
  console.log('inline js')
</script>
</body>
</html>
```

然后启动服务去访问，会出现如下报错

`Refused to execute inline script because it violates the following Content Security Policy directive: "default-src http: https:". Either the 'unsafe-inline' keyword, a hash ('sha256-KU4m2rqHAFwi569te1RE5P3qW1O/qJ+m+gVo66Frm4k='), or a nonce ('nonce-...') is required to enable inline execution. Note also that 'script-src' was not explicitly set, so 'default-src' is used as a fallback.`

###　限制外链加载 script

限制外链接在 的 script 通过哪些域名进行加载．如，限制只能通过本域名进行加载 外链 script

```js
// server.js
'Content-Security-Policy': 'script-src \'self\'' // 限制外链 script 只能是本域名下的
```

```html
// test.html
<script src="test.js"></script>  本域名下的可以使用
<script src="https://cdn.bootcss.com/jquery/3.3.1/core.js"></script>
```

8888端口访问，可以看到报错信息

`Refused to load the script 'https://cdn.bootcss.com/jquery/3.3.1/core.js' because it violates the following Content Security Policy directive: "script-src 'self'".`

查看 network，发现在浏览器端就被 block掉了，没有发送请求。

![CSPblock](~@image/cspblock.png)

### 限制指定某个网站

```js
'Content-Security-Policy': 'script-src \'self\' https://cdn.bootcss.com' // 限制外链 script 只能是本域名下的，允许指定域名script加载
```

这样就没有报错信息了，network 看到 core.js加载成功

### 限制 form 表单提交范围

form 不接受 default-src 的限制，可以通过 form-action来限制。

下例中 form 会调转到 [baidu.com](https://www.baidu.com/)，通过 form-action限制浏览器会报错。

```js
// server.js
'Content-Security-Policy': 'script-src \'self\'; form-action \'self\'' // 限制表单提交只能在本域下
```

```html
// test.html
<form action="http://baidu.com">
  <button type="submit">click me</button>
</form>
```

报错信息

`Refused to send form data to 'http://baidu.com/' because it violates the following Content Security Policy directive: "form-action 'self'".`

### 限制图片链接

通过全局限制 default-src 就可以实现

```js
'Content-Security-Policy': 'default-src \'self\'; form-action \'self\'' 
```

### 限制 ajax 请求

通过 connect-src

```js
'Content-Security-Policy': 'connect-src \'self\'; form-action \'self\'; report-uri / report' 
```

```html
<script> 
  fetch('http://baidu.com')
</script>
```

报错信息

`Refused to connect to 'http://baidu.com/' because it violates the following Content Security Policy directive: "connect-src 'self'".`

### 汇报

```js
// server.js
'Content-Security-Policy': 'default-src \'self\'; form-action \'self\'; report-uri / report' 
```

network查看，发送的内容，是 标准的 csp report 的内容。

![CSPreport](~@image/cspreport.png)

### 允许加载但汇报

使用 ‘Content-Security-Policy-Report-Only’

```js
// server.js
'Content-Security-Policy-Report-Only': 'default-src \'self\'; form-action \'self\'; report-uri / report' 
```

资源会正常加载，但是汇报 Report-Only相关的错误提醒

### 在 html 中使用 csp

和在服务端使用效果相同，最好在服务端做。

```html
<meta http-equiv="Content-Security-Policy" content="script-src 'self'; form-action 'self';">
```

report-uri 不允许在 html 的 meta 中使用，只能在服务端通过 head 进行设置。