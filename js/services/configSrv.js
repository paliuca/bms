'use strict';

module.exports = ["$http", "TranslateService", "CookiesService", function($http, TranslateService, CookiesService) {
  
    var model = {
        getConfigAndGenerateRoutes : function($routeProvider){
            return $http.get('/helpers/words').success(function(response) {
                _.each(response, function(v, k){
                    TranslateService.set(k,v);
                })
                var type = CookiesService.get('type');
                model.generateRoutes($routeProvider, type);
            });                        

        },
        generateRoutes: function($routeProvider, type) {
            $routeProvider.when('/start', {
                templateUrl: './views/home.html'
                ,controller: 'homeCtrl'
                ,resolve : {
                    title : function(){
                        return CookiesService.get('user');
                        //return TranslateService.get('home');
                    },
                    objects : ['UserFactory','ObjectFactory', function(UserFactory, ObjectFactory){
                        return ObjectFactory.search({user_id:CookiesService.get('user_id'), favorite:1}).then(function(response){
                            return response;
                        });
                    }],
                    type : function(){
                        return type;
                    }              
                }
            })

            $routeProvider.when('/tree', {
                templateUrl: './views/tree.html'
                ,controller: 'treeCtrl'
                ,resolve : {
                    items : ['UserFactory','RoomFactory','FloorFactory','HouseFactory', function(UserFactory, RoomFactory, FloorFactory, HouseFactory){
                        switch(type){
                            case 'ap':
                                return RoomFactory.search({user_id:CookiesService.get('user_id')}).then(function(response){
                                    return response;
                                })
                            break;
                            case 'house':
                                return FloorFactory.search({user_id:CookiesService.get('user_id')}).then(function(response){                                
                                    return response;
                                })
                            break;
                            case 'complex':
                                return HouseFactory.search({user_id:CookiesService.get('user_id')}).then(function(response){
                                    return response;                                    
                                })                                
                            break;
                        }
                    }],
                    objects : ['ObjectFactory', function(ObjectFactory){
                        return ObjectFactory.search({user_id:CookiesService.get('user_id'), house_id:0, floor_id:0, room_id:0}).then(function(response){
                            return response;
                        })
                    }],                    
                    zone : function(){
                        switch(type){
                            case 'ap':
                                return 'rooms';
                            break;
                            case 'house':
                                return 'floors';
                            break;
                            case 'complex':
                                return 'houses';
                            break;
                        }
                    },
                    type : function(){
                        return type;
                    },
                    title : function(){
                        return TranslateService.get('house_plan');
                    }
                }       
            })
            $routeProvider.when('/ap', {
                templateUrl: './views/ap.html'
                ,controller: 'apCtrl'
                ,resolve : {
                    objects : ['ObjectFactory', function(ObjectFactory){
                        return ObjectFactory.search({user_id:CookiesService.get('user_id')}).then(function(response){
                            return response;
                        })
                    }],                    
                    zone : function(){
                        switch(type){
                            case 'ap':
                                return 'rooms';
                            break;
                            case 'house':
                                return 'floors';
                            break;
                            case 'complex':
                                return 'houses';
                            break;
                        }
                    },
                    title : function(){
                        return TranslateService.get('house_plan');
                    },
                    type : function(){
                        return type;
                    }                    
                }       
            })
            $routeProvider.when('/house/:houseId', {
                templateUrl: './views/house.html'
                ,controller: 'houseCtrl'
                ,resolve : {
                    objects : ['$route', 'UserFactory','ObjectFactory', function($route, UserFactory, ObjectFactory){
                        return ObjectFactory.search({user_id:CookiesService.get('user_id'), house_id:$route.current.params.houseId, floor_id:0, room_id:0}).then(function(response){
                            return response;                            
                        })                        
                    }],                     
                    floors : ['$route', 'UserFactory','FloorFactory',  function($route, UserFactory, FloorFactory){
                        return FloorFactory.search({user_id:CookiesService.get('user_id'), house_id:$route.current.params.houseId}).then(function(response){
                            return response;
                        })
                    }],
                    house : ['$route','UserFactory','HouseFactory', function($route, UserFactory, HouseFactory){
                        return HouseFactory.search({user_id:CookiesService.get('user_id'), house_id:$route.current.params.houseId}).then(function(response){
                            return response[0];
                        })
                    }],
                    type : function(){
                        return type;
                    }
                }       
            })
            $routeProvider.when('/floor/:floorId', {
                templateUrl: './views/floor.html'
                ,controller: 'floorCtrl'
                ,resolve : {
                    objects : ['$route', 'ObjectFactory', function($route, ObjectFactory){
                        return ObjectFactory.search({user_id:CookiesService.get('user_id'), floor_id:$route.current.params.floorId, room_id:0}).then(function(response){
                            return response;
                        })                            
                    }],                     
                    rooms : ['$route', 'RoomFactory', function($route, RoomFactory){
                        return RoomFactory.search({user_id:CookiesService.get('user_id'),floor_id:$route.current.params.floorId}).then(function(response){                        
                            return response;
                        })                            
                    }],
                    floor : ['$route', 'FloorFactory', function($route, FloorFactory){
                        return FloorFactory.search({user_id:CookiesService.get('user_id'),floor_id:$route.current.params.floorId}).then(function(response){
                            return response[0];
                        })
                    }],
                    type : function(){
                        return type;
                    }
                }       
            })
            $routeProvider.when('/room/:roomId/:typeId?', {
                templateUrl: './views/room.html'
                ,controller: 'roomCtrl'
                ,resolve : {
                    objects : ['$route', 'RoomFactory','ObjectFactory', function($route, RoomFactory, ObjectFactory){
                        return ObjectFactory.search({user_id:CookiesService.get('user_id'), room_id:$route.current.params.roomId, category:$route.current.params.typeId}).then(function(response){
                            return response;
                            
                        })
                    }],
                    room : ['$route','UserFactory','RoomFactory', function($route, UserFactory, RoomFactory){
                        return RoomFactory.search({user_id:CookiesService.get('user_id'), room_id:$route.current.params.roomId}).then(function(response){
                            return response[0];
                            
                        })
                    }],                    
                    type : function(){
                        return type;
                    },
                    typeId : ["$route",function($route){
                        return $route.current.params.typeId;
                    }]  
                }       
            })

            $routeProvider.when('/settings', {
                templateUrl: './views/settings.html'
                ,controller: 'settingsCtrl'
            })

            $routeProvider.when('/type/:category/:houseId?/:floorId?/:roomId?', {
                templateUrl: function(){
                    return './views/type.html';
                }
                ,controller: 'typeCtrl'
                ,resolve : {
                    objects : ['$route', 'UserFactory','ObjectFactory', function($route, UserFactory, ObjectFactory){
                        return ObjectFactory.search({user_id:CookiesService.get('user_id'), category:$route.current.params.category,'house_id':$route.current.params.houseId,floor_id:$route.current.params.floorId,room_id:$route.current.params.roomId}).then(function(response){
                            return response;                            
                        })
                    }],
                    type : function(){                        
                        return type;
                    },
                    typeId : ["$route",function($route){
                        return $route.current.params.category;
                    }],  
                    zones: ["helperObjectService", function(helperObjectService){
                        switch(type){
                            case 'ap':
                                return helperObjectService.getApTree(CookiesService.get('user_id')).then(function(items){
                                    return items;
                                });  
                            break;
                            case 'house':
                                return helperObjectService.getHouseTree(CookiesService.get('user_id')).then(function(items){
                                    return items;
                                });  
                            break;
                            case 'complex':
                                return helperObjectService.getComplexTree(CookiesService.get('user_id')).then(function(items){                                    
                                    return items;
                                });                                
                            break;
                        }
                    }],
                    title : ["$route", function($route){
                        return TranslateService.get($route.current.params.category);
                    }],
                    routes : ["$route", function($route){
                        var routes = {};
                        routes.houseId = $route.current.params.houseId;
                        routes.floorId = $route.current.params.floorId;
                        routes.roomId =$route.current.params.roomId;
                        return routes;
                    }]
                }
            })

            $routeProvider.otherwise({
                redirectTo: '/start'
            });
        }
    };
    return model;    
}]