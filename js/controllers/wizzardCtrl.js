
module.exports = ["$scope", "UsersQueryService", "HouseQueryService", "FloorQueryService", "RoomQueryService", "ObjectQueryService", "CookiesService", "ToastService", "$location", "ObjectTemplateService", "$window", "AuthentificationService", "$route", "$q", "$http"
,function($scope, UsersQueryService, HouseQueryService, FloorQueryService, RoomQueryService, ObjectQueryService, CookiesService, ToastService, $location, ObjectTemplateService, $window, AuthentificationService, $route, $q, $http) {


	
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
        

    $scope.mainConfig = {
    	handle: ".drag-handle",
        group: 'bar'
	}

    $scope.goToStep = function(step){
    	switch(step){
    		case 0:
    			UsersQueryService.all().then(function(response){
    				$scope.users = response;
    				console.log($scope.users);
    			})
				$scope.stepZero = true;
				$scope.stepOne = false;
				$scope.stepTwo = false;
				$scope.stepThree = false;
    		break;    		
    		case 1:
				if($scope.type){
			        var key = _.findLastIndex($scope.types, {
			            key: $scope.type
			        });
					$scope.selectedType = $scope.types[key];
				}
				if($scope.language){
			        var key = _.findLastIndex($scope.languages, {
			            key: $scope.language
			        });
			        $scope.selectedLanguage = $scope.languages[key];
				}
				$scope.stepZero = false;
			    $scope.stepOne = true;
			    $scope.stepTwo = false;
			    $scope.stepThree = false;
    		break;
    		case 2:
				$scope.configTree($scope.type);
				$scope.stepZero = false;
				$scope.stepOne = false;
				$scope.stepTwo = true;
				$scope.stepThree = false;
    		break;
    		case 3:
				$scope.configTree($scope.type);
				$scope.stepZero = false;
				$scope.stepOne = false;
				$scope.stepTwo = false;
				$scope.stepThree = true;
			
				ObjectQueryService.dbObjects().then(function(response){
					var objects = response;
		    		ObjectQueryService.all().then(function(saveObjects){
		    			_.each(saveObjects, function(object){
		    				if(object){
			    				var foundObject = _.where(objects, {BMSID:object.BMSID});
			    				if(foundObject.length){
							        var key = _.findLastIndex(objects, {
							            BMSID: foundObject[0].BMSID
							        });
							        objects.splice(key,1);			    					
			    				}
		    				}
		    			})
						$scope.modules = _.groupBy(objects, function(object){        
							return object.HAModuleName;
						});
		    			//console.log($scope.objects);
		    		})
				}, function(){
					console.log('no connection');
				})
    		break;
    	}
    }

    $scope.configTree = function(type){
		$scope.houses = [];
		$scope.floors = [];
		$scope.rooms = [];    	
    	switch(type){
    		case 'ap':
    			$scope.rooms = [];
				RoomQueryService.findByFloorId().then(function(rooms){
					_.each(rooms, function(room){
						room.eachConfig = {
							handle: ".drag-handle",
							group: 'bar',
							onAdd: function (evt){
								ObjectQueryService.insert(evt.model, room.id).then(function(response){
								})
							},
							onRemove: function (evt){
								ObjectQueryService.delete(evt.model.BMSID).then(function(response){
								})
						    }
						};
						room.objects = [];
						$scope.rooms.push(room);
						$scope.addObjects(room);
					})
				})
    		break;
    		case 'house':
    			$scope.floors = [];	
				FloorQueryService.findByHouseId().then(function(floors){
					_.each(floors, function(floor){
						floor.rooms = [];
						$scope.floors.push(floor);
						$scope.addRooms(floor);
					})
				});
    		break;
    		case 'complex':
    			$scope.houses = [];
    			HouseQueryService.all().then(function(response){
    				var houses = response;
					_.each(houses, function(house){
						house.floors = [];
						$scope.houses.push(house);
						$scope.addFloors(house);
					})
    			})
    		break;
    	}
    }

	$scope.type = CookiesService.get('type');
	$scope.language = CookiesService.get('language');


    $scope.goToApp = function(){
    	$window.location.href = '#/start';
    }

    $scope.saveDB = function(){
		$q.all([
		   HouseQueryService.all(),
		   FloorQueryService.all(),
		   RoomQueryService.all(),
		   ObjectQueryService.all()
		]).then(function(data) {
			var db = {};
			db['houses'] = data[0];
			db['floors'] = data[1];
			db['rooms'] = data[2];
			db['objects'] = data[3];
			db['type'] = $scope.type;
			db['language'] = $scope.language;
	        $http.post('/api/saveDb', {'user':'user@user.com', 'db':JSON.stringify(db)}).success(function(response){
				console.log(response);
	        }).error(function(response){
	            console.log(response);
	        })
    	})

    }

	$scope.goToStep(0);
	if($scope.type){
	}else{
		$scope.goToStep(3);
	}

	$scope.clearDbObjects = function(){
		ObjectQueryService.dbObjectsClear().then(function(response){
			$window.location.reload();
		})
	}

	$scope.logout = function(){
		AuthentificationService.logout();		
	}

	$scope.deleteObjectFromRoom = function(object){
		ObjectQueryService.delete(object.BMSID).then(function(response){
			$route.reload();
		})
	}


    $scope.saveConfig = function(form){
    	if(form.$valid){
    		var deleteDB = false;
    		if($scope.type && ($scope.type != $scope.selectedType.key)){
    			deleteDB = true;
    		}
    		$scope.type = CookiesService.put('type', $scope.selectedType.key);
    		$scope.language = CookiesService.put('language', $scope.selectedLanguage.key);
    		if(deleteDB){
				$q.all([
				   HouseQueryService.clear(),
				   FloorQueryService.clear(),
				   RoomQueryService.clear(),
				   ObjectQueryService.clear()
				]).then(function(data) {
				   $scope.goToStep(2);
				});
    		}else{
    			$scope.goToStep(2);	
    		}	
    	}
    }

    $scope.addFloors = function(house){
		FloorQueryService.findByHouseId(house.id).then(function(floors){
			_.each(floors, function(floor){
				floor.rooms = [];
				house.floors.push(floor);
				$scope.addRooms(floor);
			}) 
		})
    }

    $scope.addRooms = function(floor){
		RoomQueryService.findByFloorId(floor.id).then(function(rooms){
			_.each(rooms, function(room){
				room.objects = [];
				room.eachConfig = {
					handle: ".drag-handle",
					group: 'bar',
					onAdd: function (evt){
						ObjectQueryService.insert(evt.model, room.id).then(function(response){
						})
					},
					onRemove: function (evt){
						ObjectQueryService.delete(evt.model.BMSID).then(function(response){
						})
				    }
				};
				floor.rooms.push(room);
				$scope.addObjects(room);
			})
		})	   	
    }

    $scope.addObjects = function(room){
		ObjectQueryService.findByRoomId(room.id).then(function(objects){
			_.each(objects, function(object){
				room.objects.push(object);
			})
		})
    }

	$scope.apInsertRoom = function(form){
		if(form.$valid){
			RoomQueryService.insertApRoom($scope.apRoomName).then(function(room){
		        $scope.rooms.push(room);
		        $scope.apRoomName = '';
			}, function(){
				ToastService.create('A room with the same name already exists', 'warning');
			})
		}
	}

	$scope.apDeleteRoom = function(roomId){
		RoomQueryService.delete(roomId).then(function(response){
	        var key = _.findLastIndex($scope.rooms, {id: roomId});
	        $scope.rooms.splice(key,1);
		}, function(){
			ToastService.create('This room contains objects, Please clear the room before deleting it', 'warning');
		})
	}

	$scope.houseInsertFloor = function(form){
		if(form.$valid){
			FloorQueryService.insertHouseFloor($scope.houseFloorName).then(function(response){
				response.rooms = [];
				$scope.floors.push(response);
				$scope.houseFloorName = '';
			}, function(){
				ToastService.create('A floor with the same name already exists', 'warning');
			})
		}		
	}

	$scope.houseInsertRoom = function(form){
		if(form.$valid){
			RoomQueryService.insertRoom($scope.houseRoomName, $scope.houseFloor.id).then(function(room){
				var key = _.findLastIndex($scope.floors, {id: $scope.houseFloor.id});
				$scope.floors[key]['rooms'].push(room);
				$scope.houseRoomName = '';
				$scope.houseFloor = {};
			}, function(){
				ToastService.create('A room with the same name already exists in the selected floor', 'warning');
			})
		}
	}

	$scope.houseDeleteFloor = function(floorId){
		FloorQueryService.delete(floorId).then(function(response){
	        var key = _.findLastIndex($scope.floors, {id: floorId});
	        $scope.floors.splice(key,1);
		}, function(){
			ToastService.create('This floor contains rooms, Please clear the floor befeore deleting it', 'warning');
		})
	}

	$scope.houseDeleteRoom = function(roomId, floorId){
		RoomQueryService.delete(roomId).then(function(response){
	        var key = _.findLastIndex($scope.floors, {id: floorId});
			var rooms = $scope.floors[key]['rooms']
	        var key = _.findLastIndex(rooms, {id: roomId});
	        rooms.splice(key,1);
		}, function(){
			ToastService.create('This room contains objects, Please clear the room before deleting it', 'warning');			
		})		
	}

	$scope.complexInsertHouse = function(form){
		if(form.$valid){
			HouseQueryService.insertComplexHouse($scope.complexHouseName).then(function(house){
				house.floors = [];
		        $scope.houses.push(house);
		        $scope.complexHouseName = '';
			}, function(){
				ToastService.create('A house with the same name already exists', 'warning');
			})			
		}
	}

	$scope.complexInsertFloor = function(form){
		if(form.$valid){
			FloorQueryService.insertComplexFloor($scope.complexFloorName, $scope.complexHouse.id).then(function(floor){
				var key = _.findLastIndex($scope.houses, {id: $scope.complexHouse.id});
				floor.rooms = [];
				$scope.houses[key]['floors'].push(floor);
				$scope.complexFloorName = '';
				$scope.complexHouse = {};
			}, function(){
				ToastService.create('A floor with the same name already exists in the selected house', 'warning');
			})
		}
	}

	$scope.complexInsertRoom = function(form){
		if(form.$valid){
			RoomQueryService.insertRoom($scope.complexRoomName, $scope.complexFloor.id).then(function(room){
				var key = _.findLastIndex($scope.houses, {id: $scope.complexRoomHouse.id});
				var floors = $scope.houses[key]['floors'];
				var key = _.findLastIndex(floors, {id: $scope.complexFloor.id});
				var rooms = floors[key]['rooms'];
				rooms.push(room);
				$scope.complexRoomHouse = {};
				$scope.complexFloor = {};
				$scope.complexRoomName = '';
			}, function(){
				ToastService.create('A room with the same name already exists in the selected floor', 'warning');
			})
		}
	}

	$scope.complexDeleteHouse = function(houseId){
		HouseQueryService.delete(houseId).then(function(response){
	        var key = _.findLastIndex($scope.houses, {id: houseId});
	        $scope.houses.splice(key,1);
		}, function(){
			ToastService.create('This house contains floors, Please clear the house befeore deleting it', 'warning');
		})
	}

	$scope.complexDeleteFloor = function(floorId, houseId){
		FloorQueryService.delete(floorId).then(function(response){
	        var key = _.findLastIndex($scope.houses, {id: houseId});
			var floors = $scope.houses[key]['floors']
	        var key = _.findLastIndex(floors, {id: floorId});
	        floors.splice(key,1);
	        //floors.splice(floors.indexOf(floor), 1);
		}, function(){
			ToastService.create('This floor contains rooms, Please clear the floor befeore deleting it', 'warning');
		})
	}

	$scope.complexDeleteRoom = function(roomId, floorId, houseId){
		RoomQueryService.delete(roomId).then(function(response){
	        var key = _.findLastIndex($scope.houses, {id: houseId});
			var floors = $scope.houses[key]['floors']
	        var key = _.findLastIndex(floors, {id: floorId});
	        var rooms = floors[key]['rooms'];
	        var key = _.findLastIndex(rooms, {id: roomId});
	        rooms.splice(key,1);
		}, function(){
			ToastService.create('This room contains objects, Please clear the room before deleting it', 'warning');
		})
	}

}];