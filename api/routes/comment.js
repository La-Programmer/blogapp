import express from 'express';
import Comment from '../models/CommentSchema.js';
import checkSessionExpiration from '../middleware/auth.js';

const CommentRouter = express.Router();
CommentRouter.use(express.json());

// Create a new comment with session authentication
CommentRouter.post('/', checkSessionExpiration, async (req, res) => {
  try {
    const { comment, postId, user } = req.body;
    const newComment = await Comment.create({ comment, postId, user });
    res
      .status(201)
      .json({ msg: 'Comment created successfully', comment: newComment });
  } catch (error) {
    res
      .status(400)
      .json({ msg: 'Failed to create comment', error: error.message });
  }
});

// Get all the comments associated with a post
CommentRouter.get('/', checkSessionExpiration, async (req, res) => {
  try {
    const postId = req.body;
    const comments = await Comment.find({ postId });
    res.status(200).json(comments);
  } catch (error) {
    res
      .status(400)
      .json({ msg: 'Failed to fetch comments', error: error.message });
  }
});

// Update a comment
CommentRouter.put('/:commentId', checkSessionExpiration, async (req, res) => {
  try {
    const { comment } = req.body;
    const updatePost = await Comment.findByIdAndUpdate(
      req.params.commentId,
      { comment },
      { new: true }
    );
  } catch (error) {
    res
      .status(400)
      .json({ msg: 'Failed to update comment', error: error.message });
  }
});

// Delete Comment
CommentRouter.delete(
  '/:commentId',
  checkSessionExpiration,
  async (req, res) => {
    try {
      const deletedComment = await Comment.findByIdAndDelete(
        req.params.commentId
      );
      res
        .status(200)
        .json({ msg: 'Comment deleted successfully', comment: deletedComment });
    } catch (error) {
      res
        .status(400)
        .json({ msg: 'Failed to delete comment', error: error.message });
    }
  }
);

export default CommentRouter;
