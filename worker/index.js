const { redisHost, redisPort } = require("./keys");
const redis = require("redis");

const redisClient = redis.createClient({
  host: redisHost,
  port: redisPort,
  retry_strategy: () => 1000
});

const redisPublisher = redisClient.duplicate();

const fib = index => (index < 2 ? 1 : fib(index - 1) + fib(index - 2));

redisPublisher.on("message", (channel, message) => {
  redisClient.hset("values", message, fib(parseInt(message)));
});

redisPublisher.subscribe("insert");
