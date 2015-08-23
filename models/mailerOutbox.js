var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var outboxSchema = new Schema({
  from: String,
  to: String,
  subject: String,
  text: String,
  html: String,
  attachments: [{
    filename: String,
    path: String
  }],
  created: {
    type: Date
  },
  updated: {
    type: Date
  },
});

outboxSchema.pre('save', function(next) {
  var app = this;

  now = new Date();

  if (!app.created) {
    app.created = now;
  }

  next();
});

module.exports = mongoose.model('Mailer_Outbox', outboxSchema);
