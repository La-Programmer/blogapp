import express from 'express';
import User from '../models/UserSchema.js';
import Session from '../models/SessionSchema.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const UserRouter = express.Router();
UserRouter.use(express.json());

const generateSessionToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

UserRouter.get('/', async (req, res) => {
  await User.find()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((error) => {
      res.status(400).json({ error: error.message });
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
      res.status(401).json({ error: 'Wrong credentials' });
    }
    const token = jwt.sign({ id: existUser._id }, process.env.SECRET);

    // Create authentication token session.
    const tokenId = generateSessionToken();
    const startSession = await Session.create({
      tokenId,
      lastActivity: Date.now(),
    });

    res.status(201).json({
      msg: 'User logged in',
      token: tokenId,
      user: existUser,
      session: startSession,
    });
  } catch (error) {
    res.status(400).json({ msg: 'Login failed', error: error.message });
  }
});

UserRouter.post('/register', async (req, res) => {
  try {
    const { name, user_name, email, password, account_type } = req.body;
    if (name && user_name && email && password && account_type) {
      const hashPassword = await bcrypt.hash(password, 14);
      const user = await User.create({
        name,
        email,
        password: hashPassword,
        user_name,
        account_type,
      });

      // Create Authentication token session.
      const tokenId = generateSessionToken();
      const startSession = await Session.create({
        tokenId,
        lastActivity: Date.now(),
      });

      res.status(200).json({
        msg: 'User registered successfully',
        user: user,
        session: startSession,
      });
    } else {
      res.status(422).json({ msg: 'Missing credentials' });
    }
  } catch (error) {
    res.status(400).json({ msg: 'Signup failed', error: error.message });
  }
});

// This route is for user password reseting.
UserRouter.post('/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    // Check if the user with the provided email exists.
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Hash the new password.
    const hashedPassword = await bcrypt.hash(newPassword, 14);

    // Update the user's password in the database.
    await User.updateOne({ email }, { password: hashedPassword });

    res.status(200).json({ msg: 'Password reset successfully' });
  } catch (error) {
    res
      .status(500)
      .json({ msg: 'Internal Server Error', error: error.message });
  }
});

// This route is getting all data for a particular user.
UserRouter.get('/users/:email', async (req, res) => {
  try {
    const userEmail = req.params.email;

    // Find user in database
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res
      .status(200)
      .json({ msg: 'User data retrieved successfully', user: user });
  } catch (error) {
    res
      .status(500)
      .json({ msg: 'Internal Server Error', error: error.message });
  }
});

// This route is deleting a user from the database.
UserRouter.delete('/users/:email', async (req, res) => {
  try {
    const userEmail = req.params.email;

    // Find and remove user from database based on the email.
    const deletedUser = await User.findOneAndDelete({ email: userEmail });

    if (!deletedUser) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res
      .status(200)
      .json({ msg: 'User deleted successfully', user: deletedUser });
  } catch (error) {
    res
      .status(500)
      .json({ msg: 'Internal Server Error', error: error.message });
  }
});

// Endpoint to suspend a user
UserRouter.post('/suspend/:email', async (req, res) => {
  try {
    const userEmail = req.params.email;

    // Find and update user's suspension status in the database.
    const updatedUser = await User.findOneAndUpdate(
      { email: userEmail },
      { $set: { isSuspended: true } },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res
      .status(200)
      .json({ msg: 'User suspended successfully', user: updatedUser });
  } catch (error) {
    res
      .status(500)
      .json({ msg: 'Internal Server Error', error: error.message });
  }
});

UserRouter.get('/sessions', async (req, res) => {
  await Session.find()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((error) => {
      res
        .status(400)
        .json({ msg: 'Failed to fetch sessions', error: error.message });
    });
});

export default UserRouter;
