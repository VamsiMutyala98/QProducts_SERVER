const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');

const counterSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    unique: true,
  },
  count: {
    type: Number,
    required: true,
    unique: true,
  },
});

counterSchema.plugin(timestamps);

module.exports = mongoose.model('Counter', counterSchema);