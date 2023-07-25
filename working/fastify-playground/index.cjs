const fastify = require("fastify")
const serverOptions = {
  logger: true
}


const app = fastify(serverOptions)

await app.listen({
  port: 5000,
  host: 'localhost'
}) // .then(address => console.log(`Server started on ${address}`))


app.log.debug(app.initialConfig, 'Fastify listening with the config')

const { port } = app.server.address()
// console.log(app.server.address())
app.log.info('HTTP Server port is %i', port)
