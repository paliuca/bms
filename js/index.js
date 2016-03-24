'use strict';

var app = angular.module('arena', ['ngRoute','ngResource', 'ngCookies', 'ngSanitize', 'ngAnimate', 'ngTouch', 'ng-sortable', 'ngToast', 'ui.bootstrap', 'angular-svg-round-progress', 'rzModule', 'hmTouchEvents']);

require('./controllers');
require('./directives');
require('./services');
require('./factories');

app.config(['$routeProvider','ngToastProvider',
    function($routeProvider, ngToast) {
        $routeProvider.when('/', {
            templateUrl: './views/login.html'
            ,controller: 'loginCtrl'
        })
        $routeProvider.when('/sessions', {
            templateUrl: './views/sessions.html'
            ,controller: 'sessionsCtrl'
        })
        $routeProvider.when('/wizzard/users', {
            templateUrl: './views/wizzard/users.html'
            ,controller: 'usersCtrl'
            ,resolve : {
                users : ['UserFactory', function(UserFactory){
                    return UserFactory.all().then(function(response){
                        return response;
                    }, function(){

                    });
                }],
            }
        })
        $routeProvider.when('/wizzard/rooms-to-house/:userid/:type', { 
            templateUrl: './views/wizzard/rooms-to-house.html'
            ,controller: 'roomsToHouseCtrl'
            ,resolve : {   
                user : ['$route', 'UserFactory', function($route, UserFactory){
                    return UserFactory.find($route.current.params.userid).then(function(response){
                        return response;
                    });
                }],
                items : ['$route', "ItemFactory", function($route, ItemFactory){
                    switch($route.current.params.type){
                        case 'ap':
                            return ItemFactory.getApTree($route.current.params.userid).then(function(response){
                                return response;
                            });   
                        break;
                        case 'house':
                            return ItemFactory.getHouseTree($route.current.params.userid).then(function(response){
                                return response;
                            });
                        break;
                        case 'complex':
                            return ItemFactory.getComplexTree($route.current.params.userid).then(function(response){                                    
                                return response;
                            });
                        break;
                        }                  
                }] 
            }            
        })        
       /* $routeProvider.when('/wizzard/templates', {
            templateUrl: './views/wizzard/templates.html'
            ,controller: 'templatesCtrl'
            ,resolve : {
                templates : ['ItemFactory', function(ItemFactory){
                    return ItemFactory.getTemplates().then(function(response){
                        return response;
                    });                                       
                }],
            }
        })
        $routeProvider.when('/wizzard/objects-to-template/:tempalteid', {
            templateUrl: './views/wizzard/objects-to-template.html'
            ,controller: 'objectsToTemplateCtrl'
            ,resolve : {
                template : ['ItemFactory','$route', function(ItemFactory, $route){
                    return ItemFactory.getTemplate($route.current.params.tempalteid).then(function(response){
                        return response;
                    });                                       
                }],
            }
        })*/
        $routeProvider.when('/wizzard/objects-to-rooms/:userid/:type', {
            templateUrl: './views/wizzard/objects-to-rooms.html'
            ,controller: 'objectsToRoomsCtrl'
            ,resolve : {   
                user : ['$route', 'UserFactory', function($route, UserFactory){
                    return UserFactory.find($route.current.params.userid).then(function(response){
                        return response;
                    });
                }],
                objects : ["$http","ObjectFactory", function($http, ObjectFactory){
                    return ObjectFactory.getByToken().then(function(response){
                        return response;
                    })                    
                }],
                items : ['$route','ItemFactory', function($route, ItemFactory){
                        switch($route.current.params.type){
                            case 'ap':
                                return ItemFactory.getApTree($route.current.params.userid).then(function(response){
                                    return response;
                                });                         
                            break;
                            case 'house':
                                return ItemFactory.getHouseTree($route.current.params.userid).then(function(response){
                                    return response;
                                });                            
                            break;
                            case 'complex':
                                return ItemFactory.getComplexTree($route.current.params.userid).then(function(response){
                                    return response;
                                });                           
                            break;
                        }                  
                }]                
            }            
        })
        $routeProvider.when('/wizzard/objects-controlls/:userid/:type', {
            templateUrl: './views/wizzard/objects-controlls.html'
            ,controller: 'objectsControllsCtrl'
            ,resolve : {   
                user : ['$route', 'UserFactory', function($route, UserFactory){
                    return UserFactory.find($route.current.params.userid).then(function(response){
                        return response;
                    });
                }],
                items : ['$route', "ItemFactory", function($route, ItemFactory){
                        switch($route.current.params.type){
                            case 'ap':                                
                                return ItemFactory.getApTree($route.current.params.userid).then(function(response){
                                    return response;
                                });   
                            break;
                            case 'house':
                                return ItemFactory.getHouseTree($route.current.params.userid).then(function(response){
                                    return response;
                                });                            
                            break;
                            case 'complex':
                                return ItemFactory.getComplexTree($route.current.params.userid).then(function(response){                                    
                                    return response;
                                });                           
                            break;
                        }                  
                }] 
            }             
        })


        $routeProvider.when('/wizzard/objects', {
            templateUrl: './views/wizzard/objects.html'
            ,controller: 'objectsCtrl'
        })
        $routeProvider.
            otherwise({
                resolve: {
                    config: ['configSrv','$route','$location',function (configSrv, $route, $location) {
                        configSrv.getConfigAndGenerateRoutes($routeProvider).then(function(data) {
                                $route.reload();
                            }, function (data) {
                                // if we cannot load config, go to login page
                                $location.path('/');
                            });;
                    }]
                }
            });           
        ngToast.configure({
            verticalPosition: 'top',
            horizontalPosition: 'center',
            animation: 'fade',
            maxNumber: 1
        });      

    }
]); 

