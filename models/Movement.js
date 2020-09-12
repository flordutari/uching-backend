const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ObjectId = Schema.Types.ObjectId;

const movementSchema = new Schema({
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    enum: ['ARS', 'AUD', 'BOB', 'BRL', 'CAD', 'CHF', 'CLP', 'CNY',
    'COP', 'CRC', 'CZK', 'DKK', 'EUR', 'GBP', 'MXN', 'SEK', 'USD']
  },
  category : {
    type: String,
    default: 'Others'
  },
  description: {
    type: String,
    default: '../img/default-profile.png'
  },
  account: {
    type: ObjectId,
    ref: 'Account'
  },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
});

const Movement = mongoose.model('Movement', movementSchema);

module.exports = Movement;