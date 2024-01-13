import dotenv from 'dotenv';
import mongoose from 'mongoose';
import mongoos, { mongo } from 'mongoose';

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log('Connected to database'))
  .catch((err) => console.log(err));
