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
