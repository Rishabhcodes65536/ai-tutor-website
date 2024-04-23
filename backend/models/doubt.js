// models/Doubt.js

import mongoose from "mongoose"

const doubtSchema = new mongoose.Schema({
  student_id: {
    type: String,
    required: true
  },
  question: {
    type: String,
    required: true
  },
  answer: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const Doubt = mongoose.model('Doubt', doubtSchema);

export default Doubt;
