import express from 'express';
import User from '../models/UserSchema.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const UserRouter = express.Router();
UserRouter.use(express.json());

UserRouter.get('/', async (req, res) => {
  await User.find()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((error) => {
      res.status(400).json({ error: error });
    });
});

UserRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const existUser = await User.findOne({ email });
    if (!existUser) {
      res.status(404).json({ error: 'User not found' });
    }
    const comparePassword = await bcrypt.compare(password, existUser.password);
    if (!comparePassword) {
      res.status(401).json({ msg: 'Wrong credentials' });
    }
    const token = jwt.sign({ id: existUser._id }, process.env.SECRET);
    res.status(201).json({ msg: 'User logged in', token: token });
  } catch (error) {}
});

UserRouter.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (name && email && password) {
      const hashPassword = await bcrypt.hash(password, 14);
      const user = await User.create({ name, email, password: hashPassword });
      res.status(200).json({ msg: 'User registered successfully', user: user });
    } else {
      res.status(422).json({ msg: 'Missing credentials' });
    }
  } catch (error) {
    res.status(400).json({ msg: error });
  }
});

export default UserRouter;
