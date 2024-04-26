import mongoose from "mongoose";

const metacognitionSchema = new mongoose.Schema({
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
    type: Number, // Corrected type definition
  },
  allocated_marks: {
    type: Number, // Corrected type definition
  },
  partial_mark_enabled:{type:Boolean,default:false},
  steps:[{
    order:{
        type:Number,required:true
    },
    solution_step:{
        type:String
    }
  }]
}, {
  timestamps: true 
});

const MetaquestionModel = mongoose.model('Metaquestion', metacognitionSchema);

export default MetaquestionModel;
