# yeeturl
A rewrite of the simple and 🔒 end-to-end encrypted URL shortener written in Node.js.

## Installation
1. Install the MongoDB server and Node.js
2. Clone this repository
3. Download all third-party libraries; open a terminal, `cd` into the repo you just cloned, and type `npm i`.
4. Copy `env.example` into `.env` and replace all the values in here
5. Write your own privacy policy and terms of service at `web/privacy.txt`. If you are running yeeturl for yourself or just for a couple of friends, you can just remove everything from this file.
6. Run yeeturl with `node index.js` or `npm start`

*It is recommended that you run yeeturl behind a reverse proxy with a [modern HTTPS configuration](https://ssl-config.mozilla.org/).*

## Backups
This is as simple as backing up your MongoDB database - an official guide is published [here](https://docs.mongodb.com/manual/core/backups/).
yeeturl doesn't save any files on your machine; you could even run it with no write access as long as the database does have it, making it easy to restore everything.
Usually, the restore process should be done by restoring your MongoDB database and following the self-hosting steps above.

## To-Do

- [x] Determine if the maximum request body size limit could be decreased (yes, to 2kb)
- [x] Remove code that we believed to provide security but it actually didn't
