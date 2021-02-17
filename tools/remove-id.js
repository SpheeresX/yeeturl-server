const readline = require("readline");
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
const keyv = new Keyv(process.env.MONGODB_URL);
keyv.on('error', err => {
    console.error('Connection Error', err);
    process.exit(1);
});


rl.question(`Which ID do you want to remove (https://yeeturl.example.com/#<ID>/<password>)? `, async(input) => {
    rl.close();
    console.log('Removing ID...');

    const deleted = await keyv.delete(input); // => true
    if (deleted) {
        console.log('ID removed successfully.');
        process.exit(0);
    } else {
        console.log('This ID does not exist.');
        process.exit(1);
    }
});
