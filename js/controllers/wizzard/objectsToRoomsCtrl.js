
module.exports = ["$scope", "$http", "user", "objects","$location", "items", "ObjectFactory", "$route"
,function($scope, $http, user, objects, $location, items, ObjectFactory,$route) {

	
	$scope.goToUsers = function(){
		$location.path('/wizzard/users');
	}
	$scope.goToRoomsToHouse = function(){
		$location.path('wizzard/rooms-to-house/'+user.id+'/'+user.type);
	}
	$scope.goToObjectsToRooms = function(){
		$route.reload();
	}
	$scope.goToObjectsToControlls = function(){		
		$location.path('wizzard/objects-controlls/'+user.id+'/'+user.type);
	}


	$scope.user = user;

	$scope.modules = _.groupBy(objects, function(object){
		return object.HAModuleId;
	});		
	
	$scope.items = items;

	$scope.deleteObject = function(objects, object){	
		ObjectFactory.delete(object.id).then(function(){
			var key = _.findLastIndex(objects, {id:object.id});
			objects.splice(key,1);
		})
	}

}];