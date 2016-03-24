
module.exports = ["$scope", "$http", "user", "items", "$location", "ObjectFactory"
,function($scope, $http, user, items, $location, ObjectFactory) {

	$scope.items = items;	
	$scope.goToUsers = function(){
		$location.path('/wizzard/users');
	}
	$scope.goToRoomsToHouse = function(){
		$location.path('wizzard/rooms-to-house/'+user.id+'/'+user.type);
	}
	$scope.goToObjectsToRooms = function(){
		$location.path('wizzard/objects-to-rooms/'+user.id+'/'+user.type);
	}
	$scope.goToObjectsToControlls = function(){
		$route.reload();		
	}
	$scope.user = user;
	
	$scope.deleteObject = function(objects, object){	
		ObjectFactory.delete(object.id).then(function(){
			var key = _.findLastIndex(objects, {id:object.id});
			objects.splice(key,1);
		})
	}


}];