const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ObjectId = Schema.Types.ObjectId;

const accountSchema = new Schema({
  name: {
    type: String,
    default: 'My account'
  },
  movements: [{
    type: ObjectId,
    ref: 'Movement'
  }],
  owner: [{
    type: ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
});

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;
