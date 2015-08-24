var should = require("chai").should;
var path = require('path');
var nodeMailer = require('../index');
var config = require(path.resolve(__dirname, 'config'));

var mail1 = {
  from: 'abc@abc.def',    // fix this for actual send
  to: 'my-abc@xyz.net',   // fix this for actual send
  subject: 'hello world',
  text: 'hello world!',
  html: '<b>Hello World! </b>',
  attachments: [{
    filename: 'README.md',
    path: 'https://github.com/tomysmile/nodemailer-wrapper/blob/master/README.md'
  }]
};

var mail2 = {
  from: 'whoami@no-name.net', // fix this for actual send
  to: 'dummy-person@xyz.net', // fix this for actual send
  subject: 'hello world',
  text: 'hello world!',
  html: '<b>Hello World! </b>'
};

var mailer = {};

describe("nodemailer", function() {

  before("initialize test", function() {
    //
  });

  after("destructor", function() {
    //
  });

  describe("constructor checking", function() {

    it("should have at least database configuration", function() {
      mailer = new nodeMailer(config.emailDatabase, config.mailConfig);
    });

  });

  describe("adding and sending email", function() {

    this.timeout(15000);

    it("should saved to database", function(done) {

      mailer.prepareMail(mail1);
      mailer.prepareMail(mail2);

      mailer.saveMails(function(err) {
        console.info('mails have been saved !');
        done();
      });
    });

    it("should sending emails", function(done) {      
      mailer.send(function(err) {
        console.log('done sending');
        done();
      });
    });

  });

});
