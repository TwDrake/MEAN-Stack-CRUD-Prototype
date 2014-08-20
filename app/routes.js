// app/routes.js //

// load the quote model
var Quote = require('./models/quote_model');
var User = require('./models/user_model')

// expose the routes to our app with module.exports
module.exports = function(app) {
	// api -----------------------------------------------------



	// User ----------------------------------------------------

	// create user
	app.post('/api/users', function(req,res) {
		
		User.create({
			user: req.body.user,
			done: false
		}, function(err,user) {
			if (err){
				return res.status(404).send(err);
			}
			if(user){
			return res.status(200).send(user);		
			}	
		});
		
	});

	// login user
	app.get('/api/users/:user', function(req,res){

		User.findOne({user: req.params.user}, function(err,user) {
			if (err) {
				return res.send(err);
			}
			else if (!user) {
				return res.send('User Not Found');
			}
			else 
				return res.send(user)
		});
	});



	// Quote ---------------------------------------------------

	// get all quotes
	app.get('/api/quotes/:userID', function(req,res){

		// use mongoose to get all quotes in the database
		Quote.find({userID: req.params.userID}, function(err,quotes) {
			if (err) 
				return res.send(err);
			
			return res.send(quotes); // return all quotes in JSON format
		});
	});

	// create quote and send back all quotes after creation
	app.post('/api/quotes', function(req,res){

		// create a quote, information comes from AJAX request from Angular
		Quote.create({
			text            : req.body.text,
			author          : req.body.author,
			userID          : req.body.userID
		}, function(err,quote) {
			if (err)
				return res.send(err);
			Quote.find({userID: req.body.userID}, function(err,quotes) {
				if (err) 
					return res.send(err)
				return res.json(quotes);
			});
		});

	});

	app.post('/api/quotes/:_id', function(req, res) {
		if(req.body.hasOwnProperty('inform')){
			Quote.update(
							
				{_id: req.params._id},
				{$push: {inform: {category: req.body.inform.category}}},

				function(err,data) {
					if (err)
						return res.send(err);
					Quote.find({_id: req.params._id}, function(err,quote) {
						if (err)
							res.send(err)
						return res.json(quote);
					})					
				}						
			);
		}
		else if (req.body.hasOwnProperty('comment')){
			Quote.update(	

				{_id: req.params._id},
				{$push: {comments: {name: req.body.name, comment: req.body.comment}}},

				function(err,data) {
					if (err)
						return res.send(err);
					Quote.find({_id: req.params._id}, function(err,quote) {
						if (err)
							res.send(err)
						return res.json(quote);
					})	
				}
			);
		}
		else {
			return res.send('Error Error')
		}
	});

	// delete a quote
	app.delete('/api/quotes/:_id', function(req,res){
		Quote.remove({
			_id: req.params._id
		}, function(err) {
			if (err) {
				return res.status(404).send(err);
			} else {
			return res.send(200);
			}
		});
	});


	// application --------------------------------------------
	app.get('/',function(req,res){
		res.sendfile('./public/index.html'); // load single view file
	});
}