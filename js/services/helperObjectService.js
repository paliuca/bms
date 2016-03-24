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