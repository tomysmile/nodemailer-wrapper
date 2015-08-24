module.exports = {    
  "emailDatabase": "mongodb://localhost:27017/demo-mails",  
  "mailConfig": {
    "transportType": "smtp", // choice: gmail, smtp  
    "defaultSender": 'sender@mail',
    "config": {
      host: "mail-hostname", // hostname
      secureConnection: false, // TLS requires secureConnection to be false
      port: 587, // port for secure SMTP
      auth: {
        user: 'user@auth',
        pass: 'auth-pwd'
      },
      maxConnections: 20,
      // do not send more than 10 messages per connection
      maxMessages: 10,
      tls: {
        rejectUnauthorized: false
      }
    }
  }
};
