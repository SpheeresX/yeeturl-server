const { Command } = require('commander');
const program = new Command();

program
	.version('1.0.0')
	.option('-p, --port <port>', 'port to listen on')
	.option('-m, --mongodb <url>', 'MongoDB server to connect to')
	.parse();
var opts = program.opts();

require('./server.js').run(opts.port, opts.mongodb);