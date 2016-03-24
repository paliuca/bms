'use strict';

module.exports = ["$scope", "AuthentificationService", "$location","$window", function($scope, AuthentificationService, $location, $window) {
	
    $scope.login = function(form){
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
    };
}];