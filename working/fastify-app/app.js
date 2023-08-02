"use strict"

const path = require("path")
const AutoLoad = require("@fastify/autoload")

module.exports = async function (fastify, opts) {
  // Place here your custom code!
  // fastify.log.info("The .env file has been read %s", process.env.MONGO_URL)

  // Schema loading
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, "schemas"),
    indexPattern: /^loader.js$/i,
  })

  await fastify.register(require("./configs/config"))
  fastify.log.info("Config loaded %o", fastify.config)

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, "plugins"),
    ignorePattern: /.*.no-load\.js/,
    indexPattern: /^no$/i,
    options: fastify.config,
  })

  // This loads all plugins defined in routes
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, "routes"),
    options: Object.assign({}, opts),
    indexPattern: /.*routes(\.js|\.cjs)$/i,
    ignorePattern: /.*\.js/,
    autoHooksPattern: /.*hooks(\.js|\.cjs)$/i,
    autoHooks: true,
    cascadeHooks: true,
  })
}

module.exports.options = require("./configs/server-options")
