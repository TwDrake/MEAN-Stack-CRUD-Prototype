// public/core.js //

var twQuote = angular.module('twQuote', []);

//------Services--------------------------------------------------------------------------------

twQuote.factory('quoteService', function($http) {
	return {
		   addUser: function(info, callback) {
		   	$http.post('/api/users', info
		   		).success(function (data) {
					return callback(data);
				}).error(function(data) {
					return callback(data);
				});
		}, getQuotes: function(uID, callback) {
			$http.get('/api/quotes/' + uID
				).success(function (data) {
					return callback(data);
				}).error(function(data) {
					return callback(data);
				});
		}, getUser: function(userName, callback) {
			$http.get('/api/users/' + userName
				).success(function(data) {
					return callback(data);
				}).error(function(data) {
					return callback(data);
				});
		}, postQuote: function(info, callback) {
			$http.post('/api/quotes/', info
				).success(function(data) {
					return callback(data);
				}).error(function(data) {
					return callback(data);
				});
		}, postQuotePush: function(id, info, callback) {
			$http.post('/api/quotes/' + id, info
				).success(function(data) {
					return callback(data);
				}).error(function(data) {
					return callback(data);
				});
		}, postComment: function(id, info, callback) {
			$http.post('/api/quotes/' + id, info
				).success(function(data) {
					return callback(data);
				}).error(function(data) {
					return callback(data);
				});
		}, deleteQuote: function(id, callback) {
			$http.delete('/api/quotes/' + id
				).success(function(data) {
					return callback(data);
				}).error(function(data) {
					return callback(data);
				});
		}
	}
});

//-----Controller--------------------------------------------------------------------------------



twQuote.controller('mainController', function($scope, $http, $q, quoteService) {
	$scope.formData    = {};
	$scope.commentData = {};
	$scope.userNew     = {user: ''};
	$scope.userName    = {user: ''};
	$scope.collection  = false;
	$scope.commentForm = [];
	$scope.exists      = [null];
	var userTag;



	// create user on create click
	
	$scope.createUser = function() {
		var userDefer = $q.defer();
		quoteService.addUser($scope.userNew, function(user){
			if(user && user.length) {
				console.log(user);
				$scope.userNew = {};
				userDefer.resolve();
			} else {
				userDefer.reject("Problem creating user");
			}
		});
		return userDefer.promise;
	};

	// retrieve user ID for login click, confirm ID exists

	$scope.logIn = function(userName) {
		var userDefer = $q.defer();
		quoteService.getUser(userName, function(user) {
			if(user) {
				userTag = user._id;
				$scope.formData.userID = userTag;
				userDefer.resolve();
			} else {
				userDefer.reject("Problem getting user");
			}
		});
		userDefer.promise.then(function() {
		var quoteDefer = $q.defer();
		quoteService.getQuotes($scope.formData.userID, function(quotes) {
			if(quotes) {
				$scope.quotes = quotes;
				for(var i=0; i<$scope.quotes.length; i++) {
					if ($scope.quotes[i].comments.length > 0) {
						$scope.exists[i] = true;
					} else {
						$scope.exists[i] = false;
					}
				}
				$scope.collection = true;
				quoteDefer.resolve();
			} else {
				quoteDefer.reject("Problem getting quotes");
			}
		});
		return quoteDefer.promise;
	});
	};

				


	$scope.logOut = function() {
		$scope.userName = {};
		$scope.collection = false;
	};

	$scope.showCommentForm = function(index) {
		$scope.commentForm[index] = true;
	};
	
	// when submitting the add form, send the text to the node api
	$scope.createQuote = function() {
		var quoteDefer = $q.defer();
		quoteService.postQuote($scope.formData, function(resp) {
			if (resp && resp.length) {
				$scope.quotes = resp;
				quoteDefer.resolve();
			} else {
				quoteDefer.reject("Problem posting quote");
			}	
		});
		quoteDefer.promise.then(function() {
		var quotepushDefer = $q.defer();
		quoteService.postQuotePush($scope.quotes[$scope.quotes.length-1]._id, $scope.formData, function(resp) {
			if(resp && resp.length) {
				console.log(resp);
				$scope.quotes[$scope.quotes.length-1] = resp[0];
				$scope.formData = {}; 
				$scope.formData.userID = userTag;
				quotepushDefer.resolve();
			} else {
				quotepushDefer.reject("Problem pushing category")
			}
		});
		return quoteDefer.promise;
	});
	};


	// Create and add quote
	$scope.addComment = function(id, index) {
		var commentDefer = $q.defer();
		quoteService.postComment(id, $scope.commentData, function(resp) {
			if (resp && resp.length) {
				console.log(resp);
				$scope.quotes[index].comments = resp[0].comments;
				$scope.commentData = {};
				$scope.commentForm[index] = false;
				$scope.exists[index] = true;
				commentDefer.resolve();
			} else {
				commentDefer.reject("Problem pushing comment");
			}		
		});
		return commentDefer.promise;
	};


	// delete a quote
	$scope.deleteQuote = function(id) {
		quoteService.deleteQuote(id, function(resp) {
			console.log($scope.formData.userID);
			quoteService.getQuotes($scope.formData.userID, function(resp) {
				console.log(resp);
				$scope.quotes = resp;
				for(var i=0; i<$scope.quotes.length; i++) {
					if ($scope.quotes[i].comments.length > 0) {
						$scope.exists[i] = true;
					} else {
						$scope.exists[i] = false;
					}
				}
				$scope.collection = true;
			});
		});
	};

});

//--------Directives---------------------------------------------------------------------

twQuote.directive('userStatus', function() {
	return {
		restrict: 'E',
		replace: true,
		template: '<span id="status">{{userName.user}} is logged in.</span>'
	}
});
