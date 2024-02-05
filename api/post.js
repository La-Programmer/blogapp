import express from 'express';
import Post from '../models/PostSchema.js';
import Session from '../models/SessionSchema.js';

const PostRouter = express.Router();
PostRouter.use(express.json());



// Middleware to check session expiration
const checkSessionExpiration = async (req, res, next) => {
  const sessionToken = req.headers.authorization; // Assuming the session token is sent in the 'Authorization' header

  if (sessionToken) {
    try {
      const session = await Session.findOne({ tokenId: sessionToken });

      if (session && Date.now() - session.lastActivity < 60 * 60 * 1000) {
        // Update last activity timestamp
        await Session.updateOne({ _id: session._id }, { $set: { lastActivity: Date.now() } });
        next(); // Continue processing the request
      } else {
        // Session has expired, delete from database.
        await Session.deleteOne({ _id: session._id })
        res.status(401).json({ msg: 'Session expired. Please log in again.' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Internal server error' });
    }
  } else {
    // No session token provided
    res.status(401).json({ msg: 'Unauthorized. Please provide a valid session token.' });
  }
};




// Create posts. Including checkSessionExpiration middleware
PostRouter.post('/', checkSessionExpiration, async (req, res) => {
  try {
    const { title, description, image } = req.body;
    const newPost = await Post.create({ title, description, image });
    res.status(201).json({ msg: 'Post created successfully', post: newPost });
  } catch (error) {
    res.status(400).json({ msg: 'Failed to create post', error: error.message });
  }
});


// Get all posts. Including checkSessionExpiration middleware
PostRouter.get('/', checkSessionExpiration, async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    res.status(400).json({ msg: 'Failed to fetch posts', error: error.message })
  }
});


// Update post. Including checkSessionExpiration middleware
PostRouter.put('/:postId', checkSessionExpiration, async (req, res) => {
  try {
    const { title, description, image } = req.body;
    const updatePost = await Post.findByIdAndUpdate(
      req.params.postId,
      { title, description, image },
      { new: true }
    );
    res.status(200).json({ msg: 'Post updated successfully', post: updatedPost });
  } catch (error) {
    res.status(400).json({ msg: 'Failed to update post', error: error.message });
  }
});



// Delete Post. Including checkSessionExpiration middleware
PostRouter.delete('/:postId', checkSessionExpiration, async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.postId);
    res.status(200).json({ msg: 'Post deleted successfully', post: deletedPost });
  } catch (error) {
    res.status(400).json({ msg: 'Failed to delete post', error: error.message });
  }
});




export default PostRouter;
