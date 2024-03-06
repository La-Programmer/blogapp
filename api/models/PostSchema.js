import mongoose, { mongo } from 'mongoose';

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
    type: [Buffer],
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
  comment_number: {
    type: Number,
    default: 0,
  },
});

const Post = mongoose.model('Post', PostSchema);

export default Post;
