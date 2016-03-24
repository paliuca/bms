
module.exports = ["$scope", "ToastService", "$location", "$http", "users","$route", "UserFactory", "HouseFactory", "FloorFactory", "RoomFactory", "ObjectFactory", "$q", "helperObjectService", "ItemFactory"
,function($scope, ToastService, $location, $http, users, $route, UserFactory, HouseFactory, FloorFactory, RoomFactory, ObjectFactory, $q, helperObjectService, ItemFactory) {
	


	$scope.goToRoomsToHouse = function(user){
		$location.path('wizzard/rooms-to-house/'+user.id+'/'+user.type);
	}
	$scope.goToObjectsToRooms = function(user){
		$location.path('wizzard/objects-to-rooms/'+user.id+'/'+user.type);
	}
	$scope.goToObjectsToControlls = function(user){
		$location.path('wizzard/objects-controlls/'+user.id+'/'+user.type);
	}
	$scope.goToTemplates = function(user){
		$location.path('wizzard/templates');
	}
	$scope.goToUsers = function(user){
		$route.reload();
	}	


		
    $scope.types = [
		{key:'ap', value:'Apartment'},
		{key:'house', value:'House'},
		{key:'complex', value:'House complex'}
    ];
    $scope.languages = [
		{key:'en', value:'English'},
		{key:'ro', value:'Romana',},
		{key:'fr', value:'Français'}
    ];	

    $scope.users = users;
    
	$scope.user = {};
    $scope.saveUser = function(form){
    	if(form.$valid){
	        UserFactory.create($scope.user).then(function(response){
	        	$scope.user.id = response;
	        	$scope.users.push($scope.user);
	        	$scope.user = {};
	        })
    	}
    }


    $scope.cloneUser = function(form){
    	if(form.$valid){
    		var cloneAfterId = form.cloneid.$modelValue;
    		var clone = form.userid.$modelValue;
    		ItemFactory.deleteApTree(clone).then(function(){
				ItemFactory.getApTree(cloneAfterId).then(function(response){
					ObjectFactory.createAll(response.objects, clone).then(function(){

						RoomFactory.createAll(response.rooms, clone).then(function(rooms){
							//console.log(rooms);
						})

					})
					/*RoomFactory.createAll(response.rooms, clone).then(function(){

					})*/
			    	/*_.each(response.rooms, function(room){
			    		var newRoom = {}; 
			    		newRoom.user_id = clone;
			    		newRoom.name = room.name;
			    		newRoom.floor_id = room.floor_id;
			    		newRoom.order = room.order;
			    		newRoom.icon_id = room.icon_id;
						RoomFactory.create(newRoom).then(function(room_id){
							_.each(room.objects, function(object){
								var newObject = {};					
								newObject.ModuleItem = object.ModuleItem;
								newObject.ModuleType = object.ModuleType;
								newObject.ItemDescription = object.ItemDescription;
								newObject.category = object.category;
								newObject.template_id = object.template_id;
								newObject.icon_id = object.icon_id;
								newObject.shutter_input = object.shutter_input;
								newObject.shutter_seconds = object.shutter_seconds;
								newObject.dimming_input = object.dimming_input;
								newObject.dimming_ratio = object.dimming_ratio;
								newObject.name = object.name;
								newObject.room_id = room_id;
								newObject.floor_id = 0;
								newObject.house_id = 0;
								newObject.user_id = clone;
								ObjectFactory.create(newObject);
							})
						})	    		
			    	})*/
			    })    			
    		})		    
    	}
    }


	$scope.removeUser = function(user){
		UserFactory.delete(user.id).then(function(){
			var userKey = _.findLastIndex($scope.users, {id: user.id});
			$scope.users.splice(userKey,1);
			ToastService.create('Successfully deleted', 'success');
	    })
	} 

}];