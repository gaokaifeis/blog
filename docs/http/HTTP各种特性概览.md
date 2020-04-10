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

## Redirect

## CSP