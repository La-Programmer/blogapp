import express from 'express';
import Post from '../models/PostSchema.js';

const PostRouter = express.Router();
PostRouter.use(express.json());

// Create posts
PostRouter.post('/', async (req, res) => {
  try {
    const { title, description, image } = req.body;
    const newPost = await Post.create({ title, description, image });
    res.status(201).json({ msg: 'Post created successfully', post: newPost });
  } catch (error) {
    res.status(400).json({ msg: 'Failed to create post', error: error.message });
  }
});


// Get all posts
PostRouter.get('/', async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    res.status(400).json({ msg: 'Failed to fetch posts', error: error.message })
  }
});


// Update post
PostRouter.put('/:postId', async (req, res) => {
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



// Delete Post
PostRouter.delete('/:postId', async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.postId);
    res.status(200).json({ msg: 'Post deleted successfully', post: deletedPost });
  } catch (error) {
    res.status(400).json({ msg: 'Failed to delete post', error: error.message });
  }
});




export default PostRouter;
