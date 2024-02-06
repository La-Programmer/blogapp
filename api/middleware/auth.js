import User from '../models/UserSchema.js ';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const getAuth = async (req, res, next) => {
  try {
    const token = req.headers.token;
    if (token) {
      console.log({ token: token });
    }

    const verifyToken = jwt.verify(token, process.env.SECRET);
    console.log(verifyToken);

    const auth = await User.findbyId(verifyToken.id);

    req.userId = verifyToken.id;
    req.auth = auth;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

export default getAuth;
