;(function() { 

	var app = angular.module('magPortal', ['ngAnimate','ui.router','firebase','ngMaterial','ngMessages']);


	app.run(['$rootScope', '$state', function($rootScope, $state) {
		
		//redirect logged out users
		$rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
			if (error == 'AUTH_REQUIRED') {
				$state.go('/home');
			}
		});

	}]);


	//App Config
	//-------------------------------------------------------//
	app.config(['$stateProvider', '$urlRouterProvider', '$mdThemingProvider', '$mdIconProvider', function($stateProvider, $urlRouterProvider, $mdThemingProvider, $mdIconProvider) {
		
		//Routes
		$stateProvider.state('home', {
			url: '/home',
			controller: 'homeCtrl',
			templateUrl: 'views/home.html',
			resolve: {
				'currentAuth': ['Auth', function(Auth) {
					return Auth.$waitForSignIn();
				}]
			}
		}).state('account', {
			url: '/account',
			controller: 'accountCtrl',
			templateUrl: 'views/account.html',
			resolve: {
				'currentAuth': ['Auth', function(Auth) {
					return Auth.$requireSignIn();
				}]
			}
		}).state('survey', {
			url: '/survey',
			controller: 'surveyCtrl',
			templateUrl: 'views/survey.html',
			resolve: {
				'currentAuth': ['Auth', function(Auth) {
					return Auth.$requireSignIn();
				}]
			}
		}).state('survey-edit', {
			url: '/survey-edit',
			controller: 'surveyCtrl',
			templateUrl: 'views/survey-edit.html'
		});
		$urlRouterProvider.otherwise('/home');

		//theme colors
		$mdThemingProvider.theme('default').primaryPalette('teal').accentPalette('deep-orange').warnPalette('pink');
	}]);



	//factories around firebase modules
	app.factory('Auth', ['$firebaseAuth', function($firebaseAuth) {
	  return $firebaseAuth();
	}]);
	app.factory('Profile', ['$firebaseObject', function($firebaseObject) {
		return function(uid) {
			var ref = firebase.database().ref().child('Profiles').child(uid);
			return $firebaseObject(ref);
		};
	}]);
	app.factory('DB', ['$firebaseObject', function($firebaseObject) {
		var ref = firebase.database().ref();
		return $firebaseObject(ref);
	}]);



	//Shell Controller - header, footer, overlay, etc
	app.controller('shellCtrl', ['$scope', '$state', 'Auth', function($scope, $state, Auth) {
		$scope.loggedIn = false;
		$scope.isLoading = false;

		$scope.doLogOut = function() {
			Auth.$signOut();
			$scope.loggedIn = false;
			$state.go('home');
		};
	}]);



	//Home Controller - shows signup/in, or default dash for signed-in user
	//----------------------------------------------------------------------------//
	app.controller('homeCtrl', ['$scope', '$state', 'currentAuth', 'Auth', function($scope, $state, currentAuth, Auth) {

		$scope.user = currentAuth;
		
		$scope.signupError = false;
		$scope.signinError = false;

		if (currentAuth) {
			$scope.$parent.loggedIn = true;
		} 

		Auth.$onAuthStateChanged(function(firebaseUser) {
			$scope.user = firebaseUser;
			if (!firebaseUser) {
				$scope.$parent.loggedIn = false;
			}
		});

		
		$scope.createUserByEmail = function() {
			Auth.$createUserWithEmailAndPassword($scope.signupEmail, $scope.signupPassword)
				.then(function(firebaseUser) {
					$scope.user = firebaseUser;
				}).catch(function(error) {	
					$scope.signupError = error.message;
				});
		};

		$scope.emailSignIn = function() {
			Auth.$signInWithEmailAndPassword($scope.signinEmail, $scope.signinPassword)
				.then(function(firebaseUser) {
					$scope.user = firebaseUser;
					$scope.$parent.loggedIn = true;
				}).catch(function(error) {
					$scope.signinError = error.message;
				});
		};

		$scope.socialSignIn = function(provider) {
			Auth.$signInWithPopup(provider).then(function() {
			}).catch(function(error) {
				$scope.signinError = error;
			});
		};

		$scope.doLogOut = $scope.$parent.doLogOut;
	}]);




	//Account Controller -
	//----------------------------------------------------------------//
	app.controller('accountCtrl', ['$scope', 'currentAuth', 'Profile', 'Auth', function($scope, currentAuth, Profile, Auth) {

		$scope.user = currentAuth;

		if (currentAuth) {
			$scope.$parent.loggedIn = true;
		}

		Auth.$onAuthStateChanged(function(firebaseUser) {
			$scope.user = firebaseUser;
		});

		$scope.profile = {
			type: 'super',
			email: $scope.user.email
		};

		//syncs data 3 way
		Profile(currentAuth.uid).$bindTo($scope, "profile");
		
	}]);



	//Survey Controller -
	//----------------------------------------------------------------//
	app.controller('surveyCtrl', ['$scope', 'currentAuth', 'Auth', function($scope, currentAuth, Auth) {

		$scope.user = currentAuth;

		if (currentAuth) {
			$scope.$parent.loggedIn = true;
		}

		Auth.$onAuthStateChanged(function(firebaseUser) {
			$scope.user = firebaseUser;
		});


	}]);


})();