const { Command } = require('commander');
const fs = require('fs');
const program = new Command();

program
	.version('1.0.0')
	.option('-p, --port <port>', 'port to listen on')
	.option('-m, --mongodb <url>', 'MongoDB server to connect to')
	.option('-r, --privacy <path>', 'Path to your privacy policy (privacy.html)')
	.parse();
var opts = program.opts();

if (!opts.port || !opts.mongodb || !opts.privacy) {
	console.log('One of the required options (port, mongodb, privacy) is missing');
	return program.help();
}

// Read the privacy policy (to pass it to the server)
var privacy = fs.readFileSync(opts.privacy);

require('./server.js').run(opts.port, opts.mongodb, true, privacy);
