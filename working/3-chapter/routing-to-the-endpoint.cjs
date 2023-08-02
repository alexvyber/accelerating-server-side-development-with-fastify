"use strict"

const fastify = require("fastify")
const app = fastify({
  logger: true,
})

app.get("/", async () => {})
app.get("/a", async () => {}) // [1]

app.listen(8080, (err) => {
  app.log.error(err)
})
