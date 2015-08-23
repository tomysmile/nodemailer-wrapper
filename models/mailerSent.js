var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var sentSchema = new Schema({
  from: String,
  to: String,
  subject: String,
  text: String,
  html: String,
  attachments: [{
    filename: String,
    path: String
  }],
  status: {
    type: Boolean,
    default: true
  },
  sent: {
    type: Date,
    default: Date.now
  },
  updated: {
    type: Date,
    default: Date.now
  }
});

sentSchema.pre('save', function(next) {
  var app = this;

  now = new Date();
  app.updated = now;

  if (!app.sent) {
    app.sent = now;
  }

  next();
});

module.exports = mongoose.model('Mailer_Sent', sentSchema);
