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