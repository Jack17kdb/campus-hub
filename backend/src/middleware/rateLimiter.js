import rateLimit from 'express-rate-limit';
import { createClient } from 'redis';
import RedisStore from 'rate-limit-redis';

const redisClient = createClient({
	url: 'redis://localhost:6379',
});

redisClient.on('error', (err) => {
	console.error('Redis Client Error: ', err);
});

await redisClient.connect();

const redisLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 100,
	standardHeaders: true,
	legacyHeaders: false,
	message: 'Too many requests, please try again later.',
	store: new RedisStore({
		sendCommand: (...args) => redisClient.sendCommand(args),
	}),
});

export default redisLimiter;
