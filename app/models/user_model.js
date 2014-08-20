
var mongoose = require('mongoose');

module.exports = mongoose.model('User', {
	user: { type: String, unique: true, required: true },
	done: Boolean
});