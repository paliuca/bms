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