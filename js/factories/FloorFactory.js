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