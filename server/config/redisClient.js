import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL ,
});

redisClient.on("error", (err) => console.error(" Redis Error:", err));
redisClient.on("connect", () => console.log(" Connected to Redis"));

(async () => {
  try {
    await redisClient.connect();
  } catch (error) {
    console.error(" Failed to connect Redis:", error);
  }
})();

export default redisClient;
