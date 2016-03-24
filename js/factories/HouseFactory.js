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