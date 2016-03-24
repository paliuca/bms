(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

module.exports = ["$scope", "title", "batApiSrv", "objects","type", function($scope, title, batApiSrv, objects, type) {

   
    $scope.title = title;

    $scope.room   = 'type';

    $scope.type   = type;

    $scope.items = batApiSrv.getLiveList(objects);    

    $scope.$on('$destroy', function () {
        batApiSrv.clearObjects();
    });

}];
},{}],2:[function(require,module,exports){

module.exports = ["$scope", "floor", "rooms", "type", "helperObjectService","batApiSrv","objects",  function($scope, floor, rooms, type, helperObjectService, batApiSrv, objects) {

    $scope.title = floor.name;

    if(floor.house_id){
        $scope.floorObj = floor;        
        $scope.backUrl = '#/house/'+floor.house_id;
    }else{
        $scope.backUrl = '#/tree';
    }
    $scope.zones = rooms;

    $scope.room = 'floor';

    $scope.zone = 'rooms';

    $scope.items = batApiSrv.getLiveList(objects);    

    $scope.$on('$destroy', function () {
        batApiSrv.clearObjects();
    });    

    $scope.treeConfig = {   
        handle: ".my-handle",
        onEnd: function (evt) {
            var items = evt.models;
            helperObjectService.reorder(items, 'ap').then(function(){
            }, function(){
                
            });
        }
    };
}];


},{}],3:[function(require,module,exports){
'use strict';

module.exports = ["$scope", "batApiSrv", "$http", "WeatherIconService", "AuthentificationService", "objects", "type", "title", "CookiesService", 
    function($scope, batApiSrv, $http, WeatherIconService, AuthentificationService, objects, type, title, CookiesService) {

    $scope.hour = null;
    $scope.day = null;    
    $scope.AuthentificationService = AuthentificationService;
    $scope.title = title;
        
    $scope.type   = type;
    $scope.room   = 'home';

    var lang = CookiesService.get('language')?CookiesService.get('language'):'ro';
    var updateTime = function (){
        $scope.day = moment().locale(lang).format('dddd Do MMM YYYY');
        $scope.hour = moment().locale(lang).format('HH : mm');
    }
    
    var updateLater = function () {
        setTimeout(function() {
          updateTime();
          updateLater();
        }, 100);
    }        
    updateLater();
        
    $http.get('/helpers/weather', {}).success(function(response){
        $scope.weather = {};
        $scope.weather.description = response.current.skytext;
        $scope.weather.icon = response.current.imageUrl;
        $scope.weather.temperature = response.current.temperature;
        $scope.weather.humidity = response.current.humidity;        
        $scope.weather.wind = response.current.winddisplay;
    }).error(function(response){
        console.log(response);
    })    

    

    $scope.items = batApiSrv.getLiveList(objects);



    $scope.removeFavorite = function(object){
        var key = _.findLastIndex($scope.items, {
            BMSID: object.BMSID
        });
        $scope.items.splice(key,1);
    }

    $scope.logOut = function(){
        batApiSrv.clearObjects();
        AuthentificationService.logout();
    }


    $scope.$on('$destroy', function () {        
        batApiSrv.clearObjects();
    });
    
}];
},{}],4:[function(require,module,exports){

module.exports = ["$scope", "house", "floors", "type", "helperObjectService","objects","batApiSrv", function($scope, house, floors, type, helperObjectService, objects, batApiSrv) {

    $scope.title = house.name;
    
    $scope.backUrl = '#/tree';
    
    $scope.zones = floors;

    $scope.zone = 'floors';
    
    $scope.type = type;

    $scope.room = 'house';

    $scope.items = batApiSrv.getLiveList(objects);    

    $scope.$on('$destroy', function () {
        batApiSrv.clearObjects();
    });

    $scope.treeConfig = {   
        handle: ".my-handle",
        onEnd: function (evt) {
            var items = evt.models;
            helperObjectService.reorder(items, 'house').then(function(){                
            }, function(){
            });
        }
    };
}];
},{}],5:[function(require,module,exports){
'use strict';
var app = angular.module('arena');


app.controller('loginCtrl', require('./loginCtrl'));

app.controller('homeCtrl', require('./homeCtrl'));

app.controller('floorCtrl', require('./floorCtrl'));

app.controller('roomCtrl', require('./roomCtrl'));

app.controller('houseCtrl', require('./houseCtrl'));


app.controller('treeCtrl', require('./treeCtrl'));


app.controller('settingsCtrl', require('./settingsCtrl'));
app.controller('wizzardCtrl', require('./wizzardCtrl'));


app.controller('typeCtrl', require('./typeCtrl'));
app.controller('apCtrl', require('./apCtrl'));

app.controller('sessionsCtrl', require('./sessionsCtrl'));


app.controller('usersCtrl', require('./wizzard/usersCtrl'));
app.controller('objectsToRoomsCtrl', require('./wizzard/objectsToRoomsCtrl'));
app.controller('roomsToHouseCtrl', require('./wizzard/roomsToHouseCtrl'));
app.controller('objectsControllsCtrl', require('./wizzard/objectsControllsCtrl'));
app.controller('templatesCtrl', require('./wizzard/templatesCtrl'));
app.controller('objectsToTemplateCtrl', require('./wizzard/objectsToTemplateCtrl'));



},{"./apCtrl":1,"./floorCtrl":2,"./homeCtrl":3,"./houseCtrl":4,"./loginCtrl":6,"./roomCtrl":7,"./sessionsCtrl":8,"./settingsCtrl":9,"./treeCtrl":10,"./typeCtrl":11,"./wizzard/objectsControllsCtrl":13,"./wizzard/objectsToRoomsCtrl":14,"./wizzard/objectsToTemplateCtrl":15,"./wizzard/roomsToHouseCtrl":16,"./wizzard/templatesCtrl":17,"./wizzard/usersCtrl":18,"./wizzardCtrl":12}],6:[function(require,module,exports){
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
},{}],7:[function(require,module,exports){

module.exports = ["$scope", "room", "type", "typeId", "batApiSrv", "objects", "$routeParams", function($scope, room, type, typeId, batApiSrv, objects, $routeParams) {

    
    if(room.floor_id){
        $scope.backUrl = '#/floor/'+room.floor_id;
    }else{
        $scope.backUrl = '#/tree';
    }    
    $scope.baseUrl = '#/room/'+room.id; 

    
    
    $scope.title = room.name;
    $scope.type   = type;
    $scope.typeId   = typeId;
    $scope.room   = 'room';
        

    if($routeParams.q){
        $scope.checked = true;
    }else{
        $scope.checked = false;
    }


    $scope.toggle = function(){
        $scope.checked = !$scope.checked
    }
    $scope.items = batApiSrv.getLiveList(objects);    

    $scope.$on('$destroy', function () {
        batApiSrv.clearObjects();
    });
}];
},{}],8:[function(require,module,exports){
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
},{}],9:[function(require,module,exports){

module.exports = ["$scope", "$http", "$window", function($scope, $http, $window) {


    $scope.resetModules = function(){
        $scope.isLoading = true;
        ModulesQueryBuilder.clearDB().then(function(data){
            ZonesQueryBuilder.clearDB().then(function(data){
                $scope.isLoading = false;
            })
        });        
    }


	$http.get('/api/getWordsConfig').success(function(response) {
		$scope.items = response;
	});

	$scope.save = function(form){
		if(form.$valid){
			var json = {};
			_.each($scope.items, function(value, key){
				json[key] = form[key].$modelValue;				
			})
			$http.post('/api/setWordsConfig', {'json':json}).success(function(response) {
				$window.location.reload();
			});
		}
	}  
}];
},{}],10:[function(require,module,exports){
module.exports = ["$scope", "items", "type", "title", "zone", "helperObjectService","objects","batApiSrv", function($scope, items, type, title, zone, helperObjectService, objects, batApiSrv) {
	
    $scope.title = title;
            
    $scope.type = type;    
    
    $scope.zones = items;
        
    $scope.zone = zone;

    $scope.items = batApiSrv.getLiveList(objects);    
    
    
    $scope.room = 'tree';

    $scope.$on('$destroy', function () {
        batApiSrv.clearObjects();
    });

    $scope.treeConfig = {   
        handle: ".my-handle",
        onEnd: function (evt) {
            var items = evt.models;
            helperObjectService.reorder(items, $scope.type).then(function(response){                
            }, function(){
            });
        }
    };   
}];
},{}],11:[function(require,module,exports){

module.exports = ["$scope", "title", "type", "batApiSrv", "objects","zones","typeId","routes","ObjectIconService","$routeParams", 

function($scope, title, type, batApiSrv, objects, zones, typeId, routes, ObjectIconService, $routeParams) {

	$scope.title = title;

    $scope.type   = type;
    $scope.room   = 'type';

    $scope.ObjectIconService = ObjectIconService;

    $scope.items = batApiSrv.getLiveList(objects);
    $scope.zones = zones;
    $scope.routes = routes;


    $scope.baseUrl = '#/type/'+typeId;
    if($routeParams.q){
        $scope.checked = true;
    }else{
        $scope.checked = false;
    }

    $scope.toggle = function(){
        $scope.checked = !$scope.checked;
    }

    $scope.$on('$destroy', function () {        
        batApiSrv.clearObjects();
    });   

     console.log();
}];

},{}],12:[function(require,module,exports){

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
},{}],13:[function(require,module,exports){

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
},{}],14:[function(require,module,exports){

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
},{}],15:[function(require,module,exports){

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
},{}],16:[function(require,module,exports){

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
},{}],17:[function(require,module,exports){

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
},{}],18:[function(require,module,exports){

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
},{}],19:[function(require,module,exports){
'use strict';

module.exports = ["ObjectTemplateService", "ObjectIconService", "ToastService", "ObjectFactory","$route", function(ObjectTemplateService, ObjectIconService, ToastService, ObjectFactory, $route) {
	return {
		restrict: 'E',
		templateUrl: 'views/directives/admin-add-object-item.html',
		replace: true,
        scope:{
            house : '@house',
            floor : '@floor',            
            room : '@room',
            user : '@user'
        },
		link: function($scope){
            $scope.object = {};

            $scope.ObjectTemplateService = ObjectTemplateService;
            $scope.ObjectIconService = ObjectIconService;

            $scope.nameEditorEnabled = false;


            $scope.enableNameEditor = function() {
                if($scope.object.category){
                    if($scope.object.template_id){
                        $scope.template = ObjectTemplateService.getTemplate($scope.object.category, $scope.object.template_id);
                    }
                    if($scope.object.icon_id){
                        $scope.icon = ObjectIconService.getIcon($scope.object.category, $scope.object.icon_id);
                    }
                }
                $scope.nameEditorEnabled = true;                
            };

            $scope.disableNameEditor = function() {
                $scope.nameEditorEnabled = false;
            };

            $scope.saveObject = function(form) {
                if(form.$valid){
                    $scope.object.room_id = $scope.room;
                    $scope.object.floor_id = $scope.floor;
                    $scope.object.house_id = $scope.house;
                    $scope.object.user_id = $scope.user;                    
                    $scope.object.icon_id = $scope.icon?$scope.icon.id:null;
                    $scope.object.template_id = $scope.template.id;
                    ObjectFactory.create($scope.object).then(function(response){
                        $route.reload();
                    }, function(){
                        ToastService.create('Object already exists','warning');
                    })                                        
                }
            };
        }
	}
}]
},{}],20:[function(require,module,exports){
'use strict';

module.exports = ["ObjectTemplateService", "ObjectIconService","$http", "ToastService", "ObjectFactory", function(ObjectTemplateService, ObjectIconService, $http, ToastService, ObjectFactory) {
	return {
		restrict: 'E',
		templateUrl: 'views/directives/admin-object-item.html',
		replace: true,
        scope:{
            object : '=object'            
        },
		link: function($scope){

            $scope.ObjectTemplateService = ObjectTemplateService;
            $scope.ObjectIconService = ObjectIconService;

            $scope.nameEditorEnabled = false;


            $scope.enableNameEditor = function() {
                if($scope.object.category){
                    if($scope.object.template_id){
                        $scope.template = ObjectTemplateService.getTemplate($scope.object.category, $scope.object.template_id);
                    }
                    if($scope.object.icon_id){
                        $scope.icon = ObjectIconService.getIcon($scope.object.category, $scope.object.icon_id);
                    }
                }
                $scope.nameEditorEnabled = true;                
            };

            $scope.disableNameEditor = function() {
                $scope.nameEditorEnabled = false;
            };

            $scope.saveObject = function(form) {
                if(form.$valid){
                    $scope.object.icon_id = $scope.icon?$scope.icon.id:null;
                    $scope.object.template_id = $scope.template.id;
                    ObjectFactory.update($scope.object).then(function(){

                    }, function(){

                    })                    
                }
            };
        }
	}
}]
},{}],21:[function(require,module,exports){
'use strict';
var app = angular.module('arena');

app.directive('zone', require('./zone'));
app.directive('adminObjectItem', require('./admin-object-item'));

app.directive('adminAddObjectItem', require('./admin-add-object-item'));
},{"./admin-add-object-item":19,"./admin-object-item":20,"./zone":22}],22:[function(require,module,exports){
'use strict';

module.exports = ["ObjectIconService", "$http", "UserFactory", "RoomFactory", "FloorFactory", "HouseFactory", function(ObjectIconService, $http, UserFactory, RoomFactory, FloorFactory, HouseFactory) {
	return {
		restrict: 'E',
		templateUrl: 'views/directives/zone.html',
		replace: true,
        scope:{
            type : '@type',
            zone : '@zone',
            item: '=item',
            floor:'=floor',
            orderBar : '=orderBar'
        },
		link: function($scope){
            switch($scope.zone){
                case 'houses':
                    $scope.link = "#/house/"+$scope.item.id;
                break;
                case 'floors':
                    $scope.link = "#/floor/"+$scope.item.id;
                break;
                case 'rooms':
                    $scope.link = "#/room/"+$scope.item.id;
                break;
            }        

            $scope.nameEditorEnabled = false;
            $scope.iconEditorEnabled = false;
            $scope.ObjectIconService = ObjectIconService;
            $scope.enableNameEditor = function() {
                $scope.zoneName = $scope.item.name;
                $scope.nameEditorEnabled = true;
            };

            $scope.enableIconEditor = function() {
                $scope.iconsArray = ObjectIconService.getIcons($scope.zone);
                if($scope.item.icon_id){
                    var key1 = _.findLastIndex($scope.iconsArray, {id: $scope.item.icon_id});
                    $scope.selectedIcon = $scope.iconsArray[key1];
                }
                $scope.editorIconEnabled = true;
            };            

            $scope.saveZone = function(form){
                if(form.$valid){
                    if($scope.selectedIcon){
                        $scope.item.icon_id = $scope.selectedIcon.id;                             
                    }
                    if(form.zoneName){
                        $scope.item.name = form.zoneName.$modelValue;                        
                    }
                    switch($scope.zone){
                        case 'rooms':
                            RoomFactory.update($scope.item).then(function(){
                                $scope.disableEditor();
                            }, function(){
                                $scope.disableEditor();
                            })                            
                        break;
                        case 'floors':
                            FloorFactory.update($scope.item).then(function(){
                                $scope.disableEditor();
                            }, function(){
                                $scope.disableEditor();
                            })                                          
                        break;
                        case 'houses':
                            HouseFactory.update($scope.item).then(function(){
                                $scope.disableEditor();
                            }, function(){
                                $scope.disableEditor();
                            })
                        break;
                    }                    
                }
            }


            $scope.disableEditor = function() {
                $scope.nameEditorEnabled = false;
                $scope.editorIconEnabled = false;
            };           
		}
	}
}];
},{}],23:[function(require,module,exports){
'use strict';

module.exports = ["$http","$q", "ToastService", function($http, $q, ToastService) {
  
    return {
        search : function(object){
            var deferred = $q.defer();
            $http.post('/floors/search', object).then(function(response) {
                deferred.resolve(response.data);
            },function(err) {
                ToastService.create(err.data, 'danger');
                deferred.reject(null);
            });
            return deferred.promise;            
        },
        create : function(floor){
            var deferred = $q.defer();
            $http.post('/floors/create', floor).then(function(response){
                deferred.resolve(response.data[0]);
            }, function(err){
                ToastService.create(err.data, 'danger');
                deferred.reject(null);
            })
            return deferred.promise;  
        },
        update:function(floor){
            var deferred = $q.defer();
            $http.put('/floors/update/'+floor.id, {floor:floor}).then(function(response){
                deferred.resolve(response.data);
            }, function(){            
                deferred.reject(null);   
            })            
            return deferred.promise;
        },
        delete : function(object){
            var deferred = $q.defer();
            $http.post('/floors/delete', object).then(function(response){
                deferred.resolve(null);
            }, function(err){
                ToastService.create(err.data, 'danger');
                deferred.reject(null);
            })
            return deferred.promise;
        }  
    }
        
}]
},{}],24:[function(require,module,exports){
'use strict';

module.exports = ["$http","$q","ToastService", function($http,$q,ToastService) {
  
    return {
        search : function(object){
            var deferred = $q.defer();
            $http.post('/houses/search', object).then(function(response) {
                deferred.resolve(response.data);
            },function(err) {
                ToastService.create(err.data, 'danger');
                deferred.reject(null);
            });
            return deferred.promise;
        },
        create : function(house){
            var deferred = $q.defer();
            $http.post('/houses/create', house).then(function(response){
                deferred.resolve(response.data[0]);
            }, function(err){
                ToastService.create(err.data, 'danger');
                deferred.reject(null);
            })
            return deferred.promise;  
        },
        update:function(house){
            var deferred = $q.defer();
            $http.put('/houses/update/'+house.id, {house:house}).then(function(response){
                deferred.resolve(response.data);
            }, function(){            
                deferred.reject(null);   
            })            
            return deferred.promise;
        },
        delete : function(object){
            var deferred = $q.defer();
            $http.post('/houses/delete', object).then(function(response){
                deferred.resolve(null);
            }, function(err){
                deferred.reject(null);
            })
            return deferred.promise;            
        }  
    }
        
}]
},{}],25:[function(require,module,exports){
'use strict';

module.exports = ['ToastService','$http','RoomFactory','FloorFactory','HouseFactory','ObjectFactory', "$q",
        function(ToastService, $http, RoomFactory, FloorFactory, HouseFactory, ObjectFactory, $q) {  
    return {
        deleteApTree:function(user_id){            
            return ObjectFactory.search({user_id:user_id}).then(function(response){
                return ObjectFactory.deleteAll(response).then(function(response){
                    return RoomFactory.search({user_id:user_id}).then(function(response){
                        return RoomFactory.deleteAll(response).then(function(response){                            
                            return true;
                        })
                    }) 
                })                                
            })
        },
        getApTree : function(user_id){
            return RoomFactory.search({user_id:user_id}).then(function(rooms){
                var ap = {};
                ap.name = "Apartment";
                ap.eachConfig = {
                    group: { name: 'objs',pull: false,put: true},
                    onAdd: function (evt){
                        var object = evt.model;
                        object.room_id = 0;
                        object.floor_id = 0;
                        object.house_id = 0;
                        object.user_id = user_id;
                        ObjectFactory.create(object).then(function(response){
                            object.id = response;
                        }, function(){
                            var key = _.findLastIndex(ap.objects, {id:object.id});
                            ap.objects.splice(key,1);
                        })
                    }
                };
                return ObjectFactory.search({user_id:user_id,room_id:0,floor_id:0,house_id:0}).then(function(response){
                    ap.objects = response;

                    var items = [];
                    _.each(rooms, function(room){
                        room.eachConfig = {
                            group: { name: 'objs', pull: false, put: true},
                            onAdd: function (evt){
                                var object = evt.model;
                                object.user_id = user_id;
                                object.room_id = room.id;
                                object.floor_id = 0;
                                object.house_id = 0;
                                ObjectFactory.create(object).then(function(response){
                                    object.id = response;
                                }, function(){
                                    var key = _.findLastIndex(room.objects, {id:object.id});
                                    room.objects.splice(key,1);
                                })
                            }
                        };
                        ObjectFactory.search({user_id:user_id,room_id:room.id,floor_id:0,house_id:0}).then(function(response){
                            room.objects = response;
                        })                    
                        items.push(room);
                    })
                    ap.rooms = items;
                    return ap;
                })                
            },function(response){
                ToastService.create(response, 'danger');
            });            
        },
        getHouseTree : function(user_id){
            return FloorFactory.search({user_id:user_id}).then(function(floors){                
                var house = {};
                house.name = "House";
                house.eachConfig = {
                    group: { name: 'objs',pull: false,put: true},
                    onAdd: function (evt){
                        var object = evt.model;
                        object.user_id = user_id;                        
                        object.room_id = 0;
                        object.floor_id = 0;
                        object.house_id = 0;
                        ObjectFactory.create(object).then(function(response){
                            object.id = response;
                        }, function(){
                            var key = _.findLastIndex(house.objects, {id:object.id});
                            house.objects.splice(key,1);
                        })
                    }
                };
                ObjectFactory.search({user_id:user_id,room_id:0,floor_id:0,house_id:0}).then(function(response){                    
                    house.objects = response;
                })
                var items = floors;
                _.each(items, function(floor){
                    floor.eachConfig = {
                        group: { name: 'objs',pull: false,put: true},
                        onAdd: function (evt){
                            var object = evt.model;
                            object.user_id = user_id;
                            object.room_id = 0;
                            object.floor_id = floor.id;
                            object.house_id = 0;
                            ObjectFactory.create(object).then(function(response){
                                object.id = response;
                            }, function(){
                                var key = _.findLastIndex(floor.objects, {id:object.id});
                                floor.objects.splice(key,1);
                            })
                        }
                    };
                    ObjectFactory.search({user_id:user_id,room_id:0,floor_id:floor.id,house_id:0}).then(function(response){                        
                        floor.objects = response;
                    })                   
                    floor.rooms = [];
                    RoomFactory.search({user_id:user_id,floor_id:floor.id}).then(function(response){
                        _.each(response, function(room){
                            room.eachConfig = {
                                group: { name: 'objs',pull: false,put: true},
                                onAdd: function (evt){
                                    var object = evt.model;
                                    object.house_id = 0;
                                    object.floor_id = floor.id;
                                    object.room_id = room.id;
                                    object.user_id = user_id;
                                    ObjectFactory.create(object).then(function(response){
                                        object.id = response;
                                    }, function(){
                                        var key = _.findLastIndex(room.objects, {id:object.id});
                                        room.objects.splice(key,1);
                                    })
                                }
                            };
                            ObjectFactory.search({user_id:user_id,room_id:room.id,floor_id:floor.id,house_id:0}).then(function(response){
                                room.objects = response;
                            })
                            floor.rooms.push(room);
                        })
                    }, function(response){
                        ToastService.create(response, 'danger');
                    })
                })
                house.floors = items;
                return house;
            },function(response){
                ToastService.create(response, 'danger');
            })             
        },
        getComplexTree : function(user_id){
            return HouseFactory.search({user_id:user_id}).then(function(response){            
                var complex = {};
                complex.name = "Complex";
                complex.eachConfig = {
                    group: { name: 'objs',pull: false,put: true},
                    onAdd: function (evt){
                        var object = evt.model;
                        object.room_id = 0;
                        object.floor_id = 0;
                        object.house_id = 0;
                        object.user_id = user_id;
                        ObjectFactory.create(object).then(function(response){
                            object.id = response;
                        }, function(){
                            var key = _.findLastIndex(complex.objects, {id:object.id});
                            complex.objects.splice(key,1);
                        })
                    }
                };
                ObjectFactory.search({user_id:user_id,room_id:0,floor_id:0,house_id:0}).then(function(response){
                    complex.objects = response;
                })                                  

                var items = response;
                _.each(items, function(house){
                    house.eachConfig = {
                        group: { name: 'objs',pull: false,put: true},
                        onAdd: function (evt){
                            var object = evt.model;
                            object.house_id = house.id;
                            object.floor_id = 0;
                            object.room_id = 0;
                            object.user_id = user_id;
                            ObjectFactory.create(object).then(function(response){
                                object.id = response;
                            }, function(){
                                var key = _.findLastIndex(house.objects, {id:object.id});
                                house.objects.splice(key,1);
                            })
                        }
                    };
                    ObjectFactory.search({user_id:user_id,room_id:0,floor_id:0,house_id:house.id}).then(function(response){
                        house.objects = response;
                    })
                    FloorFactory.search({user_id:user_id, house_id:house.id}).then(function(response){
                        house.floors = response;
                        _.each(house.floors, function(floor){
                            floor.eachConfig = {
                                group: { name: 'objs',pull: false,put: true},
                                onAdd: function (evt){
                                    var object = evt.model;
                                    object.house_id = house.id;
                                    object.floor_id = floor.id;
                                    object.room_id = 0;
                                    object.user_id = user_id;
                                    ObjectFactory.create(object).then(function(response){
                                        object.id = response;
                                    }, function(){
                                        var key = _.findLastIndex(floor.objects, {id:object.id});
                                        floor.objects.splice(key,1);
                                    })
                                }
                            };
                            ObjectFactory.search({user_id:user_id,room_id:0,floor_id:floor.id,house_id:house.id}).then(function(response){
                                floor.objects = response;
                            })                                                        
                            floor.rooms = [];
                            RoomFactory.search({user_id:user_id, floor_id:floor.id}).then(function(response){
                                _.each(response, function(room){
                                    room.eachConfig = {
                                        group: { name: 'objs',pull: false,put: true},
                                        onAdd: function (evt){
                                            var object = evt.model;
                                            object.house_id = house.id;
                                            object.floor_id = floor.id;
                                            object.room_id = room.id;
                                            object.user_id = user_id;
                                            ObjectFactory.create(object).then(function(response){
                                                object.id = response;
                                            }, function(){
                                                var key = _.findLastIndex(room.objects, {id:object.id});
                                                room.objects.splice(key,1);
                                            })
                                        }
                                    };
                                    ObjectFactory.search({user_id:user_id,room_id:room.id,floor_id:floor.id,house_id:house.id}).then(function(response){
                                        room.objects = response;
                                    })                                  
                                    floor.rooms.push(room);
                                })
                            }, function(response){
                                ToastService.create(response.data, 'danger');  
                            })
                        })
                    },function(response){
                        ToastService.create(response, 'danger');
                    })
                })
                complex.houses = items;
                return complex;
            }, function(response){
                ToastService.create(response.data, 'danger');
            })              
        },
        getTemplate : function(templateid){
            return $http.get('/api/templates/'+templateid).then(function(response){
                return response.data;
            },function(response){                        
                ToastService.create(response.data, 'danger');
            })
        },        
        getTemplates : function(){
            return $http.get('/api/templates').then(function(response){
                return response.data;
            }, function(response){
                ToastService.create(response.data, 'danger');
            })
        }
    }
        
}]
},{}],26:[function(require,module,exports){
'use strict';

module.exports = ["$http","$q", "ToastService", "CookiesService", function($http, $q, ToastService, CookiesService) {
  
    return {
        getByToken : function(){
            var deferred = $q.defer();
            $http.get('/objects/getByToken/'+CookiesService.get('token')).then(function(response){
                if(response.data.status){
                    deferred.resolve(response.data.objects);
                }else{
                    deferred.reject(null);
                }
            }, function(){
                deferred.reject(null);
            });
            return deferred.promise;            
        },
        search:function(object){            
            var deferred = $q.defer();
            $http.post('/objects/search', object).then(function(response){                
                deferred.resolve(response.data);
            }, function(){
               deferred.reject(null); 
            })
            return deferred.promise;
        },
        create:function(object){
            var deferred = $q.defer();
            $http.post('/objects/create', {object:object}).then(function(response){
                deferred.resolve(response.data);
            }, function(){            
                deferred.reject(null);   
            })
            return deferred.promise;
        },
        createAll : function(objects, user_id, room_id){
            var promises = objects.map( function(object){
                var deferred  = $q.defer();                
                var newObject = {};                 
                newObject.ModuleItem = object.ModuleItem;
                newObject.ModuleType = object.ModuleType;
                newObject.ItemDescription = object.ItemDescription;
                newObject.favorite = object.favorite;
                newObject.category = object.category;
                newObject.template_id = object.template_id;
                newObject.icon_id = object.icon_id;
                newObject.detector_output = object.detector_output;
                newObject.shutter_input = object.shutter_input;
                newObject.shutter_seconds = object.shutter_seconds;
                newObject.dimming_input = object.dimming_input;
                newObject.dimming_ratio = object.dimming_ratio;
                newObject.name = object.name;
                newObject.room_id = room_id?room_id:(object.room_id?object.room_id:0);
                newObject.floor_id = object.floor_id?object.floor_id:0;
                newObject.house_id = object.house_id?object.house_id:0;
                newObject.user_id = user_id;
                $http.post('/objects/create', {object:newObject}).then(function(response){
                    deferred.resolve(null);
                }, function(){            
                    deferred.resolve(null);
                })                               
                return deferred.promise;
            })
            return $q.all(promises) 
        },        
        update:function(object){
            var deferred = $q.defer();
            $http.put('/objects/update/'+object.id, {object:object}).then(function(response){
                deferred.resolve(response.data);
            }, function(){            
                deferred.reject(null);   
            })            
            return deferred.promise;
        },
        delete : function(id){
            var deferred = $q.defer();
            $http.delete('/objects/delete/'+id).then(function(response){
                deferred.resolve(null);
            }, function(err){
                ToastService.create(err.data, 'danger');
                deferred.reject(null);
            })
            return deferred.promise;            
        },
        deleteAll : function(objects){
            var promises = objects.map( function(object){
                var deferred  = $q.defer();
                $http.delete('/objects/delete/'+object.id).then(function(){
                    deferred.resolve(null);
                }, function(err){
                    deferred.reject(null);
                })                                
                return deferred.promise;
            })
            return $q.all(promises)            
        }
    }
        
}]
},{}],27:[function(require,module,exports){
'use strict';

module.exports = ["$http","$q","ObjectFactory","ToastService", function($http,$q,ObjectFactory,ToastService) {
  
    return {
        search : function(object){
            var deferred = $q.defer();

            $http.post('/rooms/search', object).then(function(response) {
                deferred.resolve(response.data);
            },function(err) {
                ToastService.create(err.data, 'danger');
                deferred.reject(null);
            });
            return deferred.promise;            
        },
        create : function(room){
            var deferred = $q.defer();
            $http.post('/rooms/create', room).then(function(response){

                deferred.resolve(response.data[0]);
            }, function(err){

                ToastService.create(err.data, 'danger');
                deferred.reject(null);
            })
            return deferred.promise;  
        },
        createAll : function(rooms, user_id){
            var promises = rooms.map( function(room){
                var deferred  = $q.defer();
                var newRoom = {}; 
                newRoom.user_id = user_id;
                newRoom.name = room.name;
                newRoom.floor_id = room.floor_id;
                newRoom.order = room.order;
                newRoom.icon_id = room.icon_id;
                $http.post('/rooms/create', newRoom).then(function(response){
                    var room_id = parseInt(response.data);
                    ObjectFactory.createAll(room.objects, user_id, room_id).then(function(){
                        deferred.resolve(response.data[0]);
                    })                    
                }, function(err){
                    deferred.resolve(null);
                })                               
                return deferred.promise;
            })
            return $q.all(promises) 
        },
        update:function(room){
            var deferred = $q.defer();
            $http.put('/rooms/update/'+room.id, {room:room}).then(function(response){
                deferred.resolve(response.data);
            }, function(){            
                deferred.reject(null);   
            })            
            return deferred.promise;
        },
        delete : function(object){
            var deferred = $q.defer();
            $http.post('/rooms/delete', object).then(function(response){
                deferred.resolve(null);
            }, function(err){
                ToastService.create(err.data, 'danger');
                deferred.reject(null);
            })
            return deferred.promise;            
        },
        deleteAll : function(rooms){
            var promises = rooms.map( function(room){
                var deferred  = $q.defer();
                room.room_id = room.id;
                $http.post('/rooms/delete', room).then(function(){
                    deferred.resolve(null);
                }, function(err){
                    deferred.reject(null);
                })                                
                return deferred.promise;
            })
            return $q.all(promises)            
        }        
    }
        
}]
},{}],28:[function(require,module,exports){
'use strict';

module.exports = ["$http","$q", "ToastService", function($http, $q, ToastService) {
  
    return {
        login : function(user){
            var deferred = $q.defer();
            $http.get('/users/login/'+user.name+'/'+user.password).then(function(response) {
                deferred.resolve(response.data);
            },function(err) {
                ToastService.create(err.data, 'danger');
                deferred.reject(null);
            });
            return deferred.promise;
        },
        all : function(){
            var deferred = $q.defer();
            $http.get('/users/all').then(function(response){
                deferred.resolve(response.data);
            }, function(err){
                deferred.reject(null);
            })
            return deferred.promise;
        },
        find : function(id){
            var deferred = $q.defer();
            $http.get('/users/find/'+id).then(function(response) {
                deferred.resolve(response.data);
            },function(err) {
                deferred.reject(null);
            });
            return deferred.promise;
        },
        logout: function(){
            var deferred = $q.defer();
            $http.get('/users/logout').then(function() {
                deferred.resolve(null);
            },function(err) {
                deferred.reject(null);
            });
            return deferred.promise;
        },
        delete : function(id){
            var deferred = $q.defer();
            $http.delete('/users/delete/'+id).then(function() {
                deferred.resolve(null);
            },function(err) {
                ToastService.create(err.data, 'danger');
            });
            return deferred.promise;            
        },
        create : function(user){
            var deferred = $q.defer();
            $http.post('/users/create', {user:user}).then(function(response) {
                deferred.resolve(response.data[0]);
            },function(err) {
                ToastService.create(err.data, 'danger');
            });
            return deferred.promise;                        
        }    
    }
        
}]
},{}],29:[function(require,module,exports){
'use strict';
var app = angular.module('arena');




app.factory('UserFactory', require('./UserFactory'));
app.factory('ObjectFactory', require('./ObjectFactory'));
app.factory('RoomFactory', require('./RoomFactory'));
app.factory('FloorFactory', require('./FloorFactory'));
app.factory('HouseFactory', require('./HouseFactory'));


app.factory('ItemFactory', require('./ItemFactory'));




},{"./FloorFactory":23,"./HouseFactory":24,"./ItemFactory":25,"./ObjectFactory":26,"./RoomFactory":27,"./UserFactory":28}],30:[function(require,module,exports){
'use strict';

var app = angular.module('arena', ['ngRoute','ngResource', 'ngCookies', 'ngSanitize', 'ngAnimate', 'ngTouch', 'ng-sortable', 'ngToast', 'ui.bootstrap', 'angular-svg-round-progress', 'rzModule', 'hmTouchEvents']);

require('./controllers');
require('./directives');
require('./services');
require('./factories');

app.config(['$routeProvider','ngToastProvider',
    function($routeProvider, ngToast) {
        $routeProvider.when('/', {
            templateUrl: './views/login.html'
            ,controller: 'loginCtrl'
        })
        $routeProvider.when('/sessions', {
            templateUrl: './views/sessions.html'
            ,controller: 'sessionsCtrl'
        })
        $routeProvider.when('/wizzard/users', {
            templateUrl: './views/wizzard/users.html'
            ,controller: 'usersCtrl'
            ,resolve : {
                users : ['UserFactory', function(UserFactory){
                    return UserFactory.all().then(function(response){
                        return response;
                    }, function(){

                    });
                }],
            }
        })
        $routeProvider.when('/wizzard/rooms-to-house/:userid/:type', { 
            templateUrl: './views/wizzard/rooms-to-house.html'
            ,controller: 'roomsToHouseCtrl'
            ,resolve : {   
                user : ['$route', 'UserFactory', function($route, UserFactory){
                    return UserFactory.find($route.current.params.userid).then(function(response){
                        return response;
                    });
                }],
                items : ['$route', "ItemFactory", function($route, ItemFactory){
                    switch($route.current.params.type){
                        case 'ap':
                            return ItemFactory.getApTree($route.current.params.userid).then(function(response){
                                return response;
                            });   
                        break;
                        case 'house':
                            return ItemFactory.getHouseTree($route.current.params.userid).then(function(response){
                                return response;
                            });
                        break;
                        case 'complex':
                            return ItemFactory.getComplexTree($route.current.params.userid).then(function(response){                                    
                                return response;
                            });
                        break;
                        }                  
                }] 
            }            
        })        
       /* $routeProvider.when('/wizzard/templates', {
            templateUrl: './views/wizzard/templates.html'
            ,controller: 'templatesCtrl'
            ,resolve : {
                templates : ['ItemFactory', function(ItemFactory){
                    return ItemFactory.getTemplates().then(function(response){
                        return response;
                    });                                       
                }],
            }
        })
        $routeProvider.when('/wizzard/objects-to-template/:tempalteid', {
            templateUrl: './views/wizzard/objects-to-template.html'
            ,controller: 'objectsToTemplateCtrl'
            ,resolve : {
                template : ['ItemFactory','$route', function(ItemFactory, $route){
                    return ItemFactory.getTemplate($route.current.params.tempalteid).then(function(response){
                        return response;
                    });                                       
                }],
            }
        })*/
        $routeProvider.when('/wizzard/objects-to-rooms/:userid/:type', {
            templateUrl: './views/wizzard/objects-to-rooms.html'
            ,controller: 'objectsToRoomsCtrl'
            ,resolve : {   
                user : ['$route', 'UserFactory', function($route, UserFactory){
                    return UserFactory.find($route.current.params.userid).then(function(response){
                        return response;
                    });
                }],
                objects : ["$http","ObjectFactory", function($http, ObjectFactory){
                    return ObjectFactory.getByToken().then(function(response){
                        return response;
                    })                    
                }],
                items : ['$route','ItemFactory', function($route, ItemFactory){
                        switch($route.current.params.type){
                            case 'ap':
                                return ItemFactory.getApTree($route.current.params.userid).then(function(response){
                                    return response;
                                });                         
                            break;
                            case 'house':
                                return ItemFactory.getHouseTree($route.current.params.userid).then(function(response){
                                    return response;
                                });                            
                            break;
                            case 'complex':
                                return ItemFactory.getComplexTree($route.current.params.userid).then(function(response){
                                    return response;
                                });                           
                            break;
                        }                  
                }]                
            }            
        })
        $routeProvider.when('/wizzard/objects-controlls/:userid/:type', {
            templateUrl: './views/wizzard/objects-controlls.html'
            ,controller: 'objectsControllsCtrl'
            ,resolve : {   
                user : ['$route', 'UserFactory', function($route, UserFactory){
                    return UserFactory.find($route.current.params.userid).then(function(response){
                        return response;
                    });
                }],
                items : ['$route', "ItemFactory", function($route, ItemFactory){
                        switch($route.current.params.type){
                            case 'ap':                                
                                return ItemFactory.getApTree($route.current.params.userid).then(function(response){
                                    return response;
                                });   
                            break;
                            case 'house':
                                return ItemFactory.getHouseTree($route.current.params.userid).then(function(response){
                                    return response;
                                });                            
                            break;
                            case 'complex':
                                return ItemFactory.getComplexTree($route.current.params.userid).then(function(response){                                    
                                    return response;
                                });                           
                            break;
                        }                  
                }] 
            }             
        })


        $routeProvider.when('/wizzard/objects', {
            templateUrl: './views/wizzard/objects.html'
            ,controller: 'objectsCtrl'
        })
        $routeProvider.
            otherwise({
                resolve: {
                    config: ['configSrv','$route','$location',function (configSrv, $route, $location) {
                        configSrv.getConfigAndGenerateRoutes($routeProvider).then(function(data) {
                                $route.reload();
                            }, function (data) {
                                // if we cannot load config, go to login page
                                $location.path('/');
                            });;
                    }]
                }
            });           
        ngToast.configure({
            verticalPosition: 'top',
            horizontalPosition: 'center',
            animation: 'fade',
            maxNumber: 1
        });      

    }
]); 

app.run(['$rootScope', '$location', 'AuthentificationService', 'TranslateService', '$http', '$window',
    function($rootScope, $location, AuthentificationService, TranslateService, $http, $window)
    {        

        
        var routesThatNotRequireAuth = ['/'];
        $rootScope.$on('$routeChangeStart', function(event, next, current){
            
            if($location.$$path == '/' && AuthentificationService.isAdmin()){
                $location.path('/wizzard/users');
            }

            if($location.$$path == '/' && AuthentificationService.isLoggedIn()){
                $location.path('/start');
            }
            
            if(!AuthentificationService.isLoggedIn()){
                $location.path('/');
            }

        })
    }
]);

(function (angular, window, $) {
    var regType = function(name, controllerFn){
        app.directive($.camelCase('bat-object-'+name), ["$window", "$rootScope", "ObjectIconService", 
            function($window, $rootScope, ObjectIconService){
            return {
                restrict: 'E',
                scope: {
                    item: '=',
                    room: '@',
                    type: '@',
                    items: '=',
                    setfavorite:'='
                },
                template: '<div ng-include="templateUrl"></div>',
                controller: controllerFn,
                link: function($scope){                     
                    $scope.templateUrl = './objects/templates/'+$scope.item.category+'/'+name+'.html';

                    $scope.ObjectIconService = ObjectIconService;

                    $scope.removeFavorite = function(object){
                        var key = _.findLastIndex($scope.items, {
                            $$hashKey: object.$$hashKey
                        });
                        $scope.items.splice(key,1);
                    }

                    $scope.setFavorite = function(value){
                        $scope.item.favorite = value;
                        $scope.item.live.updateObject($scope.item).then(function(response){

                        },function(){
                            $scope.item.favorite = !$scope.item.favorite;
                        })
                               
                    }

                
                    $scope.editorNameEnabled = false;
                    $scope.editorIconEnabled = false;

                    $scope.enableNameEditor = function() {
                        $scope.editableText = $scope.item.name;
                        $scope.editorNameEnabled = true;
                    };

                    $scope.enableIconEditor = function() {
                        $scope.item.live.$$service.stop();
                        $scope.iconsArray = ObjectIconService.getIcons($scope.item.category);
                        if($scope.item.icon_id){
                            var key = _.findLastIndex($scope.iconsArray, {id: $scope.item.icon_id});
                            $scope.selectedIcon = $scope.iconsArray[key];                            
                        }

                        $scope.editorIconEnabled=true;
                    };

                    $scope.disableEditor = function() {
                        $scope.editorNameEnabled = false;
                        $scope.editorIconEnabled = false;
                        $scope.item.live.$$service.start();
                    };

                    $scope.saveIcon = function(form){
                        if(form.$valid){                            
                            $scope.item.icon_id = form.selectedIcon.$modelValue.id;
                            $scope.item.live.updateObject($scope.item).then(function(response){
                                $scope.disableEditor();
                            },function(){
                                $scope.disableEditor();
                            })
                        }
                    }
                    $scope.saveName = function(form) {                                       
                        if(form.$valid){
                            $scope.item.name = form.editableText.$modelValue;                          
                            $scope.item.live.updateObject($scope.item).then(function(response){
                                $scope.disableEditor();
                            })                            
                        }                        
                    };
                  
                }
            }
        }])

    };

    app.directive('batObject',['$compile','ObjectTemplateService',function($compile, ObjectTemplateService){
        return {
            restrict: 'E',
            scope: {
                item: '=',
                room: '@',
                type: '@',
                items: '=',
                setfavorite:'='
            },
            link: function(scope,el,attrs){
                if(scope.item.category && scope.item.template_id){
                    var type = ObjectTemplateService.getTemplate(scope.item.category, scope.item.template_id);
                    var type=type.name?type.name:null;                  
                    var tag = 'bat-object-'+type;
                    var room = scope.room;
                    var html='<'+tag+' item="item" items="items" room="{{room}}" type="{{type}}" setfavorite="setfavorite"></'+tag+'>';
                    el.html(html);
                    $compile(el.contents())(scope);                    
                }
            }
        };
    }]);


    regType('light-switch-with-one-button', ['$scope', function ($scope) {
        $scope.onChange = function(){            
            $scope.item.live.setValue(parseInt($scope.item.live.ModuleValue));
        }        
    }]);

    regType('light-switch-with-two-buttons', ['$scope', function ($scope) {
        $scope.onChange = function(value){
            $scope.item.live.setValue(value);
        }
    }]);

    regType('light-dimming-two-buttons', ['$scope', function ($scope) {
        $scope.onChange = function(direction){
            var value = parseInt($scope.item.live.ModuleValue);
            if(direction == 'up'){
                value += $scope.item.ratio?$scope.item.ratio:10;
            }else{
                value -= $scope.item.ratio?$scope.item.ratio:10;
            }
            value = (value > 100) ? 100 : ((value < 0) ? 0 : value);            
            $scope.item.live.setValue(value);
        }
    }]);

    regType('light-dimming-with-slider', ['$scope','$timeout','$interval', function ($scope, $timeout, $interval) {
        $scope.slider = {
            value: 0,
            options: {
                floor: 0,
                ceil: 100,
                onEnd: function () {
                    $scope.item.live.setValue($scope.slider.value);
                }
            }
        };
        $scope.$watch(function(){return $scope.item.live.ModuleValue;}, function(value) {
            $scope.slider.value = value;
        });        
    }]);

    regType('light-dimming-with-or-without-memory', ['$scope','batApiSrv', function ($scope, batApiSrv) {

            var inputObject = {};
            var input;
            if($scope.item.dimming_input){
                input = $scope.item.dimming_input.replace(/[0-9]/g, '');                
            }

            inputObject.HAModuleId = $scope.item.HAModuleId;
            inputObject.ModuleItem = $scope.item.dimming_input;
            inputObject.ModuleType = input;
            inputObject.ModuleValue = "1";            
            var params = {};
            params.button = 'Left';

        $scope.onPress = function(){
            params.mouseState = 'Down';
            batApiSrv.setHelpModuleValue(inputObject, params);
            //console.log("press");
        }
        $scope.onPressUp = function(){
            params.mouseState = 'Up';
            batApiSrv.setHelpModuleValue(inputObject, params);
            //console.log("release");
        }

        $scope.onTap = function(){
            params.mouseState = 'Down';
            batApiSrv.setHelpModuleValue(inputObject, params).then(function(){
                params.mouseState = 'Up';
                batApiSrv.setHelpModuleValue(inputObject, params);
            }); 
            //console.log("tap");
        }
        $scope.slider = {
            value: 0,
            options: {
                floor: 0,
                ceil: 100,
                onEnd: function () {
                    $scope.item.live.setValue($scope.slider.value);
                }
            }
        };
        $scope.$watch(function(){return $scope.item.live.ModuleValue;}, function(value) {
            $scope.slider.value = value;
        });          
    }]);



    regType('scenario-one', ['$scope','$timeout', function ($scope, $timeout) {
        $scope.onChange = function(){
            var params = {};
            $scope.loading = false;
            params.button = 'Left';
            params.mouseState = 'Down';
            $scope.item.live.setValue(1, params).then(function(){
                $scope.loading = true;
                $timeout(function(){
                    params.mouseState = 'Up';
                    $scope.item.live.setValue(1, params).then(function(){
                        $scope.loading = false;
                    })
                }, 2000)
            });         
        }
    }]);


    regType('heating-one', ['$scope', 'batApiSrv', function ($scope, batApiSrv) {
        var setObject = {};
        setObject.HAModuleId = $scope.item.HAModuleId;
        setObject.ModuleType = $scope.item.ModuleType;
        setObject.ModuleItem = "Instruction";

        batApiSrv.getHelpModuleValue(setObject).then(function(response){
            if(response.ModuleValue == undefined){
               $scope.item.setpoint = 20;
            }else{
                $scope.item.setpoint = parseFloat(response.ModuleValue);
            }
        })

        $scope.onChange = function(direction){
            var initialValue = $scope.item.setpoint;
            var changedValue = initialValue;
            changedValue = parseFloat(changedValue).toFixed(1); 
            if(direction == 'up'){
                if(initialValue < 35){
                    changedValue = Number(changedValue) + Number(0.2);
                }
            }else{
                if(initialValue > 15){
                    changedValue = Number(changedValue) - Number(0.2);
                }
            }          
            changedValue = parseFloat(changedValue).toFixed(1);              
            
            setObject.ModuleValue = changedValue;            
            batApiSrv.setHelpModuleValue(setObject, {}).then(function(response){                
                $scope.item.setpoint = changedValue;
            }, function(){
                $scope.item.setpoint = initialValue;
            })
        }        
    }]);


    regType('shutters-one', ['$scope','$timeout','batApiSrv', function ($scope, $timeout, batApiSrv) {
        $scope.goingDown = false;
        $scope.goingUp = false;
        var timeout;  
        var time = $scope.item.shutter_seconds?$scope.item.shutter_seconds:10;

        $scope.up = function(){
            var params = {};
            params.button = 'Left';
            params.mouseState = 'Down';                
            $scope.item.live.setValue('1', params).then(function(response){
                params.button = 'Left';
                params.mouseState = 'Up';
                $scope.item.live.setValue('1', params).then(function(response){
                    timeout = $timeout(function(){
                        $scope.goingUp = false;
                        $scope.goingDown = false;
                    }, time*1000)
                })                     
            })
        }
        $scope.down = function(){
            var params = {};
            params.button = 'Left';
            params.mouseState = 'Down';
            var downObject = {};
            downObject.HAModuleId = $scope.item.HAModuleId;
            downObject.ModuleItem = $scope.item.shutter_input;
            downObject.ModuleType = $scope.item.ModuleType;
            downObject.ModuleValue = "1";
            batApiSrv.setHelpModuleValue(downObject, params).then(function(response){
                params.button = 'Left';
                params.mouseState = 'Up';                    
                batApiSrv.setHelpModuleValue(downObject, params).then(function(response){
                    timeout = $timeout(function(){
                        $scope.goingUp = false;
                        $scope.goingDown = false;
                    }, time*1000)
                })                    
            })            
        }
        $scope.onStop = function(direction){
            $timeout.cancel( timeout );
            $scope.goingUp = false;
            $scope.goingDown = false; 
            if(direction == 'up'){
                $scope.up();
            }else{
                $scope.down();
            }
        }
        $scope.onMove = function(direction){
            $timeout.cancel( timeout );
            switch(direction) {
                case 'up':
                    $scope.goingUp = true;
                    $scope.goingDown = false;                    
                break;
                case 'down':
                    $scope.goingDown = true;
                    $scope.goingUp = false;                    
                break;
                default:
                    $scope.goingUp = false;
                    $scope.goingDown = false;
            }
            if(direction == 'up'){            
                $scope.up();
            }else{
                $scope.down();
            }
        }
    }])

    regType('magnetic-contactor', ['$scope', function ($scope) {
    }]);

    regType('flood-detector', ['$scope', function ($scope) {
    }]);

    regType('door-yale', ['$scope','$timeout', function ($scope, $timeout) {
        $scope.loading = false;
        $scope.onChange = function(){
            $scope.loading = true;
            $scope.item.live.setValue(100).then(function(){
                $timeout(function(){
                    $scope.item.live.setValue(0).then(function(){
                        $scope.loading = false;
                    })
                }, 2000)
            }); 
        }
    }]);

    regType('smoke-detector-circuit', ['$scope','batApiSrv','$timeout', function ($scope, batApiSrv, $timeout) {
        var resetObject = {};
        var output;
        $scope.loading = false;
        if($scope.item.detector_output){
            output = $scope.item.detector_output.replace(/[0-9]/g, '');            
        }
        resetObject.HAModuleId = $scope.item.HAModuleId;
        resetObject.ModuleItem = $scope.item.detector_output;
        resetObject.ModuleType = output;
        $scope.onChange = function(){
            $scope.loading = true;        
            resetObject.ModuleValue = 0;
            batApiSrv.setHelpModuleValue(resetObject).then(function(response){
                resetObject.ModuleValue = 100;
                $timeout(function(){
                    batApiSrv.setHelpModuleValue(resetObject).then(function(response){
                        $scope.loading = false;
                    })                    
                }, 1000)
            })
        }
    }]);
})(angular, window, $);

},{"./controllers":5,"./directives":21,"./factories":29,"./services":41}],31:[function(require,module,exports){
'use strict';

module.exports = ["CookiesService", "$q", "$http", "$location", "ToastService","UserFactory",  function(CookiesService, $q, $http, $location, ToastService, UserFactory) {
    var cache = function(key, value){
        CookiesService.put(key, value);
    }
    var cacheUser = function(user){
        CookiesService.put('user', user);
    }
    var cacheUserId = function(user_id){
        CookiesService.put('user_id', user_id);
    }
    var uncacheSession = function(){
        CookiesService.remove('user');
        CookiesService.remove('user_id');
        CookiesService.remove('token');
        CookiesService.remove('type');
        CookiesService.remove('language');
    }    

    return {
        login: function(credentials){
            var deferred = $q.defer();
            UserFactory.login(credentials).then(function(response){
                cache('token', response.token);
                cache('user_id', response.user.id);
                cache('user', response.user.name);
                cache('type', response.user.type);
                deferred.resolve(null);
            }, function(err){
                deferred.reject(null);
            })
            return deferred.promise;
        },
        logout: function(){     
            UserFactory.logout().then(function(){
                uncacheSession();
                $location.path('/');                
            })
        },
        isLoggedIn: function()
        {   
            return CookiesService.get('token');
        },
        isAdmin: function(){
            return CookiesService.get('token') && (CookiesService.get('user') == 'admin@admin.com');
        }
    }
}]
},{}],32:[function(require,module,exports){
'use strict';

module.exports = ["$cookies", function($cookies) {
    var storage = window.localStorage;
    return {
        get : function(key) {
            return $cookies.get(key);  
            //return storage.getItem(key);
        },
        put : function(key, value) {
            var expireDate = new Date();
            expireDate.setDate(expireDate.getDate() + 365);

            $cookies.put(key, value, {'expires': expireDate});
            return value;
            //storage.setItem(key, value);
            //return value;

        },
        remove : function(key) {
            return $cookies.remove(key);
            //return storage.removeItem(key);
        }
    }
}]
},{}],33:[function(require,module,exports){
'use strict';

module.exports = function() {

    var icons = {};
    icons.L = [];
    icons.RM = [];
    icons.H = [];
    icons.SC = [];
    icons.SE = [];

    icons.houses = [];
    icons.floors = [];
    icons.rooms = [];
    
    icons.L.push({id:1, name:'lights-01', type : 'icon'});
    icons.L.push({id:2, name:'lights-02', type : 'icon'});
    icons.L.push({id:3, name:'lights-03', type : 'icon'});
    icons.L.push({id:4, name:'lights-04', type : 'icon'});
    
    icons.L.push({id:5, name:'lights-05', type : 'icon'});
    icons.L.push({id:6, name:'lights-06', type : 'icon'});
    icons.L.push({id:7, name:'lights-07', type : 'icon'});
    icons.L.push({id:8, name:'lights-08', type : 'icon'});
    icons.L.push({id:9, name:'lights-09', type : 'icon'});
    icons.L.push({id:10, name:'lights-10', type : 'icon'});
    icons.L.push({id:11, name:'lights-11', type : 'icon'});
    icons.L.push({id:12, name:'lights-12', type : 'icon'});
    icons.L.push({id:13, name:'fa fa-battery-half', type : 'progress-bar-horisontal-01'});
    icons.L.push({id:14, name:'fa fa-circle-o-notch', type : 'progress-round-01'});



    icons.RM.push({id:1, name:'fa fa-bars'});

    icons.SC.push({id:1, name:'fa fa-power-off'});
    icons.SC.push({id:2, name:'fa fa-television'});
    icons.SC.push({id:3, name:'fa fa-volume-up'});
    icons.SC.push({id:4, name:'fa fa-volume-off'});
    icons.SC.push({id:5, name:'fa fa-bell'});
    icons.SC.push({id:6, name:'fa fa-bell-slash'});
    icons.SC.push({id:7, name:'fa fa-circle'});
    icons.SC.push({id:8, name:'fa fa-check-circle'});
    icons.SC.push({id:9, name:'fa fa-toggle-on'});
    icons.SC.push({id:10, name:'fa fa-toggle-off'});
    icons.SC.push({id:11, name:'fa fa-bed'});

    icons.SE.push({id:1, name:'fa fa-fire'});
    icons.SE.push({id:2, name:'fa fa-tint'});
    icons.SE.push({id:3, name:'contactors-window-1'});
    icons.SE.push({id:4, name:'contactors-door-1'});


    icons.houses.push({id:1, name:'houses-01', human:'human'});
    icons.houses.push({id:2, name:'houses-02', human:'human'});
    icons.houses.push({id:3, name:'houses-03', human:'human'});
    icons.houses.push({id:4, name:'houses-04', human:'human'});
    

    icons.floors.push({id:1, name:'floors-01', human:'human'});
    icons.floors.push({id:2, name:'floors-02', human:'human'});
    icons.floors.push({id:3, name:'floors-03', human:'human'});
    icons.floors.push({id:4, name:'floors-04', human:'human'});
    icons.floors.push({id:5, name:'floors-05', human:'human'});

    icons.floorsAll = [];
    icons.floorsAll.push({id:1, name:'floors-all-2', human:'For 2 stories building'});
    icons.floorsAll.push({id:2, name:'floors-all-3', human:'For 3 stories building'});
    


    icons.rooms.push({id:1, name:'rooms-01', human:'room'});
    icons.rooms.push({id:2, name:'rooms-02', human:'room'});
    //icons.rooms.push({id:3, name:'rooms-03', human:'room'});
    icons.rooms.push({id:4, name:'rooms-04', human:'room'});
    icons.rooms.push({id:5, name:'rooms-05', human:'room'});
    icons.rooms.push({id:6, name:'rooms-06', human:'room'});
    icons.rooms.push({id:7, name:'rooms-07', human:'room'});
    icons.rooms.push({id:8, name:'rooms-08', human:'room'});
    icons.rooms.push({id:9, name:'rooms-09', human:'room'});
    icons.rooms.push({id:10, name:'rooms-10', human:'room'});
    icons.rooms.push({id:11, name:'rooms-11', human:'room'});
    //icons.rooms.push({id:12, name:'rooms-12', human:'room'});
    
    return {
        getIcons : function(key) {
            return icons[key];
        },
        getIcon : function(key, id) {
            if(key){
                var key1 = _.findLastIndex(icons[key], {id: id});
                return icons[key][key1];                
            }
        }
    }
}
},{}],34:[function(require,module,exports){
'use strict';

module.exports = function() {    

    var template = {};
    template.L = [];
    template.CM = [];
    template.RM = [];
    template.H = [];
    template.SC = [];
    template.SE = [];
    
    template.L.push({id:1, name:'light-switch-with-one-button', human:'Light switch with one button'});
    template.L.push({id:2, name:'light-switch-with-two-buttons', human:'Lights switch with 2 buttons'});
    template.L.push({id:3, name:'light-dimming-two-buttons', human:'Dimmer with 2 buttons'});
    template.L.push({id:4, name:'light-dimming-with-slider', human:'Dimmer with slider'});
    template.L.push({id:5, name:'light-dimming-with-or-without-memory', human:'Dimmer with or without memory'});
    
    
    
    template.RM.push({id:1, name:'shutters-one', human:'Shutters with 2 buttons'});


    template.H.push({id:1, name:'heating-one', human:'Heating control with 2 buttons'});

    template.SC.push({id:1, name:'scenario-one', human:'Scenario with one set/reset'});

    template.SE.push({id:1, name:'smoke-detector-circuit', human:'Smoke detector with reset circuit'});
    template.SE.push({id:2, name:'flood-detector', human:'Flood detector'});
    template.SE.push({id:3, name:'door-yale', human:'Door yale'});
    template.SE.push({id:4, name:'magnetic-contactor', human:'Magentic contactors'});

    return {
        getTemplates : function(key) {
            return template[key];
        },
        getTemplate : function(key, id) {
            var key1 = _.findLastIndex(template[key], {id: id});
            return template[key][key1];
        }        
    }
        
}
},{}],35:[function(require,module,exports){
'use strict';

module.exports = ["ngToast", function(ngToast) {
    return {
        create: function(message, className){
			ngToast.create({
				className: className,
				content: message,
				dismissButton: true,
				dismissButtonHtml: '&times;'
			});        	
        }
    }
}];
},{}],36:[function(require,module,exports){
'use strict';

module.exports = function() {    

    var words = [];
    return {
        get : function(key) {
            return words[key];
        }, 
        set : function(key, value){
            return words[key] = value;
        }
    }
}
},{}],37:[function(require,module,exports){
'use strict';

module.exports = function() {    

    var icons = [];
    icons['200'] = 'wi wi-thunderstorm'; //thunderstorm with light rain
    icons['201'] = 'wi wi-thunderstorm'; //thunderstorm with rain
    icons['202'] = 'wi wi-thunderstorm'; //thunderstorm with heavy rain
    icons['210'] = 'wi wi-thunderstorm'; //light thunderstorm
    icons['211'] = 'wi wi-thunderstorm'; //thunderstorm
    icons['212'] = 'wi wi-thunderstorm'; //heavy thunderstorm
    icons['221'] = 'wi wi-thunderstorm'; //ragged thunderstorm
    icons['230'] = 'wi wi-thunderstorm'; //thunderstorm with light drizzle
    icons['231'] = 'wi wi-thunderstorm'; //thunderstorm with drizzle
    icons['232'] = 'wi wi-thunderstorm'; //thunderstorm with heavy drizzle

    icons['300'] = 'wi wi-showers'; //light intensity drizzle
    icons['301'] = 'wi wi-showers'; //drizzle
    icons['302'] = 'wi wi-showers'; //heavy intensity drizzle
    icons['310'] = 'wi wi-showers'; //light intensity drizzle rain
    icons['311'] = 'wi wi-showers'; //drizzle rain
    icons['312'] = 'wi wi-showers'; //heavy intensity drizzle rain
    icons['313'] = 'wi wi-showers'; //shower rain and drizzle
    icons['314'] = 'wi wi-showers'; //heavy shower rain and drizzle
    icons['321'] = 'wi wi-showers'; //shower drizzle

    icons['500'] = 'wi wi-showers'; //light rain
    icons['501'] = 'wi wi-showers'; //moderate rain
    icons['502'] = 'wi wi-showers'; //heavy intensity rain
    icons['503'] = 'wi wi-showers'; //very heavy rain
    icons['504'] = 'wi wi-showers'; //extreme rain
    icons['511'] = 'wi wi-snow'; //freezing rain
    icons['520'] = 'wi wi-rain'; //light intensity shower rain
    icons['521'] = 'wi wi-rain'; //shower rain
    icons['522'] = 'wi wi-rain'; //heavy intensity shower rain
    icons['531'] = 'wi wi-rain'; //ragged shower rain

    icons['600'] = 'wi wi-snow'; //light snow
    icons['601'] = 'wi wi-snow'; //snow
    icons['602'] = 'wi wi-snow'; //heavy snow
    icons['611'] = 'wi wi-snow'; //sleet
    icons['612'] = 'wi wi-snow'; //shower sleet
    icons['615'] = 'wi wi-snow'; //light rain and snow
    icons['616'] = 'wi wi-snow'; //rain and snow
    icons['620'] = 'wi wi-snow'; //light shower snow
    icons['621'] = 'wi wi-snow'; //shower snow
    icons['622'] = 'wi wi-snow'; //heavy shower snow

    icons['701'] = 'wi wi-fog'; //mist
    icons['711'] = 'wi wi-fog'; //smoke
    icons['721'] = 'wi wi-fog'; //haze
    icons['731'] = 'wi wi-fog'; //sand, dust whirls
    icons['741'] = 'wi wi-fog'; //fog
    icons['751'] = 'wi wi-fog'; //sand
    icons['761'] = 'wi wi-fog'; //dust
    icons['762'] = 'wi wi-fog'; //volcanic ash
    icons['771'] = 'wi wi-fog'; //squalls
    icons['781'] = 'wi wi-fog'; //tornado

    icons['800'] = 'wi wi-day-sunny'; //clear sky
    icons['801'] = 'wi wi-day-cloudy'; //few clouds
    icons['802'] = 'wi wi-cloudy'; //scattered clouds
    icons['803'] = 'wi wi-cloudy'; //broken clouds
    icons['804'] = 'wi wi-cloudy'; //overcast clouds
    return {
        getIcon : function(key) {
            return icons[key];
        },
        getMock: function(){
            return icons[200];
        }
    }
}
},{}],38:[function(require,module,exports){
'use strict';


module.exports = ["$http", "$q", "$interval", "CookiesService", "$timeout", "UserFactory", "ObjectFactory", function($http, $q, $interval, CookiesService, $timeout, UserFactory, ObjectFactory) {
    

        var LiveObject = function (object,service) {
            this.id = object.id;
            this.ModuleValue = object.ModuleValue == undefined ? 0 : object.ModuleValue;
            this.HAModuleId = object.HAModuleId;
            this.ModuleItem = object.ModuleItem;
            this.ModuleType = object.ModuleType;
            this.ts = new Date().getTime();
            this.$$service = service; // link to batBmsService
        };
        LiveObject.prototype.update = function (object) {            
            // Update only if it is a newer value            
            if ( (object.ts>this.ts || !this.ts) && (this.ModuleValue != object.ModuleValue) ) {
                this.ModuleValue = object.ModuleValue;
                this.ts = new Date().getTime();
            }
        };
        LiveObject.prototype.setValue = function (value, params) {
            var deferred = $q.defer();
            var self = this;

            if(params == undefined){
                params = {};
                params.button = undefined;
                params.mouseState = undefined;
            }
            this.$$service.stop();
            this.ModuleValue = value;
            this.ts = new Date().getTime();
            this.$$service.setModulesValue(this, params).then(function(response){                
                $timeout(function(){
                    self.$$service.start();
                }, 1000);
                deferred.resolve(response);
            });
            
            return deferred.promise;          
        };        
        
        LiveObject.prototype.updateObject = function(object){
            var deferred = $q.defer();
            ObjectFactory.update(object).then(function(response){
                deferred.resolve(null);
            }, function(response){
                deferred.reject(null);
            })                                    
            return deferred.promise;
        }

        var BmsService = function () {
            this.liveObjects = [];
            this.liveObjectsIndex = {};
            this._watcherHandle = null;
            this._lastTimestamp = null;
            this.status = null;
        };

        BmsService.prototype.getLiveObject = function (object) {
            if (typeof object === 'object') {
                if (this.liveObjectsIndex[object.id]) {
                    return this.liveObjectsIndex[object.id];
                }else{
                    var obj = new LiveObject(object,this);
                    this._addLiveObject(obj);
                    return obj;
                }
            }else{
                return this.liveObjectsIndex[object];
            }
        };

        BmsService.prototype.getLiveList = function (list) {
            var self = this;
            angular.forEach(list, function (object) {
                object.live = self.getLiveObject(object);
            });
            return list;
        };

        BmsService.prototype.clearObjects = function () {
            this.liveObjects = [];
            this.liveObjectsIndex = {};
        };

        BmsService.prototype._addLiveObject = function (liveObject) {
            this.liveObjects.push(liveObject);
            this.liveObjectsIndex[liveObject.id]=liveObject;
        };   
        BmsService.prototype.setModulesValue = function(objectBms, params){
            var deferred = $q.defer();
            var self = this;
            var ts = new Date().getTime();
            if(params == undefined){
                params = {};
                var button = undefined;
                var mouseState = undefined;
            }else{
                var button = params.button;       
                var mouseState = params.mouseState;
            }             
            $http.get('/helpers/setModulesValue/'+objectBms.id+'/'+objectBms.ModuleValue+'/'+button+'/'+mouseState).success(function(response){
                if(response.status){
                    deferred.resolve(true);
                }else{
                    deferred.resolve(false);
                }
            }).error(function(response){
                deferred.resolve(false);
            })
            return deferred.promise;
        } 
        BmsService.prototype.setHelpModuleValue = function(objectBms, params){
            var deferred = $q.defer();
            if(params == undefined){
                params = {};
                var button = undefined;
                var mouseState = undefined;
            }else{
                var button = params.button;       
                var mouseState = params.mouseState;
            }   
            $http.get('/helpers/setHelpModuleValue/'+objectBms.HAModuleId+'/'+objectBms.ModuleItem+'/'+objectBms.ModuleType+'/'+objectBms.ModuleValue+'/'+button+'/'+mouseState).success(function(response){
                if(response.status){   
                    deferred.resolve(null);
                }else{
                    deferred.reject(null);
                }
            }).error(function(response){
                deferred.resolve(false);
            })
            return deferred.promise;
        }

        BmsService.prototype.getHelpModuleValue = function(objectBms){
            var deferred = $q.defer();
            $http.get('/helpers/getHelpModuleValue/'+objectBms.HAModuleId+'/'+objectBms.ModuleType+'/'+objectBms.ModuleItem).success(function(response){
                if(response.status){
                    deferred.resolve(response.object);
                }else{
                    deferred.reject(null);
                }
            }).error(function(response){
                deferred.reject(null);
            })
            return deferred.promise;
        }

 

        BmsService.prototype.updateModule = function () {
            var self = this;
            var deferred = $q.defer();           
            var ids = Object.keys(this.liveObjects);
            var objectsIds = [];
            for (var i = 0; i < ids.length; i++) {
                objectsIds.push(this.liveObjects[ids[i]].id);
            }            
            ids=objectsIds.join(',');            
            if(ids.length == 0){
                deferred.resolve(null);
            }else{
                var ts = Date.now();                    
                $http.get('/helpers/GetModuleValuesByToken/'+ids).success(function(response){
                    if(response.status){
                        for (var i in response.objects){
                            var item = response.objects[i];
                            item.id = item.id;                            
                            var obj  = self.getLiveObject(item);
                            item.ts  = ts;
                            obj.update(item);
                        }
                    }
                    deferred.resolve(null);
                }).error(function(response){
                    deferred.resolve(null);
                })       
            }            
            return deferred.promise;         
        };

        BmsService.prototype._watcherFn = function () {
            if (this._processRunning) {
                return;
            }else{
                var self=this;
                this._processRunning = true;
                this.updateModule().then(function () {                    
                    self._processRunning = false;
                })
            }
        };


        BmsService.prototype.start = function(){            
            if (this._watcherHandle) {
                return false;
            }else{
                var self=this;
                this._watcherHandle = $interval(function(){
                    self._watcherFn();
                }, 1000);
                return true;
            }        
        }

        BmsService.prototype.stop = function () {
            if (this._watcherHandle) {
                var res=$interval.cancel(this._watcherHandle);
                this._watcherHandle = null;
                return res;
            }else{
                return false;
            }
        };

        var service = new BmsService();
        service.start();
        return service;
}]

},{}],39:[function(require,module,exports){
'use strict';

module.exports = ["$http", "TranslateService", "CookiesService", function($http, TranslateService, CookiesService) {
  
    var model = {
        getConfigAndGenerateRoutes : function($routeProvider){
            return $http.get('/helpers/words').success(function(response) {
                _.each(response, function(v, k){
                    TranslateService.set(k,v);
                })
                var type = CookiesService.get('type');
                model.generateRoutes($routeProvider, type);
            });                        

        },
        generateRoutes: function($routeProvider, type) {
            $routeProvider.when('/start', {
                templateUrl: './views/home.html'
                ,controller: 'homeCtrl'
                ,resolve : {
                    title : function(){
                        return CookiesService.get('user');
                        //return TranslateService.get('home');
                    },
                    objects : ['UserFactory','ObjectFactory', function(UserFactory, ObjectFactory){
                        return ObjectFactory.search({user_id:CookiesService.get('user_id'), favorite:1}).then(function(response){
                            return response;
                        });
                    }],
                    type : function(){
                        return type;
                    }              
                }
            })

            $routeProvider.when('/tree', {
                templateUrl: './views/tree.html'
                ,controller: 'treeCtrl'
                ,resolve : {
                    items : ['UserFactory','RoomFactory','FloorFactory','HouseFactory', function(UserFactory, RoomFactory, FloorFactory, HouseFactory){
                        switch(type){
                            case 'ap':
                                return RoomFactory.search({user_id:CookiesService.get('user_id')}).then(function(response){
                                    return response;
                                })
                            break;
                            case 'house':
                                return FloorFactory.search({user_id:CookiesService.get('user_id')}).then(function(response){                                
                                    return response;
                                })
                            break;
                            case 'complex':
                                return HouseFactory.search({user_id:CookiesService.get('user_id')}).then(function(response){
                                    return response;                                    
                                })                                
                            break;
                        }
                    }],
                    objects : ['ObjectFactory', function(ObjectFactory){
                        return ObjectFactory.search({user_id:CookiesService.get('user_id'), house_id:0, floor_id:0, room_id:0}).then(function(response){
                            return response;
                        })
                    }],                    
                    zone : function(){
                        switch(type){
                            case 'ap':
                                return 'rooms';
                            break;
                            case 'house':
                                return 'floors';
                            break;
                            case 'complex':
                                return 'houses';
                            break;
                        }
                    },
                    type : function(){
                        return type;
                    },
                    title : function(){
                        return TranslateService.get('house_plan');
                    }
                }       
            })
            $routeProvider.when('/ap', {
                templateUrl: './views/ap.html'
                ,controller: 'apCtrl'
                ,resolve : {
                    objects : ['ObjectFactory', function(ObjectFactory){
                        return ObjectFactory.search({user_id:CookiesService.get('user_id')}).then(function(response){
                            return response;
                        })
                    }],                    
                    zone : function(){
                        switch(type){
                            case 'ap':
                                return 'rooms';
                            break;
                            case 'house':
                                return 'floors';
                            break;
                            case 'complex':
                                return 'houses';
                            break;
                        }
                    },
                    title : function(){
                        return TranslateService.get('house_plan');
                    },
                    type : function(){
                        return type;
                    }                    
                }       
            })
            $routeProvider.when('/house/:houseId', {
                templateUrl: './views/house.html'
                ,controller: 'houseCtrl'
                ,resolve : {
                    objects : ['$route', 'UserFactory','ObjectFactory', function($route, UserFactory, ObjectFactory){
                        return ObjectFactory.search({user_id:CookiesService.get('user_id'), house_id:$route.current.params.houseId, floor_id:0, room_id:0}).then(function(response){
                            return response;                            
                        })                        
                    }],                     
                    floors : ['$route', 'UserFactory','FloorFactory',  function($route, UserFactory, FloorFactory){
                        return FloorFactory.search({user_id:CookiesService.get('user_id'), house_id:$route.current.params.houseId}).then(function(response){
                            return response;
                        })
                    }],
                    house : ['$route','UserFactory','HouseFactory', function($route, UserFactory, HouseFactory){
                        return HouseFactory.search({user_id:CookiesService.get('user_id'), house_id:$route.current.params.houseId}).then(function(response){
                            return response[0];
                        })
                    }],
                    type : function(){
                        return type;
                    }
                }       
            })
            $routeProvider.when('/floor/:floorId', {
                templateUrl: './views/floor.html'
                ,controller: 'floorCtrl'
                ,resolve : {
                    objects : ['$route', 'ObjectFactory', function($route, ObjectFactory){
                        return ObjectFactory.search({user_id:CookiesService.get('user_id'), floor_id:$route.current.params.floorId, room_id:0}).then(function(response){
                            return response;
                        })                            
                    }],                     
                    rooms : ['$route', 'RoomFactory', function($route, RoomFactory){
                        return RoomFactory.search({user_id:CookiesService.get('user_id'),floor_id:$route.current.params.floorId}).then(function(response){                        
                            return response;
                        })                            
                    }],
                    floor : ['$route', 'FloorFactory', function($route, FloorFactory){
                        return FloorFactory.search({user_id:CookiesService.get('user_id'),floor_id:$route.current.params.floorId}).then(function(response){
                            return response[0];
                        })
                    }],
                    type : function(){
                        return type;
                    }
                }       
            })
            $routeProvider.when('/room/:roomId/:typeId?', {
                templateUrl: './views/room.html'
                ,controller: 'roomCtrl'
                ,resolve : {
                    objects : ['$route', 'RoomFactory','ObjectFactory', function($route, RoomFactory, ObjectFactory){
                        return ObjectFactory.search({user_id:CookiesService.get('user_id'), room_id:$route.current.params.roomId, category:$route.current.params.typeId}).then(function(response){
                            return response;
                            
                        })
                    }],
                    room : ['$route','UserFactory','RoomFactory', function($route, UserFactory, RoomFactory){
                        return RoomFactory.search({user_id:CookiesService.get('user_id'), room_id:$route.current.params.roomId}).then(function(response){
                            return response[0];
                            
                        })
                    }],                    
                    type : function(){
                        return type;
                    },
                    typeId : ["$route",function($route){
                        return $route.current.params.typeId;
                    }]  
                }       
            })

            $routeProvider.when('/settings', {
                templateUrl: './views/settings.html'
                ,controller: 'settingsCtrl'
            })

            $routeProvider.when('/type/:category/:houseId?/:floorId?/:roomId?', {
                templateUrl: function(){
                    return './views/type.html';
                }
                ,controller: 'typeCtrl'
                ,resolve : {
                    objects : ['$route', 'UserFactory','ObjectFactory', function($route, UserFactory, ObjectFactory){
                        return ObjectFactory.search({user_id:CookiesService.get('user_id'), category:$route.current.params.category,'house_id':$route.current.params.houseId,floor_id:$route.current.params.floorId,room_id:$route.current.params.roomId}).then(function(response){
                            return response;                            
                        })
                    }],
                    type : function(){                        
                        return type;
                    },
                    typeId : ["$route",function($route){
                        return $route.current.params.category;
                    }],  
                    zones: ["helperObjectService", function(helperObjectService){
                        switch(type){
                            case 'ap':
                                return helperObjectService.getApTree(CookiesService.get('user_id')).then(function(items){
                                    return items;
                                });  
                            break;
                            case 'house':
                                return helperObjectService.getHouseTree(CookiesService.get('user_id')).then(function(items){
                                    return items;
                                });  
                            break;
                            case 'complex':
                                return helperObjectService.getComplexTree(CookiesService.get('user_id')).then(function(items){                                    
                                    return items;
                                });                                
                            break;
                        }
                    }],
                    title : ["$route", function($route){
                        return TranslateService.get($route.current.params.category);
                    }],
                    routes : ["$route", function($route){
                        var routes = {};
                        routes.houseId = $route.current.params.houseId;
                        routes.floorId = $route.current.params.floorId;
                        routes.roomId =$route.current.params.roomId;
                        return routes;
                    }]
                }
            })

            $routeProvider.otherwise({
                redirectTo: '/start'
            });
        }
    };
    return model;    
}]
},{}],40:[function(require,module,exports){
'use strict'; 
module.exports = ["$q", "$http", "RoomFactory", "FloorFactory", "HouseFactory",
	function($q, $http, RoomFactory, FloorFactory, HouseFactory) {

	var helperObjectService = function() {	

	};
	

	helperObjectService.prototype.reorder = function(items, type){
		var deferred = $q.defer();
		var i = 1;
		var items = items.map(function(item){
			item.order = i;
			i++;
			return item;
		})
		switch(type){
			case 'complex':
				angular.forEach(items, function(item){
					HouseFactory.update(item).then(function(){
					}, function(){
					})
				})
			break;
			case 'house':
				angular.forEach(items, function(item){
					FloorFactory.update(item).then(function(){
					}, function(){
					})
				})
			break;
			case 'ap':
				angular.forEach(items, function(item){
					RoomFactory.update(item).then(function(){
					}, function(){
					})
				})
			break;
		}
		
		return deferred.promise;
	}


	helperObjectService.prototype.getComplexTree = function(user_id){
		var deferred = $q.defer();
		var items = {};
		HouseFactory.search({user_id:user_id}).then(function(houses){
			items = houses;
			_.each(houses, function(house){
				FloorFactory.search({user_id:user_id, house_id:house.id}).then(function(floors){
					house.floors = floors;
					_.each(floors, function(floor){
						RoomFactory.search({user_id:user_id, floor_id:floor.id}).then(function(rooms){
							floor.rooms = rooms;
						})
					})
				})
			})	
			deferred.resolve(items);		
		})		
		return deferred.promise;
	}
	helperObjectService.prototype.getHouseTree = function(user_id){
		var deferred = $q.defer();
		var items = {};
		FloorFactory.search({user_id:user_id}).then(function(floors){
			items = floors;
			_.each(floors, function(floor){
				RoomFactory.search({user_id:user_id, floor_id:floor.id}).then(function(rooms){
					floor.rooms = rooms;
				})
			})
			deferred.resolve(items);
		})

		return deferred.promise;
	}
	helperObjectService.prototype.getApTree = function(user_id){
		var deferred = $q.defer();
		var items = {};
		RoomFactory.search({user_id:user_id}).then(function(rooms){
			items = rooms;
			deferred.resolve(items);			
		})
		return deferred.promise;
	}

    return new helperObjectService();

}];
},{}],41:[function(require,module,exports){
'use strict';

var app = angular.module('arena');


app.service('AuthentificationService', require('./AuthentificationService'));

app.service('configSrv', require('./configSrv'));

app.service('helperObjectService', require('./helperObjectService'));

app.service('batApiSrv', require('./batApiSrv'));




app.service('ObjectIconService', require('./ObjectIconService'));
app.service('ObjectTemplateService', require('./ObjectTemplateService'));
app.service('TranslateService', require('./TranslateService'));
app.service('WeatherIconService', require('./WeatherIconService'));
app.service('CookiesService', require('./CookiesService'));
app.service('ToastService', require('./ToastService'));

},{"./AuthentificationService":31,"./CookiesService":32,"./ObjectIconService":33,"./ObjectTemplateService":34,"./ToastService":35,"./TranslateService":36,"./WeatherIconService":37,"./batApiSrv":38,"./configSrv":39,"./helperObjectService":40}]},{},[30])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6XFxEcm9wYm94XFxEcm9wYm94XFxibXNfVjRcXG5vZGVfbW9kdWxlc1xcZ3VscC1icm93c2VyaWZ5XFxub2RlX21vZHVsZXNcXGJyb3dzZXJpZnlcXG5vZGVfbW9kdWxlc1xcYnJvd3Nlci1wYWNrXFxfcHJlbHVkZS5qcyIsImU6L0Ryb3Bib3gvRHJvcGJveC9ibXNfVjQvcHVibGljL2pzL2NvbnRyb2xsZXJzL2FwQ3RybC5qcyIsImU6L0Ryb3Bib3gvRHJvcGJveC9ibXNfVjQvcHVibGljL2pzL2NvbnRyb2xsZXJzL2Zsb29yQ3RybC5qcyIsImU6L0Ryb3Bib3gvRHJvcGJveC9ibXNfVjQvcHVibGljL2pzL2NvbnRyb2xsZXJzL2hvbWVDdHJsLmpzIiwiZTovRHJvcGJveC9Ecm9wYm94L2Jtc19WNC9wdWJsaWMvanMvY29udHJvbGxlcnMvaG91c2VDdHJsLmpzIiwiZTovRHJvcGJveC9Ecm9wYm94L2Jtc19WNC9wdWJsaWMvanMvY29udHJvbGxlcnMvaW5kZXguanMiLCJlOi9Ecm9wYm94L0Ryb3Bib3gvYm1zX1Y0L3B1YmxpYy9qcy9jb250cm9sbGVycy9sb2dpbkN0cmwuanMiLCJlOi9Ecm9wYm94L0Ryb3Bib3gvYm1zX1Y0L3B1YmxpYy9qcy9jb250cm9sbGVycy9yb29tQ3RybC5qcyIsImU6L0Ryb3Bib3gvRHJvcGJveC9ibXNfVjQvcHVibGljL2pzL2NvbnRyb2xsZXJzL3Nlc3Npb25zQ3RybC5qcyIsImU6L0Ryb3Bib3gvRHJvcGJveC9ibXNfVjQvcHVibGljL2pzL2NvbnRyb2xsZXJzL3NldHRpbmdzQ3RybC5qcyIsImU6L0Ryb3Bib3gvRHJvcGJveC9ibXNfVjQvcHVibGljL2pzL2NvbnRyb2xsZXJzL3RyZWVDdHJsLmpzIiwiZTovRHJvcGJveC9Ecm9wYm94L2Jtc19WNC9wdWJsaWMvanMvY29udHJvbGxlcnMvdHlwZUN0cmwuanMiLCJlOi9Ecm9wYm94L0Ryb3Bib3gvYm1zX1Y0L3B1YmxpYy9qcy9jb250cm9sbGVycy93aXp6YXJkQ3RybC5qcyIsImU6L0Ryb3Bib3gvRHJvcGJveC9ibXNfVjQvcHVibGljL2pzL2NvbnRyb2xsZXJzL3dpenphcmQvb2JqZWN0c0NvbnRyb2xsc0N0cmwuanMiLCJlOi9Ecm9wYm94L0Ryb3Bib3gvYm1zX1Y0L3B1YmxpYy9qcy9jb250cm9sbGVycy93aXp6YXJkL29iamVjdHNUb1Jvb21zQ3RybC5qcyIsImU6L0Ryb3Bib3gvRHJvcGJveC9ibXNfVjQvcHVibGljL2pzL2NvbnRyb2xsZXJzL3dpenphcmQvb2JqZWN0c1RvVGVtcGxhdGVDdHJsLmpzIiwiZTovRHJvcGJveC9Ecm9wYm94L2Jtc19WNC9wdWJsaWMvanMvY29udHJvbGxlcnMvd2l6emFyZC9yb29tc1RvSG91c2VDdHJsLmpzIiwiZTovRHJvcGJveC9Ecm9wYm94L2Jtc19WNC9wdWJsaWMvanMvY29udHJvbGxlcnMvd2l6emFyZC90ZW1wbGF0ZXNDdHJsLmpzIiwiZTovRHJvcGJveC9Ecm9wYm94L2Jtc19WNC9wdWJsaWMvanMvY29udHJvbGxlcnMvd2l6emFyZC91c2Vyc0N0cmwuanMiLCJlOi9Ecm9wYm94L0Ryb3Bib3gvYm1zX1Y0L3B1YmxpYy9qcy9kaXJlY3RpdmVzL2FkbWluLWFkZC1vYmplY3QtaXRlbS5qcyIsImU6L0Ryb3Bib3gvRHJvcGJveC9ibXNfVjQvcHVibGljL2pzL2RpcmVjdGl2ZXMvYWRtaW4tb2JqZWN0LWl0ZW0uanMiLCJlOi9Ecm9wYm94L0Ryb3Bib3gvYm1zX1Y0L3B1YmxpYy9qcy9kaXJlY3RpdmVzL2luZGV4LmpzIiwiZTovRHJvcGJveC9Ecm9wYm94L2Jtc19WNC9wdWJsaWMvanMvZGlyZWN0aXZlcy96b25lLmpzIiwiZTovRHJvcGJveC9Ecm9wYm94L2Jtc19WNC9wdWJsaWMvanMvZmFjdG9yaWVzL0Zsb29yRmFjdG9yeS5qcyIsImU6L0Ryb3Bib3gvRHJvcGJveC9ibXNfVjQvcHVibGljL2pzL2ZhY3Rvcmllcy9Ib3VzZUZhY3RvcnkuanMiLCJlOi9Ecm9wYm94L0Ryb3Bib3gvYm1zX1Y0L3B1YmxpYy9qcy9mYWN0b3JpZXMvSXRlbUZhY3RvcnkuanMiLCJlOi9Ecm9wYm94L0Ryb3Bib3gvYm1zX1Y0L3B1YmxpYy9qcy9mYWN0b3JpZXMvT2JqZWN0RmFjdG9yeS5qcyIsImU6L0Ryb3Bib3gvRHJvcGJveC9ibXNfVjQvcHVibGljL2pzL2ZhY3Rvcmllcy9Sb29tRmFjdG9yeS5qcyIsImU6L0Ryb3Bib3gvRHJvcGJveC9ibXNfVjQvcHVibGljL2pzL2ZhY3Rvcmllcy9Vc2VyRmFjdG9yeS5qcyIsImU6L0Ryb3Bib3gvRHJvcGJveC9ibXNfVjQvcHVibGljL2pzL2ZhY3Rvcmllcy9pbmRleC5qcyIsImU6L0Ryb3Bib3gvRHJvcGJveC9ibXNfVjQvcHVibGljL2pzL2Zha2VfYTEwYzdkZmQuanMiLCJlOi9Ecm9wYm94L0Ryb3Bib3gvYm1zX1Y0L3B1YmxpYy9qcy9zZXJ2aWNlcy9BdXRoZW50aWZpY2F0aW9uU2VydmljZS5qcyIsImU6L0Ryb3Bib3gvRHJvcGJveC9ibXNfVjQvcHVibGljL2pzL3NlcnZpY2VzL0Nvb2tpZXNTZXJ2aWNlLmpzIiwiZTovRHJvcGJveC9Ecm9wYm94L2Jtc19WNC9wdWJsaWMvanMvc2VydmljZXMvT2JqZWN0SWNvblNlcnZpY2UuanMiLCJlOi9Ecm9wYm94L0Ryb3Bib3gvYm1zX1Y0L3B1YmxpYy9qcy9zZXJ2aWNlcy9PYmplY3RUZW1wbGF0ZVNlcnZpY2UuanMiLCJlOi9Ecm9wYm94L0Ryb3Bib3gvYm1zX1Y0L3B1YmxpYy9qcy9zZXJ2aWNlcy9Ub2FzdFNlcnZpY2UuanMiLCJlOi9Ecm9wYm94L0Ryb3Bib3gvYm1zX1Y0L3B1YmxpYy9qcy9zZXJ2aWNlcy9UcmFuc2xhdGVTZXJ2aWNlLmpzIiwiZTovRHJvcGJveC9Ecm9wYm94L2Jtc19WNC9wdWJsaWMvanMvc2VydmljZXMvV2VhdGhlckljb25TZXJ2aWNlLmpzIiwiZTovRHJvcGJveC9Ecm9wYm94L2Jtc19WNC9wdWJsaWMvanMvc2VydmljZXMvYmF0QXBpU3J2LmpzIiwiZTovRHJvcGJveC9Ecm9wYm94L2Jtc19WNC9wdWJsaWMvanMvc2VydmljZXMvY29uZmlnU3J2LmpzIiwiZTovRHJvcGJveC9Ecm9wYm94L2Jtc19WNC9wdWJsaWMvanMvc2VydmljZXMvaGVscGVyT2JqZWN0U2VydmljZS5qcyIsImU6L0Ryb3Bib3gvRHJvcGJveC9ibXNfVjQvcHVibGljL2pzL3NlcnZpY2VzL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNVFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25HQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZrQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2UEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcclxubW9kdWxlLmV4cG9ydHMgPSBbXCIkc2NvcGVcIiwgXCJ0aXRsZVwiLCBcImJhdEFwaVNydlwiLCBcIm9iamVjdHNcIixcInR5cGVcIiwgZnVuY3Rpb24oJHNjb3BlLCB0aXRsZSwgYmF0QXBpU3J2LCBvYmplY3RzLCB0eXBlKSB7XHJcblxyXG4gICBcclxuICAgICRzY29wZS50aXRsZSA9IHRpdGxlO1xyXG5cclxuICAgICRzY29wZS5yb29tICAgPSAndHlwZSc7XHJcblxyXG4gICAgJHNjb3BlLnR5cGUgICA9IHR5cGU7XHJcblxyXG4gICAgJHNjb3BlLml0ZW1zID0gYmF0QXBpU3J2LmdldExpdmVMaXN0KG9iamVjdHMpOyAgICBcclxuXHJcbiAgICAkc2NvcGUuJG9uKCckZGVzdHJveScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBiYXRBcGlTcnYuY2xlYXJPYmplY3RzKCk7XHJcbiAgICB9KTtcclxuXHJcbn1dOyIsIlxyXG5tb2R1bGUuZXhwb3J0cyA9IFtcIiRzY29wZVwiLCBcImZsb29yXCIsIFwicm9vbXNcIiwgXCJ0eXBlXCIsIFwiaGVscGVyT2JqZWN0U2VydmljZVwiLFwiYmF0QXBpU3J2XCIsXCJvYmplY3RzXCIsICBmdW5jdGlvbigkc2NvcGUsIGZsb29yLCByb29tcywgdHlwZSwgaGVscGVyT2JqZWN0U2VydmljZSwgYmF0QXBpU3J2LCBvYmplY3RzKSB7XHJcblxyXG4gICAgJHNjb3BlLnRpdGxlID0gZmxvb3IubmFtZTtcclxuXHJcbiAgICBpZihmbG9vci5ob3VzZV9pZCl7XHJcbiAgICAgICAgJHNjb3BlLmZsb29yT2JqID0gZmxvb3I7ICAgICAgICBcclxuICAgICAgICAkc2NvcGUuYmFja1VybCA9ICcjL2hvdXNlLycrZmxvb3IuaG91c2VfaWQ7XHJcbiAgICB9ZWxzZXtcclxuICAgICAgICAkc2NvcGUuYmFja1VybCA9ICcjL3RyZWUnO1xyXG4gICAgfVxyXG4gICAgJHNjb3BlLnpvbmVzID0gcm9vbXM7XHJcblxyXG4gICAgJHNjb3BlLnJvb20gPSAnZmxvb3InO1xyXG5cclxuICAgICRzY29wZS56b25lID0gJ3Jvb21zJztcclxuXHJcbiAgICAkc2NvcGUuaXRlbXMgPSBiYXRBcGlTcnYuZ2V0TGl2ZUxpc3Qob2JqZWN0cyk7ICAgIFxyXG5cclxuICAgICRzY29wZS4kb24oJyRkZXN0cm95JywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGJhdEFwaVNydi5jbGVhck9iamVjdHMoKTtcclxuICAgIH0pOyAgICBcclxuXHJcbiAgICAkc2NvcGUudHJlZUNvbmZpZyA9IHsgICBcclxuICAgICAgICBoYW5kbGU6IFwiLm15LWhhbmRsZVwiLFxyXG4gICAgICAgIG9uRW5kOiBmdW5jdGlvbiAoZXZ0KSB7XHJcbiAgICAgICAgICAgIHZhciBpdGVtcyA9IGV2dC5tb2RlbHM7XHJcbiAgICAgICAgICAgIGhlbHBlck9iamVjdFNlcnZpY2UucmVvcmRlcihpdGVtcywgJ2FwJykudGhlbihmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn1dO1xyXG5cclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBbXCIkc2NvcGVcIiwgXCJiYXRBcGlTcnZcIiwgXCIkaHR0cFwiLCBcIldlYXRoZXJJY29uU2VydmljZVwiLCBcIkF1dGhlbnRpZmljYXRpb25TZXJ2aWNlXCIsIFwib2JqZWN0c1wiLCBcInR5cGVcIiwgXCJ0aXRsZVwiLCBcIkNvb2tpZXNTZXJ2aWNlXCIsIFxyXG4gICAgZnVuY3Rpb24oJHNjb3BlLCBiYXRBcGlTcnYsICRodHRwLCBXZWF0aGVySWNvblNlcnZpY2UsIEF1dGhlbnRpZmljYXRpb25TZXJ2aWNlLCBvYmplY3RzLCB0eXBlLCB0aXRsZSwgQ29va2llc1NlcnZpY2UpIHtcclxuXHJcbiAgICAkc2NvcGUuaG91ciA9IG51bGw7XHJcbiAgICAkc2NvcGUuZGF5ID0gbnVsbDsgICAgXHJcbiAgICAkc2NvcGUuQXV0aGVudGlmaWNhdGlvblNlcnZpY2UgPSBBdXRoZW50aWZpY2F0aW9uU2VydmljZTtcclxuICAgICRzY29wZS50aXRsZSA9IHRpdGxlO1xyXG4gICAgICAgIFxyXG4gICAgJHNjb3BlLnR5cGUgICA9IHR5cGU7XHJcbiAgICAkc2NvcGUucm9vbSAgID0gJ2hvbWUnO1xyXG5cclxuICAgIHZhciBsYW5nID0gQ29va2llc1NlcnZpY2UuZ2V0KCdsYW5ndWFnZScpP0Nvb2tpZXNTZXJ2aWNlLmdldCgnbGFuZ3VhZ2UnKToncm8nO1xyXG4gICAgdmFyIHVwZGF0ZVRpbWUgPSBmdW5jdGlvbiAoKXtcclxuICAgICAgICAkc2NvcGUuZGF5ID0gbW9tZW50KCkubG9jYWxlKGxhbmcpLmZvcm1hdCgnZGRkZCBEbyBNTU0gWVlZWScpO1xyXG4gICAgICAgICRzY29wZS5ob3VyID0gbW9tZW50KCkubG9jYWxlKGxhbmcpLmZvcm1hdCgnSEggOiBtbScpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICB2YXIgdXBkYXRlTGF0ZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgIHVwZGF0ZVRpbWUoKTtcclxuICAgICAgICAgIHVwZGF0ZUxhdGVyKCk7XHJcbiAgICAgICAgfSwgMTAwKTtcclxuICAgIH0gICAgICAgIFxyXG4gICAgdXBkYXRlTGF0ZXIoKTtcclxuICAgICAgICBcclxuICAgICRodHRwLmdldCgnL2hlbHBlcnMvd2VhdGhlcicsIHt9KS5zdWNjZXNzKGZ1bmN0aW9uKHJlc3BvbnNlKXtcclxuICAgICAgICAkc2NvcGUud2VhdGhlciA9IHt9O1xyXG4gICAgICAgICRzY29wZS53ZWF0aGVyLmRlc2NyaXB0aW9uID0gcmVzcG9uc2UuY3VycmVudC5za3l0ZXh0O1xyXG4gICAgICAgICRzY29wZS53ZWF0aGVyLmljb24gPSByZXNwb25zZS5jdXJyZW50LmltYWdlVXJsO1xyXG4gICAgICAgICRzY29wZS53ZWF0aGVyLnRlbXBlcmF0dXJlID0gcmVzcG9uc2UuY3VycmVudC50ZW1wZXJhdHVyZTtcclxuICAgICAgICAkc2NvcGUud2VhdGhlci5odW1pZGl0eSA9IHJlc3BvbnNlLmN1cnJlbnQuaHVtaWRpdHk7ICAgICAgICBcclxuICAgICAgICAkc2NvcGUud2VhdGhlci53aW5kID0gcmVzcG9uc2UuY3VycmVudC53aW5kZGlzcGxheTtcclxuICAgIH0pLmVycm9yKGZ1bmN0aW9uKHJlc3BvbnNlKXtcclxuICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XHJcbiAgICB9KSAgICBcclxuXHJcbiAgICBcclxuXHJcbiAgICAkc2NvcGUuaXRlbXMgPSBiYXRBcGlTcnYuZ2V0TGl2ZUxpc3Qob2JqZWN0cyk7XHJcblxyXG5cclxuXHJcbiAgICAkc2NvcGUucmVtb3ZlRmF2b3JpdGUgPSBmdW5jdGlvbihvYmplY3Qpe1xyXG4gICAgICAgIHZhciBrZXkgPSBfLmZpbmRMYXN0SW5kZXgoJHNjb3BlLml0ZW1zLCB7XHJcbiAgICAgICAgICAgIEJNU0lEOiBvYmplY3QuQk1TSURcclxuICAgICAgICB9KTtcclxuICAgICAgICAkc2NvcGUuaXRlbXMuc3BsaWNlKGtleSwxKTtcclxuICAgIH1cclxuXHJcbiAgICAkc2NvcGUubG9nT3V0ID0gZnVuY3Rpb24oKXtcclxuICAgICAgICBiYXRBcGlTcnYuY2xlYXJPYmplY3RzKCk7XHJcbiAgICAgICAgQXV0aGVudGlmaWNhdGlvblNlcnZpY2UubG9nb3V0KCk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgICRzY29wZS4kb24oJyRkZXN0cm95JywgZnVuY3Rpb24gKCkgeyAgICAgICAgXHJcbiAgICAgICAgYmF0QXBpU3J2LmNsZWFyT2JqZWN0cygpO1xyXG4gICAgfSk7XHJcbiAgICBcclxufV07IiwiXHJcbm1vZHVsZS5leHBvcnRzID0gW1wiJHNjb3BlXCIsIFwiaG91c2VcIiwgXCJmbG9vcnNcIiwgXCJ0eXBlXCIsIFwiaGVscGVyT2JqZWN0U2VydmljZVwiLFwib2JqZWN0c1wiLFwiYmF0QXBpU3J2XCIsIGZ1bmN0aW9uKCRzY29wZSwgaG91c2UsIGZsb29ycywgdHlwZSwgaGVscGVyT2JqZWN0U2VydmljZSwgb2JqZWN0cywgYmF0QXBpU3J2KSB7XHJcblxyXG4gICAgJHNjb3BlLnRpdGxlID0gaG91c2UubmFtZTtcclxuICAgIFxyXG4gICAgJHNjb3BlLmJhY2tVcmwgPSAnIy90cmVlJztcclxuICAgIFxyXG4gICAgJHNjb3BlLnpvbmVzID0gZmxvb3JzO1xyXG5cclxuICAgICRzY29wZS56b25lID0gJ2Zsb29ycyc7XHJcbiAgICBcclxuICAgICRzY29wZS50eXBlID0gdHlwZTtcclxuXHJcbiAgICAkc2NvcGUucm9vbSA9ICdob3VzZSc7XHJcblxyXG4gICAgJHNjb3BlLml0ZW1zID0gYmF0QXBpU3J2LmdldExpdmVMaXN0KG9iamVjdHMpOyAgICBcclxuXHJcbiAgICAkc2NvcGUuJG9uKCckZGVzdHJveScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBiYXRBcGlTcnYuY2xlYXJPYmplY3RzKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkc2NvcGUudHJlZUNvbmZpZyA9IHsgICBcclxuICAgICAgICBoYW5kbGU6IFwiLm15LWhhbmRsZVwiLFxyXG4gICAgICAgIG9uRW5kOiBmdW5jdGlvbiAoZXZ0KSB7XHJcbiAgICAgICAgICAgIHZhciBpdGVtcyA9IGV2dC5tb2RlbHM7XHJcbiAgICAgICAgICAgIGhlbHBlck9iamVjdFNlcnZpY2UucmVvcmRlcihpdGVtcywgJ2hvdXNlJykudGhlbihmdW5jdGlvbigpeyAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufV07IiwiJ3VzZSBzdHJpY3QnO1xyXG52YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ2FyZW5hJyk7XHJcblxyXG5cclxuYXBwLmNvbnRyb2xsZXIoJ2xvZ2luQ3RybCcsIHJlcXVpcmUoJy4vbG9naW5DdHJsJykpO1xyXG5cclxuYXBwLmNvbnRyb2xsZXIoJ2hvbWVDdHJsJywgcmVxdWlyZSgnLi9ob21lQ3RybCcpKTtcclxuXHJcbmFwcC5jb250cm9sbGVyKCdmbG9vckN0cmwnLCByZXF1aXJlKCcuL2Zsb29yQ3RybCcpKTtcclxuXHJcbmFwcC5jb250cm9sbGVyKCdyb29tQ3RybCcsIHJlcXVpcmUoJy4vcm9vbUN0cmwnKSk7XHJcblxyXG5hcHAuY29udHJvbGxlcignaG91c2VDdHJsJywgcmVxdWlyZSgnLi9ob3VzZUN0cmwnKSk7XHJcblxyXG5cclxuYXBwLmNvbnRyb2xsZXIoJ3RyZWVDdHJsJywgcmVxdWlyZSgnLi90cmVlQ3RybCcpKTtcclxuXHJcblxyXG5hcHAuY29udHJvbGxlcignc2V0dGluZ3NDdHJsJywgcmVxdWlyZSgnLi9zZXR0aW5nc0N0cmwnKSk7XHJcbmFwcC5jb250cm9sbGVyKCd3aXp6YXJkQ3RybCcsIHJlcXVpcmUoJy4vd2l6emFyZEN0cmwnKSk7XHJcblxyXG5cclxuYXBwLmNvbnRyb2xsZXIoJ3R5cGVDdHJsJywgcmVxdWlyZSgnLi90eXBlQ3RybCcpKTtcclxuYXBwLmNvbnRyb2xsZXIoJ2FwQ3RybCcsIHJlcXVpcmUoJy4vYXBDdHJsJykpO1xyXG5cclxuYXBwLmNvbnRyb2xsZXIoJ3Nlc3Npb25zQ3RybCcsIHJlcXVpcmUoJy4vc2Vzc2lvbnNDdHJsJykpO1xyXG5cclxuXHJcbmFwcC5jb250cm9sbGVyKCd1c2Vyc0N0cmwnLCByZXF1aXJlKCcuL3dpenphcmQvdXNlcnNDdHJsJykpO1xyXG5hcHAuY29udHJvbGxlcignb2JqZWN0c1RvUm9vbXNDdHJsJywgcmVxdWlyZSgnLi93aXp6YXJkL29iamVjdHNUb1Jvb21zQ3RybCcpKTtcclxuYXBwLmNvbnRyb2xsZXIoJ3Jvb21zVG9Ib3VzZUN0cmwnLCByZXF1aXJlKCcuL3dpenphcmQvcm9vbXNUb0hvdXNlQ3RybCcpKTtcclxuYXBwLmNvbnRyb2xsZXIoJ29iamVjdHNDb250cm9sbHNDdHJsJywgcmVxdWlyZSgnLi93aXp6YXJkL29iamVjdHNDb250cm9sbHNDdHJsJykpO1xyXG5hcHAuY29udHJvbGxlcigndGVtcGxhdGVzQ3RybCcsIHJlcXVpcmUoJy4vd2l6emFyZC90ZW1wbGF0ZXNDdHJsJykpO1xyXG5hcHAuY29udHJvbGxlcignb2JqZWN0c1RvVGVtcGxhdGVDdHJsJywgcmVxdWlyZSgnLi93aXp6YXJkL29iamVjdHNUb1RlbXBsYXRlQ3RybCcpKTtcclxuXHJcblxyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFtcIiRzY29wZVwiLCBcIkF1dGhlbnRpZmljYXRpb25TZXJ2aWNlXCIsIFwiJGxvY2F0aW9uXCIsXCIkd2luZG93XCIsIGZ1bmN0aW9uKCRzY29wZSwgQXV0aGVudGlmaWNhdGlvblNlcnZpY2UsICRsb2NhdGlvbiwgJHdpbmRvdykge1xyXG5cdFxyXG4gICAgJHNjb3BlLmxvZ2luID0gZnVuY3Rpb24oZm9ybSl7XHJcbiAgICBcdGlmKGZvcm0uJHZhbGlkKXtcclxuXHJcblx0ICAgICAgICBBdXRoZW50aWZpY2F0aW9uU2VydmljZS5sb2dpbigkc2NvcGUuY3JlZGVudGlhbHMpLnRoZW4oZnVuY3Rpb24oKXtcclxuXHQgICAgICAgIFx0aWYoJHNjb3BlLmNyZWRlbnRpYWxzLm5hbWUgPT0gJ2FkbWluQGFkbWluLmNvbScpe1xyXG5cdCAgICAgICAgXHRcdCRsb2NhdGlvbi5wYXRoKCcvd2l6emFyZC91c2VycycpOyAgXHJcblx0ICAgICAgICBcdH1lbHNle1xyXG5cdCAgICAgICAgXHRcdCR3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcjL3N0YXJ0JztcclxuXHQgICAgICAgIFx0fVxyXG5cdCAgICAgICAgfSwgZnVuY3Rpb24oKXtcclxuXHQgICAgICAgIFx0JHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJyMvbG9naW4nO1xyXG5cdCAgICAgICAgfSk7XHJcbiAgICBcdH1cclxuICAgIH07XHJcbn1dOyIsIlxyXG5tb2R1bGUuZXhwb3J0cyA9IFtcIiRzY29wZVwiLCBcInJvb21cIiwgXCJ0eXBlXCIsIFwidHlwZUlkXCIsIFwiYmF0QXBpU3J2XCIsIFwib2JqZWN0c1wiLCBcIiRyb3V0ZVBhcmFtc1wiLCBmdW5jdGlvbigkc2NvcGUsIHJvb20sIHR5cGUsIHR5cGVJZCwgYmF0QXBpU3J2LCBvYmplY3RzLCAkcm91dGVQYXJhbXMpIHtcclxuXHJcbiAgICBcclxuICAgIGlmKHJvb20uZmxvb3JfaWQpe1xyXG4gICAgICAgICRzY29wZS5iYWNrVXJsID0gJyMvZmxvb3IvJytyb29tLmZsb29yX2lkO1xyXG4gICAgfWVsc2V7XHJcbiAgICAgICAgJHNjb3BlLmJhY2tVcmwgPSAnIy90cmVlJztcclxuICAgIH0gICAgXHJcbiAgICAkc2NvcGUuYmFzZVVybCA9ICcjL3Jvb20vJytyb29tLmlkOyBcclxuXHJcbiAgICBcclxuICAgIFxyXG4gICAgJHNjb3BlLnRpdGxlID0gcm9vbS5uYW1lO1xyXG4gICAgJHNjb3BlLnR5cGUgICA9IHR5cGU7XHJcbiAgICAkc2NvcGUudHlwZUlkICAgPSB0eXBlSWQ7XHJcbiAgICAkc2NvcGUucm9vbSAgID0gJ3Jvb20nO1xyXG4gICAgICAgIFxyXG5cclxuICAgIGlmKCRyb3V0ZVBhcmFtcy5xKXtcclxuICAgICAgICAkc2NvcGUuY2hlY2tlZCA9IHRydWU7XHJcbiAgICB9ZWxzZXtcclxuICAgICAgICAkc2NvcGUuY2hlY2tlZCA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAkc2NvcGUudG9nZ2xlID0gZnVuY3Rpb24oKXtcclxuICAgICAgICAkc2NvcGUuY2hlY2tlZCA9ICEkc2NvcGUuY2hlY2tlZFxyXG4gICAgfVxyXG4gICAgJHNjb3BlLml0ZW1zID0gYmF0QXBpU3J2LmdldExpdmVMaXN0KG9iamVjdHMpOyAgICBcclxuXHJcbiAgICAkc2NvcGUuJG9uKCckZGVzdHJveScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBiYXRBcGlTcnYuY2xlYXJPYmplY3RzKCk7XHJcbiAgICB9KTtcclxufV07IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBbXCIkc2NvcGVcIiwgXCJBdXRoZW50aWZpY2F0aW9uU2VydmljZVwiLCBcIiRsb2NhdGlvblwiLFwiJHdpbmRvd1wiLCBmdW5jdGlvbigkc2NvcGUsIEF1dGhlbnRpZmljYXRpb25TZXJ2aWNlLCAkbG9jYXRpb24sICR3aW5kb3cpIHtcclxuXHRcclxuXHQkc2NvcGUudXNlcnMgPSBbXCJhcDdAbmV3dG9uLmRpcmVjdFwiLFwiYXA4QG5ld3Rvbi5kaXJlY3RcIixcImFwOUBuZXd0b24uZGlyZWN0XCIsXCJhcDEwQG5ld3Rvbi5kaXJlY3RcIixcImFwMTFAbmV3dG9uLmRpcmVjdFwiLFwiYXAxMkBuZXd0b24uZGlyZWN0XCJdO1xyXG5cdCRzY29wZS5sb2dpbkFzID0gZnVuY3Rpb24odXNlcil7XHJcblx0XHQkc2NvcGUuY3JlZGVudGlhbHMgPSB7fTtcclxuXHRcdCRzY29wZS5jcmVkZW50aWFscy5uYW1lID0gdXNlcjtcclxuXHRcdCRzY29wZS5jcmVkZW50aWFscy5wYXNzd29yZCA9ICduZXd0b24nO1xyXG4gICAgICAgIEF1dGhlbnRpZmljYXRpb25TZXJ2aWNlLmxvZ2luKCRzY29wZS5jcmVkZW50aWFscykudGhlbihmdW5jdGlvbigpe1xyXG4gICAgICAgIFx0aWYoJHNjb3BlLmNyZWRlbnRpYWxzLm5hbWUgPT0gJ2FkbWluQGFkbWluLmNvbScpe1xyXG4gICAgICAgIFx0XHQkbG9jYXRpb24ucGF0aCgnL3dpenphcmQvdXNlcnMnKTsgIFxyXG4gICAgICAgIFx0fWVsc2V7XHJcbiAgICAgICAgXHRcdCR3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcjL3N0YXJ0JztcclxuICAgICAgICBcdH1cclxuICAgICAgICB9LCBmdW5jdGlvbigpe1xyXG4gICAgICAgIFx0JHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJyMvbG9naW4nO1xyXG4gICAgICAgIH0pO1xyXG5cdH1cclxuICAgIC8qJHNjb3BlLmxvZ2luID0gZnVuY3Rpb24oZm9ybSl7XHJcbiAgICBcdGlmKGZvcm0uJHZhbGlkKXtcclxuXHQgICAgICAgIEF1dGhlbnRpZmljYXRpb25TZXJ2aWNlLmxvZ2luKCRzY29wZS5jcmVkZW50aWFscykudGhlbihmdW5jdGlvbigpe1xyXG5cdCAgICAgICAgXHRpZigkc2NvcGUuY3JlZGVudGlhbHMubmFtZSA9PSAnYWRtaW5AYWRtaW4uY29tJyl7XHJcblx0ICAgICAgICBcdFx0JGxvY2F0aW9uLnBhdGgoJy93aXp6YXJkL3VzZXJzJyk7ICBcclxuXHQgICAgICAgIFx0fWVsc2V7XHJcblx0ICAgICAgICBcdFx0JHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJyMvc3RhcnQnO1xyXG5cdCAgICAgICAgXHR9XHJcblx0ICAgICAgICB9LCBmdW5jdGlvbigpe1xyXG5cdCAgICAgICAgXHQkd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnIy9sb2dpbic7XHJcblx0ICAgICAgICB9KTtcclxuICAgIFx0fVxyXG4gICAgfTsqL1xyXG59XTsiLCJcclxubW9kdWxlLmV4cG9ydHMgPSBbXCIkc2NvcGVcIiwgXCIkaHR0cFwiLCBcIiR3aW5kb3dcIiwgZnVuY3Rpb24oJHNjb3BlLCAkaHR0cCwgJHdpbmRvdykge1xyXG5cclxuXHJcbiAgICAkc2NvcGUucmVzZXRNb2R1bGVzID0gZnVuY3Rpb24oKXtcclxuICAgICAgICAkc2NvcGUuaXNMb2FkaW5nID0gdHJ1ZTtcclxuICAgICAgICBNb2R1bGVzUXVlcnlCdWlsZGVyLmNsZWFyREIoKS50aGVuKGZ1bmN0aW9uKGRhdGEpe1xyXG4gICAgICAgICAgICBab25lc1F1ZXJ5QnVpbGRlci5jbGVhckRCKCkudGhlbihmdW5jdGlvbihkYXRhKXtcclxuICAgICAgICAgICAgICAgICRzY29wZS5pc0xvYWRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9KTsgICAgICAgIFxyXG4gICAgfVxyXG5cclxuXHJcblx0JGh0dHAuZ2V0KCcvYXBpL2dldFdvcmRzQ29uZmlnJykuc3VjY2VzcyhmdW5jdGlvbihyZXNwb25zZSkge1xyXG5cdFx0JHNjb3BlLml0ZW1zID0gcmVzcG9uc2U7XHJcblx0fSk7XHJcblxyXG5cdCRzY29wZS5zYXZlID0gZnVuY3Rpb24oZm9ybSl7XHJcblx0XHRpZihmb3JtLiR2YWxpZCl7XHJcblx0XHRcdHZhciBqc29uID0ge307XHJcblx0XHRcdF8uZWFjaCgkc2NvcGUuaXRlbXMsIGZ1bmN0aW9uKHZhbHVlLCBrZXkpe1xyXG5cdFx0XHRcdGpzb25ba2V5XSA9IGZvcm1ba2V5XS4kbW9kZWxWYWx1ZTtcdFx0XHRcdFxyXG5cdFx0XHR9KVxyXG5cdFx0XHQkaHR0cC5wb3N0KCcvYXBpL3NldFdvcmRzQ29uZmlnJywgeydqc29uJzpqc29ufSkuc3VjY2VzcyhmdW5jdGlvbihyZXNwb25zZSkge1xyXG5cdFx0XHRcdCR3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH0gIFxyXG59XTsiLCJtb2R1bGUuZXhwb3J0cyA9IFtcIiRzY29wZVwiLCBcIml0ZW1zXCIsIFwidHlwZVwiLCBcInRpdGxlXCIsIFwiem9uZVwiLCBcImhlbHBlck9iamVjdFNlcnZpY2VcIixcIm9iamVjdHNcIixcImJhdEFwaVNydlwiLCBmdW5jdGlvbigkc2NvcGUsIGl0ZW1zLCB0eXBlLCB0aXRsZSwgem9uZSwgaGVscGVyT2JqZWN0U2VydmljZSwgb2JqZWN0cywgYmF0QXBpU3J2KSB7XHJcblx0XHJcbiAgICAkc2NvcGUudGl0bGUgPSB0aXRsZTtcclxuICAgICAgICAgICAgXHJcbiAgICAkc2NvcGUudHlwZSA9IHR5cGU7ICAgIFxyXG4gICAgXHJcbiAgICAkc2NvcGUuem9uZXMgPSBpdGVtcztcclxuICAgICAgICBcclxuICAgICRzY29wZS56b25lID0gem9uZTtcclxuXHJcbiAgICAkc2NvcGUuaXRlbXMgPSBiYXRBcGlTcnYuZ2V0TGl2ZUxpc3Qob2JqZWN0cyk7ICAgIFxyXG4gICAgXHJcbiAgICBcclxuICAgICRzY29wZS5yb29tID0gJ3RyZWUnO1xyXG5cclxuICAgICRzY29wZS4kb24oJyRkZXN0cm95JywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGJhdEFwaVNydi5jbGVhck9iamVjdHMoKTtcclxuICAgIH0pO1xyXG5cclxuICAgICRzY29wZS50cmVlQ29uZmlnID0geyAgIFxyXG4gICAgICAgIGhhbmRsZTogXCIubXktaGFuZGxlXCIsXHJcbiAgICAgICAgb25FbmQ6IGZ1bmN0aW9uIChldnQpIHtcclxuICAgICAgICAgICAgdmFyIGl0ZW1zID0gZXZ0Lm1vZGVscztcclxuICAgICAgICAgICAgaGVscGVyT2JqZWN0U2VydmljZS5yZW9yZGVyKGl0ZW1zLCAkc2NvcGUudHlwZSkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7ICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9OyAgIFxyXG59XTsiLCJcclxubW9kdWxlLmV4cG9ydHMgPSBbXCIkc2NvcGVcIiwgXCJ0aXRsZVwiLCBcInR5cGVcIiwgXCJiYXRBcGlTcnZcIiwgXCJvYmplY3RzXCIsXCJ6b25lc1wiLFwidHlwZUlkXCIsXCJyb3V0ZXNcIixcIk9iamVjdEljb25TZXJ2aWNlXCIsXCIkcm91dGVQYXJhbXNcIiwgXHJcblxyXG5mdW5jdGlvbigkc2NvcGUsIHRpdGxlLCB0eXBlLCBiYXRBcGlTcnYsIG9iamVjdHMsIHpvbmVzLCB0eXBlSWQsIHJvdXRlcywgT2JqZWN0SWNvblNlcnZpY2UsICRyb3V0ZVBhcmFtcykge1xyXG5cclxuXHQkc2NvcGUudGl0bGUgPSB0aXRsZTtcclxuXHJcbiAgICAkc2NvcGUudHlwZSAgID0gdHlwZTtcclxuICAgICRzY29wZS5yb29tICAgPSAndHlwZSc7XHJcblxyXG4gICAgJHNjb3BlLk9iamVjdEljb25TZXJ2aWNlID0gT2JqZWN0SWNvblNlcnZpY2U7XHJcblxyXG4gICAgJHNjb3BlLml0ZW1zID0gYmF0QXBpU3J2LmdldExpdmVMaXN0KG9iamVjdHMpO1xyXG4gICAgJHNjb3BlLnpvbmVzID0gem9uZXM7XHJcbiAgICAkc2NvcGUucm91dGVzID0gcm91dGVzO1xyXG5cclxuXHJcbiAgICAkc2NvcGUuYmFzZVVybCA9ICcjL3R5cGUvJyt0eXBlSWQ7XHJcbiAgICBpZigkcm91dGVQYXJhbXMucSl7XHJcbiAgICAgICAgJHNjb3BlLmNoZWNrZWQgPSB0cnVlO1xyXG4gICAgfWVsc2V7XHJcbiAgICAgICAgJHNjb3BlLmNoZWNrZWQgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAkc2NvcGUudG9nZ2xlID0gZnVuY3Rpb24oKXtcclxuICAgICAgICAkc2NvcGUuY2hlY2tlZCA9ICEkc2NvcGUuY2hlY2tlZDtcclxuICAgIH1cclxuXHJcbiAgICAkc2NvcGUuJG9uKCckZGVzdHJveScsIGZ1bmN0aW9uICgpIHsgICAgICAgIFxyXG4gICAgICAgIGJhdEFwaVNydi5jbGVhck9iamVjdHMoKTtcclxuICAgIH0pOyAgIFxyXG5cclxuICAgICBjb25zb2xlLmxvZygpO1xyXG59XTtcclxuIiwiXHJcbm1vZHVsZS5leHBvcnRzID0gW1wiJHNjb3BlXCIsIFwiVXNlcnNRdWVyeVNlcnZpY2VcIiwgXCJIb3VzZVF1ZXJ5U2VydmljZVwiLCBcIkZsb29yUXVlcnlTZXJ2aWNlXCIsIFwiUm9vbVF1ZXJ5U2VydmljZVwiLCBcIk9iamVjdFF1ZXJ5U2VydmljZVwiLCBcIkNvb2tpZXNTZXJ2aWNlXCIsIFwiVG9hc3RTZXJ2aWNlXCIsIFwiJGxvY2F0aW9uXCIsIFwiT2JqZWN0VGVtcGxhdGVTZXJ2aWNlXCIsIFwiJHdpbmRvd1wiLCBcIkF1dGhlbnRpZmljYXRpb25TZXJ2aWNlXCIsIFwiJHJvdXRlXCIsIFwiJHFcIiwgXCIkaHR0cFwiXHJcbixmdW5jdGlvbigkc2NvcGUsIFVzZXJzUXVlcnlTZXJ2aWNlLCBIb3VzZVF1ZXJ5U2VydmljZSwgRmxvb3JRdWVyeVNlcnZpY2UsIFJvb21RdWVyeVNlcnZpY2UsIE9iamVjdFF1ZXJ5U2VydmljZSwgQ29va2llc1NlcnZpY2UsIFRvYXN0U2VydmljZSwgJGxvY2F0aW9uLCBPYmplY3RUZW1wbGF0ZVNlcnZpY2UsICR3aW5kb3csIEF1dGhlbnRpZmljYXRpb25TZXJ2aWNlLCAkcm91dGUsICRxLCAkaHR0cCkge1xyXG5cclxuXHJcblx0XHJcbiAgICAkc2NvcGUudHlwZXMgPSBbXHJcblx0XHR7a2V5OidhcCcsIHZhbHVlOidBcGFydG1lbnQnfSxcclxuXHRcdHtrZXk6J2hvdXNlJywgdmFsdWU6J0hvdXNlJ30sXHJcblx0XHR7a2V5Oidjb21wbGV4JywgdmFsdWU6J0hvdXNlIGNvbXBsZXgnfVxyXG4gICAgXTtcclxuXHJcbiAgICAkc2NvcGUubGFuZ3VhZ2VzID0gW1xyXG5cdFx0e2tleTonZW4nLCB2YWx1ZTonRW5nbGlzaCd9LFxyXG5cdFx0e2tleToncm8nLCB2YWx1ZTonUm9tYW5hJyx9LFxyXG5cdFx0e2tleTonZnInLCB2YWx1ZTonRnJhbsOnYWlzJ31cclxuICAgIF07XHRcclxuICAgICAgICBcclxuXHJcbiAgICAkc2NvcGUubWFpbkNvbmZpZyA9IHtcclxuICAgIFx0aGFuZGxlOiBcIi5kcmFnLWhhbmRsZVwiLFxyXG4gICAgICAgIGdyb3VwOiAnYmFyJ1xyXG5cdH1cclxuXHJcbiAgICAkc2NvcGUuZ29Ub1N0ZXAgPSBmdW5jdGlvbihzdGVwKXtcclxuICAgIFx0c3dpdGNoKHN0ZXApe1xyXG4gICAgXHRcdGNhc2UgMDpcclxuICAgIFx0XHRcdFVzZXJzUXVlcnlTZXJ2aWNlLmFsbCgpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xyXG4gICAgXHRcdFx0XHQkc2NvcGUudXNlcnMgPSByZXNwb25zZTtcclxuICAgIFx0XHRcdFx0Y29uc29sZS5sb2coJHNjb3BlLnVzZXJzKTtcclxuICAgIFx0XHRcdH0pXHJcblx0XHRcdFx0JHNjb3BlLnN0ZXBaZXJvID0gdHJ1ZTtcclxuXHRcdFx0XHQkc2NvcGUuc3RlcE9uZSA9IGZhbHNlO1xyXG5cdFx0XHRcdCRzY29wZS5zdGVwVHdvID0gZmFsc2U7XHJcblx0XHRcdFx0JHNjb3BlLnN0ZXBUaHJlZSA9IGZhbHNlO1xyXG4gICAgXHRcdGJyZWFrOyAgICBcdFx0XHJcbiAgICBcdFx0Y2FzZSAxOlxyXG5cdFx0XHRcdGlmKCRzY29wZS50eXBlKXtcclxuXHRcdFx0ICAgICAgICB2YXIga2V5ID0gXy5maW5kTGFzdEluZGV4KCRzY29wZS50eXBlcywge1xyXG5cdFx0XHQgICAgICAgICAgICBrZXk6ICRzY29wZS50eXBlXHJcblx0XHRcdCAgICAgICAgfSk7XHJcblx0XHRcdFx0XHQkc2NvcGUuc2VsZWN0ZWRUeXBlID0gJHNjb3BlLnR5cGVzW2tleV07XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKCRzY29wZS5sYW5ndWFnZSl7XHJcblx0XHRcdCAgICAgICAgdmFyIGtleSA9IF8uZmluZExhc3RJbmRleCgkc2NvcGUubGFuZ3VhZ2VzLCB7XHJcblx0XHRcdCAgICAgICAgICAgIGtleTogJHNjb3BlLmxhbmd1YWdlXHJcblx0XHRcdCAgICAgICAgfSk7XHJcblx0XHRcdCAgICAgICAgJHNjb3BlLnNlbGVjdGVkTGFuZ3VhZ2UgPSAkc2NvcGUubGFuZ3VhZ2VzW2tleV07XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdCRzY29wZS5zdGVwWmVybyA9IGZhbHNlO1xyXG5cdFx0XHQgICAgJHNjb3BlLnN0ZXBPbmUgPSB0cnVlO1xyXG5cdFx0XHQgICAgJHNjb3BlLnN0ZXBUd28gPSBmYWxzZTtcclxuXHRcdFx0ICAgICRzY29wZS5zdGVwVGhyZWUgPSBmYWxzZTtcclxuICAgIFx0XHRicmVhaztcclxuICAgIFx0XHRjYXNlIDI6XHJcblx0XHRcdFx0JHNjb3BlLmNvbmZpZ1RyZWUoJHNjb3BlLnR5cGUpO1xyXG5cdFx0XHRcdCRzY29wZS5zdGVwWmVybyA9IGZhbHNlO1xyXG5cdFx0XHRcdCRzY29wZS5zdGVwT25lID0gZmFsc2U7XHJcblx0XHRcdFx0JHNjb3BlLnN0ZXBUd28gPSB0cnVlO1xyXG5cdFx0XHRcdCRzY29wZS5zdGVwVGhyZWUgPSBmYWxzZTtcclxuICAgIFx0XHRicmVhaztcclxuICAgIFx0XHRjYXNlIDM6XHJcblx0XHRcdFx0JHNjb3BlLmNvbmZpZ1RyZWUoJHNjb3BlLnR5cGUpO1xyXG5cdFx0XHRcdCRzY29wZS5zdGVwWmVybyA9IGZhbHNlO1xyXG5cdFx0XHRcdCRzY29wZS5zdGVwT25lID0gZmFsc2U7XHJcblx0XHRcdFx0JHNjb3BlLnN0ZXBUd28gPSBmYWxzZTtcclxuXHRcdFx0XHQkc2NvcGUuc3RlcFRocmVlID0gdHJ1ZTtcclxuXHRcdFx0XHJcblx0XHRcdFx0T2JqZWN0UXVlcnlTZXJ2aWNlLmRiT2JqZWN0cygpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xyXG5cdFx0XHRcdFx0dmFyIG9iamVjdHMgPSByZXNwb25zZTtcclxuXHRcdCAgICBcdFx0T2JqZWN0UXVlcnlTZXJ2aWNlLmFsbCgpLnRoZW4oZnVuY3Rpb24oc2F2ZU9iamVjdHMpe1xyXG5cdFx0ICAgIFx0XHRcdF8uZWFjaChzYXZlT2JqZWN0cywgZnVuY3Rpb24ob2JqZWN0KXtcclxuXHRcdCAgICBcdFx0XHRcdGlmKG9iamVjdCl7XHJcblx0XHRcdCAgICBcdFx0XHRcdHZhciBmb3VuZE9iamVjdCA9IF8ud2hlcmUob2JqZWN0cywge0JNU0lEOm9iamVjdC5CTVNJRH0pO1xyXG5cdFx0XHQgICAgXHRcdFx0XHRpZihmb3VuZE9iamVjdC5sZW5ndGgpe1xyXG5cdFx0XHRcdFx0XHRcdCAgICAgICAgdmFyIGtleSA9IF8uZmluZExhc3RJbmRleChvYmplY3RzLCB7XHJcblx0XHRcdFx0XHRcdFx0ICAgICAgICAgICAgQk1TSUQ6IGZvdW5kT2JqZWN0WzBdLkJNU0lEXHJcblx0XHRcdFx0XHRcdFx0ICAgICAgICB9KTtcclxuXHRcdFx0XHRcdFx0XHQgICAgICAgIG9iamVjdHMuc3BsaWNlKGtleSwxKTtcdFx0XHQgICAgXHRcdFx0XHRcdFxyXG5cdFx0XHQgICAgXHRcdFx0XHR9XHJcblx0XHQgICAgXHRcdFx0XHR9XHJcblx0XHQgICAgXHRcdFx0fSlcclxuXHRcdFx0XHRcdFx0JHNjb3BlLm1vZHVsZXMgPSBfLmdyb3VwQnkob2JqZWN0cywgZnVuY3Rpb24ob2JqZWN0KXsgICAgICAgIFxyXG5cdFx0XHRcdFx0XHRcdHJldHVybiBvYmplY3QuSEFNb2R1bGVOYW1lO1xyXG5cdFx0XHRcdFx0XHR9KTtcclxuXHRcdCAgICBcdFx0XHQvL2NvbnNvbGUubG9nKCRzY29wZS5vYmplY3RzKTtcclxuXHRcdCAgICBcdFx0fSlcclxuXHRcdFx0XHR9LCBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ25vIGNvbm5lY3Rpb24nKTtcclxuXHRcdFx0XHR9KVxyXG4gICAgXHRcdGJyZWFrO1xyXG4gICAgXHR9XHJcbiAgICB9XHJcblxyXG4gICAgJHNjb3BlLmNvbmZpZ1RyZWUgPSBmdW5jdGlvbih0eXBlKXtcclxuXHRcdCRzY29wZS5ob3VzZXMgPSBbXTtcclxuXHRcdCRzY29wZS5mbG9vcnMgPSBbXTtcclxuXHRcdCRzY29wZS5yb29tcyA9IFtdOyAgICBcdFxyXG4gICAgXHRzd2l0Y2godHlwZSl7XHJcbiAgICBcdFx0Y2FzZSAnYXAnOlxyXG4gICAgXHRcdFx0JHNjb3BlLnJvb21zID0gW107XHJcblx0XHRcdFx0Um9vbVF1ZXJ5U2VydmljZS5maW5kQnlGbG9vcklkKCkudGhlbihmdW5jdGlvbihyb29tcyl7XHJcblx0XHRcdFx0XHRfLmVhY2gocm9vbXMsIGZ1bmN0aW9uKHJvb20pe1xyXG5cdFx0XHRcdFx0XHRyb29tLmVhY2hDb25maWcgPSB7XHJcblx0XHRcdFx0XHRcdFx0aGFuZGxlOiBcIi5kcmFnLWhhbmRsZVwiLFxyXG5cdFx0XHRcdFx0XHRcdGdyb3VwOiAnYmFyJyxcclxuXHRcdFx0XHRcdFx0XHRvbkFkZDogZnVuY3Rpb24gKGV2dCl7XHJcblx0XHRcdFx0XHRcdFx0XHRPYmplY3RRdWVyeVNlcnZpY2UuaW5zZXJ0KGV2dC5tb2RlbCwgcm9vbS5pZCkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XHJcblx0XHRcdFx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdFx0b25SZW1vdmU6IGZ1bmN0aW9uIChldnQpe1xyXG5cdFx0XHRcdFx0XHRcdFx0T2JqZWN0UXVlcnlTZXJ2aWNlLmRlbGV0ZShldnQubW9kZWwuQk1TSUQpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xyXG5cdFx0XHRcdFx0XHRcdFx0fSlcclxuXHRcdFx0XHRcdFx0ICAgIH1cclxuXHRcdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdFx0cm9vbS5vYmplY3RzID0gW107XHJcblx0XHRcdFx0XHRcdCRzY29wZS5yb29tcy5wdXNoKHJvb20pO1xyXG5cdFx0XHRcdFx0XHQkc2NvcGUuYWRkT2JqZWN0cyhyb29tKTtcclxuXHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0fSlcclxuICAgIFx0XHRicmVhaztcclxuICAgIFx0XHRjYXNlICdob3VzZSc6XHJcbiAgICBcdFx0XHQkc2NvcGUuZmxvb3JzID0gW107XHRcclxuXHRcdFx0XHRGbG9vclF1ZXJ5U2VydmljZS5maW5kQnlIb3VzZUlkKCkudGhlbihmdW5jdGlvbihmbG9vcnMpe1xyXG5cdFx0XHRcdFx0Xy5lYWNoKGZsb29ycywgZnVuY3Rpb24oZmxvb3Ipe1xyXG5cdFx0XHRcdFx0XHRmbG9vci5yb29tcyA9IFtdO1xyXG5cdFx0XHRcdFx0XHQkc2NvcGUuZmxvb3JzLnB1c2goZmxvb3IpO1xyXG5cdFx0XHRcdFx0XHQkc2NvcGUuYWRkUm9vbXMoZmxvb3IpO1xyXG5cdFx0XHRcdFx0fSlcclxuXHRcdFx0XHR9KTtcclxuICAgIFx0XHRicmVhaztcclxuICAgIFx0XHRjYXNlICdjb21wbGV4JzpcclxuICAgIFx0XHRcdCRzY29wZS5ob3VzZXMgPSBbXTtcclxuICAgIFx0XHRcdEhvdXNlUXVlcnlTZXJ2aWNlLmFsbCgpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xyXG4gICAgXHRcdFx0XHR2YXIgaG91c2VzID0gcmVzcG9uc2U7XHJcblx0XHRcdFx0XHRfLmVhY2goaG91c2VzLCBmdW5jdGlvbihob3VzZSl7XHJcblx0XHRcdFx0XHRcdGhvdXNlLmZsb29ycyA9IFtdO1xyXG5cdFx0XHRcdFx0XHQkc2NvcGUuaG91c2VzLnB1c2goaG91c2UpO1xyXG5cdFx0XHRcdFx0XHQkc2NvcGUuYWRkRmxvb3JzKGhvdXNlKTtcclxuXHRcdFx0XHRcdH0pXHJcbiAgICBcdFx0XHR9KVxyXG4gICAgXHRcdGJyZWFrO1xyXG4gICAgXHR9XHJcbiAgICB9XHJcblxyXG5cdCRzY29wZS50eXBlID0gQ29va2llc1NlcnZpY2UuZ2V0KCd0eXBlJyk7XHJcblx0JHNjb3BlLmxhbmd1YWdlID0gQ29va2llc1NlcnZpY2UuZ2V0KCdsYW5ndWFnZScpO1xyXG5cclxuXHJcbiAgICAkc2NvcGUuZ29Ub0FwcCA9IGZ1bmN0aW9uKCl7XHJcbiAgICBcdCR3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcjL3N0YXJ0JztcclxuICAgIH1cclxuXHJcbiAgICAkc2NvcGUuc2F2ZURCID0gZnVuY3Rpb24oKXtcclxuXHRcdCRxLmFsbChbXHJcblx0XHQgICBIb3VzZVF1ZXJ5U2VydmljZS5hbGwoKSxcclxuXHRcdCAgIEZsb29yUXVlcnlTZXJ2aWNlLmFsbCgpLFxyXG5cdFx0ICAgUm9vbVF1ZXJ5U2VydmljZS5hbGwoKSxcclxuXHRcdCAgIE9iamVjdFF1ZXJ5U2VydmljZS5hbGwoKVxyXG5cdFx0XSkudGhlbihmdW5jdGlvbihkYXRhKSB7XHJcblx0XHRcdHZhciBkYiA9IHt9O1xyXG5cdFx0XHRkYlsnaG91c2VzJ10gPSBkYXRhWzBdO1xyXG5cdFx0XHRkYlsnZmxvb3JzJ10gPSBkYXRhWzFdO1xyXG5cdFx0XHRkYlsncm9vbXMnXSA9IGRhdGFbMl07XHJcblx0XHRcdGRiWydvYmplY3RzJ10gPSBkYXRhWzNdO1xyXG5cdFx0XHRkYlsndHlwZSddID0gJHNjb3BlLnR5cGU7XHJcblx0XHRcdGRiWydsYW5ndWFnZSddID0gJHNjb3BlLmxhbmd1YWdlO1xyXG5cdCAgICAgICAgJGh0dHAucG9zdCgnL2FwaS9zYXZlRGInLCB7J3VzZXInOid1c2VyQHVzZXIuY29tJywgJ2RiJzpKU09OLnN0cmluZ2lmeShkYil9KS5zdWNjZXNzKGZ1bmN0aW9uKHJlc3BvbnNlKXtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhyZXNwb25zZSk7XHJcblx0ICAgICAgICB9KS5lcnJvcihmdW5jdGlvbihyZXNwb25zZSl7XHJcblx0ICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xyXG5cdCAgICAgICAgfSlcclxuICAgIFx0fSlcclxuXHJcbiAgICB9XHJcblxyXG5cdCRzY29wZS5nb1RvU3RlcCgwKTtcclxuXHRpZigkc2NvcGUudHlwZSl7XHJcblx0fWVsc2V7XHJcblx0XHQkc2NvcGUuZ29Ub1N0ZXAoMyk7XHJcblx0fVxyXG5cclxuXHQkc2NvcGUuY2xlYXJEYk9iamVjdHMgPSBmdW5jdGlvbigpe1xyXG5cdFx0T2JqZWN0UXVlcnlTZXJ2aWNlLmRiT2JqZWN0c0NsZWFyKCkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XHJcblx0XHRcdCR3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XHJcblx0XHR9KVxyXG5cdH1cclxuXHJcblx0JHNjb3BlLmxvZ291dCA9IGZ1bmN0aW9uKCl7XHJcblx0XHRBdXRoZW50aWZpY2F0aW9uU2VydmljZS5sb2dvdXQoKTtcdFx0XHJcblx0fVxyXG5cclxuXHQkc2NvcGUuZGVsZXRlT2JqZWN0RnJvbVJvb20gPSBmdW5jdGlvbihvYmplY3Qpe1xyXG5cdFx0T2JqZWN0UXVlcnlTZXJ2aWNlLmRlbGV0ZShvYmplY3QuQk1TSUQpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xyXG5cdFx0XHQkcm91dGUucmVsb2FkKCk7XHJcblx0XHR9KVxyXG5cdH1cclxuXHJcblxyXG4gICAgJHNjb3BlLnNhdmVDb25maWcgPSBmdW5jdGlvbihmb3JtKXtcclxuICAgIFx0aWYoZm9ybS4kdmFsaWQpe1xyXG4gICAgXHRcdHZhciBkZWxldGVEQiA9IGZhbHNlO1xyXG4gICAgXHRcdGlmKCRzY29wZS50eXBlICYmICgkc2NvcGUudHlwZSAhPSAkc2NvcGUuc2VsZWN0ZWRUeXBlLmtleSkpe1xyXG4gICAgXHRcdFx0ZGVsZXRlREIgPSB0cnVlO1xyXG4gICAgXHRcdH1cclxuICAgIFx0XHQkc2NvcGUudHlwZSA9IENvb2tpZXNTZXJ2aWNlLnB1dCgndHlwZScsICRzY29wZS5zZWxlY3RlZFR5cGUua2V5KTtcclxuICAgIFx0XHQkc2NvcGUubGFuZ3VhZ2UgPSBDb29raWVzU2VydmljZS5wdXQoJ2xhbmd1YWdlJywgJHNjb3BlLnNlbGVjdGVkTGFuZ3VhZ2Uua2V5KTtcclxuICAgIFx0XHRpZihkZWxldGVEQil7XHJcblx0XHRcdFx0JHEuYWxsKFtcclxuXHRcdFx0XHQgICBIb3VzZVF1ZXJ5U2VydmljZS5jbGVhcigpLFxyXG5cdFx0XHRcdCAgIEZsb29yUXVlcnlTZXJ2aWNlLmNsZWFyKCksXHJcblx0XHRcdFx0ICAgUm9vbVF1ZXJ5U2VydmljZS5jbGVhcigpLFxyXG5cdFx0XHRcdCAgIE9iamVjdFF1ZXJ5U2VydmljZS5jbGVhcigpXHJcblx0XHRcdFx0XSkudGhlbihmdW5jdGlvbihkYXRhKSB7XHJcblx0XHRcdFx0ICAgJHNjb3BlLmdvVG9TdGVwKDIpO1xyXG5cdFx0XHRcdH0pO1xyXG4gICAgXHRcdH1lbHNle1xyXG4gICAgXHRcdFx0JHNjb3BlLmdvVG9TdGVwKDIpO1x0XHJcbiAgICBcdFx0fVx0XHJcbiAgICBcdH1cclxuICAgIH1cclxuXHJcbiAgICAkc2NvcGUuYWRkRmxvb3JzID0gZnVuY3Rpb24oaG91c2Upe1xyXG5cdFx0Rmxvb3JRdWVyeVNlcnZpY2UuZmluZEJ5SG91c2VJZChob3VzZS5pZCkudGhlbihmdW5jdGlvbihmbG9vcnMpe1xyXG5cdFx0XHRfLmVhY2goZmxvb3JzLCBmdW5jdGlvbihmbG9vcil7XHJcblx0XHRcdFx0Zmxvb3Iucm9vbXMgPSBbXTtcclxuXHRcdFx0XHRob3VzZS5mbG9vcnMucHVzaChmbG9vcik7XHJcblx0XHRcdFx0JHNjb3BlLmFkZFJvb21zKGZsb29yKTtcclxuXHRcdFx0fSkgXHJcblx0XHR9KVxyXG4gICAgfVxyXG5cclxuICAgICRzY29wZS5hZGRSb29tcyA9IGZ1bmN0aW9uKGZsb29yKXtcclxuXHRcdFJvb21RdWVyeVNlcnZpY2UuZmluZEJ5Rmxvb3JJZChmbG9vci5pZCkudGhlbihmdW5jdGlvbihyb29tcyl7XHJcblx0XHRcdF8uZWFjaChyb29tcywgZnVuY3Rpb24ocm9vbSl7XHJcblx0XHRcdFx0cm9vbS5vYmplY3RzID0gW107XHJcblx0XHRcdFx0cm9vbS5lYWNoQ29uZmlnID0ge1xyXG5cdFx0XHRcdFx0aGFuZGxlOiBcIi5kcmFnLWhhbmRsZVwiLFxyXG5cdFx0XHRcdFx0Z3JvdXA6ICdiYXInLFxyXG5cdFx0XHRcdFx0b25BZGQ6IGZ1bmN0aW9uIChldnQpe1xyXG5cdFx0XHRcdFx0XHRPYmplY3RRdWVyeVNlcnZpY2UuaW5zZXJ0KGV2dC5tb2RlbCwgcm9vbS5pZCkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XHJcblx0XHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0b25SZW1vdmU6IGZ1bmN0aW9uIChldnQpe1xyXG5cdFx0XHRcdFx0XHRPYmplY3RRdWVyeVNlcnZpY2UuZGVsZXRlKGV2dC5tb2RlbC5CTVNJRCkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XHJcblx0XHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0ICAgIH1cclxuXHRcdFx0XHR9O1xyXG5cdFx0XHRcdGZsb29yLnJvb21zLnB1c2gocm9vbSk7XHJcblx0XHRcdFx0JHNjb3BlLmFkZE9iamVjdHMocm9vbSk7XHJcblx0XHRcdH0pXHJcblx0XHR9KVx0ICAgXHRcclxuICAgIH1cclxuXHJcbiAgICAkc2NvcGUuYWRkT2JqZWN0cyA9IGZ1bmN0aW9uKHJvb20pe1xyXG5cdFx0T2JqZWN0UXVlcnlTZXJ2aWNlLmZpbmRCeVJvb21JZChyb29tLmlkKS50aGVuKGZ1bmN0aW9uKG9iamVjdHMpe1xyXG5cdFx0XHRfLmVhY2gob2JqZWN0cywgZnVuY3Rpb24ob2JqZWN0KXtcclxuXHRcdFx0XHRyb29tLm9iamVjdHMucHVzaChvYmplY3QpO1xyXG5cdFx0XHR9KVxyXG5cdFx0fSlcclxuICAgIH1cclxuXHJcblx0JHNjb3BlLmFwSW5zZXJ0Um9vbSA9IGZ1bmN0aW9uKGZvcm0pe1xyXG5cdFx0aWYoZm9ybS4kdmFsaWQpe1xyXG5cdFx0XHRSb29tUXVlcnlTZXJ2aWNlLmluc2VydEFwUm9vbSgkc2NvcGUuYXBSb29tTmFtZSkudGhlbihmdW5jdGlvbihyb29tKXtcclxuXHRcdCAgICAgICAgJHNjb3BlLnJvb21zLnB1c2gocm9vbSk7XHJcblx0XHQgICAgICAgICRzY29wZS5hcFJvb21OYW1lID0gJyc7XHJcblx0XHRcdH0sIGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0VG9hc3RTZXJ2aWNlLmNyZWF0ZSgnQSByb29tIHdpdGggdGhlIHNhbWUgbmFtZSBhbHJlYWR5IGV4aXN0cycsICd3YXJuaW5nJyk7XHJcblx0XHRcdH0pXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQkc2NvcGUuYXBEZWxldGVSb29tID0gZnVuY3Rpb24ocm9vbUlkKXtcclxuXHRcdFJvb21RdWVyeVNlcnZpY2UuZGVsZXRlKHJvb21JZCkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XHJcblx0ICAgICAgICB2YXIga2V5ID0gXy5maW5kTGFzdEluZGV4KCRzY29wZS5yb29tcywge2lkOiByb29tSWR9KTtcclxuXHQgICAgICAgICRzY29wZS5yb29tcy5zcGxpY2Uoa2V5LDEpO1xyXG5cdFx0fSwgZnVuY3Rpb24oKXtcclxuXHRcdFx0VG9hc3RTZXJ2aWNlLmNyZWF0ZSgnVGhpcyByb29tIGNvbnRhaW5zIG9iamVjdHMsIFBsZWFzZSBjbGVhciB0aGUgcm9vbSBiZWZvcmUgZGVsZXRpbmcgaXQnLCAnd2FybmluZycpO1xyXG5cdFx0fSlcclxuXHR9XHJcblxyXG5cdCRzY29wZS5ob3VzZUluc2VydEZsb29yID0gZnVuY3Rpb24oZm9ybSl7XHJcblx0XHRpZihmb3JtLiR2YWxpZCl7XHJcblx0XHRcdEZsb29yUXVlcnlTZXJ2aWNlLmluc2VydEhvdXNlRmxvb3IoJHNjb3BlLmhvdXNlRmxvb3JOYW1lKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcclxuXHRcdFx0XHRyZXNwb25zZS5yb29tcyA9IFtdO1xyXG5cdFx0XHRcdCRzY29wZS5mbG9vcnMucHVzaChyZXNwb25zZSk7XHJcblx0XHRcdFx0JHNjb3BlLmhvdXNlRmxvb3JOYW1lID0gJyc7XHJcblx0XHRcdH0sIGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0VG9hc3RTZXJ2aWNlLmNyZWF0ZSgnQSBmbG9vciB3aXRoIHRoZSBzYW1lIG5hbWUgYWxyZWFkeSBleGlzdHMnLCAnd2FybmluZycpO1xyXG5cdFx0XHR9KVxyXG5cdFx0fVx0XHRcclxuXHR9XHJcblxyXG5cdCRzY29wZS5ob3VzZUluc2VydFJvb20gPSBmdW5jdGlvbihmb3JtKXtcclxuXHRcdGlmKGZvcm0uJHZhbGlkKXtcclxuXHRcdFx0Um9vbVF1ZXJ5U2VydmljZS5pbnNlcnRSb29tKCRzY29wZS5ob3VzZVJvb21OYW1lLCAkc2NvcGUuaG91c2VGbG9vci5pZCkudGhlbihmdW5jdGlvbihyb29tKXtcclxuXHRcdFx0XHR2YXIga2V5ID0gXy5maW5kTGFzdEluZGV4KCRzY29wZS5mbG9vcnMsIHtpZDogJHNjb3BlLmhvdXNlRmxvb3IuaWR9KTtcclxuXHRcdFx0XHQkc2NvcGUuZmxvb3JzW2tleV1bJ3Jvb21zJ10ucHVzaChyb29tKTtcclxuXHRcdFx0XHQkc2NvcGUuaG91c2VSb29tTmFtZSA9ICcnO1xyXG5cdFx0XHRcdCRzY29wZS5ob3VzZUZsb29yID0ge307XHJcblx0XHRcdH0sIGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0VG9hc3RTZXJ2aWNlLmNyZWF0ZSgnQSByb29tIHdpdGggdGhlIHNhbWUgbmFtZSBhbHJlYWR5IGV4aXN0cyBpbiB0aGUgc2VsZWN0ZWQgZmxvb3InLCAnd2FybmluZycpO1xyXG5cdFx0XHR9KVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0JHNjb3BlLmhvdXNlRGVsZXRlRmxvb3IgPSBmdW5jdGlvbihmbG9vcklkKXtcclxuXHRcdEZsb29yUXVlcnlTZXJ2aWNlLmRlbGV0ZShmbG9vcklkKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcclxuXHQgICAgICAgIHZhciBrZXkgPSBfLmZpbmRMYXN0SW5kZXgoJHNjb3BlLmZsb29ycywge2lkOiBmbG9vcklkfSk7XHJcblx0ICAgICAgICAkc2NvcGUuZmxvb3JzLnNwbGljZShrZXksMSk7XHJcblx0XHR9LCBmdW5jdGlvbigpe1xyXG5cdFx0XHRUb2FzdFNlcnZpY2UuY3JlYXRlKCdUaGlzIGZsb29yIGNvbnRhaW5zIHJvb21zLCBQbGVhc2UgY2xlYXIgdGhlIGZsb29yIGJlZmVvcmUgZGVsZXRpbmcgaXQnLCAnd2FybmluZycpO1xyXG5cdFx0fSlcclxuXHR9XHJcblxyXG5cdCRzY29wZS5ob3VzZURlbGV0ZVJvb20gPSBmdW5jdGlvbihyb29tSWQsIGZsb29ySWQpe1xyXG5cdFx0Um9vbVF1ZXJ5U2VydmljZS5kZWxldGUocm9vbUlkKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcclxuXHQgICAgICAgIHZhciBrZXkgPSBfLmZpbmRMYXN0SW5kZXgoJHNjb3BlLmZsb29ycywge2lkOiBmbG9vcklkfSk7XHJcblx0XHRcdHZhciByb29tcyA9ICRzY29wZS5mbG9vcnNba2V5XVsncm9vbXMnXVxyXG5cdCAgICAgICAgdmFyIGtleSA9IF8uZmluZExhc3RJbmRleChyb29tcywge2lkOiByb29tSWR9KTtcclxuXHQgICAgICAgIHJvb21zLnNwbGljZShrZXksMSk7XHJcblx0XHR9LCBmdW5jdGlvbigpe1xyXG5cdFx0XHRUb2FzdFNlcnZpY2UuY3JlYXRlKCdUaGlzIHJvb20gY29udGFpbnMgb2JqZWN0cywgUGxlYXNlIGNsZWFyIHRoZSByb29tIGJlZm9yZSBkZWxldGluZyBpdCcsICd3YXJuaW5nJyk7XHRcdFx0XHJcblx0XHR9KVx0XHRcclxuXHR9XHJcblxyXG5cdCRzY29wZS5jb21wbGV4SW5zZXJ0SG91c2UgPSBmdW5jdGlvbihmb3JtKXtcclxuXHRcdGlmKGZvcm0uJHZhbGlkKXtcclxuXHRcdFx0SG91c2VRdWVyeVNlcnZpY2UuaW5zZXJ0Q29tcGxleEhvdXNlKCRzY29wZS5jb21wbGV4SG91c2VOYW1lKS50aGVuKGZ1bmN0aW9uKGhvdXNlKXtcclxuXHRcdFx0XHRob3VzZS5mbG9vcnMgPSBbXTtcclxuXHRcdCAgICAgICAgJHNjb3BlLmhvdXNlcy5wdXNoKGhvdXNlKTtcclxuXHRcdCAgICAgICAgJHNjb3BlLmNvbXBsZXhIb3VzZU5hbWUgPSAnJztcclxuXHRcdFx0fSwgZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRUb2FzdFNlcnZpY2UuY3JlYXRlKCdBIGhvdXNlIHdpdGggdGhlIHNhbWUgbmFtZSBhbHJlYWR5IGV4aXN0cycsICd3YXJuaW5nJyk7XHJcblx0XHRcdH0pXHRcdFx0XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQkc2NvcGUuY29tcGxleEluc2VydEZsb29yID0gZnVuY3Rpb24oZm9ybSl7XHJcblx0XHRpZihmb3JtLiR2YWxpZCl7XHJcblx0XHRcdEZsb29yUXVlcnlTZXJ2aWNlLmluc2VydENvbXBsZXhGbG9vcigkc2NvcGUuY29tcGxleEZsb29yTmFtZSwgJHNjb3BlLmNvbXBsZXhIb3VzZS5pZCkudGhlbihmdW5jdGlvbihmbG9vcil7XHJcblx0XHRcdFx0dmFyIGtleSA9IF8uZmluZExhc3RJbmRleCgkc2NvcGUuaG91c2VzLCB7aWQ6ICRzY29wZS5jb21wbGV4SG91c2UuaWR9KTtcclxuXHRcdFx0XHRmbG9vci5yb29tcyA9IFtdO1xyXG5cdFx0XHRcdCRzY29wZS5ob3VzZXNba2V5XVsnZmxvb3JzJ10ucHVzaChmbG9vcik7XHJcblx0XHRcdFx0JHNjb3BlLmNvbXBsZXhGbG9vck5hbWUgPSAnJztcclxuXHRcdFx0XHQkc2NvcGUuY29tcGxleEhvdXNlID0ge307XHJcblx0XHRcdH0sIGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0VG9hc3RTZXJ2aWNlLmNyZWF0ZSgnQSBmbG9vciB3aXRoIHRoZSBzYW1lIG5hbWUgYWxyZWFkeSBleGlzdHMgaW4gdGhlIHNlbGVjdGVkIGhvdXNlJywgJ3dhcm5pbmcnKTtcclxuXHRcdFx0fSlcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdCRzY29wZS5jb21wbGV4SW5zZXJ0Um9vbSA9IGZ1bmN0aW9uKGZvcm0pe1xyXG5cdFx0aWYoZm9ybS4kdmFsaWQpe1xyXG5cdFx0XHRSb29tUXVlcnlTZXJ2aWNlLmluc2VydFJvb20oJHNjb3BlLmNvbXBsZXhSb29tTmFtZSwgJHNjb3BlLmNvbXBsZXhGbG9vci5pZCkudGhlbihmdW5jdGlvbihyb29tKXtcclxuXHRcdFx0XHR2YXIga2V5ID0gXy5maW5kTGFzdEluZGV4KCRzY29wZS5ob3VzZXMsIHtpZDogJHNjb3BlLmNvbXBsZXhSb29tSG91c2UuaWR9KTtcclxuXHRcdFx0XHR2YXIgZmxvb3JzID0gJHNjb3BlLmhvdXNlc1trZXldWydmbG9vcnMnXTtcclxuXHRcdFx0XHR2YXIga2V5ID0gXy5maW5kTGFzdEluZGV4KGZsb29ycywge2lkOiAkc2NvcGUuY29tcGxleEZsb29yLmlkfSk7XHJcblx0XHRcdFx0dmFyIHJvb21zID0gZmxvb3JzW2tleV1bJ3Jvb21zJ107XHJcblx0XHRcdFx0cm9vbXMucHVzaChyb29tKTtcclxuXHRcdFx0XHQkc2NvcGUuY29tcGxleFJvb21Ib3VzZSA9IHt9O1xyXG5cdFx0XHRcdCRzY29wZS5jb21wbGV4Rmxvb3IgPSB7fTtcclxuXHRcdFx0XHQkc2NvcGUuY29tcGxleFJvb21OYW1lID0gJyc7XHJcblx0XHRcdH0sIGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0VG9hc3RTZXJ2aWNlLmNyZWF0ZSgnQSByb29tIHdpdGggdGhlIHNhbWUgbmFtZSBhbHJlYWR5IGV4aXN0cyBpbiB0aGUgc2VsZWN0ZWQgZmxvb3InLCAnd2FybmluZycpO1xyXG5cdFx0XHR9KVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0JHNjb3BlLmNvbXBsZXhEZWxldGVIb3VzZSA9IGZ1bmN0aW9uKGhvdXNlSWQpe1xyXG5cdFx0SG91c2VRdWVyeVNlcnZpY2UuZGVsZXRlKGhvdXNlSWQpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xyXG5cdCAgICAgICAgdmFyIGtleSA9IF8uZmluZExhc3RJbmRleCgkc2NvcGUuaG91c2VzLCB7aWQ6IGhvdXNlSWR9KTtcclxuXHQgICAgICAgICRzY29wZS5ob3VzZXMuc3BsaWNlKGtleSwxKTtcclxuXHRcdH0sIGZ1bmN0aW9uKCl7XHJcblx0XHRcdFRvYXN0U2VydmljZS5jcmVhdGUoJ1RoaXMgaG91c2UgY29udGFpbnMgZmxvb3JzLCBQbGVhc2UgY2xlYXIgdGhlIGhvdXNlIGJlZmVvcmUgZGVsZXRpbmcgaXQnLCAnd2FybmluZycpO1xyXG5cdFx0fSlcclxuXHR9XHJcblxyXG5cdCRzY29wZS5jb21wbGV4RGVsZXRlRmxvb3IgPSBmdW5jdGlvbihmbG9vcklkLCBob3VzZUlkKXtcclxuXHRcdEZsb29yUXVlcnlTZXJ2aWNlLmRlbGV0ZShmbG9vcklkKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcclxuXHQgICAgICAgIHZhciBrZXkgPSBfLmZpbmRMYXN0SW5kZXgoJHNjb3BlLmhvdXNlcywge2lkOiBob3VzZUlkfSk7XHJcblx0XHRcdHZhciBmbG9vcnMgPSAkc2NvcGUuaG91c2VzW2tleV1bJ2Zsb29ycyddXHJcblx0ICAgICAgICB2YXIga2V5ID0gXy5maW5kTGFzdEluZGV4KGZsb29ycywge2lkOiBmbG9vcklkfSk7XHJcblx0ICAgICAgICBmbG9vcnMuc3BsaWNlKGtleSwxKTtcclxuXHQgICAgICAgIC8vZmxvb3JzLnNwbGljZShmbG9vcnMuaW5kZXhPZihmbG9vciksIDEpO1xyXG5cdFx0fSwgZnVuY3Rpb24oKXtcclxuXHRcdFx0VG9hc3RTZXJ2aWNlLmNyZWF0ZSgnVGhpcyBmbG9vciBjb250YWlucyByb29tcywgUGxlYXNlIGNsZWFyIHRoZSBmbG9vciBiZWZlb3JlIGRlbGV0aW5nIGl0JywgJ3dhcm5pbmcnKTtcclxuXHRcdH0pXHJcblx0fVxyXG5cclxuXHQkc2NvcGUuY29tcGxleERlbGV0ZVJvb20gPSBmdW5jdGlvbihyb29tSWQsIGZsb29ySWQsIGhvdXNlSWQpe1xyXG5cdFx0Um9vbVF1ZXJ5U2VydmljZS5kZWxldGUocm9vbUlkKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcclxuXHQgICAgICAgIHZhciBrZXkgPSBfLmZpbmRMYXN0SW5kZXgoJHNjb3BlLmhvdXNlcywge2lkOiBob3VzZUlkfSk7XHJcblx0XHRcdHZhciBmbG9vcnMgPSAkc2NvcGUuaG91c2VzW2tleV1bJ2Zsb29ycyddXHJcblx0ICAgICAgICB2YXIga2V5ID0gXy5maW5kTGFzdEluZGV4KGZsb29ycywge2lkOiBmbG9vcklkfSk7XHJcblx0ICAgICAgICB2YXIgcm9vbXMgPSBmbG9vcnNba2V5XVsncm9vbXMnXTtcclxuXHQgICAgICAgIHZhciBrZXkgPSBfLmZpbmRMYXN0SW5kZXgocm9vbXMsIHtpZDogcm9vbUlkfSk7XHJcblx0ICAgICAgICByb29tcy5zcGxpY2Uoa2V5LDEpO1xyXG5cdFx0fSwgZnVuY3Rpb24oKXtcclxuXHRcdFx0VG9hc3RTZXJ2aWNlLmNyZWF0ZSgnVGhpcyByb29tIGNvbnRhaW5zIG9iamVjdHMsIFBsZWFzZSBjbGVhciB0aGUgcm9vbSBiZWZvcmUgZGVsZXRpbmcgaXQnLCAnd2FybmluZycpO1xyXG5cdFx0fSlcclxuXHR9XHJcblxyXG59XTsiLCJcclxubW9kdWxlLmV4cG9ydHMgPSBbXCIkc2NvcGVcIiwgXCIkaHR0cFwiLCBcInVzZXJcIiwgXCJpdGVtc1wiLCBcIiRsb2NhdGlvblwiLCBcIk9iamVjdEZhY3RvcnlcIlxyXG4sZnVuY3Rpb24oJHNjb3BlLCAkaHR0cCwgdXNlciwgaXRlbXMsICRsb2NhdGlvbiwgT2JqZWN0RmFjdG9yeSkge1xyXG5cclxuXHQkc2NvcGUuaXRlbXMgPSBpdGVtcztcdFxyXG5cdCRzY29wZS5nb1RvVXNlcnMgPSBmdW5jdGlvbigpe1xyXG5cdFx0JGxvY2F0aW9uLnBhdGgoJy93aXp6YXJkL3VzZXJzJyk7XHJcblx0fVxyXG5cdCRzY29wZS5nb1RvUm9vbXNUb0hvdXNlID0gZnVuY3Rpb24oKXtcclxuXHRcdCRsb2NhdGlvbi5wYXRoKCd3aXp6YXJkL3Jvb21zLXRvLWhvdXNlLycrdXNlci5pZCsnLycrdXNlci50eXBlKTtcclxuXHR9XHJcblx0JHNjb3BlLmdvVG9PYmplY3RzVG9Sb29tcyA9IGZ1bmN0aW9uKCl7XHJcblx0XHQkbG9jYXRpb24ucGF0aCgnd2l6emFyZC9vYmplY3RzLXRvLXJvb21zLycrdXNlci5pZCsnLycrdXNlci50eXBlKTtcclxuXHR9XHJcblx0JHNjb3BlLmdvVG9PYmplY3RzVG9Db250cm9sbHMgPSBmdW5jdGlvbigpe1xyXG5cdFx0JHJvdXRlLnJlbG9hZCgpO1x0XHRcclxuXHR9XHJcblx0JHNjb3BlLnVzZXIgPSB1c2VyO1xyXG5cdFxyXG5cdCRzY29wZS5kZWxldGVPYmplY3QgPSBmdW5jdGlvbihvYmplY3RzLCBvYmplY3Qpe1x0XHJcblx0XHRPYmplY3RGYWN0b3J5LmRlbGV0ZShvYmplY3QuaWQpLnRoZW4oZnVuY3Rpb24oKXtcclxuXHRcdFx0dmFyIGtleSA9IF8uZmluZExhc3RJbmRleChvYmplY3RzLCB7aWQ6b2JqZWN0LmlkfSk7XHJcblx0XHRcdG9iamVjdHMuc3BsaWNlKGtleSwxKTtcclxuXHRcdH0pXHJcblx0fVxyXG5cclxuXHJcbn1dOyIsIlxyXG5tb2R1bGUuZXhwb3J0cyA9IFtcIiRzY29wZVwiLCBcIiRodHRwXCIsIFwidXNlclwiLCBcIm9iamVjdHNcIixcIiRsb2NhdGlvblwiLCBcIml0ZW1zXCIsIFwiT2JqZWN0RmFjdG9yeVwiLCBcIiRyb3V0ZVwiXHJcbixmdW5jdGlvbigkc2NvcGUsICRodHRwLCB1c2VyLCBvYmplY3RzLCAkbG9jYXRpb24sIGl0ZW1zLCBPYmplY3RGYWN0b3J5LCRyb3V0ZSkge1xyXG5cclxuXHRcclxuXHQkc2NvcGUuZ29Ub1VzZXJzID0gZnVuY3Rpb24oKXtcclxuXHRcdCRsb2NhdGlvbi5wYXRoKCcvd2l6emFyZC91c2VycycpO1xyXG5cdH1cclxuXHQkc2NvcGUuZ29Ub1Jvb21zVG9Ib3VzZSA9IGZ1bmN0aW9uKCl7XHJcblx0XHQkbG9jYXRpb24ucGF0aCgnd2l6emFyZC9yb29tcy10by1ob3VzZS8nK3VzZXIuaWQrJy8nK3VzZXIudHlwZSk7XHJcblx0fVxyXG5cdCRzY29wZS5nb1RvT2JqZWN0c1RvUm9vbXMgPSBmdW5jdGlvbigpe1xyXG5cdFx0JHJvdXRlLnJlbG9hZCgpO1xyXG5cdH1cclxuXHQkc2NvcGUuZ29Ub09iamVjdHNUb0NvbnRyb2xscyA9IGZ1bmN0aW9uKCl7XHRcdFxyXG5cdFx0JGxvY2F0aW9uLnBhdGgoJ3dpenphcmQvb2JqZWN0cy1jb250cm9sbHMvJyt1c2VyLmlkKycvJyt1c2VyLnR5cGUpO1xyXG5cdH1cclxuXHJcblxyXG5cdCRzY29wZS51c2VyID0gdXNlcjtcclxuXHJcblx0JHNjb3BlLm1vZHVsZXMgPSBfLmdyb3VwQnkob2JqZWN0cywgZnVuY3Rpb24ob2JqZWN0KXtcclxuXHRcdHJldHVybiBvYmplY3QuSEFNb2R1bGVJZDtcclxuXHR9KTtcdFx0XHJcblx0XHJcblx0JHNjb3BlLml0ZW1zID0gaXRlbXM7XHJcblxyXG5cdCRzY29wZS5kZWxldGVPYmplY3QgPSBmdW5jdGlvbihvYmplY3RzLCBvYmplY3Qpe1x0XHJcblx0XHRPYmplY3RGYWN0b3J5LmRlbGV0ZShvYmplY3QuaWQpLnRoZW4oZnVuY3Rpb24oKXtcclxuXHRcdFx0dmFyIGtleSA9IF8uZmluZExhc3RJbmRleChvYmplY3RzLCB7aWQ6b2JqZWN0LmlkfSk7XHJcblx0XHRcdG9iamVjdHMuc3BsaWNlKGtleSwxKTtcclxuXHRcdH0pXHJcblx0fVxyXG5cclxufV07IiwiXHJcbm1vZHVsZS5leHBvcnRzID0gW1wiJHNjb3BlXCIsIFwiJGh0dHBcIiwgXCJ0ZW1wbGF0ZVwiLCBcIiRsb2NhdGlvblwiLCBcIiRyb3V0ZVwiXHJcbixmdW5jdGlvbigkc2NvcGUsICRodHRwLCB0ZW1wbGF0ZSwgJGxvY2F0aW9uLCAkcm91dGUpIHtcclxuXHJcblx0JHNjb3BlLmdvVG9Vc2VycyA9IGZ1bmN0aW9uKCl7XHJcblx0XHQkbG9jYXRpb24ucGF0aCgnL3dpenphcmQvdXNlcnMnKTtcclxuXHR9XHJcblx0JHNjb3BlLmdvVG9UZW1wbGF0ZXMgPSBmdW5jdGlvbigpe1xyXG5cdFx0JGxvY2F0aW9uLnBhdGgoJy93aXp6YXJkL3RlbXBsYXRlcycpO1xyXG5cdH1cdFx0XHJcblx0JHNjb3BlLmdvVG9PYmplY3RzVG9UZW1wbGF0ZSA9IGZ1bmN0aW9uKCl7XHJcblx0XHQkcm91dGUucmVsb2FkKCk7XHRcdFxyXG5cdH1cclxuXHJcblxyXG5cdCRzY29wZS50ZW1wbGF0ZSA9IHRlbXBsYXRlO1x0XHJcblx0JHNjb3BlLnRlbXBsYXRlcyA9IEpTT04ucGFyc2UodGVtcGxhdGUudGVtcGxhdGUpO1xyXG5cclxuXHJcblxyXG5cdCRzY29wZS5hZGRPYmplY3QgPSBmdW5jdGlvbigpe1xyXG5cdFx0Y29uc29sZS5sb2coJ2FkZCcpO1xyXG5cdH1cclxuXHJcblx0JHNjb3BlLmFkZE9iamVjdFRvQXBSb29tID0gZnVuY3Rpb24ocm9vbU5hbWUpe1xyXG5cdFx0Y29uc29sZS5sb2cocm9vbU5hbWUpO1xyXG5cdH1cclxuXHJcblx0XHJcbn1dOyIsIlxyXG5tb2R1bGUuZXhwb3J0cyA9IFtcIiRzY29wZVwiLCBcIiRodHRwXCIsXCJUb2FzdFNlcnZpY2VcIixcIiRsb2NhdGlvblwiLCBcInVzZXJcIiwgXCJpdGVtc1wiLCBcIk9iamVjdEljb25TZXJ2aWNlXCIsIFwiJHJvdXRlXCIsIFwiUm9vbUZhY3RvcnlcIiwgXCJGbG9vckZhY3RvcnlcIiwgXCJIb3VzZUZhY3RvcnlcIlxyXG4sZnVuY3Rpb24oJHNjb3BlLCAkaHR0cCwgVG9hc3RTZXJ2aWNlLCAkbG9jYXRpb24sIHVzZXIsIGl0ZW1zLCBPYmplY3RJY29uU2VydmljZSwgJHJvdXRlLCBSb29tRmFjdG9yeSwgRmxvb3JGYWN0b3J5LCBIb3VzZUZhY3RvcnkpIHtcclxuXHJcblx0JHNjb3BlLk9iamVjdEljb25TZXJ2aWNlID0gT2JqZWN0SWNvblNlcnZpY2U7XHJcblxyXG5cdCRzY29wZS5nb1RvVXNlcnMgPSBmdW5jdGlvbigpe1xyXG5cdFx0JGxvY2F0aW9uLnBhdGgoJy93aXp6YXJkL3VzZXJzJyk7XHJcblx0fVxyXG5cdCRzY29wZS5nb1RvUm9vbXNUb0hvdXNlID0gZnVuY3Rpb24oKXtcclxuXHRcdCRyb3V0ZS5yZWxvYWQoKTtcclxuXHR9XHJcblx0JHNjb3BlLmdvVG9PYmplY3RzVG9Sb29tcyA9IGZ1bmN0aW9uKCl7XHJcblx0XHQkbG9jYXRpb24ucGF0aCgnd2l6emFyZC9vYmplY3RzLXRvLXJvb21zLycrdXNlci5pZCsnLycrdXNlci50eXBlKTtcclxuXHR9XHJcblx0JHNjb3BlLmdvVG9PYmplY3RzVG9Db250cm9sbHMgPSBmdW5jdGlvbigpe1xyXG5cdFx0JGxvY2F0aW9uLnBhdGgoJ3dpenphcmQvb2JqZWN0cy1jb250cm9sbHMvJyt1c2VyLmlkKycvJyt1c2VyLnR5cGUpO1xyXG5cdH1cclxuXHRcclxuXHRcclxuXHQkc2NvcGUudXNlciA9IHVzZXI7XHJcblx0JHNjb3BlLml0ZW1zID0gaXRlbXM7XHJcblxyXG5cclxuICAgIC8qYXAqL1xyXG4gICAgJHNjb3BlLmFkZEFwUm9vbSA9IGZ1bmN0aW9uKCl7XHJcbiAgICBcdGlmKCRzY29wZS5yb29tTmFtZSAhPSB1bmRlZmluZWQpe1xyXG4gICAgXHRcdCRzY29wZS5yb29tID0ge307XHJcbiAgICBcdFx0JHNjb3BlLnJvb20ubmFtZSA9ICRzY29wZS5yb29tTmFtZTtcclxuICAgIFx0XHQkc2NvcGUucm9vbS51c2VyX2lkID0gJHNjb3BlLnVzZXIuaWQ7XHJcbiAgICBcdFx0JHNjb3BlLnJvb20uaWNvbl9pZCA9ICRzY29wZS5yb29tSWNvbi5pZDtcclxuICAgIFx0XHQkc2NvcGUucm9vbS5mbG9vcl9pZCA9IDA7XHJcbiAgICBcdFx0Um9vbUZhY3RvcnkuY3JlYXRlKCRzY29wZS5yb29tKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcclxuXHRcdCAgICBcdCRzY29wZS5yb29tLmlkID0gcmVzcG9uc2U7XHJcbiAgICBcdFx0XHQkc2NvcGUuaXRlbXMucm9vbXMucHVzaCgkc2NvcGUucm9vbSk7XHJcbiAgICBcdFx0XHQkc2NvcGUucm9vbSA9IHt9O1xyXG4gICAgXHRcdFx0JHNjb3BlLnJvb21JY29uID0gbnVsbDtcclxuICAgIFx0XHRcdCRzY29wZS5yb29tTmFtZSA9IG51bGw7ICAgIFx0XHRcdFxyXG4gICAgXHRcdH0pXHJcblx0XHR9ICAgXHRcdFxyXG4gICAgfVxyXG5cclxuXHQkc2NvcGUuZGVsZXRlQXBSb29tID0gZnVuY3Rpb24ocm9vbSl7XHJcblx0XHRSb29tRmFjdG9yeS5kZWxldGUoeydyb29tX2lkJzpyb29tLmlkLCAndXNlcl9pZCc6JHNjb3BlLnVzZXIuaWR9KS50aGVuKGZ1bmN0aW9uKCl7XHJcblx0XHRcdHZhciByb29tS2V5ID0gXy5maW5kTGFzdEluZGV4KCRzY29wZS5pdGVtcy5yb29tcywge2lkOiByb29tLmlkfSk7XHJcblx0XHRcdCRzY29wZS5pdGVtcy5yb29tcy5zcGxpY2Uocm9vbUtleSwxKTtcclxuXHRcdH0pXHQgICAgXHJcblx0fSAgICAgICAgIFxyXG5cdC8qZW9mIGFwKi9cclxuXHJcblx0Lypob3VzZSovXHJcbiAgICAkc2NvcGUuYWRkSG91c2VGbG9vciA9IGZ1bmN0aW9uKCl7XHJcbiAgICBcdCRzY29wZS5mbG9vciA9IHt9O1xyXG4gICAgXHRpZigkc2NvcGUuZmxvb3JOYW1lICE9IHVuZGVmaW5lZCl7XHJcbiAgICBcdFx0JHNjb3BlLmZsb29yLm5hbWUgPSAkc2NvcGUuZmxvb3JOYW1lO1xyXG4gICAgXHRcdCRzY29wZS5mbG9vci51c2VyX2lkID0gJHNjb3BlLnVzZXIuaWQ7XHJcblx0XHRcdCRzY29wZS5mbG9vci5pY29uX2lkID0gJHNjb3BlLmZsb29ySWNvbi5pZDtcclxuXHRcdFx0Rmxvb3JGYWN0b3J5LmNyZWF0ZSgkc2NvcGUuZmxvb3IpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1x0XHRcdFx0XHJcblx0XHQgICAgXHQkc2NvcGUuZmxvb3IuaWQgPSByZXNwb25zZTtcclxuXHRcdCAgICBcdCRzY29wZS5mbG9vci5yb29tcyA9IFtdO1xyXG4gICAgXHRcdFx0JHNjb3BlLml0ZW1zLmZsb29ycy5wdXNoKCRzY29wZS5mbG9vcik7XHJcbiAgICBcdFx0XHQkc2NvcGUuZmxvb3IgPSB7fTtcclxuICAgIFx0XHRcdCRzY29wZS5mbG9vckljb24gPSBudWxsO1xyXG4gICAgXHRcdFx0JHNjb3BlLmZsb29yTmFtZSA9IG51bGw7XHJcblx0XHRcdH0pXHRcdCAgICBcclxuICAgIFx0fVxyXG4gICAgfVxyXG5cclxuICAgICRzY29wZS5kZWxldGVIb3VzZUZsb29yID0gZnVuY3Rpb24oZmxvb3Ipe1xyXG4gICAgXHRGbG9vckZhY3RvcnkuZGVsZXRlKHsnZmxvb3JfaWQnOmZsb29yLmlkLCAndXNlcl9pZCc6JHNjb3BlLnVzZXIuaWR9KS50aGVuKGZ1bmN0aW9uKCl7XHJcblx0XHRcdHZhciBmbG9vcktleSA9IF8uZmluZExhc3RJbmRleCgkc2NvcGUuaXRlbXMuZmxvb3JzLCB7aWQ6IGZsb29yLmlkfSk7XHJcblx0XHRcdCRzY29wZS5pdGVtcy5mbG9vcnMuc3BsaWNlKGZsb29yS2V5LDEpOyAgICBcdFx0XHJcbiAgICBcdH0pXHQgICAgXHJcbiAgICB9XHJcblxyXG4gICAgJHNjb3BlLmFkZEhvdXNlUm9vbSA9IGZ1bmN0aW9uKCl7XHJcbiAgICBcdCRzY29wZS5yb29tID0ge307XHJcbiAgICBcdGlmKCRzY29wZS5yb29tTmFtZSAhPSB1bmRlZmluZWQpe1xyXG4gICAgXHRcdCRzY29wZS5yb29tLm5hbWUgPSAkc2NvcGUucm9vbU5hbWU7XHJcbiAgICBcdFx0JHNjb3BlLnJvb20udXNlcl9pZCA9ICRzY29wZS51c2VyLmlkO1xyXG4gICAgXHRcdCRzY29wZS5yb29tLmZsb29yX2lkID0gJHNjb3BlLmZsb29yLmlkO1xyXG4gICAgXHRcdCRzY29wZS5yb29tLmljb25faWQgPSAkc2NvcGUucm9vbUljb24uaWQ7XHJcbiAgICBcdFx0Um9vbUZhY3RvcnkuY3JlYXRlKCRzY29wZS5yb29tKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcclxuXHRcdCAgICBcdCRzY29wZS5yb29tLmlkID0gcmVzcG9uc2U7XHJcbiAgICBcdFx0XHR2YXIgZmxvb3JLZXkgPSBfLmZpbmRMYXN0SW5kZXgoJHNjb3BlLml0ZW1zLmZsb29ycywge2lkOiAkc2NvcGUuZmxvb3IuaWR9KTtcclxuICAgIFx0XHRcdCRzY29wZS5pdGVtcy5mbG9vcnNbZmxvb3JLZXldLnJvb21zLnB1c2goJHNjb3BlLnJvb20pO1xyXG4gICAgXHRcdFx0JHNjb3BlLmZsb29yID0ge307XHJcbiAgICBcdFx0XHQkc2NvcGUucm9vbSA9IHt9O1xyXG4gICAgXHRcdFx0JHNjb3BlLnJvb21OYW1lID0gbnVsbDtcclxuICAgIFx0XHRcdCRzY29wZS5yb29tSWNvbiA9IG51bGw7XHJcblx0XHQgICAgfSkgIFx0XHRcclxuICAgIFx0fVxyXG4gICAgfVxyXG5cclxuICAgICRzY29wZS5kZWxldGVIb3VzZVJvb20gPSBmdW5jdGlvbihmbG9vciwgcm9vbSl7XHJcbiAgICBcdFJvb21GYWN0b3J5LmRlbGV0ZSh7J3Jvb21faWQnOnJvb20uaWQsICd1c2VyX2lkJzokc2NvcGUudXNlci5pZH0pLnRoZW4oZnVuY3Rpb24oKXtcclxuXHRcdFx0dmFyIGZsb29yS2V5ID0gXy5maW5kTGFzdEluZGV4KCRzY29wZS5pdGVtcy5mbG9vcnMsIHtpZDogZmxvb3IuaWR9KTtcclxuXHRcdFx0dmFyIHJvb21LZXkgPSBfLmZpbmRMYXN0SW5kZXgoJHNjb3BlLml0ZW1zLmZsb29yc1tmbG9vcktleV1bJ3Jvb21zJ10sIHtpZDogcm9vbS5pZH0pO1xyXG5cdFx0XHQkc2NvcGUuaXRlbXMuZmxvb3JzW2Zsb29yS2V5XVsncm9vbXMnXS5zcGxpY2Uocm9vbUtleSwxKTtcclxuXHQgICAgfSlcclxuICAgIH1cclxuICAgIC8qZW9mIGhvdXNlKi9cclxuXHJcbiAgICAvKmNvbXBsZXgqL1xyXG4gICAgJHNjb3BlLmFkZENvbXBsZXhIb3VzZSA9IGZ1bmN0aW9uKCl7XHJcbiAgICBcdCRzY29wZS5ob3VzZSA9IHt9O1xyXG4gICAgXHRpZigkc2NvcGUuaG91c2VOYW1lICE9IHVuZGVmaW5lZCl7XHJcbiAgICBcdFx0JHNjb3BlLmhvdXNlLm5hbWUgPSAkc2NvcGUuaG91c2VOYW1lO1xyXG4gICAgXHRcdCRzY29wZS5ob3VzZS51c2VyX2lkID0gJHNjb3BlLnVzZXIuaWQ7XHJcbiAgICBcdFx0JHNjb3BlLmhvdXNlLmljb25faWQgPSAkc2NvcGUuaG91c2VJY29uLmlkO1xyXG4gICAgICAgICAgICBIb3VzZUZhY3RvcnkuY3JlYXRlKCRzY29wZS5ob3VzZSkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XHRcclxuXHRcdCAgICBcdCRzY29wZS5ob3VzZS5pZCA9IHJlc3BvbnNlO1xyXG5cdFx0ICAgIFx0JHNjb3BlLmhvdXNlLmZsb29ycyA9IFtdO1xyXG4gICAgXHRcdFx0JHNjb3BlLml0ZW1zLmhvdXNlcy5wdXNoKCRzY29wZS5ob3VzZSk7XHJcbiAgICBcdFx0XHQkc2NvcGUuaG91c2UgPSB7fTtcclxuICAgICAgICAgICAgICAgICRzY29wZS5ob3VzZU5hbWUgPSBudWxsO1xyXG4gICAgXHRcdFx0JHNjb3BlLmhvdXNlSWNvbiA9IG51bGw7XHJcblx0XHQgICAgfSlcclxuICAgIFx0fSAgIFx0XHJcbiAgICB9XHJcbiAgICAkc2NvcGUuZGVsZXRlQ29tcGxleEhvdXNlID0gZnVuY3Rpb24oaG91c2Upe1xyXG4gICAgICAgIEhvdXNlRmFjdG9yeS5kZWxldGUoeydob3VzZV9pZCc6aG91c2UuaWQsICd1c2VyX2lkJzokc2NvcGUudXNlci5pZH0pLnRoZW4oZnVuY3Rpb24oKXtcclxuXHRcdFx0dmFyIGhvdXNlS2V5ID0gXy5maW5kTGFzdEluZGV4KCRzY29wZS5pdGVtcy5ob3VzZXMsIHtpZDogaG91c2UuaWR9KTtcclxuXHRcdFx0JHNjb3BlLml0ZW1zLmhvdXNlcy5zcGxpY2UoaG91c2VLZXksMSk7XHJcblx0ICAgIH0pXHJcbiAgICB9IFxyXG4gICAgJHNjb3BlLmFkZENvbXBsZXhGbG9vciA9IGZ1bmN0aW9uKCl7XHJcbiAgICBcdCRzY29wZS5mbG9vciA9IHt9O1xyXG4gICAgXHRpZigkc2NvcGUuZmxvb3JOYW1lICE9IHVuZGVmaW5lZCl7XHJcbiAgICBcdFx0JHNjb3BlLmZsb29yLm5hbWUgPSAkc2NvcGUuZmxvb3JOYW1lO1xyXG4gICAgXHRcdCRzY29wZS5mbG9vci51c2VyX2lkID0gJHNjb3BlLnVzZXIuaWQ7XHJcbiAgICBcdFx0JHNjb3BlLmZsb29yLmhvdXNlX2lkID0gJHNjb3BlLmhvdXNlLmlkO1xyXG4gICAgXHRcdCRzY29wZS5mbG9vci5pY29uX2lkID0gJHNjb3BlLmZsb29ySWNvbi5pZDtcclxuICAgICAgICAgICAgRmxvb3JGYWN0b3J5LmNyZWF0ZSgkc2NvcGUuZmxvb3IpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xyXG5cdFx0ICAgIFx0JHNjb3BlLmZsb29yLmlkID0gcmVzcG9uc2U7XHJcblx0XHQgICAgXHQkc2NvcGUuZmxvb3Iucm9vbXMgPSBbXTtcclxuICAgIFx0XHRcdHZhciBob3VzZUtleSA9IF8uZmluZExhc3RJbmRleCgkc2NvcGUuaXRlbXMuaG91c2VzLCB7aWQ6ICRzY29wZS5ob3VzZS5pZH0pO1xyXG4gICAgXHRcdFx0JHNjb3BlLml0ZW1zLmhvdXNlc1tob3VzZUtleV0uZmxvb3JzLnB1c2goJHNjb3BlLmZsb29yKTtcclxuICAgIFx0XHRcdCRzY29wZS5ob3VzZSA9IHt9O1xyXG4gICAgXHRcdFx0JHNjb3BlLmZsb29yID0ge307XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuZmxvb3JOYW1lID0gbnVsbDtcclxuICAgIFx0XHRcdCRzY29wZS5mbG9vckljb24gPSBudWxsO1xyXG5cdFx0ICAgIH0pXHJcbiAgICBcdH1cdFx0XHJcbiAgICB9XHJcbiAgICAkc2NvcGUuZGVsZXRlQ29tcGxleEZsb29yID0gZnVuY3Rpb24oaG91c2UsIGZsb29yKXtcclxuICAgICAgICBGbG9vckZhY3RvcnkuZGVsZXRlKHsnZmxvb3JfaWQnOmZsb29yLmlkLCAndXNlcl9pZCc6JHNjb3BlLnVzZXIuaWR9KS50aGVuKGZ1bmN0aW9uKCl7XHJcblx0XHRcdHZhciBob3VzZUtleSA9IF8uZmluZExhc3RJbmRleCgkc2NvcGUuaXRlbXMuaG91c2VzLCB7aWQ6IGhvdXNlLmlkfSk7XHJcblx0XHRcdHZhciBmbG9vcktleSA9IF8uZmluZExhc3RJbmRleCgkc2NvcGUuaXRlbXMuaG91c2VzW2hvdXNlS2V5XVsnZmxvb3JzJ10sIHtpZDogZmxvb3IuaWR9KTtcclxuXHRcdFx0JHNjb3BlLml0ZW1zLmhvdXNlc1tob3VzZUtleV1bJ2Zsb29ycyddLnNwbGljZShmbG9vcktleSwxKTsgXHJcblx0ICAgIH0pXHJcbiAgICB9XHJcbiAgICAkc2NvcGUuYWRkQ29tcGxleFJvb20gPSBmdW5jdGlvbigpe1xyXG4gICAgXHQkc2NvcGUucm9vbSA9IHt9O1xyXG4gICAgXHRpZigkc2NvcGUucm9vbU5hbWUgIT0gdW5kZWZpbmVkKXtcclxuICAgIFx0XHQkc2NvcGUucm9vbS5uYW1lID0gJHNjb3BlLnJvb21OYW1lO1xyXG4gICAgXHRcdCRzY29wZS5yb29tLnVzZXJfaWQgPSAkc2NvcGUudXNlci5pZDtcclxuICAgIFx0XHQkc2NvcGUucm9vbS5mbG9vcl9pZCA9ICRzY29wZS5mbG9vci5pZDtcclxuICAgIFx0XHQkc2NvcGUucm9vbS5pY29uX2lkID0gJHNjb3BlLnJvb21JY29uLmlkO1xyXG4gICAgICAgICAgICBSb29tRmFjdG9yeS5jcmVhdGUoJHNjb3BlLnJvb20pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xyXG5cdFx0ICAgIFx0JHNjb3BlLnJvb20uaWQgPSByZXNwb25zZTtcclxuICAgIFx0XHRcdHZhciBob3VzZUtleSA9IF8uZmluZExhc3RJbmRleCgkc2NvcGUuaXRlbXMuaG91c2VzLCB7aWQ6ICRzY29wZS5ob3VzZS5pZH0pO1xyXG4gICAgXHRcdFx0dmFyIGZsb29yS2V5ID0gXy5maW5kTGFzdEluZGV4KCRzY29wZS5pdGVtcy5ob3VzZXNbaG91c2VLZXldWydmbG9vcnMnXSwge2lkOiAkc2NvcGUuZmxvb3IuaWR9KTtcclxuICAgIFx0XHRcdCRzY29wZS5pdGVtcy5ob3VzZXNbaG91c2VLZXldLmZsb29yc1tmbG9vcktleV1bJ3Jvb21zJ10ucHVzaCgkc2NvcGUucm9vbSk7XHJcbiAgICBcdFx0XHQkc2NvcGUuaG91c2UgPSB7fTtcclxuICAgIFx0XHRcdCRzY29wZS5mbG9vciA9IHt9O1xyXG4gICAgXHRcdFx0JHNjb3BlLnJvb20gPSB7fTtcclxuICAgICAgICAgICAgICAgICRzY29wZS5yb29tTmFtZSA9IG51bGw7XHJcbiAgICBcdFx0XHQkc2NvcGUucm9vbUljb24gPSBudWxsO1xyXG5cdFx0ICAgIH0pXHJcbiAgICBcdH0gICAgXHRcclxuICAgIH1cclxuICAgICRzY29wZS5kZWxldGVDb21wbGV4Um9vbSA9IGZ1bmN0aW9uKGhvdXNlLCBmbG9vciwgcm9vbSl7XHJcbiAgICAgICAgUm9vbUZhY3RvcnkuZGVsZXRlKHsncm9vbV9pZCc6cm9vbS5pZCwgJ3VzZXJfaWQnOiRzY29wZS51c2VyLmlkfSkudGhlbihmdW5jdGlvbigpe1xyXG5cdFx0XHR2YXIgaG91c2VLZXkgPSBfLmZpbmRMYXN0SW5kZXgoJHNjb3BlLml0ZW1zLmhvdXNlcywge2lkOiBob3VzZS5pZH0pO1xyXG5cdFx0XHR2YXIgZmxvb3JLZXkgPSBfLmZpbmRMYXN0SW5kZXgoJHNjb3BlLml0ZW1zLmhvdXNlc1tob3VzZUtleV1bJ2Zsb29ycyddLCB7aWQ6IGZsb29yLmlkfSk7XHJcblx0XHRcdHZhciByb29tS2V5ID0gXy5maW5kTGFzdEluZGV4KCRzY29wZS5pdGVtcy5ob3VzZXNbaG91c2VLZXldWydmbG9vcnMnXVtmbG9vcktleV1bJ3Jvb20nXSwge2lkOiByb29tLmlkfSk7ICAgXHJcblx0XHRcdCRzY29wZS5pdGVtcy5ob3VzZXNbaG91c2VLZXldWydmbG9vcnMnXVtmbG9vcktleV1bJ3Jvb21zJ10uc3BsaWNlKHJvb21LZXksMSk7IFxyXG5cdCAgICB9KVxyXG4gICAgfVxyXG4gICAgLyplb2YgY29tcGxleCovXHJcblxyXG5cclxuICAgIFxyXG59XTsiLCJcclxubW9kdWxlLmV4cG9ydHMgPSBbXCIkc2NvcGVcIiwgXCJUb2FzdFNlcnZpY2VcIiwgXCIkbG9jYXRpb25cIiwgXCIkaHR0cFwiLCBcInRlbXBsYXRlc1wiLFwiJHJvdXRlXCIsXCJPYmplY3RJY29uU2VydmljZVwiXHJcbixmdW5jdGlvbigkc2NvcGUsIFRvYXN0U2VydmljZSwgJGxvY2F0aW9uLCAkaHR0cCwgdGVtcGxhdGVzLCAkcm91dGUsIE9iamVjdEljb25TZXJ2aWNlKSB7XHJcblx0XHJcblxyXG5cdCRzY29wZS5PYmplY3RJY29uU2VydmljZSA9IE9iamVjdEljb25TZXJ2aWNlO1xyXG5cdCRzY29wZS5nb1RvVXNlcnMgPSBmdW5jdGlvbih1c2VyKXtcclxuXHRcdCRsb2NhdGlvbi5wYXRoKCd3aXp6YXJkL3VzZXJzJyk7XHJcblx0fVxyXG5cdCRzY29wZS5nb1RvVGVtcGxhdGVzID0gZnVuY3Rpb24oKXtcclxuXHRcdCRyb3V0ZS5yZWxvYWQoKTtcclxuXHR9XHJcblx0JHNjb3BlLmdvVG9PYmplY3RzVG9UZW1wbGF0ZSA9IGZ1bmN0aW9uKHRlbXBsYXRlKXtcclxuXHRcdCRsb2NhdGlvbi5wYXRoKCd3aXp6YXJkL29iamVjdHMtdG8tdGVtcGxhdGUvJyt0ZW1wbGF0ZS5pZCk7XHJcblx0fVxyXG5cclxuICAgICRzY29wZS50eXBlcyA9IFtcclxuXHRcdHtrZXk6J2FwJywgdmFsdWU6J0FwYXJ0bWVudCd9LFxyXG5cdFx0e2tleTonaG91c2UnLCB2YWx1ZTonSG91c2UnfSxcclxuXHRcdHtrZXk6J2NvbXBsZXgnLCB2YWx1ZTonSG91c2UgY29tcGxleCd9XHJcbiAgICBdO1xyXG4gICAgJHNjb3BlLnRlbXBsYXRlcyA9IHRlbXBsYXRlcztcclxuICAgICRzY29wZS50ZW1wbGF0ZSA9IHt9O1xyXG4gICAgJHNjb3BlLmRvbmUgPSBmYWxzZTtcclxuICAgICRzY29wZS5zYXZlVGVtcGxhdGUgPSBmdW5jdGlvbihmb3JtKXtcclxuICAgIFx0aWYoZm9ybS4kdmFsaWQpeyAgICBcdFx0XHJcbiAgICBcdFx0dmFyIHRlbXBsYXRlID0ge307XHJcbiAgICBcdFx0aWYoJHNjb3BlLnRlbXBsYXRlLnR5cGUgPT0gJ2FwJyl7XHJcbiAgICBcdFx0XHR0ZW1wbGF0ZS5yb29tcyA9ICRzY29wZS5yb29tcztcclxuICAgIFx0XHRcdHRlbXBsYXRlLm9iamVjdHMgPSBbXTtcclxuICAgIFx0XHR9XHJcbiAgICBcdFx0aWYoJHNjb3BlLnRlbXBsYXRlLnR5cGUgPT0gJ2hvdXNlJyl7XHJcbiAgICBcdFx0XHR0ZW1wbGF0ZS5mbG9vcnMgPSAkc2NvcGUuZmxvb3JzO1xyXG4gICAgXHRcdFx0dGVtcGxhdGUub2JqZWN0cyA9IFtdO1xyXG4gICAgXHRcdH1cclxuICAgIFx0XHRpZigkc2NvcGUudGVtcGxhdGUudHlwZSA9PSAnY29tcGxleCcpe1xyXG5cdFx0XHRcdHRlbXBsYXRlLmhvdXNlcyA9ICRzY29wZS5ob3VzZXM7XHJcblx0XHRcdFx0dGVtcGxhdGUub2JqZWN0cyA9IFtdO1xyXG4gICAgXHRcdH1cclxuICAgIFx0XHQkc2NvcGUudGVtcGxhdGUudGVtcGxhdGUgPSBKU09OLnN0cmluZ2lmeSh0ZW1wbGF0ZSk7ICAgIFx0XHRcclxuICAgIFx0XHRpZigkc2NvcGUudGVtcGxhdGUuaWQpe1xyXG5cdFx0XHQgICAgJGh0dHAucHV0KCcvYXBpL3RlbXBsYXRlcy8nKyRzY29wZS50ZW1wbGF0ZS5pZCwge3RlbXBsYXRlOiRzY29wZS50ZW1wbGF0ZX0pLnN1Y2Nlc3MoZnVuY3Rpb24ocmVzcG9uc2Upe1xyXG5cdFx0XHQgICAgXHQkcm91dGUucmVsb2FkKCk7XHJcblx0XHRcdCAgICB9KS5lcnJvcihmdW5jdGlvbihyZXNwb25zZSl7XHJcblx0XHRcdCAgICAgICAgVG9hc3RTZXJ2aWNlLmNyZWF0ZShyZXNwb25zZSwgJ2RhbmdlcicpO1xyXG5cdFx0XHQgICAgfSlcclxuICAgIFx0XHR9ZWxzZXtcclxuXHRcdFx0ICAgICRodHRwLnBvc3QoJy9hcGkvdGVtcGxhdGVzJywge3RlbXBsYXRlOiRzY29wZS50ZW1wbGF0ZX0pLnN1Y2Nlc3MoZnVuY3Rpb24ocmVzcG9uc2Upe1xyXG5cdFx0ICAgICAgICBcdCRzY29wZS50ZW1wbGF0ZS5pZCA9IHJlc3BvbnNlLmlkO1xyXG5cdFx0ICAgICAgICBcdCRzY29wZS50ZW1wbGF0ZXMucHVzaCgkc2NvcGUudGVtcGxhdGUpO1xyXG5cdFx0ICAgICAgICBcdCRzY29wZS50ZW1wbGF0ZSA9IHt9O1xyXG5cdFx0ICAgICAgICBcdCRzY29wZS5kb25lID0gZmFsc2U7XHJcblx0XHRcdCAgICB9KS5lcnJvcihmdW5jdGlvbihyZXNwb25zZSl7XHJcblx0XHRcdCAgICAgICAgVG9hc3RTZXJ2aWNlLmNyZWF0ZShyZXNwb25zZSwgJ2RhbmdlcicpO1xyXG5cdFx0XHQgICAgfSlcclxuICAgIFx0XHR9XHJcbiAgICBcdH0gICAgXHRcclxuICAgIH1cclxuXHJcblx0JHNjb3BlLmVkaXRUZW1wbGF0ZSA9IGZ1bmN0aW9uKHVzZXIpe1xyXG5cdCAgICAkaHR0cC5nZXQoJy9hcGkvdGVtcGxhdGVzLycrdXNlci5pZCkuc3VjY2VzcyhmdW5jdGlvbihyZXNwb25zZSl7XHQgICAgXHRcclxuXHRcdFx0JHNjb3BlLnRlbXBsYXRlID0gcmVzcG9uc2U7XHJcblx0XHRcdGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcclxuXHRcdFx0aWYocmVzcG9uc2UudHlwZSA9PSAnYXAnKXtcclxuXHRcdFx0XHQkc2NvcGUucm9vbXMgPSBKU09OLnBhcnNlKHJlc3BvbnNlLnRlbXBsYXRlKS5yb29tcztcclxuXHRcdFx0fVxyXG5cdFx0XHRpZihyZXNwb25zZS50eXBlID09ICdob3VzZScpe1xyXG5cdFx0XHRcdCRzY29wZS5mbG9vcnMgPSBKU09OLnBhcnNlKHJlc3BvbnNlLnRlbXBsYXRlKS5mbG9vcnM7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYocmVzcG9uc2UudHlwZSA9PSAnY29tcGxleCcpe1xyXG5cdFx0XHRcdCRzY29wZS5ob3VzZXMgPSBKU09OLnBhcnNlKHJlc3BvbnNlLnRlbXBsYXRlKS5ob3VzZXM7XHJcblx0XHRcdH1cclxuXHQgICAgfSkuZXJyb3IoZnVuY3Rpb24ocmVzcG9uc2Upe1xyXG5cdCAgICAgICAgVG9hc3RTZXJ2aWNlLmNyZWF0ZShyZXNwb25zZSwgJ2RhbmdlcicpO1xyXG5cdCAgICB9KVxyXG5cdH1cclxuXHJcblx0JHNjb3BlLnJlbW92ZVRlbXBsYXRlID0gZnVuY3Rpb24odGVtcGxhdGUpe1xyXG5cdCAgICAkaHR0cC5kZWxldGUoJy9hcGkvdGVtcGxhdGVzLycrdGVtcGxhdGUuaWQpLnN1Y2Nlc3MoZnVuY3Rpb24ocmVzcG9uc2Upe1xyXG5cdFx0XHR2YXIgdGVtcGxhdGVLZXkgPSBfLmZpbmRMYXN0SW5kZXgoJHNjb3BlLnRlbXBsYXRlcywge2lkOiB0ZW1wbGF0ZS5pZH0pO1xyXG5cdFx0XHQkc2NvcGUudGVtcGxhdGVzLnNwbGljZSh0ZW1wbGF0ZUtleSwxKTtcclxuXHRcdFx0VG9hc3RTZXJ2aWNlLmNyZWF0ZSgnU3VjY2Vzc2Z1bGx5IGRlbGV0ZWQnLCAnc3VjY2VzcycpO1xyXG5cdCAgICB9KS5lcnJvcihmdW5jdGlvbihyZXNwb25zZSl7XHJcblx0ICAgICAgICBUb2FzdFNlcnZpY2UuY3JlYXRlKHJlc3BvbnNlLCAnZGFuZ2VyJyk7XHJcblx0ICAgIH0pXHJcblx0fSBcclxuICAgIFxyXG5cclxuXHQkc2NvcGUucm9vbXMgPSBbXTtcclxuICAgICRzY29wZS5hZGRBcFJvb20gPSBmdW5jdGlvbigpe1xyXG4gICAgXHRpZigkc2NvcGUucm9vbU5hbWUgIT0gdW5kZWZpbmVkKXtcclxuICAgIFx0XHR2YXIgcm9vbUtleSA9IF8uZmluZExhc3RJbmRleCgkc2NvcGUucm9vbXMsIHtuYW1lOiAkc2NvcGUucm9vbU5hbWV9KTtcclxuICAgIFx0XHRpZihyb29tS2V5ID09ICctMScpe1xyXG5cdCAgICBcdFx0JHNjb3BlLnJvb20gPSB7fTtcclxuXHQgICAgXHRcdCRzY29wZS5yb29tLm5hbWUgPSAkc2NvcGUucm9vbU5hbWU7XHJcblx0ICAgIFx0XHQkc2NvcGUucm9vbS5pY29uX2lkID0gJHNjb3BlLnJvb21JY29uLmlkO1xyXG5cdCAgICBcdFx0JHNjb3BlLnJvb20ub2JqZWN0cyA9IFtdO1xyXG5cdFx0XHRcdCRzY29wZS5yb29tcy5wdXNoKCRzY29wZS5yb29tKTtcclxuXHRcdFx0XHQkc2NvcGUucm9vbSA9IHt9O1xyXG5cdFx0XHRcdCRzY29wZS5yb29tTmFtZSA9IG51bGw7XHJcblx0XHRcdFx0JHNjb3BlLnJvb21JY29uID0gbnVsbDtcclxuICAgIFx0XHR9ZWxzZXtcclxuICAgIFx0XHRcdFRvYXN0U2VydmljZS5jcmVhdGUoXCJSb29tIGFscmVhZHkgZXhpc3RzXCIsICdkYW5nZXInKTtcclxuICAgIFx0XHR9XHJcblx0XHR9XHJcbiAgICB9XHJcblx0JHNjb3BlLmRlbGV0ZUFwUm9vbSA9IGZ1bmN0aW9uKHJvb20pe1xyXG5cdFx0dmFyIHJvb21LZXkgPSBfLmZpbmRMYXN0SW5kZXgoJHNjb3BlLnJvb21zLCB7bmFtZTogcm9vbS5uYW1lfSk7XHJcblx0XHQkc2NvcGUucm9vbXMuc3BsaWNlKHJvb21LZXksMSk7XHJcblx0fVxyXG5cclxuXHJcblx0JHNjb3BlLmZsb29ycyA9IFtdO1xyXG4gICAgJHNjb3BlLmFkZEhvdXNlRmxvb3IgPSBmdW5jdGlvbigpe1xyXG4gICAgXHQkc2NvcGUuZmxvb3IgPSB7fTtcclxuICAgIFx0aWYoJHNjb3BlLmZsb29yTmFtZSAhPSB1bmRlZmluZWQpe1xyXG4gICAgXHRcdHZhciBmbG9vcktleSA9IF8uZmluZExhc3RJbmRleCgkc2NvcGUuZmxvb3JzLCB7bmFtZTogJHNjb3BlLmZsb29yTmFtZX0pO1xyXG4gICAgXHRcdGlmKGZsb29yS2V5ID09ICctMScpe1xyXG5cdCAgICBcdFx0JHNjb3BlLmZsb29yLm5hbWUgPSAkc2NvcGUuZmxvb3JOYW1lO1xyXG5cdCAgICBcdFx0JHNjb3BlLmZsb29yLmljb25faWQgPSAkc2NvcGUuZmxvb3JJY29uLmlkO1xyXG5cdCAgICBcdFx0JHNjb3BlLmZsb29yLm9iamVjdHMgPSBbXTtcclxuXHRcdCAgICBcdCRzY29wZS5mbG9vci5yb29tcyA9IFtdO1xyXG5cdFx0XHRcdCRzY29wZS5mbG9vcnMucHVzaCgkc2NvcGUuZmxvb3IpO1xyXG5cdFx0XHRcdCRzY29wZS5mbG9vciA9IHt9O1xyXG5cdFx0XHRcdCRzY29wZS5mbG9vck5hbWUgPSBudWxsO1xyXG5cdFx0XHRcdCRzY29wZS5mbG9vckljb24gPSBudWxsO1xyXG4gICAgXHRcdH1lbHNle1xyXG5cdFx0XHRcdFRvYXN0U2VydmljZS5jcmVhdGUoXCJGbG9vciBhbHJlYWR5IGV4aXN0c1wiLCAnZGFuZ2VyJyk7XHJcbiAgICBcdFx0fVxyXG4gICAgXHR9XHQgICAgXHRcclxuICAgIH1cclxuICAgICRzY29wZS5kZWxldGVIb3VzZUZsb29yID0gZnVuY3Rpb24oZmxvb3Ipe1xyXG5cdFx0dmFyIGZsb29yS2V5ID0gXy5maW5kTGFzdEluZGV4KCRzY29wZS5mbG9vcnMsIHtuYW1lOiBmbG9vci5uYW1lfSk7XHJcblx0XHQkc2NvcGUuZmxvb3JzLnNwbGljZShmbG9vcktleSwxKTtcclxuICAgIH1cclxuICAgICRzY29wZS5hZGRIb3VzZVJvb20gPSBmdW5jdGlvbigpe1xyXG4gICAgXHQkc2NvcGUucm9vbSA9IHt9O1xyXG4gICAgXHRpZigkc2NvcGUucm9vbU5hbWUgIT0gdW5kZWZpbmVkKXtcclxuXHRcdFx0dmFyIGZsb29yS2V5ID0gXy5maW5kTGFzdEluZGV4KCRzY29wZS5mbG9vcnMsIHtuYW1lOiAkc2NvcGUuZmxvb3IubmFtZX0pO1xyXG5cdFx0XHR2YXIgcm9vbUtleSA9IF8uZmluZExhc3RJbmRleCgkc2NvcGUuZmxvb3JzW2Zsb29yS2V5XVsncm9vbXMnXSwge25hbWU6ICRzY29wZS5yb29tTmFtZX0pO1xyXG5cdFx0XHRpZihyb29tS2V5ID09ICctMScpe1xyXG5cdCAgICBcdFx0JHNjb3BlLnJvb20ubmFtZSA9ICRzY29wZS5yb29tTmFtZTtcclxuXHQgICAgXHRcdCRzY29wZS5yb29tLmljb25faWQgPSAkc2NvcGUucm9vbUljb24uaWQ7XHJcblx0ICAgIFx0XHQkc2NvcGUucm9vbS5vYmplY3RzID0gW107XHJcblx0XHRcdFx0dmFyIGZsb29yS2V5ID0gXy5maW5kTGFzdEluZGV4KCRzY29wZS5mbG9vcnMsIHtuYW1lOiAkc2NvcGUuZmxvb3IubmFtZX0pO1xyXG5cdFx0XHRcdCRzY29wZS5mbG9vcnNbZmxvb3JLZXldLnJvb21zLnB1c2goJHNjb3BlLnJvb20pO1xyXG5cdFx0XHRcdCRzY29wZS5mbG9vciA9IHt9O1xyXG5cdFx0XHRcdCRzY29wZS5yb29tID0ge307XHJcblx0XHRcdFx0JHNjb3BlLnJvb21OYW1lID0gbnVsbDtcclxuXHRcdFx0XHQkc2NvcGUucm9vbUljb24gPSBudWxsO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRUb2FzdFNlcnZpY2UuY3JlYXRlKFwiUm9vbSBhbHJlYWR5IGV4aXN0c1wiLCAnZGFuZ2VyJyk7XHJcblx0XHRcdH1cclxuICAgIFx0fVxyXG4gICAgfVxyXG4gICAgJHNjb3BlLmRlbGV0ZUhvdXNlUm9vbSA9IGZ1bmN0aW9uKGZsb29yLCByb29tKXtcclxuXHRcdHZhciBmbG9vcktleSA9IF8uZmluZExhc3RJbmRleCgkc2NvcGUuZmxvb3JzLCB7bmFtZTogZmxvb3IubmFtZX0pO1xyXG5cdFx0dmFyIHJvb21LZXkgPSBfLmZpbmRMYXN0SW5kZXgoJHNjb3BlLmZsb29yc1tmbG9vcktleV1bJ3Jvb21zJ10sIHtuYW1lOiByb29tLm5hbWV9KTtcclxuXHRcdCRzY29wZS5mbG9vcnNbZmxvb3JLZXldWydyb29tcyddLnNwbGljZShyb29tS2V5LDEpO1xyXG4gICAgfVxyXG4gXHJcblxyXG5cdCRzY29wZS5ob3VzZXMgPSBbXTtcclxuICAgICRzY29wZS5hZGRDb21wbGV4SG91c2UgPSBmdW5jdGlvbigpe1xyXG4gICAgXHQkc2NvcGUuaG91c2UgPSB7fTtcclxuICAgIFx0aWYoJHNjb3BlLmhvdXNlTmFtZSAhPSB1bmRlZmluZWQpe1xyXG4gICAgXHRcdHZhciBob3VzZUtleSA9IF8uZmluZExhc3RJbmRleCgkc2NvcGUuaG91c2VzLCB7bmFtZTogJHNjb3BlLmhvdXNlTmFtZX0pO1xyXG4gICAgXHRcdGlmKGhvdXNlS2V5ID09ICctMScpe1xyXG5cdCAgICBcdFx0JHNjb3BlLmhvdXNlLm5hbWUgPSAkc2NvcGUuaG91c2VOYW1lO1xyXG5cdCAgICBcdFx0JHNjb3BlLmhvdXNlLmljb25faWQgPSAkc2NvcGUuaG91c2VJY29uLmlkO1xyXG5cdFx0ICAgIFx0JHNjb3BlLmhvdXNlLmZsb29ycyA9IFtdO1xyXG5cdFx0ICAgIFx0JHNjb3BlLmhvdXNlLm9iamVjdHMgPSBbXTtcclxuXHRcdFx0XHQkc2NvcGUuaG91c2VzLnB1c2goJHNjb3BlLmhvdXNlKTtcclxuXHRcdFx0XHQkc2NvcGUuaG91c2UgPSB7fTtcclxuXHRcdFx0XHQkc2NvcGUuaG91c2VOYW1lID0gbnVsbDtcclxuXHRcdFx0XHQkc2NvcGUuaG91c2VJY29uID0gbnVsbDsgICAgXHRcdFx0XHJcbiAgICBcdFx0fWVsc2V7XHJcbiAgICBcdFx0XHRUb2FzdFNlcnZpY2UuY3JlYXRlKFwiSG91c2UgYWxyZWFkeSBleGlzdHNcIiwgJ2RhbmdlcicpO1xyXG4gICAgXHRcdH1cclxuICAgIFx0fSAgIFx0XHJcbiAgICB9XHJcbiAgICAkc2NvcGUuZGVsZXRlQ29tcGxleEhvdXNlID0gZnVuY3Rpb24oaG91c2Upe1xyXG5cdFx0dmFyIGhvdXNlS2V5ID0gXy5maW5kTGFzdEluZGV4KCRzY29wZS5ob3VzZXMsIHtuYW1lOiBob3VzZS5uYW1lfSk7XHJcblx0XHQkc2NvcGUuaG91c2VzLnNwbGljZShob3VzZUtleSwxKTtcclxuICAgIH0gXHJcbiAgICAkc2NvcGUuYWRkQ29tcGxleEZsb29yID0gZnVuY3Rpb24oKXtcclxuICAgIFx0JHNjb3BlLmZsb29yID0ge307XHJcbiAgICBcdGlmKCRzY29wZS5mbG9vck5hbWUgIT0gdW5kZWZpbmVkKXtcclxuXHRcdFx0dmFyIGhvdXNlS2V5ID0gXy5maW5kTGFzdEluZGV4KCRzY29wZS5ob3VzZXMsIHtuYW1lOiAkc2NvcGUuaG91c2UubmFtZX0pO1xyXG5cdFx0XHR2YXIgZmxvb3JLZXkgPSBfLmZpbmRMYXN0SW5kZXgoJHNjb3BlLmhvdXNlc1tob3VzZUtleV1bJ2Zsb29ycyddLCB7bmFtZTogJHNjb3BlLmZsb29yTmFtZX0pO1xyXG5cdFx0XHRpZihmbG9vcktleSA9PSAnLTEnKXtcclxuXHQgICAgXHRcdCRzY29wZS5mbG9vci5uYW1lID0gJHNjb3BlLmZsb29yTmFtZTtcclxuXHQgICAgXHRcdCRzY29wZS5mbG9vci5pY29uX2lkID0gJHNjb3BlLmZsb29ySWNvbi5pZDtcclxuXHRcdCAgICBcdCRzY29wZS5mbG9vci5yb29tcyA9IFtdO1xyXG5cdCAgICBcdFx0JHNjb3BlLmZsb29yLm9iamVjdHMgPSBbXTtcdFx0ICAgXHJcblx0XHRcdFx0dmFyIGhvdXNlS2V5ID0gXy5maW5kTGFzdEluZGV4KCRzY29wZS5ob3VzZXMsIHtuYW1lOiAkc2NvcGUuaG91c2UubmFtZX0pO1xyXG5cdFx0XHRcdCRzY29wZS5ob3VzZXNbaG91c2VLZXldLmZsb29ycy5wdXNoKCRzY29wZS5mbG9vcik7XHJcblx0XHRcdFx0JHNjb3BlLmhvdXNlID0ge307XHJcblx0XHRcdFx0JHNjb3BlLmZsb29yID0ge307XHJcblx0XHRcdFx0JHNjb3BlLmZsb29yTmFtZSA9IG51bGw7XHJcblx0XHRcdFx0JHNjb3BlLmZsb29ySWNvbiA9IG51bGw7XHRcdFx0XHRcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0VG9hc3RTZXJ2aWNlLmNyZWF0ZShcIkZsb29yIGFscmVhZHkgZXhpc3RzXCIsICdkYW5nZXInKTtcclxuXHRcdFx0fVxyXG4gICAgXHR9XHRcdFxyXG4gICAgfVxyXG4gICAgJHNjb3BlLmRlbGV0ZUNvbXBsZXhGbG9vciA9IGZ1bmN0aW9uKGhvdXNlLCBmbG9vcil7XHJcblx0XHR2YXIgaG91c2VLZXkgPSBfLmZpbmRMYXN0SW5kZXgoJHNjb3BlLmhvdXNlcywge25hbWU6IGhvdXNlLm5hbWV9KTtcclxuXHRcdHZhciBmbG9vcktleSA9IF8uZmluZExhc3RJbmRleCgkc2NvcGUuaG91c2VzW2hvdXNlS2V5XVsnZmxvb3JzJ10sIHtuYW1lOiBmbG9vci5uYW1lfSk7XHJcblx0XHQkc2NvcGUuaG91c2VzW2hvdXNlS2V5XVsnZmxvb3JzJ10uc3BsaWNlKGZsb29yS2V5LDEpOyBcclxuICAgIH1cclxuICAgICRzY29wZS5hZGRDb21wbGV4Um9vbSA9IGZ1bmN0aW9uKCl7XHJcbiAgICBcdCRzY29wZS5yb29tID0ge307XHJcbiAgICBcdGlmKCRzY29wZS5yb29tTmFtZSAhPSB1bmRlZmluZWQpe1xyXG5cclxuXHRcdFx0dmFyIGhvdXNlS2V5ID0gXy5maW5kTGFzdEluZGV4KCRzY29wZS5ob3VzZXMsIHtuYW1lOiAkc2NvcGUuaG91c2UubmFtZX0pO1xyXG5cdFx0XHR2YXIgZmxvb3JLZXkgPSBfLmZpbmRMYXN0SW5kZXgoJHNjb3BlLmhvdXNlc1tob3VzZUtleV1bJ2Zsb29ycyddLCB7bmFtZTogJHNjb3BlLmZsb29yLm5hbWV9KTtcclxuXHRcdFx0dmFyIHJvb21LZXkgPSBfLmZpbmRMYXN0SW5kZXgoJHNjb3BlLmhvdXNlc1tob3VzZUtleV1bJ2Zsb29ycyddW2Zsb29yS2V5XVsncm9vbXMnXSwge25hbWU6ICRzY29wZS5yb29tTmFtZX0pO1xyXG5cdFx0XHRpZihyb29tS2V5ID09ICctMScpe1xyXG5cdCAgICBcdFx0JHNjb3BlLnJvb20ubmFtZSA9ICRzY29wZS5yb29tTmFtZTtcclxuXHQgICAgXHRcdCRzY29wZS5yb29tLmljb25faWQgPSAkc2NvcGUucm9vbUljb24uaWQ7XHJcblx0ICAgIFx0XHQkc2NvcGUucm9vbS5vYmplY3RzID0gW107XHJcblx0XHRcdFx0dmFyIGhvdXNlS2V5ID0gXy5maW5kTGFzdEluZGV4KCRzY29wZS5ob3VzZXMsIHtuYW1lOiAkc2NvcGUuaG91c2UubmFtZX0pO1xyXG5cdFx0XHRcdHZhciBmbG9vcktleSA9IF8uZmluZExhc3RJbmRleCgkc2NvcGUuaG91c2VzW2hvdXNlS2V5XVsnZmxvb3JzJ10sIHtuYW1lOiAkc2NvcGUuZmxvb3IubmFtZX0pO1xyXG5cdFx0XHRcdCRzY29wZS5ob3VzZXNbaG91c2VLZXldLmZsb29yc1tmbG9vcktleV1bJ3Jvb21zJ10ucHVzaCgkc2NvcGUucm9vbSk7XHJcblx0XHRcdFx0JHNjb3BlLmhvdXNlID0ge307XHJcblx0XHRcdFx0JHNjb3BlLmZsb29yID0ge307XHJcblx0XHRcdFx0JHNjb3BlLnJvb20gPSB7fTtcclxuXHRcdFx0XHQkc2NvcGUucm9vbU5hbWUgPSBudWxsO1x0ICAgIFx0XHJcblx0XHRcdFx0JHNjb3BlLnJvb21JY29uID0gbnVsbDtcdFx0XHRcdFxyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRUb2FzdFNlcnZpY2UuY3JlYXRlKFwiUm9vbSBhbHJlYWR5IGV4aXN0c1wiLCAnZGFuZ2VyJyk7XHJcblx0XHRcdH1cclxuXHRcdH0gICAgXHRcclxuICAgIH1cclxuICAgICRzY29wZS5kZWxldGVDb21wbGV4Um9vbSA9IGZ1bmN0aW9uKGhvdXNlLCBmbG9vciwgcm9vbSl7XHJcblx0XHR2YXIgaG91c2VLZXkgPSBfLmZpbmRMYXN0SW5kZXgoJHNjb3BlLmhvdXNlcywge25hbWU6IGhvdXNlLm5hbWV9KTtcclxuXHRcdHZhciBmbG9vcktleSA9IF8uZmluZExhc3RJbmRleCgkc2NvcGUuaG91c2VzW2hvdXNlS2V5XVsnZmxvb3JzJ10sIHtuYW1lOiBmbG9vci5uYW1lfSk7XHJcblx0XHR2YXIgcm9vbUtleSA9IF8uZmluZExhc3RJbmRleCgkc2NvcGUuaG91c2VzW2hvdXNlS2V5XVsnZmxvb3JzJ11bZmxvb3JLZXldWydyb29tJ10sIHtuYW1lOiByb29tLm5hbWV9KTsgICBcclxuXHRcdCRzY29wZS5ob3VzZXNbaG91c2VLZXldWydmbG9vcnMnXVtmbG9vcktleV1bJ3Jvb21zJ10uc3BsaWNlKHJvb21LZXksMSk7IFxyXG4gICAgfVxyXG5cclxuXHJcbn1dOyIsIlxyXG5tb2R1bGUuZXhwb3J0cyA9IFtcIiRzY29wZVwiLCBcIlRvYXN0U2VydmljZVwiLCBcIiRsb2NhdGlvblwiLCBcIiRodHRwXCIsIFwidXNlcnNcIixcIiRyb3V0ZVwiLCBcIlVzZXJGYWN0b3J5XCIsIFwiSG91c2VGYWN0b3J5XCIsIFwiRmxvb3JGYWN0b3J5XCIsIFwiUm9vbUZhY3RvcnlcIiwgXCJPYmplY3RGYWN0b3J5XCIsIFwiJHFcIiwgXCJoZWxwZXJPYmplY3RTZXJ2aWNlXCIsIFwiSXRlbUZhY3RvcnlcIlxyXG4sZnVuY3Rpb24oJHNjb3BlLCBUb2FzdFNlcnZpY2UsICRsb2NhdGlvbiwgJGh0dHAsIHVzZXJzLCAkcm91dGUsIFVzZXJGYWN0b3J5LCBIb3VzZUZhY3RvcnksIEZsb29yRmFjdG9yeSwgUm9vbUZhY3RvcnksIE9iamVjdEZhY3RvcnksICRxLCBoZWxwZXJPYmplY3RTZXJ2aWNlLCBJdGVtRmFjdG9yeSkge1xyXG5cdFxyXG5cclxuXHJcblx0JHNjb3BlLmdvVG9Sb29tc1RvSG91c2UgPSBmdW5jdGlvbih1c2VyKXtcclxuXHRcdCRsb2NhdGlvbi5wYXRoKCd3aXp6YXJkL3Jvb21zLXRvLWhvdXNlLycrdXNlci5pZCsnLycrdXNlci50eXBlKTtcclxuXHR9XHJcblx0JHNjb3BlLmdvVG9PYmplY3RzVG9Sb29tcyA9IGZ1bmN0aW9uKHVzZXIpe1xyXG5cdFx0JGxvY2F0aW9uLnBhdGgoJ3dpenphcmQvb2JqZWN0cy10by1yb29tcy8nK3VzZXIuaWQrJy8nK3VzZXIudHlwZSk7XHJcblx0fVxyXG5cdCRzY29wZS5nb1RvT2JqZWN0c1RvQ29udHJvbGxzID0gZnVuY3Rpb24odXNlcil7XHJcblx0XHQkbG9jYXRpb24ucGF0aCgnd2l6emFyZC9vYmplY3RzLWNvbnRyb2xscy8nK3VzZXIuaWQrJy8nK3VzZXIudHlwZSk7XHJcblx0fVxyXG5cdCRzY29wZS5nb1RvVGVtcGxhdGVzID0gZnVuY3Rpb24odXNlcil7XHJcblx0XHQkbG9jYXRpb24ucGF0aCgnd2l6emFyZC90ZW1wbGF0ZXMnKTtcclxuXHR9XHJcblx0JHNjb3BlLmdvVG9Vc2VycyA9IGZ1bmN0aW9uKHVzZXIpe1xyXG5cdFx0JHJvdXRlLnJlbG9hZCgpO1xyXG5cdH1cdFxyXG5cclxuXHJcblx0XHRcclxuICAgICRzY29wZS50eXBlcyA9IFtcclxuXHRcdHtrZXk6J2FwJywgdmFsdWU6J0FwYXJ0bWVudCd9LFxyXG5cdFx0e2tleTonaG91c2UnLCB2YWx1ZTonSG91c2UnfSxcclxuXHRcdHtrZXk6J2NvbXBsZXgnLCB2YWx1ZTonSG91c2UgY29tcGxleCd9XHJcbiAgICBdO1xyXG4gICAgJHNjb3BlLmxhbmd1YWdlcyA9IFtcclxuXHRcdHtrZXk6J2VuJywgdmFsdWU6J0VuZ2xpc2gnfSxcclxuXHRcdHtrZXk6J3JvJywgdmFsdWU6J1JvbWFuYScsfSxcclxuXHRcdHtrZXk6J2ZyJywgdmFsdWU6J0ZyYW7Dp2Fpcyd9XHJcbiAgICBdO1x0XHJcblxyXG4gICAgJHNjb3BlLnVzZXJzID0gdXNlcnM7XHJcbiAgICBcclxuXHQkc2NvcGUudXNlciA9IHt9O1xyXG4gICAgJHNjb3BlLnNhdmVVc2VyID0gZnVuY3Rpb24oZm9ybSl7XHJcbiAgICBcdGlmKGZvcm0uJHZhbGlkKXtcclxuXHQgICAgICAgIFVzZXJGYWN0b3J5LmNyZWF0ZSgkc2NvcGUudXNlcikudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XHJcblx0ICAgICAgICBcdCRzY29wZS51c2VyLmlkID0gcmVzcG9uc2U7XHJcblx0ICAgICAgICBcdCRzY29wZS51c2Vycy5wdXNoKCRzY29wZS51c2VyKTtcclxuXHQgICAgICAgIFx0JHNjb3BlLnVzZXIgPSB7fTtcclxuXHQgICAgICAgIH0pXHJcbiAgICBcdH1cclxuICAgIH1cclxuXHJcblxyXG4gICAgJHNjb3BlLmNsb25lVXNlciA9IGZ1bmN0aW9uKGZvcm0pe1xyXG4gICAgXHRpZihmb3JtLiR2YWxpZCl7XHJcbiAgICBcdFx0dmFyIGNsb25lQWZ0ZXJJZCA9IGZvcm0uY2xvbmVpZC4kbW9kZWxWYWx1ZTtcclxuICAgIFx0XHR2YXIgY2xvbmUgPSBmb3JtLnVzZXJpZC4kbW9kZWxWYWx1ZTtcclxuICAgIFx0XHRJdGVtRmFjdG9yeS5kZWxldGVBcFRyZWUoY2xvbmUpLnRoZW4oZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRJdGVtRmFjdG9yeS5nZXRBcFRyZWUoY2xvbmVBZnRlcklkKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcclxuXHRcdFx0XHRcdE9iamVjdEZhY3RvcnkuY3JlYXRlQWxsKHJlc3BvbnNlLm9iamVjdHMsIGNsb25lKS50aGVuKGZ1bmN0aW9uKCl7XHJcblxyXG5cdFx0XHRcdFx0XHRSb29tRmFjdG9yeS5jcmVhdGVBbGwocmVzcG9uc2Uucm9vbXMsIGNsb25lKS50aGVuKGZ1bmN0aW9uKHJvb21zKXtcclxuXHRcdFx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKHJvb21zKTtcclxuXHRcdFx0XHRcdFx0fSlcclxuXHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdFx0LypSb29tRmFjdG9yeS5jcmVhdGVBbGwocmVzcG9uc2Uucm9vbXMsIGNsb25lKS50aGVuKGZ1bmN0aW9uKCl7XHJcblxyXG5cdFx0XHRcdFx0fSkqL1xyXG5cdFx0XHQgICAgXHQvKl8uZWFjaChyZXNwb25zZS5yb29tcywgZnVuY3Rpb24ocm9vbSl7XHJcblx0XHRcdCAgICBcdFx0dmFyIG5ld1Jvb20gPSB7fTsgXHJcblx0XHRcdCAgICBcdFx0bmV3Um9vbS51c2VyX2lkID0gY2xvbmU7XHJcblx0XHRcdCAgICBcdFx0bmV3Um9vbS5uYW1lID0gcm9vbS5uYW1lO1xyXG5cdFx0XHQgICAgXHRcdG5ld1Jvb20uZmxvb3JfaWQgPSByb29tLmZsb29yX2lkO1xyXG5cdFx0XHQgICAgXHRcdG5ld1Jvb20ub3JkZXIgPSByb29tLm9yZGVyO1xyXG5cdFx0XHQgICAgXHRcdG5ld1Jvb20uaWNvbl9pZCA9IHJvb20uaWNvbl9pZDtcclxuXHRcdFx0XHRcdFx0Um9vbUZhY3RvcnkuY3JlYXRlKG5ld1Jvb20pLnRoZW4oZnVuY3Rpb24ocm9vbV9pZCl7XHJcblx0XHRcdFx0XHRcdFx0Xy5lYWNoKHJvb20ub2JqZWN0cywgZnVuY3Rpb24ob2JqZWN0KXtcclxuXHRcdFx0XHRcdFx0XHRcdHZhciBuZXdPYmplY3QgPSB7fTtcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcdFx0XHRuZXdPYmplY3QuTW9kdWxlSXRlbSA9IG9iamVjdC5Nb2R1bGVJdGVtO1xyXG5cdFx0XHRcdFx0XHRcdFx0bmV3T2JqZWN0Lk1vZHVsZVR5cGUgPSBvYmplY3QuTW9kdWxlVHlwZTtcclxuXHRcdFx0XHRcdFx0XHRcdG5ld09iamVjdC5JdGVtRGVzY3JpcHRpb24gPSBvYmplY3QuSXRlbURlc2NyaXB0aW9uO1xyXG5cdFx0XHRcdFx0XHRcdFx0bmV3T2JqZWN0LmNhdGVnb3J5ID0gb2JqZWN0LmNhdGVnb3J5O1xyXG5cdFx0XHRcdFx0XHRcdFx0bmV3T2JqZWN0LnRlbXBsYXRlX2lkID0gb2JqZWN0LnRlbXBsYXRlX2lkO1xyXG5cdFx0XHRcdFx0XHRcdFx0bmV3T2JqZWN0Lmljb25faWQgPSBvYmplY3QuaWNvbl9pZDtcclxuXHRcdFx0XHRcdFx0XHRcdG5ld09iamVjdC5zaHV0dGVyX2lucHV0ID0gb2JqZWN0LnNodXR0ZXJfaW5wdXQ7XHJcblx0XHRcdFx0XHRcdFx0XHRuZXdPYmplY3Quc2h1dHRlcl9zZWNvbmRzID0gb2JqZWN0LnNodXR0ZXJfc2Vjb25kcztcclxuXHRcdFx0XHRcdFx0XHRcdG5ld09iamVjdC5kaW1taW5nX2lucHV0ID0gb2JqZWN0LmRpbW1pbmdfaW5wdXQ7XHJcblx0XHRcdFx0XHRcdFx0XHRuZXdPYmplY3QuZGltbWluZ19yYXRpbyA9IG9iamVjdC5kaW1taW5nX3JhdGlvO1xyXG5cdFx0XHRcdFx0XHRcdFx0bmV3T2JqZWN0Lm5hbWUgPSBvYmplY3QubmFtZTtcclxuXHRcdFx0XHRcdFx0XHRcdG5ld09iamVjdC5yb29tX2lkID0gcm9vbV9pZDtcclxuXHRcdFx0XHRcdFx0XHRcdG5ld09iamVjdC5mbG9vcl9pZCA9IDA7XHJcblx0XHRcdFx0XHRcdFx0XHRuZXdPYmplY3QuaG91c2VfaWQgPSAwO1xyXG5cdFx0XHRcdFx0XHRcdFx0bmV3T2JqZWN0LnVzZXJfaWQgPSBjbG9uZTtcclxuXHRcdFx0XHRcdFx0XHRcdE9iamVjdEZhY3RvcnkuY3JlYXRlKG5ld09iamVjdCk7XHJcblx0XHRcdFx0XHRcdFx0fSlcclxuXHRcdFx0XHRcdFx0fSlcdCAgICBcdFx0XHJcblx0XHRcdCAgICBcdH0pKi9cclxuXHRcdFx0ICAgIH0pICAgIFx0XHRcdFxyXG4gICAgXHRcdH0pXHRcdCAgICBcclxuICAgIFx0fVxyXG4gICAgfVxyXG5cclxuXHJcblx0JHNjb3BlLnJlbW92ZVVzZXIgPSBmdW5jdGlvbih1c2VyKXtcclxuXHRcdFVzZXJGYWN0b3J5LmRlbGV0ZSh1c2VyLmlkKS50aGVuKGZ1bmN0aW9uKCl7XHJcblx0XHRcdHZhciB1c2VyS2V5ID0gXy5maW5kTGFzdEluZGV4KCRzY29wZS51c2Vycywge2lkOiB1c2VyLmlkfSk7XHJcblx0XHRcdCRzY29wZS51c2Vycy5zcGxpY2UodXNlcktleSwxKTtcclxuXHRcdFx0VG9hc3RTZXJ2aWNlLmNyZWF0ZSgnU3VjY2Vzc2Z1bGx5IGRlbGV0ZWQnLCAnc3VjY2VzcycpO1xyXG5cdCAgICB9KVxyXG5cdH0gXHJcblxyXG59XTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFtcIk9iamVjdFRlbXBsYXRlU2VydmljZVwiLCBcIk9iamVjdEljb25TZXJ2aWNlXCIsIFwiVG9hc3RTZXJ2aWNlXCIsIFwiT2JqZWN0RmFjdG9yeVwiLFwiJHJvdXRlXCIsIGZ1bmN0aW9uKE9iamVjdFRlbXBsYXRlU2VydmljZSwgT2JqZWN0SWNvblNlcnZpY2UsIFRvYXN0U2VydmljZSwgT2JqZWN0RmFjdG9yeSwgJHJvdXRlKSB7XHJcblx0cmV0dXJuIHtcclxuXHRcdHJlc3RyaWN0OiAnRScsXHJcblx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2RpcmVjdGl2ZXMvYWRtaW4tYWRkLW9iamVjdC1pdGVtLmh0bWwnLFxyXG5cdFx0cmVwbGFjZTogdHJ1ZSxcclxuICAgICAgICBzY29wZTp7XHJcbiAgICAgICAgICAgIGhvdXNlIDogJ0Bob3VzZScsXHJcbiAgICAgICAgICAgIGZsb29yIDogJ0BmbG9vcicsICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHJvb20gOiAnQHJvb20nLFxyXG4gICAgICAgICAgICB1c2VyIDogJ0B1c2VyJ1xyXG4gICAgICAgIH0sXHJcblx0XHRsaW5rOiBmdW5jdGlvbigkc2NvcGUpe1xyXG4gICAgICAgICAgICAkc2NvcGUub2JqZWN0ID0ge307XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuT2JqZWN0VGVtcGxhdGVTZXJ2aWNlID0gT2JqZWN0VGVtcGxhdGVTZXJ2aWNlO1xyXG4gICAgICAgICAgICAkc2NvcGUuT2JqZWN0SWNvblNlcnZpY2UgPSBPYmplY3RJY29uU2VydmljZTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS5uYW1lRWRpdG9yRW5hYmxlZCA9IGZhbHNlO1xyXG5cclxuXHJcbiAgICAgICAgICAgICRzY29wZS5lbmFibGVOYW1lRWRpdG9yID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBpZigkc2NvcGUub2JqZWN0LmNhdGVnb3J5KXtcclxuICAgICAgICAgICAgICAgICAgICBpZigkc2NvcGUub2JqZWN0LnRlbXBsYXRlX2lkKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnRlbXBsYXRlID0gT2JqZWN0VGVtcGxhdGVTZXJ2aWNlLmdldFRlbXBsYXRlKCRzY29wZS5vYmplY3QuY2F0ZWdvcnksICRzY29wZS5vYmplY3QudGVtcGxhdGVfaWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZigkc2NvcGUub2JqZWN0Lmljb25faWQpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuaWNvbiA9IE9iamVjdEljb25TZXJ2aWNlLmdldEljb24oJHNjb3BlLm9iamVjdC5jYXRlZ29yeSwgJHNjb3BlLm9iamVjdC5pY29uX2lkKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUubmFtZUVkaXRvckVuYWJsZWQgPSB0cnVlOyAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS5kaXNhYmxlTmFtZUVkaXRvciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLm5hbWVFZGl0b3JFbmFibGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuc2F2ZU9iamVjdCA9IGZ1bmN0aW9uKGZvcm0pIHtcclxuICAgICAgICAgICAgICAgIGlmKGZvcm0uJHZhbGlkKXtcclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUub2JqZWN0LnJvb21faWQgPSAkc2NvcGUucm9vbTtcclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUub2JqZWN0LmZsb29yX2lkID0gJHNjb3BlLmZsb29yO1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5vYmplY3QuaG91c2VfaWQgPSAkc2NvcGUuaG91c2U7XHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLm9iamVjdC51c2VyX2lkID0gJHNjb3BlLnVzZXI7ICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUub2JqZWN0Lmljb25faWQgPSAkc2NvcGUuaWNvbj8kc2NvcGUuaWNvbi5pZDpudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5vYmplY3QudGVtcGxhdGVfaWQgPSAkc2NvcGUudGVtcGxhdGUuaWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgT2JqZWN0RmFjdG9yeS5jcmVhdGUoJHNjb3BlLm9iamVjdCkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRyb3V0ZS5yZWxvYWQoKTtcclxuICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2UuY3JlYXRlKCdPYmplY3QgYWxyZWFkeSBleGlzdHMnLCd3YXJuaW5nJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSkgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG5cdH1cclxufV0iLCIndXNlIHN0cmljdCc7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFtcIk9iamVjdFRlbXBsYXRlU2VydmljZVwiLCBcIk9iamVjdEljb25TZXJ2aWNlXCIsXCIkaHR0cFwiLCBcIlRvYXN0U2VydmljZVwiLCBcIk9iamVjdEZhY3RvcnlcIiwgZnVuY3Rpb24oT2JqZWN0VGVtcGxhdGVTZXJ2aWNlLCBPYmplY3RJY29uU2VydmljZSwgJGh0dHAsIFRvYXN0U2VydmljZSwgT2JqZWN0RmFjdG9yeSkge1xyXG5cdHJldHVybiB7XHJcblx0XHRyZXN0cmljdDogJ0UnLFxyXG5cdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9kaXJlY3RpdmVzL2FkbWluLW9iamVjdC1pdGVtLmh0bWwnLFxyXG5cdFx0cmVwbGFjZTogdHJ1ZSxcclxuICAgICAgICBzY29wZTp7XHJcbiAgICAgICAgICAgIG9iamVjdCA6ICc9b2JqZWN0JyAgICAgICAgICAgIFxyXG4gICAgICAgIH0sXHJcblx0XHRsaW5rOiBmdW5jdGlvbigkc2NvcGUpe1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLk9iamVjdFRlbXBsYXRlU2VydmljZSA9IE9iamVjdFRlbXBsYXRlU2VydmljZTtcclxuICAgICAgICAgICAgJHNjb3BlLk9iamVjdEljb25TZXJ2aWNlID0gT2JqZWN0SWNvblNlcnZpY2U7XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUubmFtZUVkaXRvckVuYWJsZWQgPSBmYWxzZTtcclxuXHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuZW5hYmxlTmFtZUVkaXRvciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgaWYoJHNjb3BlLm9iamVjdC5jYXRlZ29yeSl7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoJHNjb3BlLm9iamVjdC50ZW1wbGF0ZV9pZCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS50ZW1wbGF0ZSA9IE9iamVjdFRlbXBsYXRlU2VydmljZS5nZXRUZW1wbGF0ZSgkc2NvcGUub2JqZWN0LmNhdGVnb3J5LCAkc2NvcGUub2JqZWN0LnRlbXBsYXRlX2lkKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoJHNjb3BlLm9iamVjdC5pY29uX2lkKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmljb24gPSBPYmplY3RJY29uU2VydmljZS5nZXRJY29uKCRzY29wZS5vYmplY3QuY2F0ZWdvcnksICRzY29wZS5vYmplY3QuaWNvbl9pZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgJHNjb3BlLm5hbWVFZGl0b3JFbmFibGVkID0gdHJ1ZTsgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuZGlzYWJsZU5hbWVFZGl0b3IgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICRzY29wZS5uYW1lRWRpdG9yRW5hYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLnNhdmVPYmplY3QgPSBmdW5jdGlvbihmb3JtKSB7XHJcbiAgICAgICAgICAgICAgICBpZihmb3JtLiR2YWxpZCl7XHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLm9iamVjdC5pY29uX2lkID0gJHNjb3BlLmljb24/JHNjb3BlLmljb24uaWQ6bnVsbDtcclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUub2JqZWN0LnRlbXBsYXRlX2lkID0gJHNjb3BlLnRlbXBsYXRlLmlkO1xyXG4gICAgICAgICAgICAgICAgICAgIE9iamVjdEZhY3RvcnkudXBkYXRlKCRzY29wZS5vYmplY3QpLnRoZW4oZnVuY3Rpb24oKXtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oKXtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfSkgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuXHR9XHJcbn1dIiwiJ3VzZSBzdHJpY3QnO1xyXG52YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ2FyZW5hJyk7XHJcblxyXG5hcHAuZGlyZWN0aXZlKCd6b25lJywgcmVxdWlyZSgnLi96b25lJykpO1xyXG5hcHAuZGlyZWN0aXZlKCdhZG1pbk9iamVjdEl0ZW0nLCByZXF1aXJlKCcuL2FkbWluLW9iamVjdC1pdGVtJykpO1xyXG5cclxuYXBwLmRpcmVjdGl2ZSgnYWRtaW5BZGRPYmplY3RJdGVtJywgcmVxdWlyZSgnLi9hZG1pbi1hZGQtb2JqZWN0LWl0ZW0nKSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBbXCJPYmplY3RJY29uU2VydmljZVwiLCBcIiRodHRwXCIsIFwiVXNlckZhY3RvcnlcIiwgXCJSb29tRmFjdG9yeVwiLCBcIkZsb29yRmFjdG9yeVwiLCBcIkhvdXNlRmFjdG9yeVwiLCBmdW5jdGlvbihPYmplY3RJY29uU2VydmljZSwgJGh0dHAsIFVzZXJGYWN0b3J5LCBSb29tRmFjdG9yeSwgRmxvb3JGYWN0b3J5LCBIb3VzZUZhY3RvcnkpIHtcclxuXHRyZXR1cm4ge1xyXG5cdFx0cmVzdHJpY3Q6ICdFJyxcclxuXHRcdHRlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy96b25lLmh0bWwnLFxyXG5cdFx0cmVwbGFjZTogdHJ1ZSxcclxuICAgICAgICBzY29wZTp7XHJcbiAgICAgICAgICAgIHR5cGUgOiAnQHR5cGUnLFxyXG4gICAgICAgICAgICB6b25lIDogJ0B6b25lJyxcclxuICAgICAgICAgICAgaXRlbTogJz1pdGVtJyxcclxuICAgICAgICAgICAgZmxvb3I6Jz1mbG9vcicsXHJcbiAgICAgICAgICAgIG9yZGVyQmFyIDogJz1vcmRlckJhcidcclxuICAgICAgICB9LFxyXG5cdFx0bGluazogZnVuY3Rpb24oJHNjb3BlKXtcclxuICAgICAgICAgICAgc3dpdGNoKCRzY29wZS56b25lKXtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ2hvdXNlcyc6XHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmxpbmsgPSBcIiMvaG91c2UvXCIrJHNjb3BlLml0ZW0uaWQ7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgJ2Zsb29ycyc6XHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmxpbmsgPSBcIiMvZmxvb3IvXCIrJHNjb3BlLml0ZW0uaWQ7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgJ3Jvb21zJzpcclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUubGluayA9IFwiIy9yb29tL1wiKyRzY29wZS5pdGVtLmlkO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH0gICAgICAgIFxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLm5hbWVFZGl0b3JFbmFibGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICRzY29wZS5pY29uRWRpdG9yRW5hYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAkc2NvcGUuT2JqZWN0SWNvblNlcnZpY2UgPSBPYmplY3RJY29uU2VydmljZTtcclxuICAgICAgICAgICAgJHNjb3BlLmVuYWJsZU5hbWVFZGl0b3IgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICRzY29wZS56b25lTmFtZSA9ICRzY29wZS5pdGVtLm5hbWU7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUubmFtZUVkaXRvckVuYWJsZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmVuYWJsZUljb25FZGl0b3IgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICRzY29wZS5pY29uc0FycmF5ID0gT2JqZWN0SWNvblNlcnZpY2UuZ2V0SWNvbnMoJHNjb3BlLnpvbmUpO1xyXG4gICAgICAgICAgICAgICAgaWYoJHNjb3BlLml0ZW0uaWNvbl9pZCl7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGtleTEgPSBfLmZpbmRMYXN0SW5kZXgoJHNjb3BlLmljb25zQXJyYXksIHtpZDogJHNjb3BlLml0ZW0uaWNvbl9pZH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5zZWxlY3RlZEljb24gPSAkc2NvcGUuaWNvbnNBcnJheVtrZXkxXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICRzY29wZS5lZGl0b3JJY29uRW5hYmxlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIH07ICAgICAgICAgICAgXHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuc2F2ZVpvbmUgPSBmdW5jdGlvbihmb3JtKXtcclxuICAgICAgICAgICAgICAgIGlmKGZvcm0uJHZhbGlkKXtcclxuICAgICAgICAgICAgICAgICAgICBpZigkc2NvcGUuc2VsZWN0ZWRJY29uKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLml0ZW0uaWNvbl9pZCA9ICRzY29wZS5zZWxlY3RlZEljb24uaWQ7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoZm9ybS56b25lTmFtZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5pdGVtLm5hbWUgPSBmb3JtLnpvbmVOYW1lLiRtb2RlbFZhbHVlOyAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBzd2l0Y2goJHNjb3BlLnpvbmUpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdyb29tcyc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSb29tRmFjdG9yeS51cGRhdGUoJHNjb3BlLml0ZW0pLnRoZW4oZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZGlzYWJsZUVkaXRvcigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZGlzYWJsZUVkaXRvcigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdmbG9vcnMnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgRmxvb3JGYWN0b3J5LnVwZGF0ZSgkc2NvcGUuaXRlbSkudGhlbihmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5kaXNhYmxlRWRpdG9yKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5kaXNhYmxlRWRpdG9yKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnaG91c2VzJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEhvdXNlRmFjdG9yeS51cGRhdGUoJHNjb3BlLml0ZW0pLnRoZW4oZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZGlzYWJsZUVkaXRvcigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZGlzYWJsZUVkaXRvcigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfSAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuZGlzYWJsZUVkaXRvciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLm5hbWVFZGl0b3JFbmFibGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuZWRpdG9ySWNvbkVuYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgfTsgICAgICAgICAgIFxyXG5cdFx0fVxyXG5cdH1cclxufV07IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBbXCIkaHR0cFwiLFwiJHFcIiwgXCJUb2FzdFNlcnZpY2VcIiwgZnVuY3Rpb24oJGh0dHAsICRxLCBUb2FzdFNlcnZpY2UpIHtcclxuICBcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgc2VhcmNoIDogZnVuY3Rpb24ob2JqZWN0KXtcclxuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcclxuICAgICAgICAgICAgJGh0dHAucG9zdCgnL2Zsb29ycy9zZWFyY2gnLCBvYmplY3QpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUocmVzcG9uc2UuZGF0YSk7XHJcbiAgICAgICAgICAgIH0sZnVuY3Rpb24oZXJyKSB7XHJcbiAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2UuY3JlYXRlKGVyci5kYXRhLCAnZGFuZ2VyJyk7XHJcbiAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QobnVsbCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTsgICAgICAgICAgICBcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNyZWF0ZSA6IGZ1bmN0aW9uKGZsb29yKXtcclxuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcclxuICAgICAgICAgICAgJGh0dHAucG9zdCgnL2Zsb29ycy9jcmVhdGUnLCBmbG9vcikudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XHJcbiAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHJlc3BvbnNlLmRhdGFbMF0pO1xyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbihlcnIpe1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLmNyZWF0ZShlcnIuZGF0YSwgJ2RhbmdlcicpO1xyXG4gICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KG51bGwpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTsgIFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdXBkYXRlOmZ1bmN0aW9uKGZsb29yKXtcclxuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcclxuICAgICAgICAgICAgJGh0dHAucHV0KCcvZmxvb3JzL3VwZGF0ZS8nK2Zsb29yLmlkLCB7Zmxvb3I6Zmxvb3J9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcclxuICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUocmVzcG9uc2UuZGF0YSk7XHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKCl7ICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QobnVsbCk7ICAgXHJcbiAgICAgICAgICAgIH0pICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGVsZXRlIDogZnVuY3Rpb24ob2JqZWN0KXtcclxuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcclxuICAgICAgICAgICAgJGh0dHAucG9zdCgnL2Zsb29ycy9kZWxldGUnLCBvYmplY3QpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xyXG4gICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShudWxsKTtcclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24oZXJyKXtcclxuICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5jcmVhdGUoZXJyLmRhdGEsICdkYW5nZXInKTtcclxuICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdChudWxsKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XHJcbiAgICAgICAgfSAgXHJcbiAgICB9XHJcbiAgICAgICAgXHJcbn1dIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBbXCIkaHR0cFwiLFwiJHFcIixcIlRvYXN0U2VydmljZVwiLCBmdW5jdGlvbigkaHR0cCwkcSxUb2FzdFNlcnZpY2UpIHtcclxuICBcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgc2VhcmNoIDogZnVuY3Rpb24ob2JqZWN0KXtcclxuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcclxuICAgICAgICAgICAgJGh0dHAucG9zdCgnL2hvdXNlcy9zZWFyY2gnLCBvYmplY3QpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUocmVzcG9uc2UuZGF0YSk7XHJcbiAgICAgICAgICAgIH0sZnVuY3Rpb24oZXJyKSB7XHJcbiAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2UuY3JlYXRlKGVyci5kYXRhLCAnZGFuZ2VyJyk7XHJcbiAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QobnVsbCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNyZWF0ZSA6IGZ1bmN0aW9uKGhvdXNlKXtcclxuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcclxuICAgICAgICAgICAgJGh0dHAucG9zdCgnL2hvdXNlcy9jcmVhdGUnLCBob3VzZSkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XHJcbiAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHJlc3BvbnNlLmRhdGFbMF0pO1xyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbihlcnIpe1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLmNyZWF0ZShlcnIuZGF0YSwgJ2RhbmdlcicpO1xyXG4gICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KG51bGwpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTsgIFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdXBkYXRlOmZ1bmN0aW9uKGhvdXNlKXtcclxuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcclxuICAgICAgICAgICAgJGh0dHAucHV0KCcvaG91c2VzL3VwZGF0ZS8nK2hvdXNlLmlkLCB7aG91c2U6aG91c2V9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcclxuICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUocmVzcG9uc2UuZGF0YSk7XHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKCl7ICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QobnVsbCk7ICAgXHJcbiAgICAgICAgICAgIH0pICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGVsZXRlIDogZnVuY3Rpb24ob2JqZWN0KXtcclxuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcclxuICAgICAgICAgICAgJGh0dHAucG9zdCgnL2hvdXNlcy9kZWxldGUnLCBvYmplY3QpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xyXG4gICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShudWxsKTtcclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24oZXJyKXtcclxuICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdChudWxsKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7ICAgICAgICAgICAgXHJcbiAgICAgICAgfSAgXHJcbiAgICB9XHJcbiAgICAgICAgXHJcbn1dIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBbJ1RvYXN0U2VydmljZScsJyRodHRwJywnUm9vbUZhY3RvcnknLCdGbG9vckZhY3RvcnknLCdIb3VzZUZhY3RvcnknLCdPYmplY3RGYWN0b3J5JywgXCIkcVwiLFxyXG4gICAgICAgIGZ1bmN0aW9uKFRvYXN0U2VydmljZSwgJGh0dHAsIFJvb21GYWN0b3J5LCBGbG9vckZhY3RvcnksIEhvdXNlRmFjdG9yeSwgT2JqZWN0RmFjdG9yeSwgJHEpIHsgIFxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBkZWxldGVBcFRyZWU6ZnVuY3Rpb24odXNlcl9pZCl7ICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHJldHVybiBPYmplY3RGYWN0b3J5LnNlYXJjaCh7dXNlcl9pZDp1c2VyX2lkfSkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0RmFjdG9yeS5kZWxldGVBbGwocmVzcG9uc2UpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBSb29tRmFjdG9yeS5zZWFyY2goe3VzZXJfaWQ6dXNlcl9pZH0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gUm9vbUZhY3RvcnkuZGVsZXRlQWxsKHJlc3BvbnNlKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXsgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICB9KSBcclxuICAgICAgICAgICAgICAgIH0pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9LFxyXG4gICAgICAgIGdldEFwVHJlZSA6IGZ1bmN0aW9uKHVzZXJfaWQpe1xyXG4gICAgICAgICAgICByZXR1cm4gUm9vbUZhY3Rvcnkuc2VhcmNoKHt1c2VyX2lkOnVzZXJfaWR9KS50aGVuKGZ1bmN0aW9uKHJvb21zKXtcclxuICAgICAgICAgICAgICAgIHZhciBhcCA9IHt9O1xyXG4gICAgICAgICAgICAgICAgYXAubmFtZSA9IFwiQXBhcnRtZW50XCI7XHJcbiAgICAgICAgICAgICAgICBhcC5lYWNoQ29uZmlnID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIGdyb3VwOiB7IG5hbWU6ICdvYmpzJyxwdWxsOiBmYWxzZSxwdXQ6IHRydWV9LFxyXG4gICAgICAgICAgICAgICAgICAgIG9uQWRkOiBmdW5jdGlvbiAoZXZ0KXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG9iamVjdCA9IGV2dC5tb2RlbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0LnJvb21faWQgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QuZmxvb3JfaWQgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QuaG91c2VfaWQgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QudXNlcl9pZCA9IHVzZXJfaWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIE9iamVjdEZhY3RvcnkuY3JlYXRlKG9iamVjdCkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QuaWQgPSByZXNwb25zZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBrZXkgPSBfLmZpbmRMYXN0SW5kZXgoYXAub2JqZWN0cywge2lkOm9iamVjdC5pZH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXAub2JqZWN0cy5zcGxpY2Uoa2V5LDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0RmFjdG9yeS5zZWFyY2goe3VzZXJfaWQ6dXNlcl9pZCxyb29tX2lkOjAsZmxvb3JfaWQ6MCxob3VzZV9pZDowfSkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgYXAub2JqZWN0cyA9IHJlc3BvbnNlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB2YXIgaXRlbXMgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICBfLmVhY2gocm9vbXMsIGZ1bmN0aW9uKHJvb20pe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByb29tLmVhY2hDb25maWcgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBncm91cDogeyBuYW1lOiAnb2JqcycsIHB1bGw6IGZhbHNlLCBwdXQ6IHRydWV9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25BZGQ6IGZ1bmN0aW9uIChldnQpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvYmplY3QgPSBldnQubW9kZWw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0LnVzZXJfaWQgPSB1c2VyX2lkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC5yb29tX2lkID0gcm9vbS5pZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QuZmxvb3JfaWQgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC5ob3VzZV9pZCA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgT2JqZWN0RmFjdG9yeS5jcmVhdGUob2JqZWN0KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0LmlkID0gcmVzcG9uc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGtleSA9IF8uZmluZExhc3RJbmRleChyb29tLm9iamVjdHMsIHtpZDpvYmplY3QuaWR9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm9vbS5vYmplY3RzLnNwbGljZShrZXksMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgT2JqZWN0RmFjdG9yeS5zZWFyY2goe3VzZXJfaWQ6dXNlcl9pZCxyb29tX2lkOnJvb20uaWQsZmxvb3JfaWQ6MCxob3VzZV9pZDowfSkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb29tLm9iamVjdHMgPSByZXNwb25zZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSkgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtcy5wdXNoKHJvb20pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgYXAucm9vbXMgPSBpdGVtcztcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXA7XHJcbiAgICAgICAgICAgICAgICB9KSAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfSxmdW5jdGlvbihyZXNwb25zZSl7XHJcbiAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2UuY3JlYXRlKHJlc3BvbnNlLCAnZGFuZ2VyJyk7XHJcbiAgICAgICAgICAgIH0pOyAgICAgICAgICAgIFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZ2V0SG91c2VUcmVlIDogZnVuY3Rpb24odXNlcl9pZCl7XHJcbiAgICAgICAgICAgIHJldHVybiBGbG9vckZhY3Rvcnkuc2VhcmNoKHt1c2VyX2lkOnVzZXJfaWR9KS50aGVuKGZ1bmN0aW9uKGZsb29ycyl7ICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgdmFyIGhvdXNlID0ge307XHJcbiAgICAgICAgICAgICAgICBob3VzZS5uYW1lID0gXCJIb3VzZVwiO1xyXG4gICAgICAgICAgICAgICAgaG91c2UuZWFjaENvbmZpZyA9IHtcclxuICAgICAgICAgICAgICAgICAgICBncm91cDogeyBuYW1lOiAnb2JqcycscHVsbDogZmFsc2UscHV0OiB0cnVlfSxcclxuICAgICAgICAgICAgICAgICAgICBvbkFkZDogZnVuY3Rpb24gKGV2dCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvYmplY3QgPSBldnQubW9kZWw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC51c2VyX2lkID0gdXNlcl9pZDsgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0LnJvb21faWQgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QuZmxvb3JfaWQgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QuaG91c2VfaWQgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBPYmplY3RGYWN0b3J5LmNyZWF0ZShvYmplY3QpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0LmlkID0gcmVzcG9uc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIga2V5ID0gXy5maW5kTGFzdEluZGV4KGhvdXNlLm9iamVjdHMsIHtpZDpvYmplY3QuaWR9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhvdXNlLm9iamVjdHMuc3BsaWNlKGtleSwxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgT2JqZWN0RmFjdG9yeS5zZWFyY2goe3VzZXJfaWQ6dXNlcl9pZCxyb29tX2lkOjAsZmxvb3JfaWQ6MCxob3VzZV9pZDowfSkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7ICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBob3VzZS5vYmplY3RzID0gcmVzcG9uc2U7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgdmFyIGl0ZW1zID0gZmxvb3JzO1xyXG4gICAgICAgICAgICAgICAgXy5lYWNoKGl0ZW1zLCBmdW5jdGlvbihmbG9vcil7XHJcbiAgICAgICAgICAgICAgICAgICAgZmxvb3IuZWFjaENvbmZpZyA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXA6IHsgbmFtZTogJ29ianMnLHB1bGw6IGZhbHNlLHB1dDogdHJ1ZX0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQWRkOiBmdW5jdGlvbiAoZXZ0KXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvYmplY3QgPSBldnQubW9kZWw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QudXNlcl9pZCA9IHVzZXJfaWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3Qucm9vbV9pZCA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QuZmxvb3JfaWQgPSBmbG9vci5pZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC5ob3VzZV9pZCA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBPYmplY3RGYWN0b3J5LmNyZWF0ZShvYmplY3QpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC5pZCA9IHJlc3BvbnNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIga2V5ID0gXy5maW5kTGFzdEluZGV4KGZsb29yLm9iamVjdHMsIHtpZDpvYmplY3QuaWR9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmbG9vci5vYmplY3RzLnNwbGljZShrZXksMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICBPYmplY3RGYWN0b3J5LnNlYXJjaCh7dXNlcl9pZDp1c2VyX2lkLHJvb21faWQ6MCxmbG9vcl9pZDpmbG9vci5pZCxob3VzZV9pZDowfSkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7ICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZsb29yLm9iamVjdHMgPSByZXNwb25zZTtcclxuICAgICAgICAgICAgICAgICAgICB9KSAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBmbG9vci5yb29tcyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgIFJvb21GYWN0b3J5LnNlYXJjaCh7dXNlcl9pZDp1c2VyX2lkLGZsb29yX2lkOmZsb29yLmlkfSkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8uZWFjaChyZXNwb25zZSwgZnVuY3Rpb24ocm9vbSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb29tLmVhY2hDb25maWcgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXA6IHsgbmFtZTogJ29ianMnLHB1bGw6IGZhbHNlLHB1dDogdHJ1ZX0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25BZGQ6IGZ1bmN0aW9uIChldnQpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgb2JqZWN0ID0gZXZ0Lm1vZGVsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QuaG91c2VfaWQgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QuZmxvb3JfaWQgPSBmbG9vci5pZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0LnJvb21faWQgPSByb29tLmlkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QudXNlcl9pZCA9IHVzZXJfaWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE9iamVjdEZhY3RvcnkuY3JlYXRlKG9iamVjdCkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QuaWQgPSByZXNwb25zZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBrZXkgPSBfLmZpbmRMYXN0SW5kZXgocm9vbS5vYmplY3RzLCB7aWQ6b2JqZWN0LmlkfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByb29tLm9iamVjdHMuc3BsaWNlKGtleSwxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgT2JqZWN0RmFjdG9yeS5zZWFyY2goe3VzZXJfaWQ6dXNlcl9pZCxyb29tX2lkOnJvb20uaWQsZmxvb3JfaWQ6Zmxvb3IuaWQsaG91c2VfaWQ6MH0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvb20ub2JqZWN0cyA9IHJlc3BvbnNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZsb29yLnJvb21zLnB1c2gocm9vbSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24ocmVzcG9uc2Upe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2UuY3JlYXRlKHJlc3BvbnNlLCAnZGFuZ2VyJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICBob3VzZS5mbG9vcnMgPSBpdGVtcztcclxuICAgICAgICAgICAgICAgIHJldHVybiBob3VzZTtcclxuICAgICAgICAgICAgfSxmdW5jdGlvbihyZXNwb25zZSl7XHJcbiAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2UuY3JlYXRlKHJlc3BvbnNlLCAnZGFuZ2VyJyk7XHJcbiAgICAgICAgICAgIH0pICAgICAgICAgICAgIFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZ2V0Q29tcGxleFRyZWUgOiBmdW5jdGlvbih1c2VyX2lkKXtcclxuICAgICAgICAgICAgcmV0dXJuIEhvdXNlRmFjdG9yeS5zZWFyY2goe3VzZXJfaWQ6dXNlcl9pZH0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpeyAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgdmFyIGNvbXBsZXggPSB7fTtcclxuICAgICAgICAgICAgICAgIGNvbXBsZXgubmFtZSA9IFwiQ29tcGxleFwiO1xyXG4gICAgICAgICAgICAgICAgY29tcGxleC5lYWNoQ29uZmlnID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIGdyb3VwOiB7IG5hbWU6ICdvYmpzJyxwdWxsOiBmYWxzZSxwdXQ6IHRydWV9LFxyXG4gICAgICAgICAgICAgICAgICAgIG9uQWRkOiBmdW5jdGlvbiAoZXZ0KXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG9iamVjdCA9IGV2dC5tb2RlbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0LnJvb21faWQgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QuZmxvb3JfaWQgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QuaG91c2VfaWQgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QudXNlcl9pZCA9IHVzZXJfaWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIE9iamVjdEZhY3RvcnkuY3JlYXRlKG9iamVjdCkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QuaWQgPSByZXNwb25zZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBrZXkgPSBfLmZpbmRMYXN0SW5kZXgoY29tcGxleC5vYmplY3RzLCB7aWQ6b2JqZWN0LmlkfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wbGV4Lm9iamVjdHMuc3BsaWNlKGtleSwxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgT2JqZWN0RmFjdG9yeS5zZWFyY2goe3VzZXJfaWQ6dXNlcl9pZCxyb29tX2lkOjAsZmxvb3JfaWQ6MCxob3VzZV9pZDowfSkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tcGxleC5vYmplY3RzID0gcmVzcG9uc2U7XHJcbiAgICAgICAgICAgICAgICB9KSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgaXRlbXMgPSByZXNwb25zZTtcclxuICAgICAgICAgICAgICAgIF8uZWFjaChpdGVtcywgZnVuY3Rpb24oaG91c2Upe1xyXG4gICAgICAgICAgICAgICAgICAgIGhvdXNlLmVhY2hDb25maWcgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwOiB7IG5hbWU6ICdvYmpzJyxwdWxsOiBmYWxzZSxwdXQ6IHRydWV9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvbkFkZDogZnVuY3Rpb24gKGV2dCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgb2JqZWN0ID0gZXZ0Lm1vZGVsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0LmhvdXNlX2lkID0gaG91c2UuaWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QuZmxvb3JfaWQgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0LnJvb21faWQgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0LnVzZXJfaWQgPSB1c2VyX2lkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgT2JqZWN0RmFjdG9yeS5jcmVhdGUob2JqZWN0KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QuaWQgPSByZXNwb25zZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGtleSA9IF8uZmluZExhc3RJbmRleChob3VzZS5vYmplY3RzLCB7aWQ6b2JqZWN0LmlkfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaG91c2Uub2JqZWN0cy5zcGxpY2Uoa2V5LDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgT2JqZWN0RmFjdG9yeS5zZWFyY2goe3VzZXJfaWQ6dXNlcl9pZCxyb29tX2lkOjAsZmxvb3JfaWQ6MCxob3VzZV9pZDpob3VzZS5pZH0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBob3VzZS5vYmplY3RzID0gcmVzcG9uc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICBGbG9vckZhY3Rvcnkuc2VhcmNoKHt1c2VyX2lkOnVzZXJfaWQsIGhvdXNlX2lkOmhvdXNlLmlkfSkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhvdXNlLmZsb29ycyA9IHJlc3BvbnNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfLmVhY2goaG91c2UuZmxvb3JzLCBmdW5jdGlvbihmbG9vcil7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmbG9vci5lYWNoQ29uZmlnID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwOiB7IG5hbWU6ICdvYmpzJyxwdWxsOiBmYWxzZSxwdXQ6IHRydWV9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQWRkOiBmdW5jdGlvbiAoZXZ0KXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG9iamVjdCA9IGV2dC5tb2RlbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0LmhvdXNlX2lkID0gaG91c2UuaWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC5mbG9vcl9pZCA9IGZsb29yLmlkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3Qucm9vbV9pZCA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC51c2VyX2lkID0gdXNlcl9pZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgT2JqZWN0RmFjdG9yeS5jcmVhdGUob2JqZWN0KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC5pZCA9IHJlc3BvbnNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGtleSA9IF8uZmluZExhc3RJbmRleChmbG9vci5vYmplY3RzLCB7aWQ6b2JqZWN0LmlkfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmbG9vci5vYmplY3RzLnNwbGljZShrZXksMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIE9iamVjdEZhY3Rvcnkuc2VhcmNoKHt1c2VyX2lkOnVzZXJfaWQscm9vbV9pZDowLGZsb29yX2lkOmZsb29yLmlkLGhvdXNlX2lkOmhvdXNlLmlkfSkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmxvb3Iub2JqZWN0cyA9IHJlc3BvbnNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmxvb3Iucm9vbXMgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJvb21GYWN0b3J5LnNlYXJjaCh7dXNlcl9pZDp1c2VyX2lkLCBmbG9vcl9pZDpmbG9vci5pZH0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8uZWFjaChyZXNwb25zZSwgZnVuY3Rpb24ocm9vbSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvb20uZWFjaENvbmZpZyA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwOiB7IG5hbWU6ICdvYmpzJyxwdWxsOiBmYWxzZSxwdXQ6IHRydWV9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25BZGQ6IGZ1bmN0aW9uIChldnQpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvYmplY3QgPSBldnQubW9kZWw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0LmhvdXNlX2lkID0gaG91c2UuaWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0LmZsb29yX2lkID0gZmxvb3IuaWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0LnJvb21faWQgPSByb29tLmlkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC51c2VyX2lkID0gdXNlcl9pZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBPYmplY3RGYWN0b3J5LmNyZWF0ZShvYmplY3QpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QuaWQgPSByZXNwb25zZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIga2V5ID0gXy5maW5kTGFzdEluZGV4KHJvb20ub2JqZWN0cywge2lkOm9iamVjdC5pZH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByb29tLm9iamVjdHMuc3BsaWNlKGtleSwxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBPYmplY3RGYWN0b3J5LnNlYXJjaCh7dXNlcl9pZDp1c2VyX2lkLHJvb21faWQ6cm9vbS5pZCxmbG9vcl9pZDpmbG9vci5pZCxob3VzZV9pZDpob3VzZS5pZH0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm9vbS5vYmplY3RzID0gcmVzcG9uc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmbG9vci5yb29tcy5wdXNoKHJvb20pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbihyZXNwb25zZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLmNyZWF0ZShyZXNwb25zZS5kYXRhLCAnZGFuZ2VyJyk7ICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgfSxmdW5jdGlvbihyZXNwb25zZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5jcmVhdGUocmVzcG9uc2UsICdkYW5nZXInKTtcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIGNvbXBsZXguaG91c2VzID0gaXRlbXM7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY29tcGxleDtcclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24ocmVzcG9uc2Upe1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLmNyZWF0ZShyZXNwb25zZS5kYXRhLCAnZGFuZ2VyJyk7XHJcbiAgICAgICAgICAgIH0pICAgICAgICAgICAgICBcclxuICAgICAgICB9LFxyXG4gICAgICAgIGdldFRlbXBsYXRlIDogZnVuY3Rpb24odGVtcGxhdGVpZCl7XHJcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJy9hcGkvdGVtcGxhdGVzLycrdGVtcGxhdGVpZCkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcclxuICAgICAgICAgICAgfSxmdW5jdGlvbihyZXNwb25zZSl7ICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2UuY3JlYXRlKHJlc3BvbnNlLmRhdGEsICdkYW5nZXInKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9LCAgICAgICAgXHJcbiAgICAgICAgZ2V0VGVtcGxhdGVzIDogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnL2FwaS90ZW1wbGF0ZXMnKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbihyZXNwb25zZSl7XHJcbiAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2UuY3JlYXRlKHJlc3BvbnNlLmRhdGEsICdkYW5nZXInKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAgICAgXHJcbn1dIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBbXCIkaHR0cFwiLFwiJHFcIiwgXCJUb2FzdFNlcnZpY2VcIiwgXCJDb29raWVzU2VydmljZVwiLCBmdW5jdGlvbigkaHR0cCwgJHEsIFRvYXN0U2VydmljZSwgQ29va2llc1NlcnZpY2UpIHtcclxuICBcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgZ2V0QnlUb2tlbiA6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XHJcbiAgICAgICAgICAgICRodHRwLmdldCgnL29iamVjdHMvZ2V0QnlUb2tlbi8nK0Nvb2tpZXNTZXJ2aWNlLmdldCgndG9rZW4nKSkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XHJcbiAgICAgICAgICAgICAgICBpZihyZXNwb25zZS5kYXRhLnN0YXR1cyl7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShyZXNwb25zZS5kYXRhLm9iamVjdHMpO1xyXG4gICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KG51bGwpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KG51bGwpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7ICAgICAgICAgICAgXHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZWFyY2g6ZnVuY3Rpb24ob2JqZWN0KXsgICAgICAgICAgICBcclxuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcclxuICAgICAgICAgICAgJGh0dHAucG9zdCgnL29iamVjdHMvc2VhcmNoJywgb2JqZWN0KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXsgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHJlc3BvbnNlLmRhdGEpO1xyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QobnVsbCk7IFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNyZWF0ZTpmdW5jdGlvbihvYmplY3Qpe1xyXG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xyXG4gICAgICAgICAgICAkaHR0cC5wb3N0KCcvb2JqZWN0cy9jcmVhdGUnLCB7b2JqZWN0Om9iamVjdH0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xyXG4gICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShyZXNwb25zZS5kYXRhKTtcclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24oKXsgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdChudWxsKTsgICBcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBjcmVhdGVBbGwgOiBmdW5jdGlvbihvYmplY3RzLCB1c2VyX2lkLCByb29tX2lkKXtcclxuICAgICAgICAgICAgdmFyIHByb21pc2VzID0gb2JqZWN0cy5tYXAoIGZ1bmN0aW9uKG9iamVjdCl7XHJcbiAgICAgICAgICAgICAgICB2YXIgZGVmZXJyZWQgID0gJHEuZGVmZXIoKTsgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB2YXIgbmV3T2JqZWN0ID0ge307ICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIG5ld09iamVjdC5Nb2R1bGVJdGVtID0gb2JqZWN0Lk1vZHVsZUl0ZW07XHJcbiAgICAgICAgICAgICAgICBuZXdPYmplY3QuTW9kdWxlVHlwZSA9IG9iamVjdC5Nb2R1bGVUeXBlO1xyXG4gICAgICAgICAgICAgICAgbmV3T2JqZWN0Lkl0ZW1EZXNjcmlwdGlvbiA9IG9iamVjdC5JdGVtRGVzY3JpcHRpb247XHJcbiAgICAgICAgICAgICAgICBuZXdPYmplY3QuZmF2b3JpdGUgPSBvYmplY3QuZmF2b3JpdGU7XHJcbiAgICAgICAgICAgICAgICBuZXdPYmplY3QuY2F0ZWdvcnkgPSBvYmplY3QuY2F0ZWdvcnk7XHJcbiAgICAgICAgICAgICAgICBuZXdPYmplY3QudGVtcGxhdGVfaWQgPSBvYmplY3QudGVtcGxhdGVfaWQ7XHJcbiAgICAgICAgICAgICAgICBuZXdPYmplY3QuaWNvbl9pZCA9IG9iamVjdC5pY29uX2lkO1xyXG4gICAgICAgICAgICAgICAgbmV3T2JqZWN0LmRldGVjdG9yX291dHB1dCA9IG9iamVjdC5kZXRlY3Rvcl9vdXRwdXQ7XHJcbiAgICAgICAgICAgICAgICBuZXdPYmplY3Quc2h1dHRlcl9pbnB1dCA9IG9iamVjdC5zaHV0dGVyX2lucHV0O1xyXG4gICAgICAgICAgICAgICAgbmV3T2JqZWN0LnNodXR0ZXJfc2Vjb25kcyA9IG9iamVjdC5zaHV0dGVyX3NlY29uZHM7XHJcbiAgICAgICAgICAgICAgICBuZXdPYmplY3QuZGltbWluZ19pbnB1dCA9IG9iamVjdC5kaW1taW5nX2lucHV0O1xyXG4gICAgICAgICAgICAgICAgbmV3T2JqZWN0LmRpbW1pbmdfcmF0aW8gPSBvYmplY3QuZGltbWluZ19yYXRpbztcclxuICAgICAgICAgICAgICAgIG5ld09iamVjdC5uYW1lID0gb2JqZWN0Lm5hbWU7XHJcbiAgICAgICAgICAgICAgICBuZXdPYmplY3Qucm9vbV9pZCA9IHJvb21faWQ/cm9vbV9pZDoob2JqZWN0LnJvb21faWQ/b2JqZWN0LnJvb21faWQ6MCk7XHJcbiAgICAgICAgICAgICAgICBuZXdPYmplY3QuZmxvb3JfaWQgPSBvYmplY3QuZmxvb3JfaWQ/b2JqZWN0LmZsb29yX2lkOjA7XHJcbiAgICAgICAgICAgICAgICBuZXdPYmplY3QuaG91c2VfaWQgPSBvYmplY3QuaG91c2VfaWQ/b2JqZWN0LmhvdXNlX2lkOjA7XHJcbiAgICAgICAgICAgICAgICBuZXdPYmplY3QudXNlcl9pZCA9IHVzZXJfaWQ7XHJcbiAgICAgICAgICAgICAgICAkaHR0cC5wb3N0KCcvb2JqZWN0cy9jcmVhdGUnLCB7b2JqZWN0Om5ld09iamVjdH0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xyXG4gICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUobnVsbCk7XHJcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbigpeyAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUobnVsbCk7XHJcbiAgICAgICAgICAgICAgICB9KSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICByZXR1cm4gJHEuYWxsKHByb21pc2VzKSBcclxuICAgICAgICB9LCAgICAgICAgXHJcbiAgICAgICAgdXBkYXRlOmZ1bmN0aW9uKG9iamVjdCl7XHJcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XHJcbiAgICAgICAgICAgICRodHRwLnB1dCgnL29iamVjdHMvdXBkYXRlLycrb2JqZWN0LmlkLCB7b2JqZWN0Om9iamVjdH0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xyXG4gICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShyZXNwb25zZS5kYXRhKTtcclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24oKXsgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdChudWxsKTsgICBcclxuICAgICAgICAgICAgfSkgICAgICAgICAgICBcclxuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBkZWxldGUgOiBmdW5jdGlvbihpZCl7XHJcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XHJcbiAgICAgICAgICAgICRodHRwLmRlbGV0ZSgnL29iamVjdHMvZGVsZXRlLycraWQpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xyXG4gICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShudWxsKTtcclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24oZXJyKXtcclxuICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5jcmVhdGUoZXJyLmRhdGEsICdkYW5nZXInKTtcclxuICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdChudWxsKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7ICAgICAgICAgICAgXHJcbiAgICAgICAgfSxcclxuICAgICAgICBkZWxldGVBbGwgOiBmdW5jdGlvbihvYmplY3RzKXtcclxuICAgICAgICAgICAgdmFyIHByb21pc2VzID0gb2JqZWN0cy5tYXAoIGZ1bmN0aW9uKG9iamVjdCl7XHJcbiAgICAgICAgICAgICAgICB2YXIgZGVmZXJyZWQgID0gJHEuZGVmZXIoKTtcclxuICAgICAgICAgICAgICAgICRodHRwLmRlbGV0ZSgnL29iamVjdHMvZGVsZXRlLycrb2JqZWN0LmlkKS50aGVuKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShudWxsKTtcclxuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycil7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KG51bGwpO1xyXG4gICAgICAgICAgICAgICAgfSkgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIHJldHVybiAkcS5hbGwocHJvbWlzZXMpICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgICAgIFxyXG59XSIsIid1c2Ugc3RyaWN0JztcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gW1wiJGh0dHBcIixcIiRxXCIsXCJPYmplY3RGYWN0b3J5XCIsXCJUb2FzdFNlcnZpY2VcIiwgZnVuY3Rpb24oJGh0dHAsJHEsT2JqZWN0RmFjdG9yeSxUb2FzdFNlcnZpY2UpIHtcclxuICBcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgc2VhcmNoIDogZnVuY3Rpb24ob2JqZWN0KXtcclxuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcclxuXHJcbiAgICAgICAgICAgICRodHRwLnBvc3QoJy9yb29tcy9zZWFyY2gnLCBvYmplY3QpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUocmVzcG9uc2UuZGF0YSk7XHJcbiAgICAgICAgICAgIH0sZnVuY3Rpb24oZXJyKSB7XHJcbiAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2UuY3JlYXRlKGVyci5kYXRhLCAnZGFuZ2VyJyk7XHJcbiAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QobnVsbCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTsgICAgICAgICAgICBcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNyZWF0ZSA6IGZ1bmN0aW9uKHJvb20pe1xyXG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xyXG4gICAgICAgICAgICAkaHR0cC5wb3N0KCcvcm9vbXMvY3JlYXRlJywgcm9vbSkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XHJcblxyXG4gICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShyZXNwb25zZS5kYXRhWzBdKTtcclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24oZXJyKXtcclxuXHJcbiAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2UuY3JlYXRlKGVyci5kYXRhLCAnZGFuZ2VyJyk7XHJcbiAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QobnVsbCk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlOyAgXHJcbiAgICAgICAgfSxcclxuICAgICAgICBjcmVhdGVBbGwgOiBmdW5jdGlvbihyb29tcywgdXNlcl9pZCl7XHJcbiAgICAgICAgICAgIHZhciBwcm9taXNlcyA9IHJvb21zLm1hcCggZnVuY3Rpb24ocm9vbSl7XHJcbiAgICAgICAgICAgICAgICB2YXIgZGVmZXJyZWQgID0gJHEuZGVmZXIoKTtcclxuICAgICAgICAgICAgICAgIHZhciBuZXdSb29tID0ge307IFxyXG4gICAgICAgICAgICAgICAgbmV3Um9vbS51c2VyX2lkID0gdXNlcl9pZDtcclxuICAgICAgICAgICAgICAgIG5ld1Jvb20ubmFtZSA9IHJvb20ubmFtZTtcclxuICAgICAgICAgICAgICAgIG5ld1Jvb20uZmxvb3JfaWQgPSByb29tLmZsb29yX2lkO1xyXG4gICAgICAgICAgICAgICAgbmV3Um9vbS5vcmRlciA9IHJvb20ub3JkZXI7XHJcbiAgICAgICAgICAgICAgICBuZXdSb29tLmljb25faWQgPSByb29tLmljb25faWQ7XHJcbiAgICAgICAgICAgICAgICAkaHR0cC5wb3N0KCcvcm9vbXMvY3JlYXRlJywgbmV3Um9vbSkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJvb21faWQgPSBwYXJzZUludChyZXNwb25zZS5kYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICBPYmplY3RGYWN0b3J5LmNyZWF0ZUFsbChyb29tLm9iamVjdHMsIHVzZXJfaWQsIHJvb21faWQpLnRoZW4oZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShyZXNwb25zZS5kYXRhWzBdKTtcclxuICAgICAgICAgICAgICAgICAgICB9KSAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbihlcnIpe1xyXG4gICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUobnVsbCk7XHJcbiAgICAgICAgICAgICAgICB9KSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICByZXR1cm4gJHEuYWxsKHByb21pc2VzKSBcclxuICAgICAgICB9LFxyXG4gICAgICAgIHVwZGF0ZTpmdW5jdGlvbihyb29tKXtcclxuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcclxuICAgICAgICAgICAgJGh0dHAucHV0KCcvcm9vbXMvdXBkYXRlLycrcm9vbS5pZCwge3Jvb206cm9vbX0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xyXG4gICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShyZXNwb25zZS5kYXRhKTtcclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24oKXsgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdChudWxsKTsgICBcclxuICAgICAgICAgICAgfSkgICAgICAgICAgICBcclxuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBkZWxldGUgOiBmdW5jdGlvbihvYmplY3Qpe1xyXG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xyXG4gICAgICAgICAgICAkaHR0cC5wb3N0KCcvcm9vbXMvZGVsZXRlJywgb2JqZWN0KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcclxuICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUobnVsbCk7XHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycil7XHJcbiAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2UuY3JlYXRlKGVyci5kYXRhLCAnZGFuZ2VyJyk7XHJcbiAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QobnVsbCk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlOyAgICAgICAgICAgIFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGVsZXRlQWxsIDogZnVuY3Rpb24ocm9vbXMpe1xyXG4gICAgICAgICAgICB2YXIgcHJvbWlzZXMgPSByb29tcy5tYXAoIGZ1bmN0aW9uKHJvb20pe1xyXG4gICAgICAgICAgICAgICAgdmFyIGRlZmVycmVkICA9ICRxLmRlZmVyKCk7XHJcbiAgICAgICAgICAgICAgICByb29tLnJvb21faWQgPSByb29tLmlkO1xyXG4gICAgICAgICAgICAgICAgJGh0dHAucG9zdCgnL3Jvb21zL2RlbGV0ZScsIHJvb20pLnRoZW4oZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKG51bGwpO1xyXG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oZXJyKXtcclxuICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QobnVsbCk7XHJcbiAgICAgICAgICAgICAgICB9KSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgcmV0dXJuICRxLmFsbChwcm9taXNlcykgICAgICAgICAgICBcclxuICAgICAgICB9ICAgICAgICBcclxuICAgIH1cclxuICAgICAgICBcclxufV0iLCIndXNlIHN0cmljdCc7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFtcIiRodHRwXCIsXCIkcVwiLCBcIlRvYXN0U2VydmljZVwiLCBmdW5jdGlvbigkaHR0cCwgJHEsIFRvYXN0U2VydmljZSkge1xyXG4gIFxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBsb2dpbiA6IGZ1bmN0aW9uKHVzZXIpe1xyXG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xyXG4gICAgICAgICAgICAkaHR0cC5nZXQoJy91c2Vycy9sb2dpbi8nK3VzZXIubmFtZSsnLycrdXNlci5wYXNzd29yZCkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShyZXNwb25zZS5kYXRhKTtcclxuICAgICAgICAgICAgfSxmdW5jdGlvbihlcnIpIHtcclxuICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5jcmVhdGUoZXJyLmRhdGEsICdkYW5nZXInKTtcclxuICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdChudWxsKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgYWxsIDogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcclxuICAgICAgICAgICAgJGh0dHAuZ2V0KCcvdXNlcnMvYWxsJykudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XHJcbiAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHJlc3BvbnNlLmRhdGEpO1xyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbihlcnIpe1xyXG4gICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KG51bGwpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGZpbmQgOiBmdW5jdGlvbihpZCl7XHJcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XHJcbiAgICAgICAgICAgICRodHRwLmdldCgnL3VzZXJzL2ZpbmQvJytpZCkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShyZXNwb25zZS5kYXRhKTtcclxuICAgICAgICAgICAgfSxmdW5jdGlvbihlcnIpIHtcclxuICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdChudWxsKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbG9nb3V0OiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xyXG4gICAgICAgICAgICAkaHR0cC5nZXQoJy91c2Vycy9sb2dvdXQnKS50aGVuKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShudWxsKTtcclxuICAgICAgICAgICAgfSxmdW5jdGlvbihlcnIpIHtcclxuICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdChudWxsKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGVsZXRlIDogZnVuY3Rpb24oaWQpe1xyXG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xyXG4gICAgICAgICAgICAkaHR0cC5kZWxldGUoJy91c2Vycy9kZWxldGUvJytpZCkudGhlbihmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUobnVsbCk7XHJcbiAgICAgICAgICAgIH0sZnVuY3Rpb24oZXJyKSB7XHJcbiAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2UuY3JlYXRlKGVyci5kYXRhLCAnZGFuZ2VyJyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTsgICAgICAgICAgICBcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNyZWF0ZSA6IGZ1bmN0aW9uKHVzZXIpe1xyXG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xyXG4gICAgICAgICAgICAkaHR0cC5wb3N0KCcvdXNlcnMvY3JlYXRlJywge3VzZXI6dXNlcn0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUocmVzcG9uc2UuZGF0YVswXSk7XHJcbiAgICAgICAgICAgIH0sZnVuY3Rpb24oZXJyKSB7XHJcbiAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2UuY3JlYXRlKGVyci5kYXRhLCAnZGFuZ2VyJyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTsgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICB9ICAgIFxyXG4gICAgfVxyXG4gICAgICAgIFxyXG59XSIsIid1c2Ugc3RyaWN0JztcclxudmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdhcmVuYScpO1xyXG5cclxuXHJcblxyXG5cclxuYXBwLmZhY3RvcnkoJ1VzZXJGYWN0b3J5JywgcmVxdWlyZSgnLi9Vc2VyRmFjdG9yeScpKTtcclxuYXBwLmZhY3RvcnkoJ09iamVjdEZhY3RvcnknLCByZXF1aXJlKCcuL09iamVjdEZhY3RvcnknKSk7XHJcbmFwcC5mYWN0b3J5KCdSb29tRmFjdG9yeScsIHJlcXVpcmUoJy4vUm9vbUZhY3RvcnknKSk7XHJcbmFwcC5mYWN0b3J5KCdGbG9vckZhY3RvcnknLCByZXF1aXJlKCcuL0Zsb29yRmFjdG9yeScpKTtcclxuYXBwLmZhY3RvcnkoJ0hvdXNlRmFjdG9yeScsIHJlcXVpcmUoJy4vSG91c2VGYWN0b3J5JykpO1xyXG5cclxuXHJcbmFwcC5mYWN0b3J5KCdJdGVtRmFjdG9yeScsIHJlcXVpcmUoJy4vSXRlbUZhY3RvcnknKSk7XHJcblxyXG5cclxuXHJcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdhcmVuYScsIFsnbmdSb3V0ZScsJ25nUmVzb3VyY2UnLCAnbmdDb29raWVzJywgJ25nU2FuaXRpemUnLCAnbmdBbmltYXRlJywgJ25nVG91Y2gnLCAnbmctc29ydGFibGUnLCAnbmdUb2FzdCcsICd1aS5ib290c3RyYXAnLCAnYW5ndWxhci1zdmctcm91bmQtcHJvZ3Jlc3MnLCAncnpNb2R1bGUnLCAnaG1Ub3VjaEV2ZW50cyddKTtcblxucmVxdWlyZSgnLi9jb250cm9sbGVycycpO1xucmVxdWlyZSgnLi9kaXJlY3RpdmVzJyk7XG5yZXF1aXJlKCcuL3NlcnZpY2VzJyk7XG5yZXF1aXJlKCcuL2ZhY3RvcmllcycpO1xuXG5hcHAuY29uZmlnKFsnJHJvdXRlUHJvdmlkZXInLCduZ1RvYXN0UHJvdmlkZXInLFxuICAgIGZ1bmN0aW9uKCRyb3V0ZVByb3ZpZGVyLCBuZ1RvYXN0KSB7XG4gICAgICAgICRyb3V0ZVByb3ZpZGVyLndoZW4oJy8nLCB7XG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvbG9naW4uaHRtbCdcbiAgICAgICAgICAgICxjb250cm9sbGVyOiAnbG9naW5DdHJsJ1xuICAgICAgICB9KVxuICAgICAgICAkcm91dGVQcm92aWRlci53aGVuKCcvc2Vzc2lvbnMnLCB7XG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3Mvc2Vzc2lvbnMuaHRtbCdcbiAgICAgICAgICAgICxjb250cm9sbGVyOiAnc2Vzc2lvbnNDdHJsJ1xuICAgICAgICB9KVxuICAgICAgICAkcm91dGVQcm92aWRlci53aGVuKCcvd2l6emFyZC91c2VycycsIHtcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy93aXp6YXJkL3VzZXJzLmh0bWwnXG4gICAgICAgICAgICAsY29udHJvbGxlcjogJ3VzZXJzQ3RybCdcbiAgICAgICAgICAgICxyZXNvbHZlIDoge1xuICAgICAgICAgICAgICAgIHVzZXJzIDogWydVc2VyRmFjdG9yeScsIGZ1bmN0aW9uKFVzZXJGYWN0b3J5KXtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFVzZXJGYWN0b3J5LmFsbCgpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbigpe1xuXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1dLFxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICAkcm91dGVQcm92aWRlci53aGVuKCcvd2l6emFyZC9yb29tcy10by1ob3VzZS86dXNlcmlkLzp0eXBlJywgeyBcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy93aXp6YXJkL3Jvb21zLXRvLWhvdXNlLmh0bWwnXG4gICAgICAgICAgICAsY29udHJvbGxlcjogJ3Jvb21zVG9Ib3VzZUN0cmwnXG4gICAgICAgICAgICAscmVzb2x2ZSA6IHsgICBcbiAgICAgICAgICAgICAgICB1c2VyIDogWyckcm91dGUnLCAnVXNlckZhY3RvcnknLCBmdW5jdGlvbigkcm91dGUsIFVzZXJGYWN0b3J5KXtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFVzZXJGYWN0b3J5LmZpbmQoJHJvdXRlLmN1cnJlbnQucGFyYW1zLnVzZXJpZCkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1dLFxuICAgICAgICAgICAgICAgIGl0ZW1zIDogWyckcm91dGUnLCBcIkl0ZW1GYWN0b3J5XCIsIGZ1bmN0aW9uKCRyb3V0ZSwgSXRlbUZhY3Rvcnkpe1xuICAgICAgICAgICAgICAgICAgICBzd2l0Y2goJHJvdXRlLmN1cnJlbnQucGFyYW1zLnR5cGUpe1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnYXAnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBJdGVtRmFjdG9yeS5nZXRBcFRyZWUoJHJvdXRlLmN1cnJlbnQucGFyYW1zLnVzZXJpZCkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTsgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnaG91c2UnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBJdGVtRmFjdG9yeS5nZXRIb3VzZVRyZWUoJHJvdXRlLmN1cnJlbnQucGFyYW1zLnVzZXJpZCkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnY29tcGxleCc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEl0ZW1GYWN0b3J5LmdldENvbXBsZXhUcmVlKCRyb3V0ZS5jdXJyZW50LnBhcmFtcy51c2VyaWQpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpeyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB9XSBcbiAgICAgICAgICAgIH0gICAgICAgICAgICBcbiAgICAgICAgfSkgICAgICAgIFxuICAgICAgIC8qICRyb3V0ZVByb3ZpZGVyLndoZW4oJy93aXp6YXJkL3RlbXBsYXRlcycsIHtcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy93aXp6YXJkL3RlbXBsYXRlcy5odG1sJ1xuICAgICAgICAgICAgLGNvbnRyb2xsZXI6ICd0ZW1wbGF0ZXNDdHJsJ1xuICAgICAgICAgICAgLHJlc29sdmUgOiB7XG4gICAgICAgICAgICAgICAgdGVtcGxhdGVzIDogWydJdGVtRmFjdG9yeScsIGZ1bmN0aW9uKEl0ZW1GYWN0b3J5KXtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEl0ZW1GYWN0b3J5LmdldFRlbXBsYXRlcygpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICAgICAgICAgICAgICB9KTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB9XSxcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgJHJvdXRlUHJvdmlkZXIud2hlbignL3dpenphcmQvb2JqZWN0cy10by10ZW1wbGF0ZS86dGVtcGFsdGVpZCcsIHtcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy93aXp6YXJkL29iamVjdHMtdG8tdGVtcGxhdGUuaHRtbCdcbiAgICAgICAgICAgICxjb250cm9sbGVyOiAnb2JqZWN0c1RvVGVtcGxhdGVDdHJsJ1xuICAgICAgICAgICAgLHJlc29sdmUgOiB7XG4gICAgICAgICAgICAgICAgdGVtcGxhdGUgOiBbJ0l0ZW1GYWN0b3J5JywnJHJvdXRlJywgZnVuY3Rpb24oSXRlbUZhY3RvcnksICRyb3V0ZSl7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBJdGVtRmFjdG9yeS5nZXRUZW1wbGF0ZSgkcm91dGUuY3VycmVudC5wYXJhbXMudGVtcGFsdGVpZCkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgICAgICAgICAgICAgIH0pOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIH1dLFxuICAgICAgICAgICAgfVxuICAgICAgICB9KSovXG4gICAgICAgICRyb3V0ZVByb3ZpZGVyLndoZW4oJy93aXp6YXJkL29iamVjdHMtdG8tcm9vbXMvOnVzZXJpZC86dHlwZScsIHtcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy93aXp6YXJkL29iamVjdHMtdG8tcm9vbXMuaHRtbCdcbiAgICAgICAgICAgICxjb250cm9sbGVyOiAnb2JqZWN0c1RvUm9vbXNDdHJsJ1xuICAgICAgICAgICAgLHJlc29sdmUgOiB7ICAgXG4gICAgICAgICAgICAgICAgdXNlciA6IFsnJHJvdXRlJywgJ1VzZXJGYWN0b3J5JywgZnVuY3Rpb24oJHJvdXRlLCBVc2VyRmFjdG9yeSl7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBVc2VyRmFjdG9yeS5maW5kKCRyb3V0ZS5jdXJyZW50LnBhcmFtcy51c2VyaWQpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XSxcbiAgICAgICAgICAgICAgICBvYmplY3RzIDogW1wiJGh0dHBcIixcIk9iamVjdEZhY3RvcnlcIiwgZnVuY3Rpb24oJGh0dHAsIE9iamVjdEZhY3Rvcnkpe1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0RmFjdG9yeS5nZXRCeVRva2VuKCkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgICAgICAgICAgICAgIH0pICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB9XSxcbiAgICAgICAgICAgICAgICBpdGVtcyA6IFsnJHJvdXRlJywnSXRlbUZhY3RvcnknLCBmdW5jdGlvbigkcm91dGUsIEl0ZW1GYWN0b3J5KXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaCgkcm91dGUuY3VycmVudC5wYXJhbXMudHlwZSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnYXAnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gSXRlbUZhY3RvcnkuZ2V0QXBUcmVlKCRyb3V0ZS5jdXJyZW50LnBhcmFtcy51c2VyaWQpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTsgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnaG91c2UnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gSXRlbUZhY3RvcnkuZ2V0SG91c2VUcmVlKCRyb3V0ZS5jdXJyZW50LnBhcmFtcy51c2VyaWQpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnY29tcGxleCc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBJdGVtRmFjdG9yeS5nZXRDb21wbGV4VHJlZSgkcm91dGUuY3VycmVudC5wYXJhbXMudXNlcmlkKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9ICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgfV0gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9ICAgICAgICAgICAgXG4gICAgICAgIH0pXG4gICAgICAgICRyb3V0ZVByb3ZpZGVyLndoZW4oJy93aXp6YXJkL29iamVjdHMtY29udHJvbGxzLzp1c2VyaWQvOnR5cGUnLCB7XG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3Mvd2l6emFyZC9vYmplY3RzLWNvbnRyb2xscy5odG1sJ1xuICAgICAgICAgICAgLGNvbnRyb2xsZXI6ICdvYmplY3RzQ29udHJvbGxzQ3RybCdcbiAgICAgICAgICAgICxyZXNvbHZlIDogeyAgIFxuICAgICAgICAgICAgICAgIHVzZXIgOiBbJyRyb3V0ZScsICdVc2VyRmFjdG9yeScsIGZ1bmN0aW9uKCRyb3V0ZSwgVXNlckZhY3Rvcnkpe1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gVXNlckZhY3RvcnkuZmluZCgkcm91dGUuY3VycmVudC5wYXJhbXMudXNlcmlkKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfV0sXG4gICAgICAgICAgICAgICAgaXRlbXMgOiBbJyRyb3V0ZScsIFwiSXRlbUZhY3RvcnlcIiwgZnVuY3Rpb24oJHJvdXRlLCBJdGVtRmFjdG9yeSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2goJHJvdXRlLmN1cnJlbnQucGFyYW1zLnR5cGUpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2FwJzogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gSXRlbUZhY3RvcnkuZ2V0QXBUcmVlKCRyb3V0ZS5jdXJyZW50LnBhcmFtcy51c2VyaWQpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTsgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdob3VzZSc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBJdGVtRmFjdG9yeS5nZXRIb3VzZVRyZWUoJHJvdXRlLmN1cnJlbnQucGFyYW1zLnVzZXJpZCkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pOyAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdjb21wbGV4JzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEl0ZW1GYWN0b3J5LmdldENvbXBsZXhUcmVlKCRyb3V0ZS5jdXJyZW50LnBhcmFtcy51c2VyaWQpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpeyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTsgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB9XSBcbiAgICAgICAgICAgIH0gICAgICAgICAgICAgXG4gICAgICAgIH0pXG5cblxuICAgICAgICAkcm91dGVQcm92aWRlci53aGVuKCcvd2l6emFyZC9vYmplY3RzJywge1xuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL3dpenphcmQvb2JqZWN0cy5odG1sJ1xuICAgICAgICAgICAgLGNvbnRyb2xsZXI6ICdvYmplY3RzQ3RybCdcbiAgICAgICAgfSlcbiAgICAgICAgJHJvdXRlUHJvdmlkZXIuXG4gICAgICAgICAgICBvdGhlcndpc2Uoe1xuICAgICAgICAgICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICAgICAgICAgICAgY29uZmlnOiBbJ2NvbmZpZ1NydicsJyRyb3V0ZScsJyRsb2NhdGlvbicsZnVuY3Rpb24gKGNvbmZpZ1NydiwgJHJvdXRlLCAkbG9jYXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZ1Nydi5nZXRDb25maWdBbmRHZW5lcmF0ZVJvdXRlcygkcm91dGVQcm92aWRlcikudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRyb3V0ZS5yZWxvYWQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiB3ZSBjYW5ub3QgbG9hZCBjb25maWcsIGdvIHRvIGxvZ2luIHBhZ2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy8nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTs7XG4gICAgICAgICAgICAgICAgICAgIH1dXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7ICAgICAgICAgICBcbiAgICAgICAgbmdUb2FzdC5jb25maWd1cmUoe1xuICAgICAgICAgICAgdmVydGljYWxQb3NpdGlvbjogJ3RvcCcsXG4gICAgICAgICAgICBob3Jpem9udGFsUG9zaXRpb246ICdjZW50ZXInLFxuICAgICAgICAgICAgYW5pbWF0aW9uOiAnZmFkZScsXG4gICAgICAgICAgICBtYXhOdW1iZXI6IDFcbiAgICAgICAgfSk7ICAgICAgXG5cbiAgICB9XG5dKTsgXG5cbmFwcC5ydW4oWyckcm9vdFNjb3BlJywgJyRsb2NhdGlvbicsICdBdXRoZW50aWZpY2F0aW9uU2VydmljZScsICdUcmFuc2xhdGVTZXJ2aWNlJywgJyRodHRwJywgJyR3aW5kb3cnLFxuICAgIGZ1bmN0aW9uKCRyb290U2NvcGUsICRsb2NhdGlvbiwgQXV0aGVudGlmaWNhdGlvblNlcnZpY2UsIFRyYW5zbGF0ZVNlcnZpY2UsICRodHRwLCAkd2luZG93KVxuICAgIHsgICAgICAgIFxuXG4gICAgICAgIFxuICAgICAgICB2YXIgcm91dGVzVGhhdE5vdFJlcXVpcmVBdXRoID0gWycvJ107XG4gICAgICAgICRyb290U2NvcGUuJG9uKCckcm91dGVDaGFuZ2VTdGFydCcsIGZ1bmN0aW9uKGV2ZW50LCBuZXh0LCBjdXJyZW50KXtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYoJGxvY2F0aW9uLiQkcGF0aCA9PSAnLycgJiYgQXV0aGVudGlmaWNhdGlvblNlcnZpY2UuaXNBZG1pbigpKXtcbiAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL3dpenphcmQvdXNlcnMnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYoJGxvY2F0aW9uLiQkcGF0aCA9PSAnLycgJiYgQXV0aGVudGlmaWNhdGlvblNlcnZpY2UuaXNMb2dnZWRJbigpKXtcbiAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL3N0YXJ0Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmKCFBdXRoZW50aWZpY2F0aW9uU2VydmljZS5pc0xvZ2dlZEluKCkpe1xuICAgICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSlcbiAgICB9XG5dKTtcblxuKGZ1bmN0aW9uIChhbmd1bGFyLCB3aW5kb3csICQpIHtcbiAgICB2YXIgcmVnVHlwZSA9IGZ1bmN0aW9uKG5hbWUsIGNvbnRyb2xsZXJGbil7XG4gICAgICAgIGFwcC5kaXJlY3RpdmUoJC5jYW1lbENhc2UoJ2JhdC1vYmplY3QtJytuYW1lKSwgW1wiJHdpbmRvd1wiLCBcIiRyb290U2NvcGVcIiwgXCJPYmplY3RJY29uU2VydmljZVwiLCBcbiAgICAgICAgICAgIGZ1bmN0aW9uKCR3aW5kb3csICRyb290U2NvcGUsIE9iamVjdEljb25TZXJ2aWNlKXtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgICAgICAgICBzY29wZToge1xuICAgICAgICAgICAgICAgICAgICBpdGVtOiAnPScsXG4gICAgICAgICAgICAgICAgICAgIHJvb206ICdAJyxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ0AnLFxuICAgICAgICAgICAgICAgICAgICBpdGVtczogJz0nLFxuICAgICAgICAgICAgICAgICAgICBzZXRmYXZvcml0ZTonPSdcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAnPGRpdiBuZy1pbmNsdWRlPVwidGVtcGxhdGVVcmxcIj48L2Rpdj4nLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IGNvbnRyb2xsZXJGbixcbiAgICAgICAgICAgICAgICBsaW5rOiBmdW5jdGlvbigkc2NvcGUpeyAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUudGVtcGxhdGVVcmwgPSAnLi9vYmplY3RzL3RlbXBsYXRlcy8nKyRzY29wZS5pdGVtLmNhdGVnb3J5KycvJytuYW1lKycuaHRtbCc7XG5cbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLk9iamVjdEljb25TZXJ2aWNlID0gT2JqZWN0SWNvblNlcnZpY2U7XG5cbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnJlbW92ZUZhdm9yaXRlID0gZnVuY3Rpb24ob2JqZWN0KXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBrZXkgPSBfLmZpbmRMYXN0SW5kZXgoJHNjb3BlLml0ZW1zLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCRoYXNoS2V5OiBvYmplY3QuJCRoYXNoS2V5XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5pdGVtcy5zcGxpY2Uoa2V5LDEpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnNldEZhdm9yaXRlID0gZnVuY3Rpb24odmFsdWUpe1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLml0ZW0uZmF2b3JpdGUgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5pdGVtLmxpdmUudXBkYXRlT2JqZWN0KCRzY29wZS5pdGVtKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblxuICAgICAgICAgICAgICAgICAgICAgICAgfSxmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5pdGVtLmZhdm9yaXRlID0gISRzY29wZS5pdGVtLmZhdm9yaXRlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5lZGl0b3JOYW1lRW5hYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZWRpdG9ySWNvbkVuYWJsZWQgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZW5hYmxlTmFtZUVkaXRvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmVkaXRhYmxlVGV4dCA9ICRzY29wZS5pdGVtLm5hbWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZWRpdG9yTmFtZUVuYWJsZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5lbmFibGVJY29uRWRpdG9yID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuaXRlbS5saXZlLiQkc2VydmljZS5zdG9wKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuaWNvbnNBcnJheSA9IE9iamVjdEljb25TZXJ2aWNlLmdldEljb25zKCRzY29wZS5pdGVtLmNhdGVnb3J5KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCRzY29wZS5pdGVtLmljb25faWQpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBrZXkgPSBfLmZpbmRMYXN0SW5kZXgoJHNjb3BlLmljb25zQXJyYXksIHtpZDogJHNjb3BlLml0ZW0uaWNvbl9pZH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5zZWxlY3RlZEljb24gPSAkc2NvcGUuaWNvbnNBcnJheVtrZXldOyAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmVkaXRvckljb25FbmFibGVkPXRydWU7XG4gICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmRpc2FibGVFZGl0b3IgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5lZGl0b3JOYW1lRW5hYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmVkaXRvckljb25FbmFibGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuaXRlbS5saXZlLiQkc2VydmljZS5zdGFydCgpO1xuICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5zYXZlSWNvbiA9IGZ1bmN0aW9uKGZvcm0pe1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYoZm9ybS4kdmFsaWQpeyAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuaXRlbS5pY29uX2lkID0gZm9ybS5zZWxlY3RlZEljb24uJG1vZGVsVmFsdWUuaWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLml0ZW0ubGl2ZS51cGRhdGVPYmplY3QoJHNjb3BlLml0ZW0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZGlzYWJsZUVkaXRvcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmRpc2FibGVFZGl0b3IoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5zYXZlTmFtZSA9IGZ1bmN0aW9uKGZvcm0pIHsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGZvcm0uJHZhbGlkKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuaXRlbS5uYW1lID0gZm9ybS5lZGl0YWJsZVRleHQuJG1vZGVsVmFsdWU7ICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuaXRlbS5saXZlLnVwZGF0ZU9iamVjdCgkc2NvcGUuaXRlbSkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5kaXNhYmxlRWRpdG9yKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICB9ICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1dKVxuXG4gICAgfTtcblxuICAgIGFwcC5kaXJlY3RpdmUoJ2JhdE9iamVjdCcsWyckY29tcGlsZScsJ09iamVjdFRlbXBsYXRlU2VydmljZScsZnVuY3Rpb24oJGNvbXBpbGUsIE9iamVjdFRlbXBsYXRlU2VydmljZSl7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgICAgICBpdGVtOiAnPScsXG4gICAgICAgICAgICAgICAgcm9vbTogJ0AnLFxuICAgICAgICAgICAgICAgIHR5cGU6ICdAJyxcbiAgICAgICAgICAgICAgICBpdGVtczogJz0nLFxuICAgICAgICAgICAgICAgIHNldGZhdm9yaXRlOic9J1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLGVsLGF0dHJzKXtcbiAgICAgICAgICAgICAgICBpZihzY29wZS5pdGVtLmNhdGVnb3J5ICYmIHNjb3BlLml0ZW0udGVtcGxhdGVfaWQpe1xuICAgICAgICAgICAgICAgICAgICB2YXIgdHlwZSA9IE9iamVjdFRlbXBsYXRlU2VydmljZS5nZXRUZW1wbGF0ZShzY29wZS5pdGVtLmNhdGVnb3J5LCBzY29wZS5pdGVtLnRlbXBsYXRlX2lkKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHR5cGU9dHlwZS5uYW1lP3R5cGUubmFtZTpudWxsOyAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICB2YXIgdGFnID0gJ2JhdC1vYmplY3QtJyt0eXBlO1xuICAgICAgICAgICAgICAgICAgICB2YXIgcm9vbSA9IHNjb3BlLnJvb207XG4gICAgICAgICAgICAgICAgICAgIHZhciBodG1sPSc8Jyt0YWcrJyBpdGVtPVwiaXRlbVwiIGl0ZW1zPVwiaXRlbXNcIiByb29tPVwie3tyb29tfX1cIiB0eXBlPVwie3t0eXBlfX1cIiBzZXRmYXZvcml0ZT1cInNldGZhdm9yaXRlXCI+PC8nK3RhZysnPic7XG4gICAgICAgICAgICAgICAgICAgIGVsLmh0bWwoaHRtbCk7XG4gICAgICAgICAgICAgICAgICAgICRjb21waWxlKGVsLmNvbnRlbnRzKCkpKHNjb3BlKTsgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XSk7XG5cblxuICAgIHJlZ1R5cGUoJ2xpZ2h0LXN3aXRjaC13aXRoLW9uZS1idXR0b24nLCBbJyRzY29wZScsIGZ1bmN0aW9uICgkc2NvcGUpIHtcbiAgICAgICAgJHNjb3BlLm9uQ2hhbmdlID0gZnVuY3Rpb24oKXsgICAgICAgICAgICBcbiAgICAgICAgICAgICRzY29wZS5pdGVtLmxpdmUuc2V0VmFsdWUocGFyc2VJbnQoJHNjb3BlLml0ZW0ubGl2ZS5Nb2R1bGVWYWx1ZSkpO1xuICAgICAgICB9ICAgICAgICBcbiAgICB9XSk7XG5cbiAgICByZWdUeXBlKCdsaWdodC1zd2l0Y2gtd2l0aC10d28tYnV0dG9ucycsIFsnJHNjb3BlJywgZnVuY3Rpb24gKCRzY29wZSkge1xuICAgICAgICAkc2NvcGUub25DaGFuZ2UgPSBmdW5jdGlvbih2YWx1ZSl7XG4gICAgICAgICAgICAkc2NvcGUuaXRlbS5saXZlLnNldFZhbHVlKHZhbHVlKTtcbiAgICAgICAgfVxuICAgIH1dKTtcblxuICAgIHJlZ1R5cGUoJ2xpZ2h0LWRpbW1pbmctdHdvLWJ1dHRvbnMnLCBbJyRzY29wZScsIGZ1bmN0aW9uICgkc2NvcGUpIHtcbiAgICAgICAgJHNjb3BlLm9uQ2hhbmdlID0gZnVuY3Rpb24oZGlyZWN0aW9uKXtcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IHBhcnNlSW50KCRzY29wZS5pdGVtLmxpdmUuTW9kdWxlVmFsdWUpO1xuICAgICAgICAgICAgaWYoZGlyZWN0aW9uID09ICd1cCcpe1xuICAgICAgICAgICAgICAgIHZhbHVlICs9ICRzY29wZS5pdGVtLnJhdGlvPyRzY29wZS5pdGVtLnJhdGlvOjEwO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgdmFsdWUgLT0gJHNjb3BlLml0ZW0ucmF0aW8/JHNjb3BlLml0ZW0ucmF0aW86MTA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YWx1ZSA9ICh2YWx1ZSA+IDEwMCkgPyAxMDAgOiAoKHZhbHVlIDwgMCkgPyAwIDogdmFsdWUpOyAgICAgICAgICAgIFxuICAgICAgICAgICAgJHNjb3BlLml0ZW0ubGl2ZS5zZXRWYWx1ZSh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9XSk7XG5cbiAgICByZWdUeXBlKCdsaWdodC1kaW1taW5nLXdpdGgtc2xpZGVyJywgWyckc2NvcGUnLCckdGltZW91dCcsJyRpbnRlcnZhbCcsIGZ1bmN0aW9uICgkc2NvcGUsICR0aW1lb3V0LCAkaW50ZXJ2YWwpIHtcbiAgICAgICAgJHNjb3BlLnNsaWRlciA9IHtcbiAgICAgICAgICAgIHZhbHVlOiAwLFxuICAgICAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgICAgIGZsb29yOiAwLFxuICAgICAgICAgICAgICAgIGNlaWw6IDEwMCxcbiAgICAgICAgICAgICAgICBvbkVuZDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuaXRlbS5saXZlLnNldFZhbHVlKCRzY29wZS5zbGlkZXIudmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgJHNjb3BlLiR3YXRjaChmdW5jdGlvbigpe3JldHVybiAkc2NvcGUuaXRlbS5saXZlLk1vZHVsZVZhbHVlO30sIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICAkc2NvcGUuc2xpZGVyLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH0pOyAgICAgICAgXG4gICAgfV0pO1xuXG4gICAgcmVnVHlwZSgnbGlnaHQtZGltbWluZy13aXRoLW9yLXdpdGhvdXQtbWVtb3J5JywgWyckc2NvcGUnLCdiYXRBcGlTcnYnLCBmdW5jdGlvbiAoJHNjb3BlLCBiYXRBcGlTcnYpIHtcblxuICAgICAgICAgICAgdmFyIGlucHV0T2JqZWN0ID0ge307XG4gICAgICAgICAgICB2YXIgaW5wdXQ7XG4gICAgICAgICAgICBpZigkc2NvcGUuaXRlbS5kaW1taW5nX2lucHV0KXtcbiAgICAgICAgICAgICAgICBpbnB1dCA9ICRzY29wZS5pdGVtLmRpbW1pbmdfaW5wdXQucmVwbGFjZSgvWzAtOV0vZywgJycpOyAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaW5wdXRPYmplY3QuSEFNb2R1bGVJZCA9ICRzY29wZS5pdGVtLkhBTW9kdWxlSWQ7XG4gICAgICAgICAgICBpbnB1dE9iamVjdC5Nb2R1bGVJdGVtID0gJHNjb3BlLml0ZW0uZGltbWluZ19pbnB1dDtcbiAgICAgICAgICAgIGlucHV0T2JqZWN0Lk1vZHVsZVR5cGUgPSBpbnB1dDtcbiAgICAgICAgICAgIGlucHV0T2JqZWN0Lk1vZHVsZVZhbHVlID0gXCIxXCI7ICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgcGFyYW1zID0ge307XG4gICAgICAgICAgICBwYXJhbXMuYnV0dG9uID0gJ0xlZnQnO1xuXG4gICAgICAgICRzY29wZS5vblByZXNzID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHBhcmFtcy5tb3VzZVN0YXRlID0gJ0Rvd24nO1xuICAgICAgICAgICAgYmF0QXBpU3J2LnNldEhlbHBNb2R1bGVWYWx1ZShpbnB1dE9iamVjdCwgcGFyYW1zKTtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJwcmVzc1wiKTtcbiAgICAgICAgfVxuICAgICAgICAkc2NvcGUub25QcmVzc1VwID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHBhcmFtcy5tb3VzZVN0YXRlID0gJ1VwJztcbiAgICAgICAgICAgIGJhdEFwaVNydi5zZXRIZWxwTW9kdWxlVmFsdWUoaW5wdXRPYmplY3QsIHBhcmFtcyk7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwicmVsZWFzZVwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgICRzY29wZS5vblRhcCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBwYXJhbXMubW91c2VTdGF0ZSA9ICdEb3duJztcbiAgICAgICAgICAgIGJhdEFwaVNydi5zZXRIZWxwTW9kdWxlVmFsdWUoaW5wdXRPYmplY3QsIHBhcmFtcykudGhlbihmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHBhcmFtcy5tb3VzZVN0YXRlID0gJ1VwJztcbiAgICAgICAgICAgICAgICBiYXRBcGlTcnYuc2V0SGVscE1vZHVsZVZhbHVlKGlucHV0T2JqZWN0LCBwYXJhbXMpO1xuICAgICAgICAgICAgfSk7IFxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcInRhcFwiKTtcbiAgICAgICAgfVxuICAgICAgICAkc2NvcGUuc2xpZGVyID0ge1xuICAgICAgICAgICAgdmFsdWU6IDAsXG4gICAgICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICAgICAgZmxvb3I6IDAsXG4gICAgICAgICAgICAgICAgY2VpbDogMTAwLFxuICAgICAgICAgICAgICAgIG9uRW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5pdGVtLmxpdmUuc2V0VmFsdWUoJHNjb3BlLnNsaWRlci52YWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICAkc2NvcGUuJHdhdGNoKGZ1bmN0aW9uKCl7cmV0dXJuICRzY29wZS5pdGVtLmxpdmUuTW9kdWxlVmFsdWU7fSwgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgICRzY29wZS5zbGlkZXIudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfSk7ICAgICAgICAgIFxuICAgIH1dKTtcblxuXG5cbiAgICByZWdUeXBlKCdzY2VuYXJpby1vbmUnLCBbJyRzY29wZScsJyR0aW1lb3V0JywgZnVuY3Rpb24gKCRzY29wZSwgJHRpbWVvdXQpIHtcbiAgICAgICAgJHNjb3BlLm9uQ2hhbmdlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHZhciBwYXJhbXMgPSB7fTtcbiAgICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICBwYXJhbXMuYnV0dG9uID0gJ0xlZnQnO1xuICAgICAgICAgICAgcGFyYW1zLm1vdXNlU3RhdGUgPSAnRG93bic7XG4gICAgICAgICAgICAkc2NvcGUuaXRlbS5saXZlLnNldFZhbHVlKDEsIHBhcmFtcykudGhlbihmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICBwYXJhbXMubW91c2VTdGF0ZSA9ICdVcCc7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5pdGVtLmxpdmUuc2V0VmFsdWUoMSwgcGFyYW1zKS50aGVuKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0sIDIwMDApXG4gICAgICAgICAgICB9KTsgICAgICAgICBcbiAgICAgICAgfVxuICAgIH1dKTtcblxuXG4gICAgcmVnVHlwZSgnaGVhdGluZy1vbmUnLCBbJyRzY29wZScsICdiYXRBcGlTcnYnLCBmdW5jdGlvbiAoJHNjb3BlLCBiYXRBcGlTcnYpIHtcbiAgICAgICAgdmFyIHNldE9iamVjdCA9IHt9O1xuICAgICAgICBzZXRPYmplY3QuSEFNb2R1bGVJZCA9ICRzY29wZS5pdGVtLkhBTW9kdWxlSWQ7XG4gICAgICAgIHNldE9iamVjdC5Nb2R1bGVUeXBlID0gJHNjb3BlLml0ZW0uTW9kdWxlVHlwZTtcbiAgICAgICAgc2V0T2JqZWN0Lk1vZHVsZUl0ZW0gPSBcIkluc3RydWN0aW9uXCI7XG5cbiAgICAgICAgYmF0QXBpU3J2LmdldEhlbHBNb2R1bGVWYWx1ZShzZXRPYmplY3QpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgaWYocmVzcG9uc2UuTW9kdWxlVmFsdWUgPT0gdW5kZWZpbmVkKXtcbiAgICAgICAgICAgICAgICRzY29wZS5pdGVtLnNldHBvaW50ID0gMjA7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAkc2NvcGUuaXRlbS5zZXRwb2ludCA9IHBhcnNlRmxvYXQocmVzcG9uc2UuTW9kdWxlVmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgICAgICRzY29wZS5vbkNoYW5nZSA9IGZ1bmN0aW9uKGRpcmVjdGlvbil7XG4gICAgICAgICAgICB2YXIgaW5pdGlhbFZhbHVlID0gJHNjb3BlLml0ZW0uc2V0cG9pbnQ7XG4gICAgICAgICAgICB2YXIgY2hhbmdlZFZhbHVlID0gaW5pdGlhbFZhbHVlO1xuICAgICAgICAgICAgY2hhbmdlZFZhbHVlID0gcGFyc2VGbG9hdChjaGFuZ2VkVmFsdWUpLnRvRml4ZWQoMSk7IFxuICAgICAgICAgICAgaWYoZGlyZWN0aW9uID09ICd1cCcpe1xuICAgICAgICAgICAgICAgIGlmKGluaXRpYWxWYWx1ZSA8IDM1KXtcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlZFZhbHVlID0gTnVtYmVyKGNoYW5nZWRWYWx1ZSkgKyBOdW1iZXIoMC4yKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICBpZihpbml0aWFsVmFsdWUgPiAxNSl7XG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZWRWYWx1ZSA9IE51bWJlcihjaGFuZ2VkVmFsdWUpIC0gTnVtYmVyKDAuMik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSAgICAgICAgICBcbiAgICAgICAgICAgIGNoYW5nZWRWYWx1ZSA9IHBhcnNlRmxvYXQoY2hhbmdlZFZhbHVlKS50b0ZpeGVkKDEpOyAgICAgICAgICAgICAgXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHNldE9iamVjdC5Nb2R1bGVWYWx1ZSA9IGNoYW5nZWRWYWx1ZTsgICAgICAgICAgICBcbiAgICAgICAgICAgIGJhdEFwaVNydi5zZXRIZWxwTW9kdWxlVmFsdWUoc2V0T2JqZWN0LCB7fSkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7ICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICRzY29wZS5pdGVtLnNldHBvaW50ID0gY2hhbmdlZFZhbHVlO1xuICAgICAgICAgICAgfSwgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAkc2NvcGUuaXRlbS5zZXRwb2ludCA9IGluaXRpYWxWYWx1ZTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0gICAgICAgIFxuICAgIH1dKTtcblxuXG4gICAgcmVnVHlwZSgnc2h1dHRlcnMtb25lJywgWyckc2NvcGUnLCckdGltZW91dCcsJ2JhdEFwaVNydicsIGZ1bmN0aW9uICgkc2NvcGUsICR0aW1lb3V0LCBiYXRBcGlTcnYpIHtcbiAgICAgICAgJHNjb3BlLmdvaW5nRG93biA9IGZhbHNlO1xuICAgICAgICAkc2NvcGUuZ29pbmdVcCA9IGZhbHNlO1xuICAgICAgICB2YXIgdGltZW91dDsgIFxuICAgICAgICB2YXIgdGltZSA9ICRzY29wZS5pdGVtLnNodXR0ZXJfc2Vjb25kcz8kc2NvcGUuaXRlbS5zaHV0dGVyX3NlY29uZHM6MTA7XG5cbiAgICAgICAgJHNjb3BlLnVwID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHZhciBwYXJhbXMgPSB7fTtcbiAgICAgICAgICAgIHBhcmFtcy5idXR0b24gPSAnTGVmdCc7XG4gICAgICAgICAgICBwYXJhbXMubW91c2VTdGF0ZSA9ICdEb3duJzsgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAkc2NvcGUuaXRlbS5saXZlLnNldFZhbHVlKCcxJywgcGFyYW1zKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICAgICAgICBwYXJhbXMuYnV0dG9uID0gJ0xlZnQnO1xuICAgICAgICAgICAgICAgIHBhcmFtcy5tb3VzZVN0YXRlID0gJ1VwJztcbiAgICAgICAgICAgICAgICAkc2NvcGUuaXRlbS5saXZlLnNldFZhbHVlKCcxJywgcGFyYW1zKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICAgICAgICAgICAgdGltZW91dCA9ICR0aW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZ29pbmdVcCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmdvaW5nRG93biA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9LCB0aW1lKjEwMDApXG4gICAgICAgICAgICAgICAgfSkgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgICAgJHNjb3BlLmRvd24gPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgdmFyIHBhcmFtcyA9IHt9O1xuICAgICAgICAgICAgcGFyYW1zLmJ1dHRvbiA9ICdMZWZ0JztcbiAgICAgICAgICAgIHBhcmFtcy5tb3VzZVN0YXRlID0gJ0Rvd24nO1xuICAgICAgICAgICAgdmFyIGRvd25PYmplY3QgPSB7fTtcbiAgICAgICAgICAgIGRvd25PYmplY3QuSEFNb2R1bGVJZCA9ICRzY29wZS5pdGVtLkhBTW9kdWxlSWQ7XG4gICAgICAgICAgICBkb3duT2JqZWN0Lk1vZHVsZUl0ZW0gPSAkc2NvcGUuaXRlbS5zaHV0dGVyX2lucHV0O1xuICAgICAgICAgICAgZG93bk9iamVjdC5Nb2R1bGVUeXBlID0gJHNjb3BlLml0ZW0uTW9kdWxlVHlwZTtcbiAgICAgICAgICAgIGRvd25PYmplY3QuTW9kdWxlVmFsdWUgPSBcIjFcIjtcbiAgICAgICAgICAgIGJhdEFwaVNydi5zZXRIZWxwTW9kdWxlVmFsdWUoZG93bk9iamVjdCwgcGFyYW1zKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICAgICAgICBwYXJhbXMuYnV0dG9uID0gJ0xlZnQnO1xuICAgICAgICAgICAgICAgIHBhcmFtcy5tb3VzZVN0YXRlID0gJ1VwJzsgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGJhdEFwaVNydi5zZXRIZWxwTW9kdWxlVmFsdWUoZG93bk9iamVjdCwgcGFyYW1zKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICAgICAgICAgICAgdGltZW91dCA9ICR0aW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZ29pbmdVcCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmdvaW5nRG93biA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9LCB0aW1lKjEwMDApXG4gICAgICAgICAgICAgICAgfSkgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfSkgICAgICAgICAgICBcbiAgICAgICAgfVxuICAgICAgICAkc2NvcGUub25TdG9wID0gZnVuY3Rpb24oZGlyZWN0aW9uKXtcbiAgICAgICAgICAgICR0aW1lb3V0LmNhbmNlbCggdGltZW91dCApO1xuICAgICAgICAgICAgJHNjb3BlLmdvaW5nVXAgPSBmYWxzZTtcbiAgICAgICAgICAgICRzY29wZS5nb2luZ0Rvd24gPSBmYWxzZTsgXG4gICAgICAgICAgICBpZihkaXJlY3Rpb24gPT0gJ3VwJyl7XG4gICAgICAgICAgICAgICAgJHNjb3BlLnVwKCk7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAkc2NvcGUuZG93bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgICRzY29wZS5vbk1vdmUgPSBmdW5jdGlvbihkaXJlY3Rpb24pe1xuICAgICAgICAgICAgJHRpbWVvdXQuY2FuY2VsKCB0aW1lb3V0ICk7XG4gICAgICAgICAgICBzd2l0Y2goZGlyZWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAndXAnOlxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZ29pbmdVcCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5nb2luZ0Rvd24gPSBmYWxzZTsgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ2Rvd24nOlxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZ29pbmdEb3duID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmdvaW5nVXAgPSBmYWxzZTsgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5nb2luZ1VwID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5nb2luZ0Rvd24gPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKGRpcmVjdGlvbiA9PSAndXAnKXsgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAkc2NvcGUudXAoKTtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICRzY29wZS5kb3duKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XSlcblxuICAgIHJlZ1R5cGUoJ21hZ25ldGljLWNvbnRhY3RvcicsIFsnJHNjb3BlJywgZnVuY3Rpb24gKCRzY29wZSkge1xuICAgIH1dKTtcblxuICAgIHJlZ1R5cGUoJ2Zsb29kLWRldGVjdG9yJywgWyckc2NvcGUnLCBmdW5jdGlvbiAoJHNjb3BlKSB7XG4gICAgfV0pO1xuXG4gICAgcmVnVHlwZSgnZG9vci15YWxlJywgWyckc2NvcGUnLCckdGltZW91dCcsIGZ1bmN0aW9uICgkc2NvcGUsICR0aW1lb3V0KSB7XG4gICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICRzY29wZS5vbkNoYW5nZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IHRydWU7XG4gICAgICAgICAgICAkc2NvcGUuaXRlbS5saXZlLnNldFZhbHVlKDEwMCkudGhlbihmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5pdGVtLmxpdmUuc2V0VmFsdWUoMCkudGhlbihmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9LCAyMDAwKVxuICAgICAgICAgICAgfSk7IFxuICAgICAgICB9XG4gICAgfV0pO1xuXG4gICAgcmVnVHlwZSgnc21va2UtZGV0ZWN0b3ItY2lyY3VpdCcsIFsnJHNjb3BlJywnYmF0QXBpU3J2JywnJHRpbWVvdXQnLCBmdW5jdGlvbiAoJHNjb3BlLCBiYXRBcGlTcnYsICR0aW1lb3V0KSB7XG4gICAgICAgIHZhciByZXNldE9iamVjdCA9IHt9O1xuICAgICAgICB2YXIgb3V0cHV0O1xuICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICBpZigkc2NvcGUuaXRlbS5kZXRlY3Rvcl9vdXRwdXQpe1xuICAgICAgICAgICAgb3V0cHV0ID0gJHNjb3BlLml0ZW0uZGV0ZWN0b3Jfb3V0cHV0LnJlcGxhY2UoL1swLTldL2csICcnKTsgICAgICAgICAgICBcbiAgICAgICAgfVxuICAgICAgICByZXNldE9iamVjdC5IQU1vZHVsZUlkID0gJHNjb3BlLml0ZW0uSEFNb2R1bGVJZDtcbiAgICAgICAgcmVzZXRPYmplY3QuTW9kdWxlSXRlbSA9ICRzY29wZS5pdGVtLmRldGVjdG9yX291dHB1dDtcbiAgICAgICAgcmVzZXRPYmplY3QuTW9kdWxlVHlwZSA9IG91dHB1dDtcbiAgICAgICAgJHNjb3BlLm9uQ2hhbmdlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gdHJ1ZTsgICAgICAgIFxuICAgICAgICAgICAgcmVzZXRPYmplY3QuTW9kdWxlVmFsdWUgPSAwO1xuICAgICAgICAgICAgYmF0QXBpU3J2LnNldEhlbHBNb2R1bGVWYWx1ZShyZXNldE9iamVjdCkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgICAgICAgICAgcmVzZXRPYmplY3QuTW9kdWxlVmFsdWUgPSAxMDA7XG4gICAgICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgYmF0QXBpU3J2LnNldEhlbHBNb2R1bGVWYWx1ZShyZXNldE9iamVjdCkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9KSAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgfSwgMTAwMClcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICB9XSk7XG59KShhbmd1bGFyLCB3aW5kb3csICQpO1xuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBbXCJDb29raWVzU2VydmljZVwiLCBcIiRxXCIsIFwiJGh0dHBcIiwgXCIkbG9jYXRpb25cIiwgXCJUb2FzdFNlcnZpY2VcIixcIlVzZXJGYWN0b3J5XCIsICBmdW5jdGlvbihDb29raWVzU2VydmljZSwgJHEsICRodHRwLCAkbG9jYXRpb24sIFRvYXN0U2VydmljZSwgVXNlckZhY3RvcnkpIHtcclxuICAgIHZhciBjYWNoZSA9IGZ1bmN0aW9uKGtleSwgdmFsdWUpe1xyXG4gICAgICAgIENvb2tpZXNTZXJ2aWNlLnB1dChrZXksIHZhbHVlKTtcclxuICAgIH1cclxuICAgIHZhciBjYWNoZVVzZXIgPSBmdW5jdGlvbih1c2VyKXtcclxuICAgICAgICBDb29raWVzU2VydmljZS5wdXQoJ3VzZXInLCB1c2VyKTtcclxuICAgIH1cclxuICAgIHZhciBjYWNoZVVzZXJJZCA9IGZ1bmN0aW9uKHVzZXJfaWQpe1xyXG4gICAgICAgIENvb2tpZXNTZXJ2aWNlLnB1dCgndXNlcl9pZCcsIHVzZXJfaWQpO1xyXG4gICAgfVxyXG4gICAgdmFyIHVuY2FjaGVTZXNzaW9uID0gZnVuY3Rpb24oKXtcclxuICAgICAgICBDb29raWVzU2VydmljZS5yZW1vdmUoJ3VzZXInKTtcclxuICAgICAgICBDb29raWVzU2VydmljZS5yZW1vdmUoJ3VzZXJfaWQnKTtcclxuICAgICAgICBDb29raWVzU2VydmljZS5yZW1vdmUoJ3Rva2VuJyk7XHJcbiAgICAgICAgQ29va2llc1NlcnZpY2UucmVtb3ZlKCd0eXBlJyk7XHJcbiAgICAgICAgQ29va2llc1NlcnZpY2UucmVtb3ZlKCdsYW5ndWFnZScpO1xyXG4gICAgfSAgICBcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGxvZ2luOiBmdW5jdGlvbihjcmVkZW50aWFscyl7XHJcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XHJcbiAgICAgICAgICAgIFVzZXJGYWN0b3J5LmxvZ2luKGNyZWRlbnRpYWxzKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcclxuICAgICAgICAgICAgICAgIGNhY2hlKCd0b2tlbicsIHJlc3BvbnNlLnRva2VuKTtcclxuICAgICAgICAgICAgICAgIGNhY2hlKCd1c2VyX2lkJywgcmVzcG9uc2UudXNlci5pZCk7XHJcbiAgICAgICAgICAgICAgICBjYWNoZSgndXNlcicsIHJlc3BvbnNlLnVzZXIubmFtZSk7XHJcbiAgICAgICAgICAgICAgICBjYWNoZSgndHlwZScsIHJlc3BvbnNlLnVzZXIudHlwZSk7XHJcbiAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKG51bGwpO1xyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbihlcnIpe1xyXG4gICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KG51bGwpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGxvZ291dDogZnVuY3Rpb24oKXsgICAgIFxyXG4gICAgICAgICAgICBVc2VyRmFjdG9yeS5sb2dvdXQoKS50aGVuKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICB1bmNhY2hlU2Vzc2lvbigpO1xyXG4gICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy8nKTsgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSxcclxuICAgICAgICBpc0xvZ2dlZEluOiBmdW5jdGlvbigpXHJcbiAgICAgICAgeyAgIFxyXG4gICAgICAgICAgICByZXR1cm4gQ29va2llc1NlcnZpY2UuZ2V0KCd0b2tlbicpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgaXNBZG1pbjogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgcmV0dXJuIENvb2tpZXNTZXJ2aWNlLmdldCgndG9rZW4nKSAmJiAoQ29va2llc1NlcnZpY2UuZ2V0KCd1c2VyJykgPT0gJ2FkbWluQGFkbWluLmNvbScpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufV0iLCIndXNlIHN0cmljdCc7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFtcIiRjb29raWVzXCIsIGZ1bmN0aW9uKCRjb29raWVzKSB7XHJcbiAgICB2YXIgc3RvcmFnZSA9IHdpbmRvdy5sb2NhbFN0b3JhZ2U7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGdldCA6IGZ1bmN0aW9uKGtleSkge1xyXG4gICAgICAgICAgICByZXR1cm4gJGNvb2tpZXMuZ2V0KGtleSk7ICBcclxuICAgICAgICAgICAgLy9yZXR1cm4gc3RvcmFnZS5nZXRJdGVtKGtleSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBwdXQgOiBmdW5jdGlvbihrZXksIHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHZhciBleHBpcmVEYXRlID0gbmV3IERhdGUoKTtcclxuICAgICAgICAgICAgZXhwaXJlRGF0ZS5zZXREYXRlKGV4cGlyZURhdGUuZ2V0RGF0ZSgpICsgMzY1KTtcclxuXHJcbiAgICAgICAgICAgICRjb29raWVzLnB1dChrZXksIHZhbHVlLCB7J2V4cGlyZXMnOiBleHBpcmVEYXRlfSk7XHJcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgICAgICAgICAgLy9zdG9yYWdlLnNldEl0ZW0oa2V5LCB2YWx1ZSk7XHJcbiAgICAgICAgICAgIC8vcmV0dXJuIHZhbHVlO1xyXG5cclxuICAgICAgICB9LFxyXG4gICAgICAgIHJlbW92ZSA6IGZ1bmN0aW9uKGtleSkge1xyXG4gICAgICAgICAgICByZXR1cm4gJGNvb2tpZXMucmVtb3ZlKGtleSk7XHJcbiAgICAgICAgICAgIC8vcmV0dXJuIHN0b3JhZ2UucmVtb3ZlSXRlbShrZXkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufV0iLCIndXNlIHN0cmljdCc7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgIHZhciBpY29ucyA9IHt9O1xyXG4gICAgaWNvbnMuTCA9IFtdO1xyXG4gICAgaWNvbnMuUk0gPSBbXTtcclxuICAgIGljb25zLkggPSBbXTtcclxuICAgIGljb25zLlNDID0gW107XHJcbiAgICBpY29ucy5TRSA9IFtdO1xyXG5cclxuICAgIGljb25zLmhvdXNlcyA9IFtdO1xyXG4gICAgaWNvbnMuZmxvb3JzID0gW107XHJcbiAgICBpY29ucy5yb29tcyA9IFtdO1xyXG4gICAgXHJcbiAgICBpY29ucy5MLnB1c2goe2lkOjEsIG5hbWU6J2xpZ2h0cy0wMScsIHR5cGUgOiAnaWNvbid9KTtcclxuICAgIGljb25zLkwucHVzaCh7aWQ6MiwgbmFtZTonbGlnaHRzLTAyJywgdHlwZSA6ICdpY29uJ30pO1xyXG4gICAgaWNvbnMuTC5wdXNoKHtpZDozLCBuYW1lOidsaWdodHMtMDMnLCB0eXBlIDogJ2ljb24nfSk7XHJcbiAgICBpY29ucy5MLnB1c2goe2lkOjQsIG5hbWU6J2xpZ2h0cy0wNCcsIHR5cGUgOiAnaWNvbid9KTtcclxuICAgIFxyXG4gICAgaWNvbnMuTC5wdXNoKHtpZDo1LCBuYW1lOidsaWdodHMtMDUnLCB0eXBlIDogJ2ljb24nfSk7XHJcbiAgICBpY29ucy5MLnB1c2goe2lkOjYsIG5hbWU6J2xpZ2h0cy0wNicsIHR5cGUgOiAnaWNvbid9KTtcclxuICAgIGljb25zLkwucHVzaCh7aWQ6NywgbmFtZTonbGlnaHRzLTA3JywgdHlwZSA6ICdpY29uJ30pO1xyXG4gICAgaWNvbnMuTC5wdXNoKHtpZDo4LCBuYW1lOidsaWdodHMtMDgnLCB0eXBlIDogJ2ljb24nfSk7XHJcbiAgICBpY29ucy5MLnB1c2goe2lkOjksIG5hbWU6J2xpZ2h0cy0wOScsIHR5cGUgOiAnaWNvbid9KTtcclxuICAgIGljb25zLkwucHVzaCh7aWQ6MTAsIG5hbWU6J2xpZ2h0cy0xMCcsIHR5cGUgOiAnaWNvbid9KTtcclxuICAgIGljb25zLkwucHVzaCh7aWQ6MTEsIG5hbWU6J2xpZ2h0cy0xMScsIHR5cGUgOiAnaWNvbid9KTtcclxuICAgIGljb25zLkwucHVzaCh7aWQ6MTIsIG5hbWU6J2xpZ2h0cy0xMicsIHR5cGUgOiAnaWNvbid9KTtcclxuICAgIGljb25zLkwucHVzaCh7aWQ6MTMsIG5hbWU6J2ZhIGZhLWJhdHRlcnktaGFsZicsIHR5cGUgOiAncHJvZ3Jlc3MtYmFyLWhvcmlzb250YWwtMDEnfSk7XHJcbiAgICBpY29ucy5MLnB1c2goe2lkOjE0LCBuYW1lOidmYSBmYS1jaXJjbGUtby1ub3RjaCcsIHR5cGUgOiAncHJvZ3Jlc3Mtcm91bmQtMDEnfSk7XHJcblxyXG5cclxuXHJcbiAgICBpY29ucy5STS5wdXNoKHtpZDoxLCBuYW1lOidmYSBmYS1iYXJzJ30pO1xyXG5cclxuICAgIGljb25zLlNDLnB1c2goe2lkOjEsIG5hbWU6J2ZhIGZhLXBvd2VyLW9mZid9KTtcclxuICAgIGljb25zLlNDLnB1c2goe2lkOjIsIG5hbWU6J2ZhIGZhLXRlbGV2aXNpb24nfSk7XHJcbiAgICBpY29ucy5TQy5wdXNoKHtpZDozLCBuYW1lOidmYSBmYS12b2x1bWUtdXAnfSk7XHJcbiAgICBpY29ucy5TQy5wdXNoKHtpZDo0LCBuYW1lOidmYSBmYS12b2x1bWUtb2ZmJ30pO1xyXG4gICAgaWNvbnMuU0MucHVzaCh7aWQ6NSwgbmFtZTonZmEgZmEtYmVsbCd9KTtcclxuICAgIGljb25zLlNDLnB1c2goe2lkOjYsIG5hbWU6J2ZhIGZhLWJlbGwtc2xhc2gnfSk7XHJcbiAgICBpY29ucy5TQy5wdXNoKHtpZDo3LCBuYW1lOidmYSBmYS1jaXJjbGUnfSk7XHJcbiAgICBpY29ucy5TQy5wdXNoKHtpZDo4LCBuYW1lOidmYSBmYS1jaGVjay1jaXJjbGUnfSk7XHJcbiAgICBpY29ucy5TQy5wdXNoKHtpZDo5LCBuYW1lOidmYSBmYS10b2dnbGUtb24nfSk7XHJcbiAgICBpY29ucy5TQy5wdXNoKHtpZDoxMCwgbmFtZTonZmEgZmEtdG9nZ2xlLW9mZid9KTtcclxuICAgIGljb25zLlNDLnB1c2goe2lkOjExLCBuYW1lOidmYSBmYS1iZWQnfSk7XHJcblxyXG4gICAgaWNvbnMuU0UucHVzaCh7aWQ6MSwgbmFtZTonZmEgZmEtZmlyZSd9KTtcclxuICAgIGljb25zLlNFLnB1c2goe2lkOjIsIG5hbWU6J2ZhIGZhLXRpbnQnfSk7XHJcbiAgICBpY29ucy5TRS5wdXNoKHtpZDozLCBuYW1lOidjb250YWN0b3JzLXdpbmRvdy0xJ30pO1xyXG4gICAgaWNvbnMuU0UucHVzaCh7aWQ6NCwgbmFtZTonY29udGFjdG9ycy1kb29yLTEnfSk7XHJcblxyXG5cclxuICAgIGljb25zLmhvdXNlcy5wdXNoKHtpZDoxLCBuYW1lOidob3VzZXMtMDEnLCBodW1hbjonaHVtYW4nfSk7XHJcbiAgICBpY29ucy5ob3VzZXMucHVzaCh7aWQ6MiwgbmFtZTonaG91c2VzLTAyJywgaHVtYW46J2h1bWFuJ30pO1xyXG4gICAgaWNvbnMuaG91c2VzLnB1c2goe2lkOjMsIG5hbWU6J2hvdXNlcy0wMycsIGh1bWFuOidodW1hbid9KTtcclxuICAgIGljb25zLmhvdXNlcy5wdXNoKHtpZDo0LCBuYW1lOidob3VzZXMtMDQnLCBodW1hbjonaHVtYW4nfSk7XHJcbiAgICBcclxuXHJcbiAgICBpY29ucy5mbG9vcnMucHVzaCh7aWQ6MSwgbmFtZTonZmxvb3JzLTAxJywgaHVtYW46J2h1bWFuJ30pO1xyXG4gICAgaWNvbnMuZmxvb3JzLnB1c2goe2lkOjIsIG5hbWU6J2Zsb29ycy0wMicsIGh1bWFuOidodW1hbid9KTtcclxuICAgIGljb25zLmZsb29ycy5wdXNoKHtpZDozLCBuYW1lOidmbG9vcnMtMDMnLCBodW1hbjonaHVtYW4nfSk7XHJcbiAgICBpY29ucy5mbG9vcnMucHVzaCh7aWQ6NCwgbmFtZTonZmxvb3JzLTA0JywgaHVtYW46J2h1bWFuJ30pO1xyXG4gICAgaWNvbnMuZmxvb3JzLnB1c2goe2lkOjUsIG5hbWU6J2Zsb29ycy0wNScsIGh1bWFuOidodW1hbid9KTtcclxuXHJcbiAgICBpY29ucy5mbG9vcnNBbGwgPSBbXTtcclxuICAgIGljb25zLmZsb29yc0FsbC5wdXNoKHtpZDoxLCBuYW1lOidmbG9vcnMtYWxsLTInLCBodW1hbjonRm9yIDIgc3RvcmllcyBidWlsZGluZyd9KTtcclxuICAgIGljb25zLmZsb29yc0FsbC5wdXNoKHtpZDoyLCBuYW1lOidmbG9vcnMtYWxsLTMnLCBodW1hbjonRm9yIDMgc3RvcmllcyBidWlsZGluZyd9KTtcclxuICAgIFxyXG5cclxuXHJcbiAgICBpY29ucy5yb29tcy5wdXNoKHtpZDoxLCBuYW1lOidyb29tcy0wMScsIGh1bWFuOidyb29tJ30pO1xyXG4gICAgaWNvbnMucm9vbXMucHVzaCh7aWQ6MiwgbmFtZToncm9vbXMtMDInLCBodW1hbjoncm9vbSd9KTtcclxuICAgIC8vaWNvbnMucm9vbXMucHVzaCh7aWQ6MywgbmFtZToncm9vbXMtMDMnLCBodW1hbjoncm9vbSd9KTtcclxuICAgIGljb25zLnJvb21zLnB1c2goe2lkOjQsIG5hbWU6J3Jvb21zLTA0JywgaHVtYW46J3Jvb20nfSk7XHJcbiAgICBpY29ucy5yb29tcy5wdXNoKHtpZDo1LCBuYW1lOidyb29tcy0wNScsIGh1bWFuOidyb29tJ30pO1xyXG4gICAgaWNvbnMucm9vbXMucHVzaCh7aWQ6NiwgbmFtZToncm9vbXMtMDYnLCBodW1hbjoncm9vbSd9KTtcclxuICAgIGljb25zLnJvb21zLnB1c2goe2lkOjcsIG5hbWU6J3Jvb21zLTA3JywgaHVtYW46J3Jvb20nfSk7XHJcbiAgICBpY29ucy5yb29tcy5wdXNoKHtpZDo4LCBuYW1lOidyb29tcy0wOCcsIGh1bWFuOidyb29tJ30pO1xyXG4gICAgaWNvbnMucm9vbXMucHVzaCh7aWQ6OSwgbmFtZToncm9vbXMtMDknLCBodW1hbjoncm9vbSd9KTtcclxuICAgIGljb25zLnJvb21zLnB1c2goe2lkOjEwLCBuYW1lOidyb29tcy0xMCcsIGh1bWFuOidyb29tJ30pO1xyXG4gICAgaWNvbnMucm9vbXMucHVzaCh7aWQ6MTEsIG5hbWU6J3Jvb21zLTExJywgaHVtYW46J3Jvb20nfSk7XHJcbiAgICAvL2ljb25zLnJvb21zLnB1c2goe2lkOjEyLCBuYW1lOidyb29tcy0xMicsIGh1bWFuOidyb29tJ30pO1xyXG4gICAgXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGdldEljb25zIDogZnVuY3Rpb24oa2V5KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBpY29uc1trZXldO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZ2V0SWNvbiA6IGZ1bmN0aW9uKGtleSwgaWQpIHtcclxuICAgICAgICAgICAgaWYoa2V5KXtcclxuICAgICAgICAgICAgICAgIHZhciBrZXkxID0gXy5maW5kTGFzdEluZGV4KGljb25zW2tleV0sIHtpZDogaWR9KTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpY29uc1trZXldW2tleTFdOyAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIid1c2Ugc3RyaWN0JztcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7ICAgIFxyXG5cclxuICAgIHZhciB0ZW1wbGF0ZSA9IHt9O1xyXG4gICAgdGVtcGxhdGUuTCA9IFtdO1xyXG4gICAgdGVtcGxhdGUuQ00gPSBbXTtcclxuICAgIHRlbXBsYXRlLlJNID0gW107XHJcbiAgICB0ZW1wbGF0ZS5IID0gW107XHJcbiAgICB0ZW1wbGF0ZS5TQyA9IFtdO1xyXG4gICAgdGVtcGxhdGUuU0UgPSBbXTtcclxuICAgIFxyXG4gICAgdGVtcGxhdGUuTC5wdXNoKHtpZDoxLCBuYW1lOidsaWdodC1zd2l0Y2gtd2l0aC1vbmUtYnV0dG9uJywgaHVtYW46J0xpZ2h0IHN3aXRjaCB3aXRoIG9uZSBidXR0b24nfSk7XHJcbiAgICB0ZW1wbGF0ZS5MLnB1c2goe2lkOjIsIG5hbWU6J2xpZ2h0LXN3aXRjaC13aXRoLXR3by1idXR0b25zJywgaHVtYW46J0xpZ2h0cyBzd2l0Y2ggd2l0aCAyIGJ1dHRvbnMnfSk7XHJcbiAgICB0ZW1wbGF0ZS5MLnB1c2goe2lkOjMsIG5hbWU6J2xpZ2h0LWRpbW1pbmctdHdvLWJ1dHRvbnMnLCBodW1hbjonRGltbWVyIHdpdGggMiBidXR0b25zJ30pO1xyXG4gICAgdGVtcGxhdGUuTC5wdXNoKHtpZDo0LCBuYW1lOidsaWdodC1kaW1taW5nLXdpdGgtc2xpZGVyJywgaHVtYW46J0RpbW1lciB3aXRoIHNsaWRlcid9KTtcclxuICAgIHRlbXBsYXRlLkwucHVzaCh7aWQ6NSwgbmFtZTonbGlnaHQtZGltbWluZy13aXRoLW9yLXdpdGhvdXQtbWVtb3J5JywgaHVtYW46J0RpbW1lciB3aXRoIG9yIHdpdGhvdXQgbWVtb3J5J30pO1xyXG4gICAgXHJcbiAgICBcclxuICAgIFxyXG4gICAgdGVtcGxhdGUuUk0ucHVzaCh7aWQ6MSwgbmFtZTonc2h1dHRlcnMtb25lJywgaHVtYW46J1NodXR0ZXJzIHdpdGggMiBidXR0b25zJ30pO1xyXG5cclxuXHJcbiAgICB0ZW1wbGF0ZS5ILnB1c2goe2lkOjEsIG5hbWU6J2hlYXRpbmctb25lJywgaHVtYW46J0hlYXRpbmcgY29udHJvbCB3aXRoIDIgYnV0dG9ucyd9KTtcclxuXHJcbiAgICB0ZW1wbGF0ZS5TQy5wdXNoKHtpZDoxLCBuYW1lOidzY2VuYXJpby1vbmUnLCBodW1hbjonU2NlbmFyaW8gd2l0aCBvbmUgc2V0L3Jlc2V0J30pO1xyXG5cclxuICAgIHRlbXBsYXRlLlNFLnB1c2goe2lkOjEsIG5hbWU6J3Ntb2tlLWRldGVjdG9yLWNpcmN1aXQnLCBodW1hbjonU21va2UgZGV0ZWN0b3Igd2l0aCByZXNldCBjaXJjdWl0J30pO1xyXG4gICAgdGVtcGxhdGUuU0UucHVzaCh7aWQ6MiwgbmFtZTonZmxvb2QtZGV0ZWN0b3InLCBodW1hbjonRmxvb2QgZGV0ZWN0b3InfSk7XHJcbiAgICB0ZW1wbGF0ZS5TRS5wdXNoKHtpZDozLCBuYW1lOidkb29yLXlhbGUnLCBodW1hbjonRG9vciB5YWxlJ30pO1xyXG4gICAgdGVtcGxhdGUuU0UucHVzaCh7aWQ6NCwgbmFtZTonbWFnbmV0aWMtY29udGFjdG9yJywgaHVtYW46J01hZ2VudGljIGNvbnRhY3RvcnMnfSk7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBnZXRUZW1wbGF0ZXMgOiBmdW5jdGlvbihrZXkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRlbXBsYXRlW2tleV07XHJcbiAgICAgICAgfSxcclxuICAgICAgICBnZXRUZW1wbGF0ZSA6IGZ1bmN0aW9uKGtleSwgaWQpIHtcclxuICAgICAgICAgICAgdmFyIGtleTEgPSBfLmZpbmRMYXN0SW5kZXgodGVtcGxhdGVba2V5XSwge2lkOiBpZH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gdGVtcGxhdGVba2V5XVtrZXkxXTtcclxuICAgICAgICB9ICAgICAgICBcclxuICAgIH1cclxuICAgICAgICBcclxufSIsIid1c2Ugc3RyaWN0JztcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gW1wibmdUb2FzdFwiLCBmdW5jdGlvbihuZ1RvYXN0KSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGNyZWF0ZTogZnVuY3Rpb24obWVzc2FnZSwgY2xhc3NOYW1lKXtcclxuXHRcdFx0bmdUb2FzdC5jcmVhdGUoe1xyXG5cdFx0XHRcdGNsYXNzTmFtZTogY2xhc3NOYW1lLFxyXG5cdFx0XHRcdGNvbnRlbnQ6IG1lc3NhZ2UsXHJcblx0XHRcdFx0ZGlzbWlzc0J1dHRvbjogdHJ1ZSxcclxuXHRcdFx0XHRkaXNtaXNzQnV0dG9uSHRtbDogJyZ0aW1lczsnXHJcblx0XHRcdH0pOyAgICAgICAgXHRcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1dOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7ICAgIFxyXG5cclxuICAgIHZhciB3b3JkcyA9IFtdO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBnZXQgOiBmdW5jdGlvbihrZXkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHdvcmRzW2tleV07XHJcbiAgICAgICAgfSwgXHJcbiAgICAgICAgc2V0IDogZnVuY3Rpb24oa2V5LCB2YWx1ZSl7XHJcbiAgICAgICAgICAgIHJldHVybiB3b3Jkc1trZXldID0gdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHsgICAgXHJcblxyXG4gICAgdmFyIGljb25zID0gW107XHJcbiAgICBpY29uc1snMjAwJ10gPSAnd2kgd2ktdGh1bmRlcnN0b3JtJzsgLy90aHVuZGVyc3Rvcm0gd2l0aCBsaWdodCByYWluXHJcbiAgICBpY29uc1snMjAxJ10gPSAnd2kgd2ktdGh1bmRlcnN0b3JtJzsgLy90aHVuZGVyc3Rvcm0gd2l0aCByYWluXHJcbiAgICBpY29uc1snMjAyJ10gPSAnd2kgd2ktdGh1bmRlcnN0b3JtJzsgLy90aHVuZGVyc3Rvcm0gd2l0aCBoZWF2eSByYWluXHJcbiAgICBpY29uc1snMjEwJ10gPSAnd2kgd2ktdGh1bmRlcnN0b3JtJzsgLy9saWdodCB0aHVuZGVyc3Rvcm1cclxuICAgIGljb25zWycyMTEnXSA9ICd3aSB3aS10aHVuZGVyc3Rvcm0nOyAvL3RodW5kZXJzdG9ybVxyXG4gICAgaWNvbnNbJzIxMiddID0gJ3dpIHdpLXRodW5kZXJzdG9ybSc7IC8vaGVhdnkgdGh1bmRlcnN0b3JtXHJcbiAgICBpY29uc1snMjIxJ10gPSAnd2kgd2ktdGh1bmRlcnN0b3JtJzsgLy9yYWdnZWQgdGh1bmRlcnN0b3JtXHJcbiAgICBpY29uc1snMjMwJ10gPSAnd2kgd2ktdGh1bmRlcnN0b3JtJzsgLy90aHVuZGVyc3Rvcm0gd2l0aCBsaWdodCBkcml6emxlXHJcbiAgICBpY29uc1snMjMxJ10gPSAnd2kgd2ktdGh1bmRlcnN0b3JtJzsgLy90aHVuZGVyc3Rvcm0gd2l0aCBkcml6emxlXHJcbiAgICBpY29uc1snMjMyJ10gPSAnd2kgd2ktdGh1bmRlcnN0b3JtJzsgLy90aHVuZGVyc3Rvcm0gd2l0aCBoZWF2eSBkcml6emxlXHJcblxyXG4gICAgaWNvbnNbJzMwMCddID0gJ3dpIHdpLXNob3dlcnMnOyAvL2xpZ2h0IGludGVuc2l0eSBkcml6emxlXHJcbiAgICBpY29uc1snMzAxJ10gPSAnd2kgd2ktc2hvd2Vycyc7IC8vZHJpenpsZVxyXG4gICAgaWNvbnNbJzMwMiddID0gJ3dpIHdpLXNob3dlcnMnOyAvL2hlYXZ5IGludGVuc2l0eSBkcml6emxlXHJcbiAgICBpY29uc1snMzEwJ10gPSAnd2kgd2ktc2hvd2Vycyc7IC8vbGlnaHQgaW50ZW5zaXR5IGRyaXp6bGUgcmFpblxyXG4gICAgaWNvbnNbJzMxMSddID0gJ3dpIHdpLXNob3dlcnMnOyAvL2RyaXp6bGUgcmFpblxyXG4gICAgaWNvbnNbJzMxMiddID0gJ3dpIHdpLXNob3dlcnMnOyAvL2hlYXZ5IGludGVuc2l0eSBkcml6emxlIHJhaW5cclxuICAgIGljb25zWyczMTMnXSA9ICd3aSB3aS1zaG93ZXJzJzsgLy9zaG93ZXIgcmFpbiBhbmQgZHJpenpsZVxyXG4gICAgaWNvbnNbJzMxNCddID0gJ3dpIHdpLXNob3dlcnMnOyAvL2hlYXZ5IHNob3dlciByYWluIGFuZCBkcml6emxlXHJcbiAgICBpY29uc1snMzIxJ10gPSAnd2kgd2ktc2hvd2Vycyc7IC8vc2hvd2VyIGRyaXp6bGVcclxuXHJcbiAgICBpY29uc1snNTAwJ10gPSAnd2kgd2ktc2hvd2Vycyc7IC8vbGlnaHQgcmFpblxyXG4gICAgaWNvbnNbJzUwMSddID0gJ3dpIHdpLXNob3dlcnMnOyAvL21vZGVyYXRlIHJhaW5cclxuICAgIGljb25zWyc1MDInXSA9ICd3aSB3aS1zaG93ZXJzJzsgLy9oZWF2eSBpbnRlbnNpdHkgcmFpblxyXG4gICAgaWNvbnNbJzUwMyddID0gJ3dpIHdpLXNob3dlcnMnOyAvL3ZlcnkgaGVhdnkgcmFpblxyXG4gICAgaWNvbnNbJzUwNCddID0gJ3dpIHdpLXNob3dlcnMnOyAvL2V4dHJlbWUgcmFpblxyXG4gICAgaWNvbnNbJzUxMSddID0gJ3dpIHdpLXNub3cnOyAvL2ZyZWV6aW5nIHJhaW5cclxuICAgIGljb25zWyc1MjAnXSA9ICd3aSB3aS1yYWluJzsgLy9saWdodCBpbnRlbnNpdHkgc2hvd2VyIHJhaW5cclxuICAgIGljb25zWyc1MjEnXSA9ICd3aSB3aS1yYWluJzsgLy9zaG93ZXIgcmFpblxyXG4gICAgaWNvbnNbJzUyMiddID0gJ3dpIHdpLXJhaW4nOyAvL2hlYXZ5IGludGVuc2l0eSBzaG93ZXIgcmFpblxyXG4gICAgaWNvbnNbJzUzMSddID0gJ3dpIHdpLXJhaW4nOyAvL3JhZ2dlZCBzaG93ZXIgcmFpblxyXG5cclxuICAgIGljb25zWyc2MDAnXSA9ICd3aSB3aS1zbm93JzsgLy9saWdodCBzbm93XHJcbiAgICBpY29uc1snNjAxJ10gPSAnd2kgd2ktc25vdyc7IC8vc25vd1xyXG4gICAgaWNvbnNbJzYwMiddID0gJ3dpIHdpLXNub3cnOyAvL2hlYXZ5IHNub3dcclxuICAgIGljb25zWyc2MTEnXSA9ICd3aSB3aS1zbm93JzsgLy9zbGVldFxyXG4gICAgaWNvbnNbJzYxMiddID0gJ3dpIHdpLXNub3cnOyAvL3Nob3dlciBzbGVldFxyXG4gICAgaWNvbnNbJzYxNSddID0gJ3dpIHdpLXNub3cnOyAvL2xpZ2h0IHJhaW4gYW5kIHNub3dcclxuICAgIGljb25zWyc2MTYnXSA9ICd3aSB3aS1zbm93JzsgLy9yYWluIGFuZCBzbm93XHJcbiAgICBpY29uc1snNjIwJ10gPSAnd2kgd2ktc25vdyc7IC8vbGlnaHQgc2hvd2VyIHNub3dcclxuICAgIGljb25zWyc2MjEnXSA9ICd3aSB3aS1zbm93JzsgLy9zaG93ZXIgc25vd1xyXG4gICAgaWNvbnNbJzYyMiddID0gJ3dpIHdpLXNub3cnOyAvL2hlYXZ5IHNob3dlciBzbm93XHJcblxyXG4gICAgaWNvbnNbJzcwMSddID0gJ3dpIHdpLWZvZyc7IC8vbWlzdFxyXG4gICAgaWNvbnNbJzcxMSddID0gJ3dpIHdpLWZvZyc7IC8vc21va2VcclxuICAgIGljb25zWyc3MjEnXSA9ICd3aSB3aS1mb2cnOyAvL2hhemVcclxuICAgIGljb25zWyc3MzEnXSA9ICd3aSB3aS1mb2cnOyAvL3NhbmQsIGR1c3Qgd2hpcmxzXHJcbiAgICBpY29uc1snNzQxJ10gPSAnd2kgd2ktZm9nJzsgLy9mb2dcclxuICAgIGljb25zWyc3NTEnXSA9ICd3aSB3aS1mb2cnOyAvL3NhbmRcclxuICAgIGljb25zWyc3NjEnXSA9ICd3aSB3aS1mb2cnOyAvL2R1c3RcclxuICAgIGljb25zWyc3NjInXSA9ICd3aSB3aS1mb2cnOyAvL3ZvbGNhbmljIGFzaFxyXG4gICAgaWNvbnNbJzc3MSddID0gJ3dpIHdpLWZvZyc7IC8vc3F1YWxsc1xyXG4gICAgaWNvbnNbJzc4MSddID0gJ3dpIHdpLWZvZyc7IC8vdG9ybmFkb1xyXG5cclxuICAgIGljb25zWyc4MDAnXSA9ICd3aSB3aS1kYXktc3VubnknOyAvL2NsZWFyIHNreVxyXG4gICAgaWNvbnNbJzgwMSddID0gJ3dpIHdpLWRheS1jbG91ZHknOyAvL2ZldyBjbG91ZHNcclxuICAgIGljb25zWyc4MDInXSA9ICd3aSB3aS1jbG91ZHknOyAvL3NjYXR0ZXJlZCBjbG91ZHNcclxuICAgIGljb25zWyc4MDMnXSA9ICd3aSB3aS1jbG91ZHknOyAvL2Jyb2tlbiBjbG91ZHNcclxuICAgIGljb25zWyc4MDQnXSA9ICd3aSB3aS1jbG91ZHknOyAvL292ZXJjYXN0IGNsb3Vkc1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBnZXRJY29uIDogZnVuY3Rpb24oa2V5KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBpY29uc1trZXldO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZ2V0TW9jazogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgcmV0dXJuIGljb25zWzIwMF07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gW1wiJGh0dHBcIiwgXCIkcVwiLCBcIiRpbnRlcnZhbFwiLCBcIkNvb2tpZXNTZXJ2aWNlXCIsIFwiJHRpbWVvdXRcIiwgXCJVc2VyRmFjdG9yeVwiLCBcIk9iamVjdEZhY3RvcnlcIiwgZnVuY3Rpb24oJGh0dHAsICRxLCAkaW50ZXJ2YWwsIENvb2tpZXNTZXJ2aWNlLCAkdGltZW91dCwgVXNlckZhY3RvcnksIE9iamVjdEZhY3RvcnkpIHtcclxuICAgIFxyXG5cclxuICAgICAgICB2YXIgTGl2ZU9iamVjdCA9IGZ1bmN0aW9uIChvYmplY3Qsc2VydmljZSkge1xyXG4gICAgICAgICAgICB0aGlzLmlkID0gb2JqZWN0LmlkO1xyXG4gICAgICAgICAgICB0aGlzLk1vZHVsZVZhbHVlID0gb2JqZWN0Lk1vZHVsZVZhbHVlID09IHVuZGVmaW5lZCA/IDAgOiBvYmplY3QuTW9kdWxlVmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMuSEFNb2R1bGVJZCA9IG9iamVjdC5IQU1vZHVsZUlkO1xyXG4gICAgICAgICAgICB0aGlzLk1vZHVsZUl0ZW0gPSBvYmplY3QuTW9kdWxlSXRlbTtcclxuICAgICAgICAgICAgdGhpcy5Nb2R1bGVUeXBlID0gb2JqZWN0Lk1vZHVsZVR5cGU7XHJcbiAgICAgICAgICAgIHRoaXMudHMgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcclxuICAgICAgICAgICAgdGhpcy4kJHNlcnZpY2UgPSBzZXJ2aWNlOyAvLyBsaW5rIHRvIGJhdEJtc1NlcnZpY2VcclxuICAgICAgICB9O1xyXG4gICAgICAgIExpdmVPYmplY3QucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uIChvYmplY3QpIHsgICAgICAgICAgICBcclxuICAgICAgICAgICAgLy8gVXBkYXRlIG9ubHkgaWYgaXQgaXMgYSBuZXdlciB2YWx1ZSAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiAoIChvYmplY3QudHM+dGhpcy50cyB8fCAhdGhpcy50cykgJiYgKHRoaXMuTW9kdWxlVmFsdWUgIT0gb2JqZWN0Lk1vZHVsZVZhbHVlKSApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuTW9kdWxlVmFsdWUgPSBvYmplY3QuTW9kdWxlVmFsdWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRzID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIExpdmVPYmplY3QucHJvdG90eXBlLnNldFZhbHVlID0gZnVuY3Rpb24gKHZhbHVlLCBwYXJhbXMpIHtcclxuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICAgICAgaWYocGFyYW1zID09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgICAgICAgICBwYXJhbXMgPSB7fTtcclxuICAgICAgICAgICAgICAgIHBhcmFtcy5idXR0b24gPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICBwYXJhbXMubW91c2VTdGF0ZSA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLiQkc2VydmljZS5zdG9wKCk7XHJcbiAgICAgICAgICAgIHRoaXMuTW9kdWxlVmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgdGhpcy50cyA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xyXG4gICAgICAgICAgICB0aGlzLiQkc2VydmljZS5zZXRNb2R1bGVzVmFsdWUodGhpcywgcGFyYW1zKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXsgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuJCRzZXJ2aWNlLnN0YXJ0KCk7XHJcbiAgICAgICAgICAgICAgICB9LCAxMDAwKTtcclxuICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUocmVzcG9uc2UpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlOyAgICAgICAgICBcclxuICAgICAgICB9OyAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICAgICAgTGl2ZU9iamVjdC5wcm90b3R5cGUudXBkYXRlT2JqZWN0ID0gZnVuY3Rpb24ob2JqZWN0KXtcclxuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcclxuICAgICAgICAgICAgT2JqZWN0RmFjdG9yeS51cGRhdGUob2JqZWN0KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcclxuICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUobnVsbCk7XHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKHJlc3BvbnNlKXtcclxuICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdChudWxsKTtcclxuICAgICAgICAgICAgfSkgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgQm1zU2VydmljZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdGhpcy5saXZlT2JqZWN0cyA9IFtdO1xyXG4gICAgICAgICAgICB0aGlzLmxpdmVPYmplY3RzSW5kZXggPSB7fTtcclxuICAgICAgICAgICAgdGhpcy5fd2F0Y2hlckhhbmRsZSA9IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMuX2xhc3RUaW1lc3RhbXAgPSBudWxsO1xyXG4gICAgICAgICAgICB0aGlzLnN0YXR1cyA9IG51bGw7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgQm1zU2VydmljZS5wcm90b3R5cGUuZ2V0TGl2ZU9iamVjdCA9IGZ1bmN0aW9uIChvYmplY3QpIHtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5saXZlT2JqZWN0c0luZGV4W29iamVjdC5pZF0pIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5saXZlT2JqZWN0c0luZGV4W29iamVjdC5pZF07XHJcbiAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgb2JqID0gbmV3IExpdmVPYmplY3Qob2JqZWN0LHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2FkZExpdmVPYmplY3Qob2JqKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gb2JqO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxpdmVPYmplY3RzSW5kZXhbb2JqZWN0XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIEJtc1NlcnZpY2UucHJvdG90eXBlLmdldExpdmVMaXN0ID0gZnVuY3Rpb24gKGxpc3QpIHtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICBhbmd1bGFyLmZvckVhY2gobGlzdCwgZnVuY3Rpb24gKG9iamVjdCkge1xyXG4gICAgICAgICAgICAgICAgb2JqZWN0LmxpdmUgPSBzZWxmLmdldExpdmVPYmplY3Qob2JqZWN0KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiBsaXN0O1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIEJtc1NlcnZpY2UucHJvdG90eXBlLmNsZWFyT2JqZWN0cyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdGhpcy5saXZlT2JqZWN0cyA9IFtdO1xyXG4gICAgICAgICAgICB0aGlzLmxpdmVPYmplY3RzSW5kZXggPSB7fTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBCbXNTZXJ2aWNlLnByb3RvdHlwZS5fYWRkTGl2ZU9iamVjdCA9IGZ1bmN0aW9uIChsaXZlT2JqZWN0KSB7XHJcbiAgICAgICAgICAgIHRoaXMubGl2ZU9iamVjdHMucHVzaChsaXZlT2JqZWN0KTtcclxuICAgICAgICAgICAgdGhpcy5saXZlT2JqZWN0c0luZGV4W2xpdmVPYmplY3QuaWRdPWxpdmVPYmplY3Q7XHJcbiAgICAgICAgfTsgICBcclxuICAgICAgICBCbXNTZXJ2aWNlLnByb3RvdHlwZS5zZXRNb2R1bGVzVmFsdWUgPSBmdW5jdGlvbihvYmplY3RCbXMsIHBhcmFtcyl7XHJcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgdmFyIHRzID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XHJcbiAgICAgICAgICAgIGlmKHBhcmFtcyA9PSB1bmRlZmluZWQpe1xyXG4gICAgICAgICAgICAgICAgcGFyYW1zID0ge307XHJcbiAgICAgICAgICAgICAgICB2YXIgYnV0dG9uID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAgICAgdmFyIG1vdXNlU3RhdGUgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgdmFyIGJ1dHRvbiA9IHBhcmFtcy5idXR0b247ICAgICAgIFxyXG4gICAgICAgICAgICAgICAgdmFyIG1vdXNlU3RhdGUgPSBwYXJhbXMubW91c2VTdGF0ZTtcclxuICAgICAgICAgICAgfSAgICAgICAgICAgICBcclxuICAgICAgICAgICAgJGh0dHAuZ2V0KCcvaGVscGVycy9zZXRNb2R1bGVzVmFsdWUvJytvYmplY3RCbXMuaWQrJy8nK29iamVjdEJtcy5Nb2R1bGVWYWx1ZSsnLycrYnV0dG9uKycvJyttb3VzZVN0YXRlKS5zdWNjZXNzKGZ1bmN0aW9uKHJlc3BvbnNlKXtcclxuICAgICAgICAgICAgICAgIGlmKHJlc3BvbnNlLnN0YXR1cyl7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSh0cnVlKTtcclxuICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbihyZXNwb25zZSl7XHJcbiAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKGZhbHNlKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XHJcbiAgICAgICAgfSBcclxuICAgICAgICBCbXNTZXJ2aWNlLnByb3RvdHlwZS5zZXRIZWxwTW9kdWxlVmFsdWUgPSBmdW5jdGlvbihvYmplY3RCbXMsIHBhcmFtcyl7XHJcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XHJcbiAgICAgICAgICAgIGlmKHBhcmFtcyA9PSB1bmRlZmluZWQpe1xyXG4gICAgICAgICAgICAgICAgcGFyYW1zID0ge307XHJcbiAgICAgICAgICAgICAgICB2YXIgYnV0dG9uID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAgICAgdmFyIG1vdXNlU3RhdGUgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgdmFyIGJ1dHRvbiA9IHBhcmFtcy5idXR0b247ICAgICAgIFxyXG4gICAgICAgICAgICAgICAgdmFyIG1vdXNlU3RhdGUgPSBwYXJhbXMubW91c2VTdGF0ZTtcclxuICAgICAgICAgICAgfSAgIFxyXG4gICAgICAgICAgICAkaHR0cC5nZXQoJy9oZWxwZXJzL3NldEhlbHBNb2R1bGVWYWx1ZS8nK29iamVjdEJtcy5IQU1vZHVsZUlkKycvJytvYmplY3RCbXMuTW9kdWxlSXRlbSsnLycrb2JqZWN0Qm1zLk1vZHVsZVR5cGUrJy8nK29iamVjdEJtcy5Nb2R1bGVWYWx1ZSsnLycrYnV0dG9uKycvJyttb3VzZVN0YXRlKS5zdWNjZXNzKGZ1bmN0aW9uKHJlc3BvbnNlKXtcclxuICAgICAgICAgICAgICAgIGlmKHJlc3BvbnNlLnN0YXR1cyl7ICAgXHJcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShudWxsKTtcclxuICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdChudWxsKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24ocmVzcG9uc2Upe1xyXG4gICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShmYWxzZSk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgQm1zU2VydmljZS5wcm90b3R5cGUuZ2V0SGVscE1vZHVsZVZhbHVlID0gZnVuY3Rpb24ob2JqZWN0Qm1zKXtcclxuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcclxuICAgICAgICAgICAgJGh0dHAuZ2V0KCcvaGVscGVycy9nZXRIZWxwTW9kdWxlVmFsdWUvJytvYmplY3RCbXMuSEFNb2R1bGVJZCsnLycrb2JqZWN0Qm1zLk1vZHVsZVR5cGUrJy8nK29iamVjdEJtcy5Nb2R1bGVJdGVtKS5zdWNjZXNzKGZ1bmN0aW9uKHJlc3BvbnNlKXtcclxuICAgICAgICAgICAgICAgIGlmKHJlc3BvbnNlLnN0YXR1cyl7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShyZXNwb25zZS5vYmplY3QpO1xyXG4gICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KG51bGwpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbihyZXNwb25zZSl7XHJcbiAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QobnVsbCk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xyXG4gICAgICAgIH1cclxuXHJcbiBcclxuXHJcbiAgICAgICAgQm1zU2VydmljZS5wcm90b3R5cGUudXBkYXRlTW9kdWxlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7ICAgICAgICAgICBcclxuICAgICAgICAgICAgdmFyIGlkcyA9IE9iamVjdC5rZXlzKHRoaXMubGl2ZU9iamVjdHMpO1xyXG4gICAgICAgICAgICB2YXIgb2JqZWN0c0lkcyA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGlkcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgb2JqZWN0c0lkcy5wdXNoKHRoaXMubGl2ZU9iamVjdHNbaWRzW2ldXS5pZCk7XHJcbiAgICAgICAgICAgIH0gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWRzPW9iamVjdHNJZHMuam9pbignLCcpOyAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZihpZHMubGVuZ3RoID09IDApe1xyXG4gICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShudWxsKTtcclxuICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICB2YXIgdHMgPSBEYXRlLm5vdygpOyAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAkaHR0cC5nZXQoJy9oZWxwZXJzL0dldE1vZHVsZVZhbHVlc0J5VG9rZW4vJytpZHMpLnN1Y2Nlc3MoZnVuY3Rpb24ocmVzcG9uc2Upe1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHJlc3BvbnNlLnN0YXR1cyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgaW4gcmVzcG9uc2Uub2JqZWN0cyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgaXRlbSA9IHJlc3BvbnNlLm9iamVjdHNbaV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLmlkID0gaXRlbS5pZDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgb2JqICA9IHNlbGYuZ2V0TGl2ZU9iamVjdChpdGVtKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0udHMgID0gdHM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmoudXBkYXRlKGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUobnVsbCk7XHJcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbihyZXNwb25zZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShudWxsKTtcclxuICAgICAgICAgICAgICAgIH0pICAgICAgIFxyXG4gICAgICAgICAgICB9ICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlOyAgICAgICAgIFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIEJtc1NlcnZpY2UucHJvdG90eXBlLl93YXRjaGVyRm4gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9wcm9jZXNzUnVubmluZykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgIHZhciBzZWxmPXRoaXM7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9wcm9jZXNzUnVubmluZyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZU1vZHVsZSgpLnRoZW4oZnVuY3Rpb24gKCkgeyAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5fcHJvY2Vzc1J1bm5pbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuXHJcbiAgICAgICAgQm1zU2VydmljZS5wcm90b3R5cGUuc3RhcnQgPSBmdW5jdGlvbigpeyAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiAodGhpcy5fd2F0Y2hlckhhbmRsZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgIHZhciBzZWxmPXRoaXM7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl93YXRjaGVySGFuZGxlID0gJGludGVydmFsKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5fd2F0Y2hlckZuKCk7XHJcbiAgICAgICAgICAgICAgICB9LCAxMDAwKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9ICAgICAgICBcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIEJtc1NlcnZpY2UucHJvdG90eXBlLnN0b3AgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl93YXRjaGVySGFuZGxlKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcmVzPSRpbnRlcnZhbC5jYW5jZWwodGhpcy5fd2F0Y2hlckhhbmRsZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl93YXRjaGVySGFuZGxlID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXM7XHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdmFyIHNlcnZpY2UgPSBuZXcgQm1zU2VydmljZSgpO1xyXG4gICAgICAgIHNlcnZpY2Uuc3RhcnQoKTtcclxuICAgICAgICByZXR1cm4gc2VydmljZTtcclxufV1cclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBbXCIkaHR0cFwiLCBcIlRyYW5zbGF0ZVNlcnZpY2VcIiwgXCJDb29raWVzU2VydmljZVwiLCBmdW5jdGlvbigkaHR0cCwgVHJhbnNsYXRlU2VydmljZSwgQ29va2llc1NlcnZpY2UpIHtcclxuICBcclxuICAgIHZhciBtb2RlbCA9IHtcclxuICAgICAgICBnZXRDb25maWdBbmRHZW5lcmF0ZVJvdXRlcyA6IGZ1bmN0aW9uKCRyb3V0ZVByb3ZpZGVyKXtcclxuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnL2hlbHBlcnMvd29yZHMnKS5zdWNjZXNzKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICBfLmVhY2gocmVzcG9uc2UsIGZ1bmN0aW9uKHYsIGspe1xyXG4gICAgICAgICAgICAgICAgICAgIFRyYW5zbGF0ZVNlcnZpY2Uuc2V0KGssdik7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgdmFyIHR5cGUgPSBDb29raWVzU2VydmljZS5nZXQoJ3R5cGUnKTtcclxuICAgICAgICAgICAgICAgIG1vZGVsLmdlbmVyYXRlUm91dGVzKCRyb3V0ZVByb3ZpZGVyLCB0eXBlKTtcclxuICAgICAgICAgICAgfSk7ICAgICAgICAgICAgICAgICAgICAgICAgXHJcblxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZ2VuZXJhdGVSb3V0ZXM6IGZ1bmN0aW9uKCRyb3V0ZVByb3ZpZGVyLCB0eXBlKSB7XHJcbiAgICAgICAgICAgICRyb3V0ZVByb3ZpZGVyLndoZW4oJy9zdGFydCcsIHtcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9ob21lLmh0bWwnXHJcbiAgICAgICAgICAgICAgICAsY29udHJvbGxlcjogJ2hvbWVDdHJsJ1xyXG4gICAgICAgICAgICAgICAgLHJlc29sdmUgOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGUgOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gQ29va2llc1NlcnZpY2UuZ2V0KCd1c2VyJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vcmV0dXJuIFRyYW5zbGF0ZVNlcnZpY2UuZ2V0KCdob21lJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBvYmplY3RzIDogWydVc2VyRmFjdG9yeScsJ09iamVjdEZhY3RvcnknLCBmdW5jdGlvbihVc2VyRmFjdG9yeSwgT2JqZWN0RmFjdG9yeSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3RGYWN0b3J5LnNlYXJjaCh7dXNlcl9pZDpDb29raWVzU2VydmljZS5nZXQoJ3VzZXJfaWQnKSwgZmF2b3JpdGU6MX0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XSxcclxuICAgICAgICAgICAgICAgICAgICB0eXBlIDogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHR5cGU7XHJcbiAgICAgICAgICAgICAgICAgICAgfSAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICAkcm91dGVQcm92aWRlci53aGVuKCcvdHJlZScsIHtcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy90cmVlLmh0bWwnXHJcbiAgICAgICAgICAgICAgICAsY29udHJvbGxlcjogJ3RyZWVDdHJsJ1xyXG4gICAgICAgICAgICAgICAgLHJlc29sdmUgOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbXMgOiBbJ1VzZXJGYWN0b3J5JywnUm9vbUZhY3RvcnknLCdGbG9vckZhY3RvcnknLCdIb3VzZUZhY3RvcnknLCBmdW5jdGlvbihVc2VyRmFjdG9yeSwgUm9vbUZhY3RvcnksIEZsb29yRmFjdG9yeSwgSG91c2VGYWN0b3J5KXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoKHR5cGUpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnYXAnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBSb29tRmFjdG9yeS5zZWFyY2goe3VzZXJfaWQ6Q29va2llc1NlcnZpY2UuZ2V0KCd1c2VyX2lkJyl9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2hvdXNlJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gRmxvb3JGYWN0b3J5LnNlYXJjaCh7dXNlcl9pZDpDb29raWVzU2VydmljZS5nZXQoJ3VzZXJfaWQnKX0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpeyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdjb21wbGV4JzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gSG91c2VGYWN0b3J5LnNlYXJjaCh7dXNlcl9pZDpDb29raWVzU2VydmljZS5nZXQoJ3VzZXJfaWQnKX0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XSxcclxuICAgICAgICAgICAgICAgICAgICBvYmplY3RzIDogWydPYmplY3RGYWN0b3J5JywgZnVuY3Rpb24oT2JqZWN0RmFjdG9yeSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3RGYWN0b3J5LnNlYXJjaCh7dXNlcl9pZDpDb29raWVzU2VydmljZS5nZXQoJ3VzZXJfaWQnKSwgaG91c2VfaWQ6MCwgZmxvb3JfaWQ6MCwgcm9vbV9pZDowfSkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgfV0sICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICB6b25lIDogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoKHR5cGUpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnYXAnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAncm9vbXMnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdob3VzZSc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICdmbG9vcnMnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdjb21wbGV4JzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ2hvdXNlcyc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZSA6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0eXBlO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGUgOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gVHJhbnNsYXRlU2VydmljZS5nZXQoJ2hvdXNlX3BsYW4nKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9ICAgICAgIFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAkcm91dGVQcm92aWRlci53aGVuKCcvYXAnLCB7XHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvYXAuaHRtbCdcclxuICAgICAgICAgICAgICAgICxjb250cm9sbGVyOiAnYXBDdHJsJ1xyXG4gICAgICAgICAgICAgICAgLHJlc29sdmUgOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0cyA6IFsnT2JqZWN0RmFjdG9yeScsIGZ1bmN0aW9uKE9iamVjdEZhY3Rvcnkpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0RmFjdG9yeS5zZWFyY2goe3VzZXJfaWQ6Q29va2llc1NlcnZpY2UuZ2V0KCd1c2VyX2lkJyl9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICB9XSwgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIHpvbmUgOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2godHlwZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdhcCc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICdyb29tcyc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2hvdXNlJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ2Zsb29ycyc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2NvbXBsZXgnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAnaG91c2VzJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB0aXRsZSA6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBUcmFuc2xhdGVTZXJ2aWNlLmdldCgnaG91c2VfcGxhbicpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZSA6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0eXBlO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgfSAgICAgICBcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgJHJvdXRlUHJvdmlkZXIud2hlbignL2hvdXNlLzpob3VzZUlkJywge1xyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL2hvdXNlLmh0bWwnXHJcbiAgICAgICAgICAgICAgICAsY29udHJvbGxlcjogJ2hvdXNlQ3RybCdcclxuICAgICAgICAgICAgICAgICxyZXNvbHZlIDoge1xyXG4gICAgICAgICAgICAgICAgICAgIG9iamVjdHMgOiBbJyRyb3V0ZScsICdVc2VyRmFjdG9yeScsJ09iamVjdEZhY3RvcnknLCBmdW5jdGlvbigkcm91dGUsIFVzZXJGYWN0b3J5LCBPYmplY3RGYWN0b3J5KXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIE9iamVjdEZhY3Rvcnkuc2VhcmNoKHt1c2VyX2lkOkNvb2tpZXNTZXJ2aWNlLmdldCgndXNlcl9pZCcpLCBob3VzZV9pZDokcm91dGUuY3VycmVudC5wYXJhbXMuaG91c2VJZCwgZmxvb3JfaWQ6MCwgcm9vbV9pZDowfSkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7ICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KSAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIH1dLCAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGZsb29ycyA6IFsnJHJvdXRlJywgJ1VzZXJGYWN0b3J5JywnRmxvb3JGYWN0b3J5JywgIGZ1bmN0aW9uKCRyb3V0ZSwgVXNlckZhY3RvcnksIEZsb29yRmFjdG9yeSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBGbG9vckZhY3Rvcnkuc2VhcmNoKHt1c2VyX2lkOkNvb2tpZXNTZXJ2aWNlLmdldCgndXNlcl9pZCcpLCBob3VzZV9pZDokcm91dGUuY3VycmVudC5wYXJhbXMuaG91c2VJZH0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIH1dLFxyXG4gICAgICAgICAgICAgICAgICAgIGhvdXNlIDogWyckcm91dGUnLCdVc2VyRmFjdG9yeScsJ0hvdXNlRmFjdG9yeScsIGZ1bmN0aW9uKCRyb3V0ZSwgVXNlckZhY3RvcnksIEhvdXNlRmFjdG9yeSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBIb3VzZUZhY3Rvcnkuc2VhcmNoKHt1c2VyX2lkOkNvb2tpZXNTZXJ2aWNlLmdldCgndXNlcl9pZCcpLCBob3VzZV9pZDokcm91dGUuY3VycmVudC5wYXJhbXMuaG91c2VJZH0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIH1dLFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGUgOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHlwZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9ICAgICAgIFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAkcm91dGVQcm92aWRlci53aGVuKCcvZmxvb3IvOmZsb29ySWQnLCB7XHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvZmxvb3IuaHRtbCdcclxuICAgICAgICAgICAgICAgICxjb250cm9sbGVyOiAnZmxvb3JDdHJsJ1xyXG4gICAgICAgICAgICAgICAgLHJlc29sdmUgOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0cyA6IFsnJHJvdXRlJywgJ09iamVjdEZhY3RvcnknLCBmdW5jdGlvbigkcm91dGUsIE9iamVjdEZhY3Rvcnkpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0RmFjdG9yeS5zZWFyY2goe3VzZXJfaWQ6Q29va2llc1NlcnZpY2UuZ2V0KCd1c2VyX2lkJyksIGZsb29yX2lkOiRyb3V0ZS5jdXJyZW50LnBhcmFtcy5mbG9vcklkLCByb29tX2lkOjB9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSkgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgfV0sICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgcm9vbXMgOiBbJyRyb3V0ZScsICdSb29tRmFjdG9yeScsIGZ1bmN0aW9uKCRyb3V0ZSwgUm9vbUZhY3Rvcnkpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gUm9vbUZhY3Rvcnkuc2VhcmNoKHt1c2VyX2lkOkNvb2tpZXNTZXJ2aWNlLmdldCgndXNlcl9pZCcpLGZsb29yX2lkOiRyb3V0ZS5jdXJyZW50LnBhcmFtcy5mbG9vcklkfSkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7ICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIH1dLFxyXG4gICAgICAgICAgICAgICAgICAgIGZsb29yIDogWyckcm91dGUnLCAnRmxvb3JGYWN0b3J5JywgZnVuY3Rpb24oJHJvdXRlLCBGbG9vckZhY3Rvcnkpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gRmxvb3JGYWN0b3J5LnNlYXJjaCh7dXNlcl9pZDpDb29raWVzU2VydmljZS5nZXQoJ3VzZXJfaWQnKSxmbG9vcl9pZDokcm91dGUuY3VycmVudC5wYXJhbXMuZmxvb3JJZH0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIH1dLFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGUgOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHlwZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9ICAgICAgIFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAkcm91dGVQcm92aWRlci53aGVuKCcvcm9vbS86cm9vbUlkLzp0eXBlSWQ/Jywge1xyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL3Jvb20uaHRtbCdcclxuICAgICAgICAgICAgICAgICxjb250cm9sbGVyOiAncm9vbUN0cmwnXHJcbiAgICAgICAgICAgICAgICAscmVzb2x2ZSA6IHtcclxuICAgICAgICAgICAgICAgICAgICBvYmplY3RzIDogWyckcm91dGUnLCAnUm9vbUZhY3RvcnknLCdPYmplY3RGYWN0b3J5JywgZnVuY3Rpb24oJHJvdXRlLCBSb29tRmFjdG9yeSwgT2JqZWN0RmFjdG9yeSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3RGYWN0b3J5LnNlYXJjaCh7dXNlcl9pZDpDb29raWVzU2VydmljZS5nZXQoJ3VzZXJfaWQnKSwgcm9vbV9pZDokcm91dGUuY3VycmVudC5wYXJhbXMucm9vbUlkLCBjYXRlZ29yeTokcm91dGUuY3VycmVudC5wYXJhbXMudHlwZUlkfSkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICB9XSxcclxuICAgICAgICAgICAgICAgICAgICByb29tIDogWyckcm91dGUnLCdVc2VyRmFjdG9yeScsJ1Jvb21GYWN0b3J5JywgZnVuY3Rpb24oJHJvdXRlLCBVc2VyRmFjdG9yeSwgUm9vbUZhY3Rvcnkpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gUm9vbUZhY3Rvcnkuc2VhcmNoKHt1c2VyX2lkOkNvb2tpZXNTZXJ2aWNlLmdldCgndXNlcl9pZCcpLCByb29tX2lkOiRyb3V0ZS5jdXJyZW50LnBhcmFtcy5yb29tSWR9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZVswXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIH1dLCAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZSA6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0eXBlO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZUlkIDogW1wiJHJvdXRlXCIsZnVuY3Rpb24oJHJvdXRlKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRyb3V0ZS5jdXJyZW50LnBhcmFtcy50eXBlSWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfV0gIFxyXG4gICAgICAgICAgICAgICAgfSAgICAgICBcclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgICRyb3V0ZVByb3ZpZGVyLndoZW4oJy9zZXR0aW5ncycsIHtcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9zZXR0aW5ncy5odG1sJ1xyXG4gICAgICAgICAgICAgICAgLGNvbnRyb2xsZXI6ICdzZXR0aW5nc0N0cmwnXHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICAkcm91dGVQcm92aWRlci53aGVuKCcvdHlwZS86Y2F0ZWdvcnkvOmhvdXNlSWQ/LzpmbG9vcklkPy86cm9vbUlkPycsIHtcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAnLi92aWV3cy90eXBlLmh0bWwnO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLGNvbnRyb2xsZXI6ICd0eXBlQ3RybCdcclxuICAgICAgICAgICAgICAgICxyZXNvbHZlIDoge1xyXG4gICAgICAgICAgICAgICAgICAgIG9iamVjdHMgOiBbJyRyb3V0ZScsICdVc2VyRmFjdG9yeScsJ09iamVjdEZhY3RvcnknLCBmdW5jdGlvbigkcm91dGUsIFVzZXJGYWN0b3J5LCBPYmplY3RGYWN0b3J5KXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIE9iamVjdEZhY3Rvcnkuc2VhcmNoKHt1c2VyX2lkOkNvb2tpZXNTZXJ2aWNlLmdldCgndXNlcl9pZCcpLCBjYXRlZ29yeTokcm91dGUuY3VycmVudC5wYXJhbXMuY2F0ZWdvcnksJ2hvdXNlX2lkJzokcm91dGUuY3VycmVudC5wYXJhbXMuaG91c2VJZCxmbG9vcl9pZDokcm91dGUuY3VycmVudC5wYXJhbXMuZmxvb3JJZCxyb29tX2lkOiRyb3V0ZS5jdXJyZW50LnBhcmFtcy5yb29tSWR9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgfV0sXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZSA6IGZ1bmN0aW9uKCl7ICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0eXBlO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZUlkIDogW1wiJHJvdXRlXCIsZnVuY3Rpb24oJHJvdXRlKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRyb3V0ZS5jdXJyZW50LnBhcmFtcy5jYXRlZ29yeTtcclxuICAgICAgICAgICAgICAgICAgICB9XSwgIFxyXG4gICAgICAgICAgICAgICAgICAgIHpvbmVzOiBbXCJoZWxwZXJPYmplY3RTZXJ2aWNlXCIsIGZ1bmN0aW9uKGhlbHBlck9iamVjdFNlcnZpY2Upe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2godHlwZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdhcCc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGhlbHBlck9iamVjdFNlcnZpY2UuZ2V0QXBUcmVlKENvb2tpZXNTZXJ2aWNlLmdldCgndXNlcl9pZCcpKS50aGVuKGZ1bmN0aW9uKGl0ZW1zKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW1zO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pOyAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2hvdXNlJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaGVscGVyT2JqZWN0U2VydmljZS5nZXRIb3VzZVRyZWUoQ29va2llc1NlcnZpY2UuZ2V0KCd1c2VyX2lkJykpLnRoZW4oZnVuY3Rpb24oaXRlbXMpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaXRlbXM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7ICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnY29tcGxleCc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGhlbHBlck9iamVjdFNlcnZpY2UuZ2V0Q29tcGxleFRyZWUoQ29va2llc1NlcnZpY2UuZ2V0KCd1c2VyX2lkJykpLnRoZW4oZnVuY3Rpb24oaXRlbXMpeyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaXRlbXM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfV0sXHJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGUgOiBbXCIkcm91dGVcIiwgZnVuY3Rpb24oJHJvdXRlKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFRyYW5zbGF0ZVNlcnZpY2UuZ2V0KCRyb3V0ZS5jdXJyZW50LnBhcmFtcy5jYXRlZ29yeSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfV0sXHJcbiAgICAgICAgICAgICAgICAgICAgcm91dGVzIDogW1wiJHJvdXRlXCIsIGZ1bmN0aW9uKCRyb3V0ZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByb3V0ZXMgPSB7fTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcm91dGVzLmhvdXNlSWQgPSAkcm91dGUuY3VycmVudC5wYXJhbXMuaG91c2VJZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcm91dGVzLmZsb29ySWQgPSAkcm91dGUuY3VycmVudC5wYXJhbXMuZmxvb3JJZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcm91dGVzLnJvb21JZCA9JHJvdXRlLmN1cnJlbnQucGFyYW1zLnJvb21JZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJvdXRlcztcclxuICAgICAgICAgICAgICAgICAgICB9XVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgJHJvdXRlUHJvdmlkZXIub3RoZXJ3aXNlKHtcclxuICAgICAgICAgICAgICAgIHJlZGlyZWN0VG86ICcvc3RhcnQnXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICByZXR1cm4gbW9kZWw7ICAgIFxyXG59XSIsIid1c2Ugc3RyaWN0JzsgXHJcbm1vZHVsZS5leHBvcnRzID0gW1wiJHFcIiwgXCIkaHR0cFwiLCBcIlJvb21GYWN0b3J5XCIsIFwiRmxvb3JGYWN0b3J5XCIsIFwiSG91c2VGYWN0b3J5XCIsXHJcblx0ZnVuY3Rpb24oJHEsICRodHRwLCBSb29tRmFjdG9yeSwgRmxvb3JGYWN0b3J5LCBIb3VzZUZhY3RvcnkpIHtcclxuXHJcblx0dmFyIGhlbHBlck9iamVjdFNlcnZpY2UgPSBmdW5jdGlvbigpIHtcdFxyXG5cclxuXHR9O1xyXG5cdFxyXG5cclxuXHRoZWxwZXJPYmplY3RTZXJ2aWNlLnByb3RvdHlwZS5yZW9yZGVyID0gZnVuY3Rpb24oaXRlbXMsIHR5cGUpe1xyXG5cdFx0dmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcclxuXHRcdHZhciBpID0gMTtcclxuXHRcdHZhciBpdGVtcyA9IGl0ZW1zLm1hcChmdW5jdGlvbihpdGVtKXtcclxuXHRcdFx0aXRlbS5vcmRlciA9IGk7XHJcblx0XHRcdGkrKztcclxuXHRcdFx0cmV0dXJuIGl0ZW07XHJcblx0XHR9KVxyXG5cdFx0c3dpdGNoKHR5cGUpe1xyXG5cdFx0XHRjYXNlICdjb21wbGV4JzpcclxuXHRcdFx0XHRhbmd1bGFyLmZvckVhY2goaXRlbXMsIGZ1bmN0aW9uKGl0ZW0pe1xyXG5cdFx0XHRcdFx0SG91c2VGYWN0b3J5LnVwZGF0ZShpdGVtKS50aGVuKGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0XHR9LCBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdFx0fSlcclxuXHRcdFx0XHR9KVxyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAnaG91c2UnOlxyXG5cdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChpdGVtcywgZnVuY3Rpb24oaXRlbSl7XHJcblx0XHRcdFx0XHRGbG9vckZhY3RvcnkudXBkYXRlKGl0ZW0pLnRoZW4oZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRcdH0sIGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdH0pXHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlICdhcCc6XHJcblx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKGl0ZW1zLCBmdW5jdGlvbihpdGVtKXtcclxuXHRcdFx0XHRcdFJvb21GYWN0b3J5LnVwZGF0ZShpdGVtKS50aGVuKGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0XHR9LCBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdFx0fSlcclxuXHRcdFx0XHR9KVxyXG5cdFx0XHRicmVhaztcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0cmV0dXJuIGRlZmVycmVkLnByb21pc2U7XHJcblx0fVxyXG5cclxuXHJcblx0aGVscGVyT2JqZWN0U2VydmljZS5wcm90b3R5cGUuZ2V0Q29tcGxleFRyZWUgPSBmdW5jdGlvbih1c2VyX2lkKXtcclxuXHRcdHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XHJcblx0XHR2YXIgaXRlbXMgPSB7fTtcclxuXHRcdEhvdXNlRmFjdG9yeS5zZWFyY2goe3VzZXJfaWQ6dXNlcl9pZH0pLnRoZW4oZnVuY3Rpb24oaG91c2VzKXtcclxuXHRcdFx0aXRlbXMgPSBob3VzZXM7XHJcblx0XHRcdF8uZWFjaChob3VzZXMsIGZ1bmN0aW9uKGhvdXNlKXtcclxuXHRcdFx0XHRGbG9vckZhY3Rvcnkuc2VhcmNoKHt1c2VyX2lkOnVzZXJfaWQsIGhvdXNlX2lkOmhvdXNlLmlkfSkudGhlbihmdW5jdGlvbihmbG9vcnMpe1xyXG5cdFx0XHRcdFx0aG91c2UuZmxvb3JzID0gZmxvb3JzO1xyXG5cdFx0XHRcdFx0Xy5lYWNoKGZsb29ycywgZnVuY3Rpb24oZmxvb3Ipe1xyXG5cdFx0XHRcdFx0XHRSb29tRmFjdG9yeS5zZWFyY2goe3VzZXJfaWQ6dXNlcl9pZCwgZmxvb3JfaWQ6Zmxvb3IuaWR9KS50aGVuKGZ1bmN0aW9uKHJvb21zKXtcclxuXHRcdFx0XHRcdFx0XHRmbG9vci5yb29tcyA9IHJvb21zO1xyXG5cdFx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdFx0fSlcclxuXHRcdFx0XHR9KVxyXG5cdFx0XHR9KVx0XHJcblx0XHRcdGRlZmVycmVkLnJlc29sdmUoaXRlbXMpO1x0XHRcclxuXHRcdH0pXHRcdFxyXG5cdFx0cmV0dXJuIGRlZmVycmVkLnByb21pc2U7XHJcblx0fVxyXG5cdGhlbHBlck9iamVjdFNlcnZpY2UucHJvdG90eXBlLmdldEhvdXNlVHJlZSA9IGZ1bmN0aW9uKHVzZXJfaWQpe1xyXG5cdFx0dmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcclxuXHRcdHZhciBpdGVtcyA9IHt9O1xyXG5cdFx0Rmxvb3JGYWN0b3J5LnNlYXJjaCh7dXNlcl9pZDp1c2VyX2lkfSkudGhlbihmdW5jdGlvbihmbG9vcnMpe1xyXG5cdFx0XHRpdGVtcyA9IGZsb29ycztcclxuXHRcdFx0Xy5lYWNoKGZsb29ycywgZnVuY3Rpb24oZmxvb3Ipe1xyXG5cdFx0XHRcdFJvb21GYWN0b3J5LnNlYXJjaCh7dXNlcl9pZDp1c2VyX2lkLCBmbG9vcl9pZDpmbG9vci5pZH0pLnRoZW4oZnVuY3Rpb24ocm9vbXMpe1xyXG5cdFx0XHRcdFx0Zmxvb3Iucm9vbXMgPSByb29tcztcclxuXHRcdFx0XHR9KVxyXG5cdFx0XHR9KVxyXG5cdFx0XHRkZWZlcnJlZC5yZXNvbHZlKGl0ZW1zKTtcclxuXHRcdH0pXHJcblxyXG5cdFx0cmV0dXJuIGRlZmVycmVkLnByb21pc2U7XHJcblx0fVxyXG5cdGhlbHBlck9iamVjdFNlcnZpY2UucHJvdG90eXBlLmdldEFwVHJlZSA9IGZ1bmN0aW9uKHVzZXJfaWQpe1xyXG5cdFx0dmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcclxuXHRcdHZhciBpdGVtcyA9IHt9O1xyXG5cdFx0Um9vbUZhY3Rvcnkuc2VhcmNoKHt1c2VyX2lkOnVzZXJfaWR9KS50aGVuKGZ1bmN0aW9uKHJvb21zKXtcclxuXHRcdFx0aXRlbXMgPSByb29tcztcclxuXHRcdFx0ZGVmZXJyZWQucmVzb2x2ZShpdGVtcyk7XHRcdFx0XHJcblx0XHR9KVxyXG5cdFx0cmV0dXJuIGRlZmVycmVkLnByb21pc2U7XHJcblx0fVxyXG5cclxuICAgIHJldHVybiBuZXcgaGVscGVyT2JqZWN0U2VydmljZSgpO1xyXG5cclxufV07IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdhcmVuYScpO1xyXG5cclxuXHJcbmFwcC5zZXJ2aWNlKCdBdXRoZW50aWZpY2F0aW9uU2VydmljZScsIHJlcXVpcmUoJy4vQXV0aGVudGlmaWNhdGlvblNlcnZpY2UnKSk7XHJcblxyXG5hcHAuc2VydmljZSgnY29uZmlnU3J2JywgcmVxdWlyZSgnLi9jb25maWdTcnYnKSk7XHJcblxyXG5hcHAuc2VydmljZSgnaGVscGVyT2JqZWN0U2VydmljZScsIHJlcXVpcmUoJy4vaGVscGVyT2JqZWN0U2VydmljZScpKTtcclxuXHJcbmFwcC5zZXJ2aWNlKCdiYXRBcGlTcnYnLCByZXF1aXJlKCcuL2JhdEFwaVNydicpKTtcclxuXHJcblxyXG5cclxuXHJcbmFwcC5zZXJ2aWNlKCdPYmplY3RJY29uU2VydmljZScsIHJlcXVpcmUoJy4vT2JqZWN0SWNvblNlcnZpY2UnKSk7XHJcbmFwcC5zZXJ2aWNlKCdPYmplY3RUZW1wbGF0ZVNlcnZpY2UnLCByZXF1aXJlKCcuL09iamVjdFRlbXBsYXRlU2VydmljZScpKTtcclxuYXBwLnNlcnZpY2UoJ1RyYW5zbGF0ZVNlcnZpY2UnLCByZXF1aXJlKCcuL1RyYW5zbGF0ZVNlcnZpY2UnKSk7XHJcbmFwcC5zZXJ2aWNlKCdXZWF0aGVySWNvblNlcnZpY2UnLCByZXF1aXJlKCcuL1dlYXRoZXJJY29uU2VydmljZScpKTtcclxuYXBwLnNlcnZpY2UoJ0Nvb2tpZXNTZXJ2aWNlJywgcmVxdWlyZSgnLi9Db29raWVzU2VydmljZScpKTtcclxuYXBwLnNlcnZpY2UoJ1RvYXN0U2VydmljZScsIHJlcXVpcmUoJy4vVG9hc3RTZXJ2aWNlJykpO1xyXG4iXX0=
