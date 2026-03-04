import express from 'express'
import helmet from 'helmet'
import authRoutes from './routes/authRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import itemRoutes from './routes/itemRoutes.js';
import { connectDB } from './lib/db.js';
import redisLimiter from './middleware/rateLimiter.js';
import cors from 'cors';
import cookieParser from "cookie-parser";
import { logger, errorLogger } from './middleware/logger.js';
import { app, server } from './lib/socket.js';
import path from 'path';

const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

app.use(cors({
	origin: "http://localhost:5173",
	methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
	credentials: true
}));

app.use(cookieParser());
app.use(logger);
app.use(errorLogger);
app.use(helmet());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }))

if (process.env.NODE_ENV === 'production') {
	app.use('/api', redisLimiter);
};

app.use('/api/auth', authRoutes);
app.use('/api/chat', messageRoutes);
app.use('/api/item', itemRoutes);

if(process.env.NODE_ENV === 'production'){
	app.use(express.static(path.join(__dirname, "../../frontend/dist")));

	app.get('*', (req, res) => {
		res.sendFile(path.join(__dirname, "../../frontend", "dist", "index.html"));
	})
}

server.listen(PORT, () => {
	connectDB();
	console.log("Server listening on port: ", PORT);
});
