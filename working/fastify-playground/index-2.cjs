const Fastify = require("fastify");

const app = Fastify({ logger: true }); // [1]
app.register(async function (fastify, opts) {
  console.log(fastify)
  // [2]
  app.log.info("Registering my first plugin.");
});

app
  .ready() // [3]
  .then(() => {
    app.log.info("All plugins are now registered!");
  });
