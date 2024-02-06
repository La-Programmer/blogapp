import mongoose from 'mongoose';

const SessionSchema = new mongoose.Schema({
  tokenId: {
    type: String,
    required: true,
  },
  lastActivity: {
    type: Date,
    required: true
  },
});

const Session = mongoose.model('Session', SessionSchema);

export default Session;
