const Fastify = require("fastify")
const fp = require("fastify-plugin")

async function boot() {
  // [1]
  async function plugin1(fastify, options) {
    fastify.decorate("plugin1Decorator", "plugin1")
  }
  async function plugin2(fastify, options) {
    throw new Error("error")
    fastify.decorate("plugin2Decorator", "plugin2")
  }
  async function plugin3(fastify, options) {
    fastify.decorate("plugin3Decorator", "plugin3")
  }

  const app = Fastify({ logger: true })

  await app // [2]
    .register(fp(plugin1))
    .register(fp(plugin2))
    .after((error) => {
      console.log("🚀 ~ .after ~ error:", error)

      // [3]
      console.log("plugin1Decorator", app.hasDecorator("plugin1Decorator"))
      console.log("plugin2Decorator", app.hasDecorator("plugin2Decorator"))
    })
    .register(fp(plugin3)) // [4]

  console.log("plugin3Decorator", app.hasDecorator("plugin3Decorator"))

  await app.ready()
  console.log("app ready")
}
boot()
