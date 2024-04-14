import mongoose from "mongoose"

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
  topic: String,
  total_marks: {
    type: Number,
    default: null
  },
  allocated_marks: {
    type: Number,
    default: null
  },
  feedback:{ 
    type:String,
    default:""
    }
}, {
  timestamps: true 
});

const questionModel = mongoose.model('Quest', questionSchema);

export default questionModel;
