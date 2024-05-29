import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import './db/database.js';
import UserRouter from './routes/user.js';
import PostRouter from './routes/post.js';
import CommentRouter from './routes/comment.js';

dotenv.config();

const port = process.env.PORT;

const app = express();

const allowedOrigins = 'https://along-preview.netlify.app';

const corsOptions = {
  origin: allowedOrigins
};

app.use(express.json());
app.use(cors(corsOptions));
app.use('/api/user', UserRouter);
app.use('/api/post', PostRouter);
app.use('/api/comment', CommentRouter);

app.listen(port, () => {
  console.log('App is running on port: ', port);
});
