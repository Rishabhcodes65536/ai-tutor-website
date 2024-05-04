import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  question: {
    type: String,
    required: true
  },
  student_response: {
    type: String,
    default: ''
  },
  final_answer: {
    type: String,
    default: ''
  },
  topic: String,
  total_marks: {
    type: Number, // Corrected type definition
  },
  allocated_marks: {
    type: Number, // Corrected type definition
  },
  mode: {
    type: String,
    enum: ['answer', 'metacognition'], // Define enum values
    default:'answer' // Optional, specify if the mode field is required
  },
  attempted_at: {
    type: Date,
    default: Date.now
  },
  feedback: { 
    type: String,
    default: ""
  }
}, {
  timestamps: true 
});

const questionModel = mongoose.model('Quest', questionSchema);

export default questionModel;
