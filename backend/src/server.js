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
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(cors({
	origin: process.env.CLIENT_URL || "http://localhost:5173",
	methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
	credentials: true
}));

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        "default-src": ["'self'"],
        "img-src": [
          "'self'",
          "data:",
          "blob:",
          "https://res.cloudinary.com"
        ],
        "script-src": [
          "'self'",
          "'unsafe-inline'"
        ],
        "style-src": [
          "'self'",
          "'unsafe-inline'"
        ],
        "connect-src": [
          "'self'",
          process.env.CLIENT_URL || "http://localhost:5173",
          "wss://campus-hub-qq2m.onrender.com",
          "ws://localhost:5000",
          "https://res.cloudinary.com",
          "https://api.cloudinary.com"
        ],
        "media-src": [
          "'self'",
          "https://res.cloudinary.com"
        ],
        "font-src": [
          "'self'",
          "data:"
        ],
        "frame-ancestors": ["'none'"],
        "form-action": ["'self'"]
      },
    },
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }))
app.use(cookieParser());
app.use(logger);
app.use(errorLogger);

if (process.env.NODE_ENV === 'production') {
	app.use('/api', redisLimiter);
};

app.use('/api/auth', authRoutes);
app.use('/api/chat', messageRoutes);
app.use('/api/item', itemRoutes);

if(process.env.NODE_ENV === 'production'){
	app.use(express.static(path.join(__dirname, "../../frontend/dist")));

	app.get('*all', (req, res) => {
		res.sendFile(path.join(__dirname, "../../frontend", "dist", "index.html"));
	})
}

server.listen(PORT, () => {
	connectDB();
	console.log("Server listening on port: ", PORT);
	console.log("__dirname:", __dirname);
	console.log("Serving from:", path.join(__dirname, "../../frontend/dist"));
	console.log("CLIENT_URL:", process.env.CLIENT_URL);
});
