var should = require("chai").should;
var nodeMailer = require('../index');

var mongodbConfig = 'mongodb://localhost:27017/mailerDemo';

var transportConfig = {
  transportType: 'smtp',
  config: {
    host: 'your-mailserver', // hostname
    secureConnection: false, // TLS requires secureConnection to be false
    port: 587, // port for secure SMTP
    auth: {
      user: 'your-user',
      pass: 'your-password'
    },
    // use up to 20 parallel connections
    maxConnections: 20,
    // do not send more than 10 messages per connection
    maxMessages: 10,
    tls: {
      rejectUnauthorized: false
    }
  }
};

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
      mailer = new nodeMailer(mongodbConfig, transportConfig);
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
