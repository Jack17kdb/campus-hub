import rateLimit from 'express-rate-limit';
import { createClient } from 'redis';
import RedisStore from 'rate-limit-redis';

const redisClient = createClient({
	url: `redis://default:${process.env.REDIS_API_KEY}@redis-12544.c15.us-east-1-2.ec2.cloud.redislabs.com:12544`,
});

redisClient.on('error', (err) => {
	console.error('Redis Client Error: ', err);
});

await redisClient.connect();

const redisLimiter = rateLimit({
	windowMs: 10 * 60 * 1000,
	max: 1000,
	standardHeaders: true,
	legacyHeaders: false,
	message: 'Too many requests, please try again later.',
	store: new RedisStore({
		sendCommand: (...args) => redisClient.sendCommand(args),
	}),
});

export default redisLimiter;
