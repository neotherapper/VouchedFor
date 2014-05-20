pollingApp.controller('PollsController', function($window, $rootScope, $scope, $state, ipCookie) {
	$scope.polls = [];
	$scope.answeredQuestions = {};

	socket.emit('questionsRequest');

	$scope.refresh = function() {
		socket.emit('questionsRequest');
		$scope.checkAnsweredQuestions();
	}

	$scope.checkAnsweredQuestions = function() {
		var cookieData = ipCookie('answeredPolls');

		if (cookieData) {
			$scope.answeredQuestions = cookieData;
		}
	}

	$scope.isPollAnswered = function(poll) {
		return $scope.answeredQuestions[poll.id] ? true : false;
	}

	$scope.selectAnswer = function(poll, answer) {
		if ($scope.answeredQuestions[poll.id]) {
			return false;
		}
		answer.times++;
		poll.question.times++;
		answer.selected = true;
		$scope.updateCookie(poll);
		socket.emit('pollUpdate', poll);
	}

	$scope.updateCookie = function(poll) {
		var cookie = ipCookie('answeredPolls');
		
		if (cookie && cookie.length > 0) {
			cookie = JSON.parse(cookie);
		}
		else cookie = {};

		cookie[poll.id] = 'answered';

		ipCookie('answeredPolls', JSON.stringify(cookie), {expires: 99});
		$scope.refresh();
	}

	$scope.submitQuestion = function(form) {
		var answer;

		for (answer in form.answers) {
			form.answers[answer].times = 0;
		} 

		socket.emit('newQuestion', {
			'id': $scope.polls.length,
			'question': {
				'text': form.newQuestion,
				'times': 0
			},
			'answers': form.answers
		}); 
	} 

	socket.on('pollUpdateSuccess', function(poll) {
		$scope.refresh();
	});

	socket.on('newQuestionSaved', function(data) {
		$scope.refresh();
		$state.go('admin.viewquestions');
	});

	socket.on('questionsData', function(data) {
		$scope.$apply(function() {
			$scope.polls = [];
			var poll;

			for (poll in data) {
				if (data[poll]) {
					if (data[poll].length > 0) {
						data[poll] = JSON.parse(data[poll]);
						$scope.polls.unshift(data[poll]);
					}
				}
			}
		});
	});

	$scope.checkAnsweredQuestions();
});
