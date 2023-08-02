const Fastify = require("fastify")

async function myPlugin(fastify, _options) {
  console.log("myPlugin -- ", fastify.root)
  fastify.decorate("myPlugin", "hello from myPlugin.") // [2]
  console.log("myPlugin -- ", fastify.myPlugin)
  // fastify.decorate("some", "hello from the root instance.".toUpperCase()); // Throws an error
}

myPlugin[Symbol.for("skip-override")] = true // [1]

const app = Fastify({ logger: true })

app.decorate("root", "hello from the root instance.")
app.decorate("some", "hello from the root instance.")
app.register(myPlugin)

app.ready().then(() => {
  console.log("root -- ", app.root)
  console.log("root -- ", app.myPlugin) // [3]
})
