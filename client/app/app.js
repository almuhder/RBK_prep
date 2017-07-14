angular.module('prep',[
	'prep.signin',
	'prep.contents',
	'prep.weeks',
	'prep.calendar',
	'prep.services',
	'ngRoute'
])
.config(function ($routeProvider, $httpProvider ,$locationProvider, $sceDelegateProvider ,hljsServiceProvider){
    $locationProvider.hashPrefix('');
 	$locationProvider.html5Mode(true);

	//code to configure code syntax highlighter options .
	hljsServiceProvider.setOptions({
    	// replace tab with 4 spaces
    	tabReplace: '    '
  	});
	hljs.initHighlighting();
		  
	//this code is to fix Blocked loading resource 'which is the iframe slides' from url not allowed by $sceDelegate policy.
	$sceDelegateProvider.resourceUrlWhitelist([
		// Allow same origin resource loads.
		'self',
		// Allow loading from our assets domain. **.
		'https://docs.google.com/**'
	]);
	
	$routeProvider
	.when('/',{
		templateUrl: 'app/auth/signin.html',
		controller: 'SigninController'
	})
	.when('/signin',{
		templateUrl: 'app/auth/signin.html',
		controller: 'SigninController'
	})
	.when('/calendar',{
		templateUrl : 'app/calendar/calendar.html',
		controller : 'CalendarController'
	})
	.when('/chromeConsole',{
		templateUrl : 'app/other/ChromeConsole.html'
	})
	.when('/sublimeText',{
		templateUrl : 'app/other/SublimeText.html'
	})
	.when('/:lecture',{
		templateUrl : 'app/contents/contents.html',
		controller : 'ContentsController'
	})

	.otherwise({
      redirectTo: '/'
    });
})
.factory('AttachTokens', function ($window) {
	var attach = {
		request: function (object) {
		var jwt = $window.localStorage.getItem('rbk.prep');
		if (jwt) {
			object.headers['x-access-token'] = jwt;
		}
		object.headers['Allow-Control-Allow-Origin'] = '*';
		return object;
		}
	};
	return attach;
})
.run(['$route', '$rootScope', '$location' ,'Auth', function ($route, $rootScope, $location, Auth) {
	
	//code to check user authentication    
	$rootScope.$on('$routeChangeStart', function (evt, next, current) {
		if (next.$$route && !Auth.isAuth()) {
			$location.path('/signin');
		}
 	});

	//code to change url name
	var original = $location.path;
    $location.path = function (path, reload) {
        if (reload === false) {
            var lastRoute = $route.current;
            var un = $rootScope.$on('$locationChangeSuccess', function () {
                $route.current = lastRoute;
                un();
            });
        }
        return original.apply($location, [path]);
    };
}])