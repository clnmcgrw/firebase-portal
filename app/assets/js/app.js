!function(){var e=angular.module("magPortal",["ngAnimate","ui.router","firebase","ngMaterial","ngMessages"]);e.run(["$rootScope","$state",function(e,t){e.$on("$stateChangeError",function(e,r,n,o,u,i){"AUTH_REQUIRED"==i&&t.go("/home")})}]),e.config(["$stateProvider","$urlRouterProvider","$mdThemingProvider","$mdIconProvider",function(e,t,r,n){e.state("home",{url:"/home",controller:"homeCtrl",templateUrl:"views/home.html",resolve:{currentAuth:["Auth",function(e){return e.$waitForSignIn()}]}}).state("account",{url:"/account",controller:"accountCtrl",templateUrl:"views/account.html",resolve:{currentAuth:["Auth",function(e){return e.$requireSignIn()}]}}).state("survey",{url:"/survey",controller:"surveyCtrl",templateUrl:"views/survey.html",resolve:{currentAuth:["Auth",function(e){return e.$requireSignIn()}]}}).state("survey-edit",{url:"/survey-edit",controller:"surveyCtrl",templateUrl:"views/survey-edit.html"}),t.otherwise("/home"),r.theme("default").primaryPalette("teal").accentPalette("deep-orange").warnPalette("pink")}]),e.factory("Auth",["$firebaseAuth",function(e){return e()}]),e.factory("Profile",["$firebaseObject",function(e){return function(t){var r=firebase.database().ref().child("Profiles").child(t);return e(r)}}]),e.factory("DB",["$firebaseObject",function(e){var t=firebase.database().ref();return e(t)}]),e.controller("shellCtrl",["$scope","$state","Auth",function(e,t,r){e.loggedIn=!1,e.isLoading=!1,e.doLogOut=function(){r.$signOut(),e.loggedIn=!1,t.go("home")}}]),e.controller("homeCtrl",["$scope","$state","currentAuth","Auth",function(e,t,r,n){e.user=r,e.signupError=!1,e.signinError=!1,r&&(e.$parent.loggedIn=!0),n.$onAuthStateChanged(function(t){e.user=t,t||(e.$parent.loggedIn=!1)}),e.createUserByEmail=function(){n.$createUserWithEmailAndPassword(e.signupEmail,e.signupPassword).then(function(t){e.user=t})["catch"](function(t){e.signupError=t.message})},e.emailSignIn=function(){n.$signInWithEmailAndPassword(e.signinEmail,e.signinPassword).then(function(t){e.user=t,e.$parent.loggedIn=!0})["catch"](function(t){e.signinError=t.message})},e.socialSignIn=function(t){n.$signInWithPopup(t).then(function(){})["catch"](function(t){e.signinError=t})},e.doLogOut=e.$parent.doLogOut}]),e.controller("accountCtrl",["$scope","currentAuth","Profile","Auth",function(e,t,r,n){e.user=t,t&&(e.$parent.loggedIn=!0),n.$onAuthStateChanged(function(t){e.user=t}),e.profile={type:"super",email:e.user.email},r(t.uid).$bindTo(e,"profile")}]),e.controller("surveyCtrl",["$scope","currentAuth","Auth",function(e,t,r){e.user=t,t&&(e.$parent.loggedIn=!0),r.$onAuthStateChanged(function(t){e.user=t})}])}();
//# sourceMappingURL=app.js.map