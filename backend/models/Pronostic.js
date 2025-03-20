const mongoose = require('mongoose');

const pronosticSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  competition: {
    type: String,
    required: true,
  },
  days: [{
    day: {
      type: Number,
      required: true,
      enum: [1, 2, 3, 4, 5, 6, 7, 8], 
    },
    categories: {
      menCategory: {
        type: String,
        required: function() { return this.day <= 7; }, 
      },
      womenCategory: {
        type: String,
        required: function() { return this.day <= 7; }, 
      },
    },
    predictions: [{
      place: { type: String, enum: ["1st", "2nd", "3rd1", "3rd2"], required: true },
      name: { type: String, required: true },
      type: { type: String, enum: ["men", "women", "team"], required: true } 
    }]
  }],
}, { timestamps: true });

const Pronostic = mongoose.model('Pronostic', pronosticSchema);

module.exports = Pronostic;
