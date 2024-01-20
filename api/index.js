import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import './db/database.js';
import UserRouter from './routes/user.js';
import PostRouter from './routes/post.js';

dotenv.config();

const port = process.env.PORT;

const app = express();

const corsOptions = {
  origin: 'https://along-preview.netlify.app/',
  credentials: true,
};

app.use(express.json());
app.use(cors(corsOptions)); //allows all origins
app.use('/api/user', UserRouter);
app.use('/api/post', PostRouter);

app.listen(port, () => {
  console.log('App is running on port: ', port);
});
