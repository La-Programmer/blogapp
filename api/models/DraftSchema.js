import mongoose from 'mongoose';

const DraftSchema = new mongoose.Schema({
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
});

const Draft = mongoose.model('Draft', DraftSchema);

export default Draft;
