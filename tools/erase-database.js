const readline = require("readline");
const crypto = require('crypto')
const keypress = async() => {
    process.stdin.setRawMode(true)
    return new Promise(resolve => process.stdin.once('data', data => {
        const byteArray = [...data]
        if (byteArray.length > 0 && byteArray[0] === 3) {
            console.log('^C')
            process.exit(1)
        }
        process.stdin.setRawMode(false)
        resolve()
    }))
};
const rd = crypto.randomBytes(4).toString('hex');

try {
    require('dotenv').config({
        path: '../.env'
    });
} catch {
    console.log('An error has occured while loading the envvars. Make sure you are in the "tools" directory!')
}


(async() => {
    console.log('====== WARNING! ======');
    console.log('THIS SCRIPT WILL ERASE YOUR YEETURL DATABASE. ALL LINKS WILL BE PERMANENTLY REMOVED!');
    console.log('Press any key to clear the database, or type CTRL+C (^C) to exit.')
    await keypress();
    console.log('Are you sure?')
    await keypress();
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.question(`Type "YES ${rd}" to continue: `, async(input) => {
        if (input !== `YES ${rd}`) process.exit(1);
        rl.close();

        console.log('Clearing database...');
        const Keyv = require('keyv');
        const keyv = new Keyv(process.env.MONGODB_URL);
        keyv.on('error', err => {
            console.error('Connection Error', err);
            process.exit(1);
        });
        await keyv.clear();
        console.log('Database has been cleared.');
        process.exit();
    });
})();
