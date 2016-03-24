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