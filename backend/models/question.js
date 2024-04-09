import mongoose from "mongoose"

const questionSchema = new mongoose.Schema({
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    auto: true 
  },
  question_id: {
    type: String,
    required: true,
    unique: true 
  },
  question: {
    type: String,
    required: true
  },
  response: {
    type: String,
    default: ''
  },
  topic: String,
  total_marks: {
    type: Number,
    default: null
  },
  allocated_marks: {
    type: Number,
    default: null
  },
  feedback: String
}, {
  timestamps: true 
});

const questionModel = mongoose.model('Question', questionSchema);

export default questionModel;
