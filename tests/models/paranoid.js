var mongoose = require('mongoose');

var ParanoidSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

ParanoidSchema.pre('save', function (next) {
  return next(new Error('You can\'t do this!'));
});

mongoose.model('Paranoid', ParanoidSchema);