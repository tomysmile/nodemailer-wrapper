"use strict";

var util = require("util");
var EventEmitter = require("events").EventEmitter;
var nodemailer = require('nodemailer');
var smtpPool = require('nodemailer-smtp-pool');
var mongoose = require('mongoose');
var EmailOutbox = require('./models/mailerOutbox');
var EmailSent = require('./models/mailerSent');
var async = require('async');
var _ = require('lodash');

var Mailer = function(databaseConfig, transportConfig) {

  var self = this;
  var transporter;
  var addedMails = [];
  var localEmitter = new EventEmitter();
  var shouldCloseDatabase = false;

  function Mailer() {
    EventEmitter.call(this);
  };

  var noop = function() {};

  var wireEvents = function() {

    // If the Node process ends, close the Mongoose connection 
    process.on('SIGINT', function() {
      mongoose.connection.close(function() {
        console.log('Mongoose default connection disconnected through app termination', 'error');
        process.exit(0);
      });
    });

    mongoose.connection.on('open', function(ref) {
      console.log('Succeeded connected to: ' + databaseConfig);
    });

    mongoose.connection.on('error', function(err) {
      console.log('ERROR connecting to: %s %s', databaseConfig, err);
    });

    // When the connection is disconnected
    mongoose.connection.on('disconnected', function() {
      console.log('Mongoose default connection disconnected');
    });

  };

  var init = function() {

    if (!databaseConfig) {
      throw new Error("database configuration is missing !");
    }

    // connect to DB
    mongoose.connect(databaseConfig);

    // initialize transporter
    if (transportConfig) {
      var mailConfig = transportConfig.config;

      if (transportConfig.transportType === 'smtp') {
        transporter = nodemailer.createTransport(smtpPool(mailConfig));
      } else {
        transporter = nodemailer.createTransport(mailConfig);
      }
    }

    // trigger onInit
    self.emit('onInit');
  };

  var getConfig = function() {
    var config = {
      mailerConfig: transportConfig,
      dbConnectionString: databaseConfig
    };

    return config;
  };

  var prepareMail = function(mailData, callback) {
    // Make sure a callback is defined.
    callback = (callback || noop);

    if (mailData) {
      addedMails.push(mailData);
    }

    callback(addedMails);

    // Return this object reference to allow for method chaining.
    return (this);
  };

  var getPreparedMails = function() {
    return addedMails;
  };

  var savePreparedMails = function(callback) {
    if (addedMails.length) {

      EmailOutbox.collection.insert(addedMails, function(err) {
        if (err) {
          callback(err);
        }

        // clear array
        addedMails.length = 0;
        callback(null);
      });
    } else {
      callback(null);
    }

    return (this);
  };

  var sendMails = function(callback) {
    callback = (callback || noop);

    var counter = 0;
    var sentMails = [];
    var successIDMails = [];
    var falseIDMails = [];
    var sendCounter = 0;

    async.waterfall([
      function(callback) {
        EmailOutbox.find({}, function(err, emails) {
          if (err) return callback(err);
          callback(null, emails);
        });
      },
      function(emails, callback) {
        _.each(emails, function(email) {
          if (transporter) {
            transporter.sendMail(email, function(err, info) {
              sendCounter++;

              console.log(info.response);

              callback(null, email);
            });
          }
        });
      },
      function(email, callback) {

        var sentMail = new EmailSent();
        sentMail.from = email.from;
        sentMail.to = email.to;
        sentMail.subject = email.subject;
        sentMail.text = email.text;
        sentMail.html = email.html;
        sentMail.status = true;
        sentMail.attachments = email.attachments;
        sentMail.sent = new Date();

        sentMail.save(function(err) {
          callback(null, email);
        });
      },
      function(outboxEmail, callback) {

        var id = outboxEmail._id;
        EmailOutbox.findByIdAndRemove(id, function(err, user) {
          if (err) {
            console.log(err);
            return callback(err);
          }

          callback();
        });
      }

    ], function(err) {
      if (err) return callback(err);

      self.emit('onCompleted');

      // call the caller
      callback();
    });
  };

  var close = function(callback) {
    mongoose.connection.close(function() {
      process.exit(0);
      callback();
    });
  };

  wireEvents();
  init();

  return {
    getConfig: getConfig,
    prepareMail: prepareMail,
    getPreparedMails: getPreparedMails,
    saveMails: savePreparedMails,
    send: sendMails,
    close: close
  }
};

// extend the EventEmitter class
util.inherits(Mailer, EventEmitter);
module.exports = Mailer;
