var path = require('path');
var EmailTemplate = require('email-templates').EmailTemplate;
var async = require('async');
var nodeMailer = require('../index');
var config = require(path.resolve(__dirname, 'config'));

var templatesDir = path.resolve(__dirname, 'templates');
var template = new EmailTemplate(path.join(templatesDir, 'verification'));

var mailer = new nodeMailer(config.emailDatabase);

var users = [{
  name: 'demo 1',
  url: 'https://github.com/tomysmile/nodemailer-wrapper',
  urlTitle: 'nodemailer-wrapper',
  mail: {
    from: config.mailConfig.defaultSender, // fix this for actual send
    to: 'abc@def', // fix this for actual send
    subject: 'hello world',
    text: 'hello world!',
    html: '<b>Hello World! </b>'
  }
}, {
  name: 'demo 2',
  url: 'http://google.com',
  urlTitle: 'Google',
  mail: {
    from: config.mailConfig.defaultSender, // fix this for actual send
    to: 'def@abc', // fix this for actual send
    subject: 'hello world',
    text: 'hello world!',
    html: '<b>Hello World! </b>'
  }
}];

async.each(users, function(item, next) {

  console.log('processing template...');

  template.render(item, function(err, results) {
    if (err) return next(err);

    mailer.prepareMail({
      from: item.mail.from,
      to: item.mail.to,
      subject: item.mail.subject,
      html: results.html,
      text: results.text
    }, function(err) {
      next(null);
    });

  });

}, function(err) {
  if (err) {
    console.error(err);
  }

  mailer.saveMails(function(err) {
    console.log('Succesfully save %d messages', users.length);
    mailer.close();
  });

});
