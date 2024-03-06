import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: true,
  },
  postId: {
    type: String,
    required: true,
  },
  user: {
    type: Object,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  upvotes: {
    type: Number,
    default: 0,
  },
  downvotes: {
    type: Number,
    default: 0,
  },
  replies_count: {
    type: Number,
    default: 0,
  },
});

const Comment = mongoose.model('Comment', CommentSchema);

export default Comment;
