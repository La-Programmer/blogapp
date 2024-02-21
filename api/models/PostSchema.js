import mongoose, { mongo } from 'mongoose';
import Comment from './CommentSchema.js                                                                                                 ';

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  userEmail: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    default: 'Popular junctions and roundabouts',
  },
  upvotes: {
    type: Number,
    default: 0,
  },
  downvotes: {
    type: Number,
    default: 0,
  },
  comments: {
    type: Array,
    default: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  },
  comment_number: {
    type: Number,
    default: 0,
  },
});

const Post = mongoose.model('Post', PostSchema);

export default Post;
