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