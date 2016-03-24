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