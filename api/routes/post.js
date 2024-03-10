import express from 'express';
import Post from '../models/PostSchema.js';
import Draft from '../models/DraftSchema.js';
import checkSessionExpiration from '../middleware/auth.js';
import checkUserSuspension from '../middleware/suspended.js';

const PostRouter = express.Router();
PostRouter.use(express.json());

// Create posts. Including checkSessionExpiration middleware
PostRouter.post(
  '/',
  checkUserSuspension,
  checkSessionExpiration,
  async (req, res) => {
    try {
      const { title, description, image, userEmail, category } = req.body;
      const newPost = await Post.create({
        title,
        description,
        image,
        userEmail,
        category,
      });
      res.status(201).json({ msg: 'Post created successfully', post: newPost });
    } catch (error) {
      res
        .status(400)
        .json({ msg: 'Failed to create post', error: error.message });
    }
  }
);

// Save as draft function
PostRouter.post(
  '/draft',
  checkUserSuspension,
  checkSessionExpiration,
  async (req, res) => {
    try {
      const { title, description, image, userEmail, category } = req.body;
      const newDraft = await Draft.create({
        title,
        description,
        image,
        userEmail,
        category,
      });
      res.status(201).json({ msg: 'Saved as draft', draft: newDraft });
    } catch (error) {
      res
        .status(400)
        .json({ msg: 'Failed to save draft', error: error.message });
    }
  }
);

// Get all posts without authentication
PostRouter.get('/', async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    res
      .status(400)
      .json({ msg: 'Failed to fetch posts', error: error.message });
  }
});

// Get all posts by categories
PostRouter.get('/Categories', async (req, res) => {
  try {
    const { category } = req.body;
    const posts = await Post.find({ category });
    res.status(200).json(posts);
  } catch (error) {
    res
      .status(400)
      .json({ msg: 'Failed to fetch posts', error: error.message });
  }
});

// Get all posts for a specific blogger. Including checkSessionExpiration middleware
PostRouter.get('/usersPosts', checkSessionExpiration, async (req, res) => {
  try {
    const user = req.body;
    const posts = await Post.find({ userEmail: user.email });
    res.status(200).json(posts);
  } catch (error) {
    res
      .status(400)
      .json({ msg: 'Failed to fetch posts', error: error.message });
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
    res
      .status(200)
      .json({ msg: 'Post updated successfully', post: updatePost });
  } catch (error) {
    res
      .status(400)
      .json({ msg: 'Failed to update post', error: error.message });
  }
});

// Delete Post. Including checkSessionExpiration middleware
PostRouter.delete('/:postId', checkSessionExpiration, async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.postId);
    res
      .status(200)
      .json({ msg: 'Post deleted successfully', post: deletedPost });
  } catch (error) {
    res
      .status(400)
      .json({ msg: 'Failed to delete post', error: error.message });
  }
});

// Upvote a post.
PostRouter.put('/:postId/upvote', checkSessionExpiration, async (req, res) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      { $inc: { upvotes: 1 } },
      { new: true }
    );
    res
      .status(200)
      .json({ msg: 'Post upvoted successfully', post: updatedPost });
  } catch (error) {
    res
      .status(400)
      .json({ msg: 'Failed to upvote post', error: error.message });
  }
});

// Downvote a post.
PostRouter.put(
  '/:postId/downvote',
  checkSessionExpiration,
  async (req, res) => {
    try {
      const updatedPost = await Post.findByIdAndUpdate(
        req.params.postId,
        { $inc: { downvotes: 1 } },
        { new: true }
      );
      res
        .status(200)
        .json({ msg: 'Post downvoted successfully', post: updatedPost });
    } catch (error) {
      res
        .status(400)
        .json({ msg: 'Failed to downvote post', error: error.message });
    }
  }
);

// Search for posts by title
PostRouter.get('/search', checkSessionExpiration, async (req, res) => {
  try {
    const { searchQuery } = req.query;

    if (!searchQuery) {
      return res.status(400).json({ msg: 'Missing search query' });
    }

    // Using a regular expression to perform a case-insensitive search
    const matchingPosts = await Post.find({
      title: { $regex: new RegExp(searchQuery, 'i') },
    });

    res.status(200).json(matchingPosts);
  } catch (error) {
    res
      .status(400)
      .json({ msg: 'Failed to perform search', error: error.message });
  }
});

export default PostRouter;
