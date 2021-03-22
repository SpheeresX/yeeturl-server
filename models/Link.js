const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Link = new Schema({
	id: {
		type: String,
		unique: true,
		required: true
	},
	data: {
		type: String,
		unique: false,
		required: true
	}
});

module.exports = mongoose.model('Link', Link);