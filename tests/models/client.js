var mongoose = require('mongoose');

var ClientSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.ObjectId, ref: 'User', index: { unique: true }, required: true },
  secret: { type: String, required: true },
  redirect_uri: { type: String }
});

// Methods
ClientSchema.methods.getClientByUserId = function (user_id, next) {
  this.findOne({ user_id: user_id }, next);
};

mongoose.model('Client', ClientSchema);

