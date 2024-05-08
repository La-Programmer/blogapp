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

// Get all drafts for a specific user
PostRouter.get('/getDrafts', checkSessionExpiration, async (req, res) => {
  try {
    const { userEmail } = req.body;
    const drafts = await Draft.find({ userEmail });
    res.status(200).json(drafts);
  } catch (error) {
    res.status(400).json({ msg: 'Failed to fetch drafts', error: error.message });
  }
});

// Update a draft by draft ID
PostRouter.put('/draft/:draftId', checkSessionExpiration, async (req, res) => {
  try {
    const { title, description, image, category } = req.body;
    const { draftId } = req.params;

    // Check if the draft exists
    const existingDraft = await Draft.findById(draftId);
    if (!existingDraft) {
      return res.status(404).json({ msg: 'Draft not found' });
    }

    // Update the draft
    existingDraft.title = title;
    existingDraft.description = description;
    existingDraft.image = image;
    existingDraft.category = category;

    const updatedDraft = await existingDraft.save();

    res.status(200).json({ msg: 'Draft updated successfully', draft: updatedDraft });
  } catch (error) {
    res.status(400).json({ msg: 'Failed to update draft', error: error.message });
  }
});

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

// Get all posts by categories without authentication
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
// Include limit on post updating
PostRouter.put('/:postId', checkSessionExpiration, async (req, res) => {
  try {
    const { title, description, image, email } = req.body;
    const oldPost = await Post.findById(req.params.postId)
    console.log(email)
    console.log(oldPost.userEmail)
    console.log(`-----OLDPOST-----\n${oldPost}`)
    if (oldPost.editted == 0 && (email == oldPost.userEmail)) {
      const updatePost = await Post.findByIdAndUpdate(
        req.params.postId,
        { title, description, image, $inc: { editted: 1 } },
        { new: true }
      );
      res
        .status(200)
        .json({ msg: 'Post updated successfully', post: updatePost });
    } else if (email != oldPost.userEmail) {
      res.status(401).json({msg: "Unauthorized editting", email: email})
    } else {
      res.status(400).json({msg: "Post already editted", post:oldPost});
    }
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
      .status(401)
      .json({ msg: 'Failed to delete post', error: error.message });
  }
});

// Upvote a post.
// Add check to ensure that one who has upvoted before cannot upvote again
PostRouter.put('/:postId/upvote', checkSessionExpiration, async (req, res) => {
  try {
    const user = req.body;
    const post = await Post.findById(req.params.postId);
    if (!post.upvotesArray.includes(user.email)) {
      const updatedArray = await Post.findByIdAndUpdate(
        req.params.postId,
        { $push: { upvotesArray: user.email } },
        { new: true }
      )
      console.log(post.upvotesArray);
      const updatedPost = await Post.findByIdAndUpdate(
        req.params.postId,
        { $inc: { upvotes: 1 } },
        { new: true }
      );
      res
        .status(200)
        .json({ msg: 'Post upvoted successfully', post: updatedPost });
    } else {
      res.status(401).json({ error: 'You have upvoted already' });
    }
  } catch (error) {
    res
      .status(400)
      .json({ msg: 'Failed to upvote post', error: error.message });
  }
});

// Downvote a post.
// Add check to ensure that one who has downvoted before cannot downvote again
PostRouter.put(
  '/:postId/downvote',
  checkSessionExpiration,
  async (req, res) => {
    try {
      const user = req.body;
      const post = await Post.findById(req.params.postId);
      if (!post.downvotesArray.includes(user.email)) {
        const updatedArray = await Post.findByIdAndUpdate(
          req.params.postId,
          { $push: { downvotesArray: user.email } },
          { new: true }
        )
        console.log(post.downvotesArray);
        const updatedPost = await Post.findByIdAndUpdate(
          req.params.postId,
          { $inc: { downvotes: 1 } },
          { new: true }
        );
        res
          .status(200)
          .json({ msg: 'Post downvoted successfully', post: updatedPost });
      } else {
        res.status(401).json({ error: 'You have downvoted already' });
      }
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
