const redis = require("redis");
const util = require("util");

const client = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

client.on("connect", () => {
  console.log("Redis Server Connected");
});

const redisGet = util.promisify(client.get).bind(client);

module.exports = {
  redisGet,
  redisSet: client.set.bind(client),
  redisExpire: client.expire.bind(client),
  redisRemove: client.del.bind(client),
};
