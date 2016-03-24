
module.exports = ["$scope", "$http","ToastService","$location", "user", "items", "ObjectIconService", "$route", "RoomFactory", "FloorFactory", "HouseFactory"
,function($scope, $http, ToastService, $location, user, items, ObjectIconService, $route, RoomFactory, FloorFactory, HouseFactory) {

	$scope.ObjectIconService = ObjectIconService;

	$scope.goToUsers = function(){
		$location.path('/wizzard/users');
	}
	$scope.goToRoomsToHouse = function(){
		$route.reload();
	}
	$scope.goToObjectsToRooms = function(){
		$location.path('wizzard/objects-to-rooms/'+user.id+'/'+user.type);
	}
	$scope.goToObjectsToControlls = function(){
		$location.path('wizzard/objects-controlls/'+user.id+'/'+user.type);
	}
	
	
	$scope.user = user;
	$scope.items = items;


    /*ap*/
    $scope.addApRoom = function(){
    	if($scope.roomName != undefined){
    		$scope.room = {};
    		$scope.room.name = $scope.roomName;
    		$scope.room.user_id = $scope.user.id;
    		$scope.room.icon_id = $scope.roomIcon.id;
    		$scope.room.floor_id = 0;
    		RoomFactory.create($scope.room).then(function(response){
		    	$scope.room.id = response;
    			$scope.items.rooms.push($scope.room);
    			$scope.room = {};
    			$scope.roomIcon = null;
    			$scope.roomName = null;    			
    		})
		}   		
    }

	$scope.deleteApRoom = function(room){
		RoomFactory.delete({'room_id':room.id, 'user_id':$scope.user.id}).then(function(){
			var roomKey = _.findLastIndex($scope.items.rooms, {id: room.id});
			$scope.items.rooms.splice(roomKey,1);
		})	    
	}         
	/*eof ap*/

	/*house*/
    $scope.addHouseFloor = function(){
    	$scope.floor = {};
    	if($scope.floorName != undefined){
    		$scope.floor.name = $scope.floorName;
    		$scope.floor.user_id = $scope.user.id;
			$scope.floor.icon_id = $scope.floorIcon.id;
			FloorFactory.create($scope.floor).then(function(response){				
		    	$scope.floor.id = response;
		    	$scope.floor.rooms = [];
    			$scope.items.floors.push($scope.floor);
    			$scope.floor = {};
    			$scope.floorIcon = null;
    			$scope.floorName = null;
			})		    
    	}
    }

    $scope.deleteHouseFloor = function(floor){
    	FloorFactory.delete({'floor_id':floor.id, 'user_id':$scope.user.id}).then(function(){
			var floorKey = _.findLastIndex($scope.items.floors, {id: floor.id});
			$scope.items.floors.splice(floorKey,1);    		
    	})	    
    }

    $scope.addHouseRoom = function(){
    	$scope.room = {};
    	if($scope.roomName != undefined){
    		$scope.room.name = $scope.roomName;
    		$scope.room.user_id = $scope.user.id;
    		$scope.room.floor_id = $scope.floor.id;
    		$scope.room.icon_id = $scope.roomIcon.id;
    		RoomFactory.create($scope.room).then(function(response){
		    	$scope.room.id = response;
    			var floorKey = _.findLastIndex($scope.items.floors, {id: $scope.floor.id});
    			$scope.items.floors[floorKey].rooms.push($scope.room);
    			$scope.floor = {};
    			$scope.room = {};
    			$scope.roomName = null;
    			$scope.roomIcon = null;
		    })  		
    	}
    }

    $scope.deleteHouseRoom = function(floor, room){
    	RoomFactory.delete({'room_id':room.id, 'user_id':$scope.user.id}).then(function(){
			var floorKey = _.findLastIndex($scope.items.floors, {id: floor.id});
			var roomKey = _.findLastIndex($scope.items.floors[floorKey]['rooms'], {id: room.id});
			$scope.items.floors[floorKey]['rooms'].splice(roomKey,1);
	    })
    }
    /*eof house*/

    /*complex*/
    $scope.addComplexHouse = function(){
    	$scope.house = {};
    	if($scope.houseName != undefined){
    		$scope.house.name = $scope.houseName;
    		$scope.house.user_id = $scope.user.id;
    		$scope.house.icon_id = $scope.houseIcon.id;
            HouseFactory.create($scope.house).then(function(response){	
		    	$scope.house.id = response;
		    	$scope.house.floors = [];
    			$scope.items.houses.push($scope.house);
    			$scope.house = {};
                $scope.houseName = null;
    			$scope.houseIcon = null;
		    })
    	}   	
    }
    $scope.deleteComplexHouse = function(house){
        HouseFactory.delete({'house_id':house.id, 'user_id':$scope.user.id}).then(function(){
			var houseKey = _.findLastIndex($scope.items.houses, {id: house.id});
			$scope.items.houses.splice(houseKey,1);
	    })
    } 
    $scope.addComplexFloor = function(){
    	$scope.floor = {};
    	if($scope.floorName != undefined){
    		$scope.floor.name = $scope.floorName;
    		$scope.floor.user_id = $scope.user.id;
    		$scope.floor.house_id = $scope.house.id;
    		$scope.floor.icon_id = $scope.floorIcon.id;
            FloorFactory.create($scope.floor).then(function(response){
		    	$scope.floor.id = response;
		    	$scope.floor.rooms = [];
    			var houseKey = _.findLastIndex($scope.items.houses, {id: $scope.house.id});
    			$scope.items.houses[houseKey].floors.push($scope.floor);
    			$scope.house = {};
    			$scope.floor = {};
                $scope.floorName = null;
    			$scope.floorIcon = null;
		    })
    	}		
    }
    $scope.deleteComplexFloor = function(house, floor){
        FloorFactory.delete({'floor_id':floor.id, 'user_id':$scope.user.id}).then(function(){
			var houseKey = _.findLastIndex($scope.items.houses, {id: house.id});
			var floorKey = _.findLastIndex($scope.items.houses[houseKey]['floors'], {id: floor.id});
			$scope.items.houses[houseKey]['floors'].splice(floorKey,1); 
	    })
    }
    $scope.addComplexRoom = function(){
    	$scope.room = {};
    	if($scope.roomName != undefined){
    		$scope.room.name = $scope.roomName;
    		$scope.room.user_id = $scope.user.id;
    		$scope.room.floor_id = $scope.floor.id;
    		$scope.room.icon_id = $scope.roomIcon.id;
            RoomFactory.create($scope.room).then(function(response){
		    	$scope.room.id = response;
    			var houseKey = _.findLastIndex($scope.items.houses, {id: $scope.house.id});
    			var floorKey = _.findLastIndex($scope.items.houses[houseKey]['floors'], {id: $scope.floor.id});
    			$scope.items.houses[houseKey].floors[floorKey]['rooms'].push($scope.room);
    			$scope.house = {};
    			$scope.floor = {};
    			$scope.room = {};
                $scope.roomName = null;
    			$scope.roomIcon = null;
		    })
    	}    	
    }
    $scope.deleteComplexRoom = function(house, floor, room){
        RoomFactory.delete({'room_id':room.id, 'user_id':$scope.user.id}).then(function(){
			var houseKey = _.findLastIndex($scope.items.houses, {id: house.id});
			var floorKey = _.findLastIndex($scope.items.houses[houseKey]['floors'], {id: floor.id});
			var roomKey = _.findLastIndex($scope.items.houses[houseKey]['floors'][floorKey]['room'], {id: room.id});   
			$scope.items.houses[houseKey]['floors'][floorKey]['rooms'].splice(roomKey,1); 
	    })
    }
    /*eof complex*/


    
}];