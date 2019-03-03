const http = require('http')
const port = 3000

const requestHandler = (request, response) => {
  response.end('Hello world (18)')
}

const server = http.createServer(requestHandler)

server.listen(port, (err) => {
  if (err) {
    return console.log(err)
  }
  console.log(`server is listening on ${port}`)
})
