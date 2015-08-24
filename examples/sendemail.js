var path = require('path');
var nodeMailer = require('../index');
var config = require(path.resolve(__dirname, 'config'));

mailer = new nodeMailer(config.emailDatabase, config.mailConfig);

mailer.send(function(err) {
  console.log('done sending');  
});
