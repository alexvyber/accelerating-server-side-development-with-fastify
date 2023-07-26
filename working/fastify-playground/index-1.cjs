const fastify = require("fastify");
const fs = require("fs/promises");
const serverOptions = {
  logger: {
    level: "debug",
    transport: {
      target: "pino-pretty",
    },
  },
  disableRequestLogging: true, // [1]
  requestIdLogLabel: "reqId", // [2]
  requestIdHeader: "request-id", // [3]
  genReqId: function (httpIncomingMessage) {
    // [4]
    return `foo-${Math.random()}`;
  },
};

const app = fastify(serverOptions);

app.route({
  url: "/hello",
  method: "GET",
  handler: function AnonymousNamedFunction(request, reply) {
    reply.send("world");
  },
});

function business(request, reply) {
  // `this` is the Fastify application instance
  reply.send({ helloFrom: this.server.address() });
}
app.get("/server", business);

app.get("/multi", function multi(request, reply) {
  reply.send("one");
  reply.send("two");
  reply.send("three");
  this.log.info("this line is executed");
});

app.get("/more", async function myHandler(request, reply) {
  return "more"; // simple returns of a payload
});

async function foo(request, reply) {
  return { one: 1 };
}
async function bar(request, reply) {
  const oneResponse = await foo(request, reply);
  return {
    one: oneResponse,
    two: 2,
  };
}

app.get("/foo", foo);
app.get("/bar", bar);

app.get("/file", function promiseHandler(request, reply) {
  const fileName = "./package.json";
  const readPromise = fs.readFile(fileName, { encoding: "utf8" });
  return readPromise;
});

const cats = [];
app.post("/cat", function saveCat(request, reply) {
  cats.push(request.body);
  reply.code(201).send({ allCats: cats });
});

app.get("/xray", function xRay(request, reply) {
  // send back all the request properties
  return {
    id: request.id, // id assigned to the request in req <progress>
    ip: request.ip, // the client ip address
    ips: request.ips, // proxy ip addressed
    hostname: request.hostname, // the client hostname
    protocol: request.protocol, // the request protocol
    method: request.method, // the request HTTP method
    url: request.url, // the request URL
    routerPath: request.routerPath, // the generic handler URL
    is404: request.is404, // the request has been routed or
  };
});

app.get("/log", function log(request, reply) {
  request.log.info("hello"); // [1]
  request.log.info("world");
  reply.log.info("late to the party"); // same as
  request.log;
  app.log.info("unrelated"); // [2]
  reply.send();
});

// app.get("/cat/:catName", function readCat(request, reply) {
//   const lookingFor = request.params.catName;
//
//   this.log.debug("cats: ",cats );
//
//   const result = cats.find((cat) => {
//     this.log.debug("cat:", cat);
//
//     return cat.name == lookingFor;
//   });
//
//     this.log.debug("result: ", result);
//
//   if (result) {
//     return { cat: result };
//   } else {
//     reply.code(404);
//     reply.send("Not Found1:");
//     // throw new Error(`cat ${lookingFor} not found`);
//   }
// });

app.get("/cat/*", function sendCats(request, reply) {
  reply.send({ allCats: cats });
});

app.register(
  function myPlugin(pluginInstance, opts, next) {
    pluginInstance.log.info("I am a plugin instance, children of app");
    next();
  },
  { hello: "the opts object" }
);

async function start() {
  await app.listen({
    port: 5000,
    host: "localhost",
  });
  // .then(address => console.log(`Server started on ${address}`))

  app.log.debug(app.initialConfig, "Fastify listening with the config");

  const { port } = app.server.address();

  app.log.info("HTTP Server port is %i", port);
}

start();
