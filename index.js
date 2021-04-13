// The server has been moved to server.js
if (!process.env.YURL_TEST) require('dotenv').config();
require('./server').run(process.env.PORT || 3000, process.env.MONGODB_URL, false);