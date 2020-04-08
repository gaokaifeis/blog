const http = require('http')

http.createServer((request, response) => {
  console.log('request com', request.url)

  response.end('123')
}).listen(8888)