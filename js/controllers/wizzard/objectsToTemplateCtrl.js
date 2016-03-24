
module.exports = ["$scope", "$http", "template", "$location", "$route"
,function($scope, $http, template, $location, $route) {

	$scope.goToUsers = function(){
		$location.path('/wizzard/users');
	}
	$scope.goToTemplates = function(){
		$location.path('/wizzard/templates');
	}		
	$scope.goToObjectsToTemplate = function(){
		$route.reload();		
	}


	$scope.template = template;	
	$scope.templates = JSON.parse(template.template);



	$scope.addObject = function(){
		console.log('add');
	}

	$scope.addObjectToApRoom = function(roomName){
		console.log(roomName);
	}

	
}];