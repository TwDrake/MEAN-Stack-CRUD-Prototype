// app/models/model.js //

var mongoose = require('mongoose');

module.exports = mongoose.model('Quote',{
	text: String,
	author: String,
	comments: [
	{
		name: String,
		comment: String
	}],
	inform: [{dateCreated: {type: Date, default: Date.now}, category: String}],
	userID: String
});

