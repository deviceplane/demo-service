const http = require('http')
const metrics = require('./metrics')

startServer("Server", 3000, (request, response) => {
  response.end('Hello world! (25)')
});

startServer("Metrics Server", 2112, metrics.handler);

function startServer(name, port, requestHandler) {
  const server = http.createServer(requestHandler)

  server.listen(port, (err) => {
    if (err) {
      return console.log(err)
    }
    console.log(`${name} is listening on ${port}`)
  })
}
