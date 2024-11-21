const mongoose = require('mongoose');
const faqSchema = new mongoose.Schema({
  question: { 
    type: String, 
    required: true 
  },
  answers: [
    {
      text: { 
        type: String, 
        required: true 
      },
      nextQuestionId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'FAQ', 
        default: null 
      } 
    }
  ],
  parentQuestionId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'FAQ', 
    default: null 
  }, 
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('FAQ', faqSchema);
