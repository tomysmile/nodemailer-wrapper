# NodeMailer-Wrapper

Nodemailer-Wrapper is a utility module which provides a wrapper for NodeMailer [NodeMailer](https://github.com/andris9/Nodemailer) that uses MongoDB as the email storage. This utility is designed to run asynchronously as a batch file or cron worker, I suggest to use [Node-Cron](https://github.com/ncb000gt/node-cron) which runs perfectly with this. This module designed for
use with [Node.js](http://nodejs.org) and installable via `npm install nodemailer-wrapper`,

Usage (basic):
==========

```javascript
var nodeMailer = require('nodemailer-wrapper');

var transportConfig = {
  transportType: 'smtp',
  config: {
    host: 'your-mail-server-host', // hostname
    secureConnection: false, // TLS requires secureConnection to be false
    port: 587, // port for secure SMTP
    auth: {
      user: 'your-username@mail-server',
      pass: 'your-password'
    },
    // use up to 20 parallel connections
    maxConnections: 20,
    // do not send more than 10 messages per connection
    maxMessages: 10,
    tls: {
      rejectUnauthorized: false // for non-authorized mail server
    }
  }
};

// use your mongodb address
var mongodbConfig = 'mongodb://localhost:27017/mailerDemo';
var mailer = new nodeMailer(transportConfig, mongodbConfig);

var mail1 = {
  from: 'your-mail@mail-server',
  to: 'target-mail@mail-server',
  subject: 'hello world',
  text: 'hello world!',
  html: '<b>Hello World! </b>'
  attachments: [{ 
    filename: 'README.md',
    path: './demo.txt'
  }]
};

var mail2 = {
  from: 'your-mail@mail-server',
  to: 'target-mail-2@mail-server',
  subject: 'hello world',
  text: 'hello world!',
  html: '<b>Hello World! </b>'
  attachments: [{ 
    filename: 'README.md',
    path: './demo.txt'
  }]
};

mailer.prepareMail(mail1);
mailer.prepareMail(mail2);
mailer.prepareMail(mail3);

mailer.saveMails(function(err) {
  console.info('mails have been saved !');

  mailer.send(function(err) {
    if (err) console.log(err);
  });
});
```

License
==========

MIT


