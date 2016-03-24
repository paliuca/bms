'use strict';

module.exports = ["$scope", "AuthentificationService", "$location","$window", function($scope, AuthentificationService, $location, $window) {
	
	$scope.users = ["ap7@newton.direct","ap8@newton.direct","ap9@newton.direct","ap10@newton.direct","ap11@newton.direct","ap12@newton.direct"];
	$scope.loginAs = function(user){
		$scope.credentials = {};
		$scope.credentials.name = user;
		$scope.credentials.password = 'newton';
        AuthentificationService.login($scope.credentials).then(function(){
        	if($scope.credentials.name == 'admin@admin.com'){
        		$location.path('/wizzard/users');  
        	}else{
        		$window.location.href = '#/start';
        	}
        }, function(){
        	$window.location.href = '#/login';
        });
	}
    /*$scope.login = function(form){
    	if(form.$valid){
	        AuthentificationService.login($scope.credentials).then(function(){
	        	if($scope.credentials.name == 'admin@admin.com'){
	        		$location.path('/wizzard/users');  
	        	}else{
	        		$window.location.href = '#/start';
	        	}
	        }, function(){
	        	$window.location.href = '#/login';
	        });
    	}
    };*/
}];