const readline = require("readline");
const mongoose = require('mongoose')
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const crypto = require('crypto');
const Keyv = require('keyv');

try {
    require('dotenv').config({
        path: '../.env'
    });
} catch {
    console.log('An error has occured while loading the envvars. Make sure you are in the "tools" directory!')
}


console.log('Connecting to database...');
// load our mongoose models
const Link = require('../models/Link.js');
// connect to our database
mongoose.connect(mongo_url, { useNewUrlParser: true, useUnifiedTopology: true });
// check if the connection has succeeded or not
const db = mongoose.connection
db.once('open', _ => {
    console.log('Connected to DB');
});

db.on('error', err => {
    console.error('DB connection error:', err);
    process.exit(1);
});

rl.question(`What ID do you want to remove (https://yeeturl.example.com/#<ID>/<password>)? `, async (input) => {
    rl.close();
    console.log('Removing ID...');

    Link.deleteOne({id: input}, (e) => {
        if (e) {
            console.error('Error:', e);
            process.exit(1);
        };
        console.log('ID deleted');
    })
});
