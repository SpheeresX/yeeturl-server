"use strict";

/*
 * In case of some Node.js hosting services, it's not required to use dotenv.
 * This will make sure it will be loaded only if it's really needed.
 */
if (!process.env.YURL_TEST) require('dotenv').config();
const Keyv = require('keyv');
const keyv = new Keyv(process.env.MONGODB_URL);
const Express = require('express');
const app = new Express();
const helmet = require('helmet');
const rateLimit = require("express-rate-limit");
const chalk = require('chalk');
const moment = require('moment');
const crypto = require('crypto');
const sharegex = /^([a-f0-9]{64})$/;
const sanitize = require('mongo-sanitize');
const compression = require('compression');

/* Ratelimits */
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
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
app.use(helmet.expectCt());
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

/* Make static files available */
app.use(Express.static(__dirname + "/web"));

/* Sanitize user input. We're doing this on all requests for convenience. */
app.use((req, res, next) => {
  if (req.body) req.body = sanitize(req.body);
  if (req.query) req.query = sanitize(req.query);
  
  next();
});

/* API */
/* This endpoint is used to get the encrypted url from the database. */
app.get('/api/getlink', async (req, res) => {
    log('New request to /api/getlink')
    if (!req.query.id) return res.status(400).send();
    const data = await keyv.get(req.query.id);
    /* If a URL couldn't found in the database, keyv would return "undefined". */
    if (!data) return res.status(404).send();
    res.send(data);
});

/* The endpoint below is used to send the encrypted URL to the database. */
app.post('/api/shorten', async (req, res) => {
    log('New request to /api/shorten');
    if (!req.body.url || !isJSON(req.body.url)) return res.status(400).send();
    /* A fix to the issue where duplicate IDs would be generated, overwriting the previous URL.
     * It keeps on generating an ID and checking if that ID already exists in the DB.
     * It breaks out of the loop if it has been iterating more than 40 times or 
     * the generated ID doesn't exist in the DB, running the rest of the code. 
     */
    var id;
    for (let itc = 0; itc < 40; itc++) {
        id = crypto.randomBytes(3).toString('hex');
        let data = await keyv.get(id);

        if (!data) break;
    }
    await keyv.set(id, req.body.url); //2629746000
    res.status(200).json({
        link: id
    });
});

/* Keep this below all routes. 404 page */
app.use((req, res, next) => {
    res.status(404).sendFile(__dirname + '/web/404.html');
});

/* Start the webserver */
const server = app.listen(Number(process.env.PORT) || 3000, () => log(`Server listening on port ${server.address().port}`));

/* Handle database connection errors */
keyv.on('error', err => log('Connection Error', err));