app.run(['$rootScope', '$location', 'AuthentificationService', 'TranslateService', '$http', '$window',
    function($rootScope, $location, AuthentificationService, TranslateService, $http, $window)
    {        

        
        var routesThatNotRequireAuth = ['/'];
        $rootScope.$on('$routeChangeStart', function(event, next, current){
            
            if($location.$$path == '/' && AuthentificationService.isAdmin()){
                $location.path('/wizzard/users');
            }

            if($location.$$path == '/' && AuthentificationService.isLoggedIn()){
                $location.path('/start');
            }
            
            if(!AuthentificationService.isLoggedIn()){
                $location.path('/');
            }

        })
    }
]);

(function (angular, window, $) {
    var regType = function(name, controllerFn){
        app.directive($.camelCase('bat-object-'+name), ["$window", "$rootScope", "ObjectIconService", 
            function($window, $rootScope, ObjectIconService){
            return {
                restrict: 'E',
                scope: {
                    item: '=',
                    room: '@',
                    type: '@',
                    items: '=',
                    setfavorite:'='
                },
                template: '<div ng-include="templateUrl"></div>',
                controller: controllerFn,
                link: function($scope){                     
                    $scope.templateUrl = './objects/templates/'+$scope.item.category+'/'+name+'.html';

                    $scope.ObjectIconService = ObjectIconService;

                    $scope.removeFavorite = function(object){
                        var key = _.findLastIndex($scope.items, {
                            $$hashKey: object.$$hashKey
                        });
                        $scope.items.splice(key,1);
                    }

                    $scope.setFavorite = function(value){
                        $scope.item.favorite = value;
                        $scope.item.live.updateObject($scope.item).then(function(response){

                        },function(){
                            $scope.item.favorite = !$scope.item.favorite;
                        })
                               
                    }

                
                    $scope.editorNameEnabled = false;
                    $scope.editorIconEnabled = false;

                    $scope.enableNameEditor = function() {
                        $scope.editableText = $scope.item.name;
                        $scope.editorNameEnabled = true;
                    };

                    $scope.enableIconEditor = function() {
                        $scope.item.live.$$service.stop();
                        $scope.iconsArray = ObjectIconService.getIcons($scope.item.category);
                        if($scope.item.icon_id){
                            var key = _.findLastIndex($scope.iconsArray, {id: $scope.item.icon_id});
                            $scope.selectedIcon = $scope.iconsArray[key];                            
                        }

                        $scope.editorIconEnabled=true;
                    };

                    $scope.disableEditor = function() {
                        $scope.editorNameEnabled = false;
                        $scope.editorIconEnabled = false;
                        $scope.item.live.$$service.start();
                    };

                    $scope.saveIcon = function(form){
                        if(form.$valid){                            
                            $scope.item.icon_id = form.selectedIcon.$modelValue.id;
                            $scope.item.live.updateObject($scope.item).then(function(response){
                                $scope.disableEditor();
                            },function(){
                                $scope.disableEditor();
                            })
                        }
                    }
                    $scope.saveName = function(form) {                                       
                        if(form.$valid){
                            $scope.item.name = form.editableText.$modelValue;                          
                            $scope.item.live.updateObject($scope.item).then(function(response){
                                $scope.disableEditor();
                            })                            
                        }                        
                    };
                  
                }
            }
        }])

    };

    app.directive('batObject',['$compile','ObjectTemplateService',function($compile, ObjectTemplateService){
        return {
            restrict: 'E',
            scope: {
                item: '=',
                room: '@',
                type: '@',
                items: '=',
                setfavorite:'='
            },
            link: function(scope,el,attrs){
                if(scope.item.category && scope.item.template_id){
                    var type = ObjectTemplateService.getTemplate(scope.item.category, scope.item.template_id);
                    var type=type.name?type.name:null;                  
                    var tag = 'bat-object-'+type;
                    var room = scope.room;
                    var html='<'+tag+' item="item" items="items" room="{{room}}" type="{{type}}" setfavorite="setfavorite"></'+tag+'>';
                    el.html(html);
                    $compile(el.contents())(scope);                    
                }
            }
        };
    }]);


    regType('light-switch-with-one-button', ['$scope', function ($scope) {
        $scope.onChange = function(){            
            $scope.item.live.setValue(parseInt($scope.item.live.ModuleValue));
        }        
    }]);

    regType('light-switch-with-two-buttons', ['$scope', function ($scope) {
        $scope.onChange = function(value){
            $scope.item.live.setValue(value);
        }
    }]);

    regType('light-dimming-two-buttons', ['$scope', function ($scope) {
        $scope.onChange = function(direction){
            var value = parseInt($scope.item.live.ModuleValue);
            if(direction == 'up'){
                value += $scope.item.ratio?$scope.item.ratio:10;
            }else{
                value -= $scope.item.ratio?$scope.item.ratio:10;
            }
            value = (value > 100) ? 100 : ((value < 0) ? 0 : value);            
            $scope.item.live.setValue(value);
        }
    }]);

    regType('light-dimming-with-slider', ['$scope','$timeout','$interval', function ($scope, $timeout, $interval) {
        $scope.slider = {
            value: 0,
            options: {
                floor: 0,
                ceil: 100,
                onEnd: function () {
                    $scope.item.live.setValue($scope.slider.value);
                }
            }
        };
        $scope.$watch(function(){return $scope.item.live.ModuleValue;}, function(value) {
            $scope.slider.value = value;
        });        
    }]);

    regType('light-dimming-with-or-without-memory', ['$scope','batApiSrv', function ($scope, batApiSrv) {

            var inputObject = {};
            var input;
            if($scope.item.dimming_input){
                input = $scope.item.dimming_input.replace(/[0-9]/g, '');                
            }

            inputObject.HAModuleId = $scope.item.HAModuleId;
            inputObject.ModuleItem = $scope.item.dimming_input;
            inputObject.ModuleType = input;
            inputObject.ModuleValue = "1";            
            var params = {};
            params.button = 'Left';

        $scope.onPress = function(){
            params.mouseState = 'Down';
            batApiSrv.setHelpModuleValue(inputObject, params);
            //console.log("press");
        }
        $scope.onPressUp = function(){
            params.mouseState = 'Up';
            batApiSrv.setHelpModuleValue(inputObject, params);
            //console.log("release");
        }

        $scope.onTap = function(){
            params.mouseState = 'Down';
            batApiSrv.setHelpModuleValue(inputObject, params).then(function(){
                params.mouseState = 'Up';
                batApiSrv.setHelpModuleValue(inputObject, params);
            }); 
            //console.log("tap");
        }
        $scope.slider = {
            value: 0,
            options: {
                floor: 0,
                ceil: 100,
                onEnd: function () {
                    $scope.item.live.setValue($scope.slider.value);
                }
            }
        };
        $scope.$watch(function(){return $scope.item.live.ModuleValue;}, function(value) {
            $scope.slider.value = value;
        });          
    }]);



    regType('scenario-one', ['$scope','$timeout', function ($scope, $timeout) {
        $scope.onChange = function(){
            var params = {};
            $scope.loading = false;
            params.button = 'Left';
            params.mouseState = 'Down';
            $scope.item.live.setValue(1, params).then(function(){
                $scope.loading = true;
                $timeout(function(){
                    params.mouseState = 'Up';
                    $scope.item.live.setValue(1, params).then(function(){
                        $scope.loading = false;
                    })
                }, 2000)
            });         
        }
    }]);


    regType('heating-one', ['$scope', 'batApiSrv', function ($scope, batApiSrv) {
        var setObject = {};
        setObject.HAModuleId = $scope.item.HAModuleId;
        setObject.ModuleType = $scope.item.ModuleType;
        setObject.ModuleItem = "Instruction";

        batApiSrv.getHelpModuleValue(setObject).then(function(response){
            if(response.ModuleValue == undefined){
               $scope.item.setpoint = 20;
            }else{
                $scope.item.setpoint = parseFloat(response.ModuleValue);
            }
        })

        $scope.onChange = function(direction){
            var initialValue = $scope.item.setpoint;
            var changedValue = initialValue;
            changedValue = parseFloat(changedValue).toFixed(1); 
            if(direction == 'up'){
                if(initialValue < 35){
                    changedValue = Number(changedValue) + Number(0.2);
                }
            }else{
                if(initialValue > 15){
                    changedValue = Number(changedValue) - Number(0.2);
                }
            }          
            changedValue = parseFloat(changedValue).toFixed(1);              
            
            setObject.ModuleValue = changedValue;            
            batApiSrv.setHelpModuleValue(setObject, {}).then(function(response){                
                $scope.item.setpoint = changedValue;
            }, function(){
                $scope.item.setpoint = initialValue;
            })
        }        
    }]);


    regType('shutters-one', ['$scope','$timeout','batApiSrv', function ($scope, $timeout, batApiSrv) {
        $scope.goingDown = false;
        $scope.goingUp = false;
        var timeout;  
        var time = $scope.item.shutter_seconds?$scope.item.shutter_seconds:10;

        $scope.up = function(){
            var params = {};
            params.button = 'Left';
            params.mouseState = 'Down';                
            $scope.item.live.setValue('1', params).then(function(response){
                params.button = 'Left';
                params.mouseState = 'Up';
                $scope.item.live.setValue('1', params).then(function(response){
                    timeout = $timeout(function(){
                        $scope.goingUp = false;
                        $scope.goingDown = false;
                    }, time*1000)
                })                     
            })
        }
        $scope.down = function(){
            var params = {};
            params.button = 'Left';
            params.mouseState = 'Down';
            var downObject = {};
            downObject.HAModuleId = $scope.item.HAModuleId;
            downObject.ModuleItem = $scope.item.shutter_input;
            downObject.ModuleType = $scope.item.ModuleType;
            downObject.ModuleValue = "1";
            batApiSrv.setHelpModuleValue(downObject, params).then(function(response){
                params.button = 'Left';
                params.mouseState = 'Up';                    
                batApiSrv.setHelpModuleValue(downObject, params).then(function(response){
                    timeout = $timeout(function(){
                        $scope.goingUp = false;
                        $scope.goingDown = false;
                    }, time*1000)
                })                    
            })            
        }
        $scope.onStop = function(direction){
            $timeout.cancel( timeout );
            $scope.goingUp = false;
            $scope.goingDown = false; 
            if(direction == 'up'){
                $scope.up();
            }else{
                $scope.down();
            }
        }
        $scope.onMove = function(direction){
            $timeout.cancel( timeout );
            switch(direction) {
                case 'up':
                    $scope.goingUp = true;
                    $scope.goingDown = false;                    
                break;
                case 'down':
                    $scope.goingDown = true;
                    $scope.goingUp = false;                    
                break;
                default:
                    $scope.goingUp = false;
                    $scope.goingDown = false;
            }
            if(direction == 'up'){            
                $scope.up();
            }else{
                $scope.down();
            }
        }
    }])

    regType('magnetic-contactor', ['$scope', function ($scope) {
    }]);

    regType('flood-detector', ['$scope', function ($scope) {
    }]);

    regType('door-yale', ['$scope','$timeout', function ($scope, $timeout) {
        $scope.loading = false;
        $scope.onChange = function(){
            $scope.loading = true;
            $scope.item.live.setValue(100).then(function(){
                $timeout(function(){
                    $scope.item.live.setValue(0).then(function(){
                        $scope.loading = false;
                    })
                }, 2000)
            }); 
        }
    }]);

    regType('smoke-detector-circuit', ['$scope','batApiSrv','$timeout', function ($scope, batApiSrv, $timeout) {
        var resetObject = {};
        var output;
        $scope.loading = false;
        if($scope.item.detector_output){
            output = $scope.item.detector_output.replace(/[0-9]/g, '');            
        }
        resetObject.HAModuleId = $scope.item.HAModuleId;
        resetObject.ModuleItem = $scope.item.detector_output;
        resetObject.ModuleType = output;
        $scope.onChange = function(){
            $scope.loading = true;        
            resetObject.ModuleValue = 0;
            batApiSrv.setHelpModuleValue(resetObject).then(function(response){
                resetObject.ModuleValue = 100;
                $timeout(function(){
                    batApiSrv.setHelpModuleValue(resetObject).then(function(response){
                        $scope.loading = false;
                    })                    
                }, 1000)
            })
        }
    }]);
})(angular, window, $);
