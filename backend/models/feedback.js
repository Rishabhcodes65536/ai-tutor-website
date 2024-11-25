import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  question: {
    type: String,
    required: true
  },
  student_step: {
    type: String,
    default: ''
  },
  student_final: {
    type: String,
    default: ''
  },
  total_marks: {
    type: Number, // Corrected type definition
    default:0
  },
  allocated_marks: {
    type: Number, // Corrected type definition
    default:0
  },
  feedback: { 
    type: Number,
    enum: [+1, 0, -1],
    default: 0
   }
}, {
  timestamps: true 
});

const feedbackModel = mongoose.model('feedback', feedbackSchema);

export default feedbackModel;
