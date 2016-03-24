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