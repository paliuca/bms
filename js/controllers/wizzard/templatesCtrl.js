
module.exports = ["$scope", "ToastService", "$location", "$http", "templates","$route","ObjectIconService"
,function($scope, ToastService, $location, $http, templates, $route, ObjectIconService) {
	

	$scope.ObjectIconService = ObjectIconService;
	$scope.goToUsers = function(user){
		$location.path('wizzard/users');
	}
	$scope.goToTemplates = function(){
		$route.reload();
	}
	$scope.goToObjectsToTemplate = function(template){
		$location.path('wizzard/objects-to-template/'+template.id);
	}

    $scope.types = [
		{key:'ap', value:'Apartment'},
		{key:'house', value:'House'},
		{key:'complex', value:'House complex'}
    ];
    $scope.templates = templates;
    $scope.template = {};
    $scope.done = false;
    $scope.saveTemplate = function(form){
    	if(form.$valid){    		
    		var template = {};
    		if($scope.template.type == 'ap'){
    			template.rooms = $scope.rooms;
    			template.objects = [];
    		}
    		if($scope.template.type == 'house'){
    			template.floors = $scope.floors;
    			template.objects = [];
    		}
    		if($scope.template.type == 'complex'){
				template.houses = $scope.houses;
				template.objects = [];
    		}
    		$scope.template.template = JSON.stringify(template);    		
    		if($scope.template.id){
			    $http.put('/api/templates/'+$scope.template.id, {template:$scope.template}).success(function(response){
			    	$route.reload();
			    }).error(function(response){
			        ToastService.create(response, 'danger');
			    })
    		}else{
			    $http.post('/api/templates', {template:$scope.template}).success(function(response){
		        	$scope.template.id = response.id;
		        	$scope.templates.push($scope.template);
		        	$scope.template = {};
		        	$scope.done = false;
			    }).error(function(response){
			        ToastService.create(response, 'danger');
			    })
    		}
    	}    	
    }

	$scope.editTemplate = function(user){
	    $http.get('/api/templates/'+user.id).success(function(response){	    	
			$scope.template = response;
			console.log(response);
			if(response.type == 'ap'){
				$scope.rooms = JSON.parse(response.template).rooms;
			}
			if(response.type == 'house'){
				$scope.floors = JSON.parse(response.template).floors;
			}
			if(response.type == 'complex'){
				$scope.houses = JSON.parse(response.template).houses;
			}
	    }).error(function(response){
	        ToastService.create(response, 'danger');
	    })
	}

	$scope.removeTemplate = function(template){
	    $http.delete('/api/templates/'+template.id).success(function(response){
			var templateKey = _.findLastIndex($scope.templates, {id: template.id});
			$scope.templates.splice(templateKey,1);
			ToastService.create('Successfully deleted', 'success');
	    }).error(function(response){
	        ToastService.create(response, 'danger');
	    })
	} 
    

	$scope.rooms = [];
    $scope.addApRoom = function(){
    	if($scope.roomName != undefined){
    		var roomKey = _.findLastIndex($scope.rooms, {name: $scope.roomName});
    		if(roomKey == '-1'){
	    		$scope.room = {};
	    		$scope.room.name = $scope.roomName;
	    		$scope.room.icon_id = $scope.roomIcon.id;
	    		$scope.room.objects = [];
				$scope.rooms.push($scope.room);
				$scope.room = {};
				$scope.roomName = null;
				$scope.roomIcon = null;
    		}else{
    			ToastService.create("Room already exists", 'danger');
    		}
		}
    }
	$scope.deleteApRoom = function(room){
		var roomKey = _.findLastIndex($scope.rooms, {name: room.name});
		$scope.rooms.splice(roomKey,1);
	}


	$scope.floors = [];
    $scope.addHouseFloor = function(){
    	$scope.floor = {};
    	if($scope.floorName != undefined){
    		var floorKey = _.findLastIndex($scope.floors, {name: $scope.floorName});
    		if(floorKey == '-1'){
	    		$scope.floor.name = $scope.floorName;
	    		$scope.floor.icon_id = $scope.floorIcon.id;
	    		$scope.floor.objects = [];
		    	$scope.floor.rooms = [];
				$scope.floors.push($scope.floor);
				$scope.floor = {};
				$scope.floorName = null;
				$scope.floorIcon = null;
    		}else{
				ToastService.create("Floor already exists", 'danger');
    		}
    	}	    	
    }
    $scope.deleteHouseFloor = function(floor){
		var floorKey = _.findLastIndex($scope.floors, {name: floor.name});
		$scope.floors.splice(floorKey,1);
    }
    $scope.addHouseRoom = function(){
    	$scope.room = {};
    	if($scope.roomName != undefined){
			var floorKey = _.findLastIndex($scope.floors, {name: $scope.floor.name});
			var roomKey = _.findLastIndex($scope.floors[floorKey]['rooms'], {name: $scope.roomName});
			if(roomKey == '-1'){
	    		$scope.room.name = $scope.roomName;
	    		$scope.room.icon_id = $scope.roomIcon.id;
	    		$scope.room.objects = [];
				var floorKey = _.findLastIndex($scope.floors, {name: $scope.floor.name});
				$scope.floors[floorKey].rooms.push($scope.room);
				$scope.floor = {};
				$scope.room = {};
				$scope.roomName = null;
				$scope.roomIcon = null;
			}else{
				ToastService.create("Room already exists", 'danger');
			}
    	}
    }
    $scope.deleteHouseRoom = function(floor, room){
		var floorKey = _.findLastIndex($scope.floors, {name: floor.name});
		var roomKey = _.findLastIndex($scope.floors[floorKey]['rooms'], {name: room.name});
		$scope.floors[floorKey]['rooms'].splice(roomKey,1);
    }
 

	$scope.houses = [];
    $scope.addComplexHouse = function(){
    	$scope.house = {};
    	if($scope.houseName != undefined){
    		var houseKey = _.findLastIndex($scope.houses, {name: $scope.houseName});
    		if(houseKey == '-1'){
	    		$scope.house.name = $scope.houseName;
	    		$scope.house.icon_id = $scope.houseIcon.id;
		    	$scope.house.floors = [];
		    	$scope.house.objects = [];
				$scope.houses.push($scope.house);
				$scope.house = {};
				$scope.houseName = null;
				$scope.houseIcon = null;    			
    		}else{
    			ToastService.create("House already exists", 'danger');
    		}
    	}   	
    }
    $scope.deleteComplexHouse = function(house){
		var houseKey = _.findLastIndex($scope.houses, {name: house.name});
		$scope.houses.splice(houseKey,1);
    } 
    $scope.addComplexFloor = function(){
    	$scope.floor = {};
    	if($scope.floorName != undefined){
			var houseKey = _.findLastIndex($scope.houses, {name: $scope.house.name});
			var floorKey = _.findLastIndex($scope.houses[houseKey]['floors'], {name: $scope.floorName});
			if(floorKey == '-1'){
	    		$scope.floor.name = $scope.floorName;
	    		$scope.floor.icon_id = $scope.floorIcon.id;
		    	$scope.floor.rooms = [];
	    		$scope.floor.objects = [];		   
				var houseKey = _.findLastIndex($scope.houses, {name: $scope.house.name});
				$scope.houses[houseKey].floors.push($scope.floor);
				$scope.house = {};
				$scope.floor = {};
				$scope.floorName = null;
				$scope.floorIcon = null;				
			}else{
				ToastService.create("Floor already exists", 'danger');
			}
    	}		
    }
    $scope.deleteComplexFloor = function(house, floor){
		var houseKey = _.findLastIndex($scope.houses, {name: house.name});
		var floorKey = _.findLastIndex($scope.houses[houseKey]['floors'], {name: floor.name});
		$scope.houses[houseKey]['floors'].splice(floorKey,1); 
    }
    $scope.addComplexRoom = function(){
    	$scope.room = {};
    	if($scope.roomName != undefined){

			var houseKey = _.findLastIndex($scope.houses, {name: $scope.house.name});
			var floorKey = _.findLastIndex($scope.houses[houseKey]['floors'], {name: $scope.floor.name});
			var roomKey = _.findLastIndex($scope.houses[houseKey]['floors'][floorKey]['rooms'], {name: $scope.roomName});
			if(roomKey == '-1'){
	    		$scope.room.name = $scope.roomName;
	    		$scope.room.icon_id = $scope.roomIcon.id;
	    		$scope.room.objects = [];
				var houseKey = _.findLastIndex($scope.houses, {name: $scope.house.name});
				var floorKey = _.findLastIndex($scope.houses[houseKey]['floors'], {name: $scope.floor.name});
				$scope.houses[houseKey].floors[floorKey]['rooms'].push($scope.room);
				$scope.house = {};
				$scope.floor = {};
				$scope.room = {};
				$scope.roomName = null;	    	
				$scope.roomIcon = null;				
			}else{
				ToastService.create("Room already exists", 'danger');
			}
		}    	
    }
    $scope.deleteComplexRoom = function(house, floor, room){
		var houseKey = _.findLastIndex($scope.houses, {name: house.name});
		var floorKey = _.findLastIndex($scope.houses[houseKey]['floors'], {name: floor.name});
		var roomKey = _.findLastIndex($scope.houses[houseKey]['floors'][floorKey]['room'], {name: room.name});   
		$scope.houses[houseKey]['floors'][floorKey]['rooms'].splice(roomKey,1); 
    }


}];