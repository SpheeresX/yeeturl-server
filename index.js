// The server has been moved to server.js
if (!process.env.YURL_TEST) require('dotenv').config();
require('server').run(process.env.PORT, process.env.MONGODB_URL);