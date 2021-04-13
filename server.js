"use strict";

exports.run = (port, mongo_url, cli, privacyText) => {
  const mongoose = require('mongoose')
  const Express = require('express');
  const app = new Express();
  const helmet = require('helmet');
  const rateLimit = require("express-rate-limit");
  const chalk = require('chalk');
  const moment = require('moment');
  const sanitize = require('mongo-sanitize');
  const compression = require('compression');

  /* Ratelimits */
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 28,
    message: "You are sending too many requests."
  });

  app.use('/api/', limiter);

  const log = (msg) => console.log(chalk.yellow(`[${moment().format('MMMM Do YYYY h:mm:ss a')}] `) + msg);
  const isJSON = (str) => {
    try {
      JSON.parse(str);
      return true;
    } catch {
      return false;
    }
  }

  /* Security, I guess */
  app.use(helmet.dnsPrefetchControl());
  app.use(helmet.frameguard());
  app.use(helmet.hidePoweredBy());
  app.use(helmet.hsts());
  app.use(helmet.ieNoOpen());
  app.use(helmet.noSniff());
  app.use(helmet.permittedCrossDomainPolicies());
  app.use(helmet.referrerPolicy());
  app.use(helmet.xssFilter());

  /* Compress http responses to decrease data usage & page load time */
  app.use(compression());

  /* The body parser middleware, used to get JSON data from POST requests */
  app.use(Express.json({ limit: '2kb' }));

  /* If we're running as a CLI app, send the privacy policy that we got from cli.js instead of the one in dist/. */
  app.use('/privacy.txt', (req, res, next) => {
    if (cli) {
      res.set('Content-Type', 'text/plain');
      return res.send(privacyText);
    } else {
      next();
    }
  });

  /* Make static files available */
  app.use(Express.static(__dirname + "/dist"));

  /* Sanitize user input. We're doing this on all requests for convenience. */
  app.use((req, res, next) => {
    if (req.body) req.body = sanitize(req.body);
    if (req.query) req.query = sanitize(req.query);

    next();
  });

  /* Connect to the database */

  // load our mongoose models
  const Link = require('./models/Link.js');
  // connect to our database
  mongoose.connect(mongo_url, { useNewUrlParser: true, useUnifiedTopology: true });
  // check if the connection has succeeded or not
  const db = mongoose.connection
  db.once('open', _ => {
    log('Connected to DB');
  });

  db.on('error', err => {
    console.error('DB connection error:', err);
  });

  /* API */
  const routes = require('./routes/routes.js');
  routes.getlinkv1(app, Link, log);
  routes.shortenv1(app, Link, log, isJSON);
  routes.countv1(app, Link, log);

  /* Keep this below all routes. 404 page */
  app.use((req, res, next) => {
    res.status(404).sendFile(__dirname + '/dist/404.html');
  });

  /* Start the webserver */
  const server = app.listen(Number(port), () => log(`Listening on port ${server.address().port}`));
}

if (require.main === module)
  return console.log('Please run index.js instead');