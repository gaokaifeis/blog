(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{279:function(t,s,e){t.exports=e.p+"assets/img/browserParsingHTTP.8453cc6a.jpg"},298:function(t,s,e){"use strict";e.r(s);var i=e(14),a=Object(i.a)({},(function(){var t=this,s=t.$createElement,i=t._self._c||s;return i("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[i("h1",{attrs:{id:"http协议简介"}},[i("a",{staticClass:"header-anchor",attrs:{href:"#http协议简介"}},[t._v("#")]),t._v(" HTTP协议简介")]),t._v(" "),i("p",[t._v("超文本传输协议(HTTP)是一种用于传输超媒体文档(例如HTML)的应用层协议。它是为Web浏览器与Web服务器之间的通信儿设计的，但也可以用于其他目的。HTTP遵循经典的客户端-服务器模型，客户端打开一个连接以发出请求，然后等待它受到服务器端相应。HTTP是无状态协议，这意味着服务器再两个请求之间保留任何数据（状态）。该协议虽然通常基于TCP/IP层，但可以在任何可靠的传输层上使用；也就是说，不像UDP，它是一个不会静默丢失消息的协议。RUDP——作为UDP的可靠化升级版本——是一种合适的替代选择。")]),t._v(" "),i("div",{staticClass:"custom-block tip"},[i("p",{staticClass:"custom-block-title"},[t._v("TIP")]),t._v(" "),i("p",[t._v("浏览器输入URL后HTTP请求返回的完整过程")])]),t._v(" "),i("p",[i("img",{attrs:{src:e(279),alt:"An image"}})]),t._v(" "),i("ol",[i("li",[i("p",[t._v("最开始先做Redirect(重定向)， 主要保证该地址已经永久跳转为一个新的地址，所以浏览器最开始就需要先判断需不需要Redirect以及需要Redirect到哪里。")])]),t._v(" "),i("li",[i("p",[t._v("查看缓存，如果请求资源已经缓存过了，如果缓存过了就直接读取缓存，如果没有缓存就需要去服务器端请求该资源。")])]),t._v(" "),i("li",[i("p",[t._v("由于我们输入的是域名，域名需要对应到IP之后我们才能真正的访问到服务器，我们就需要先去查找域名对应的IP地址，这个过程就叫做DNS解析。")])]),t._v(" "),i("li",[i("p",[t._v("有了IP之后，我们就需要创建TCP连接，经过TCP的三次握手之后才能真正的把连接创建，如果是HTTPS的请求的话，这个过程就跟TCP连接不同，需要创建能够保证安全的传输过程的TCP连接。")])]),t._v(" "),i("li",[i("p",[t._v("TCP连接创建完成后，就可以向服务器发送请求，服务器数据操作之后，返回相应的内容。")])]),t._v(" "),i("li",[i("p",[t._v("客户端开始接收数据，接受完成之后，HTTP请求完成")])])])])}),[],!1,null,null,null);s.default=a.exports}}]);