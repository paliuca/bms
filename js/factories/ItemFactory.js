'use strict';

module.exports = ['ToastService','$http','RoomFactory','FloorFactory','HouseFactory','ObjectFactory', "$q",
        function(ToastService, $http, RoomFactory, FloorFactory, HouseFactory, ObjectFactory, $q) {  
    return {
        deleteApTree:function(user_id){            
            return ObjectFactory.search({user_id:user_id}).then(function(response){
                return ObjectFactory.deleteAll(response).then(function(response){
                    return RoomFactory.search({user_id:user_id}).then(function(response){
                        return RoomFactory.deleteAll(response).then(function(response){                            
                            return true;
                        })
                    }) 
                })                                
            })
        },
        getApTree : function(user_id){
            return RoomFactory.search({user_id:user_id}).then(function(rooms){
                var ap = {};
                ap.name = "Apartment";
                ap.eachConfig = {
                    group: { name: 'objs',pull: false,put: true},
                    onAdd: function (evt){
                        var object = evt.model;
                        object.room_id = 0;
                        object.floor_id = 0;
                        object.house_id = 0;
                        object.user_id = user_id;
                        ObjectFactory.create(object).then(function(response){
                            object.id = response;
                        }, function(){
                            var key = _.findLastIndex(ap.objects, {id:object.id});
                            ap.objects.splice(key,1);
                        })
                    }
                };
                return ObjectFactory.search({user_id:user_id,room_id:0,floor_id:0,house_id:0}).then(function(response){
                    ap.objects = response;

                    var items = [];
                    _.each(rooms, function(room){
                        room.eachConfig = {
                            group: { name: 'objs', pull: false, put: true},
                            onAdd: function (evt){
                                var object = evt.model;
                                object.user_id = user_id;
                                object.room_id = room.id;
                                object.floor_id = 0;
                                object.house_id = 0;
                                ObjectFactory.create(object).then(function(response){
                                    object.id = response;
                                }, function(){
                                    var key = _.findLastIndex(room.objects, {id:object.id});
                                    room.objects.splice(key,1);
                                })
                            }
                        };
                        ObjectFactory.search({user_id:user_id,room_id:room.id,floor_id:0,house_id:0}).then(function(response){
                            room.objects = response;
                        })                    
                        items.push(room);
                    })
                    ap.rooms = items;
                    return ap;
                })                
            },function(response){
                ToastService.create(response, 'danger');
            });            
        },
        getHouseTree : function(user_id){
            return FloorFactory.search({user_id:user_id}).then(function(floors){                
                var house = {};
                house.name = "House";
                house.eachConfig = {
                    group: { name: 'objs',pull: false,put: true},
                    onAdd: function (evt){
                        var object = evt.model;
                        object.user_id = user_id;                        
                        object.room_id = 0;
                        object.floor_id = 0;
                        object.house_id = 0;
                        ObjectFactory.create(object).then(function(response){
                            object.id = response;
                        }, function(){
                            var key = _.findLastIndex(house.objects, {id:object.id});
                            house.objects.splice(key,1);
                        })
                    }
                };
                ObjectFactory.search({user_id:user_id,room_id:0,floor_id:0,house_id:0}).then(function(response){                    
                    house.objects = response;
                })
                var items = floors;
                _.each(items, function(floor){
                    floor.eachConfig = {
                        group: { name: 'objs',pull: false,put: true},
                        onAdd: function (evt){
                            var object = evt.model;
                            object.user_id = user_id;
                            object.room_id = 0;
                            object.floor_id = floor.id;
                            object.house_id = 0;
                            ObjectFactory.create(object).then(function(response){
                                object.id = response;
                            }, function(){
                                var key = _.findLastIndex(floor.objects, {id:object.id});
                                floor.objects.splice(key,1);
                            })
                        }
                    };
                    ObjectFactory.search({user_id:user_id,room_id:0,floor_id:floor.id,house_id:0}).then(function(response){                        
                        floor.objects = response;
                    })                   
                    floor.rooms = [];
                    RoomFactory.search({user_id:user_id,floor_id:floor.id}).then(function(response){
                        _.each(response, function(room){
                            room.eachConfig = {
                                group: { name: 'objs',pull: false,put: true},
                                onAdd: function (evt){
                                    var object = evt.model;
                                    object.house_id = 0;
                                    object.floor_id = floor.id;
                                    object.room_id = room.id;
                                    object.user_id = user_id;
                                    ObjectFactory.create(object).then(function(response){
                                        object.id = response;
                                    }, function(){
                                        var key = _.findLastIndex(room.objects, {id:object.id});
                                        room.objects.splice(key,1);
                                    })
                                }
                            };
                            ObjectFactory.search({user_id:user_id,room_id:room.id,floor_id:floor.id,house_id:0}).then(function(response){
                                room.objects = response;
                            })
                            floor.rooms.push(room);
                        })
                    }, function(response){
                        ToastService.create(response, 'danger');
                    })
                })
                house.floors = items;
                return house;
            },function(response){
                ToastService.create(response, 'danger');
            })             
        },
        getComplexTree : function(user_id){
            return HouseFactory.search({user_id:user_id}).then(function(response){            
                var complex = {};
                complex.name = "Complex";
                complex.eachConfig = {
                    group: { name: 'objs',pull: false,put: true},
                    onAdd: function (evt){
                        var object = evt.model;
                        object.room_id = 0;
                        object.floor_id = 0;
                        object.house_id = 0;
                        object.user_id = user_id;
                        ObjectFactory.create(object).then(function(response){
                            object.id = response;
                        }, function(){
                            var key = _.findLastIndex(complex.objects, {id:object.id});
                            complex.objects.splice(key,1);
                        })
                    }
                };
                ObjectFactory.search({user_id:user_id,room_id:0,floor_id:0,house_id:0}).then(function(response){
                    complex.objects = response;
                })                                  

                var items = response;
                _.each(items, function(house){
                    house.eachConfig = {
                        group: { name: 'objs',pull: false,put: true},
                        onAdd: function (evt){
                            var object = evt.model;
                            object.house_id = house.id;
                            object.floor_id = 0;
                            object.room_id = 0;
                            object.user_id = user_id;
                            ObjectFactory.create(object).then(function(response){
                                object.id = response;
                            }, function(){
                                var key = _.findLastIndex(house.objects, {id:object.id});
                                house.objects.splice(key,1);
                            })
                        }
                    };
                    ObjectFactory.search({user_id:user_id,room_id:0,floor_id:0,house_id:house.id}).then(function(response){
                        house.objects = response;
                    })
                    FloorFactory.search({user_id:user_id, house_id:house.id}).then(function(response){
                        house.floors = response;
                        _.each(house.floors, function(floor){
                            floor.eachConfig = {
                                group: { name: 'objs',pull: false,put: true},
                                onAdd: function (evt){
                                    var object = evt.model;
                                    object.house_id = house.id;
                                    object.floor_id = floor.id;
                                    object.room_id = 0;
                                    object.user_id = user_id;
                                    ObjectFactory.create(object).then(function(response){
                                        object.id = response;
                                    }, function(){
                                        var key = _.findLastIndex(floor.objects, {id:object.id});
                                        floor.objects.splice(key,1);
                                    })
                                }
                            };
                            ObjectFactory.search({user_id:user_id,room_id:0,floor_id:floor.id,house_id:house.id}).then(function(response){
                                floor.objects = response;
                            })                                                        
                            floor.rooms = [];
                            RoomFactory.search({user_id:user_id, floor_id:floor.id}).then(function(response){
                                _.each(response, function(room){
                                    room.eachConfig = {
                                        group: { name: 'objs',pull: false,put: true},
                                        onAdd: function (evt){
                                            var object = evt.model;
                                            object.house_id = house.id;
                                            object.floor_id = floor.id;
                                            object.room_id = room.id;
                                            object.user_id = user_id;
                                            ObjectFactory.create(object).then(function(response){
                                                object.id = response;
                                            }, function(){
                                                var key = _.findLastIndex(room.objects, {id:object.id});
                                                room.objects.splice(key,1);
                                            })
                                        }
                                    };
                                    ObjectFactory.search({user_id:user_id,room_id:room.id,floor_id:floor.id,house_id:house.id}).then(function(response){
                                        room.objects = response;
                                    })                                  
                                    floor.rooms.push(room);
                                })
                            }, function(response){
                                ToastService.create(response.data, 'danger');  
                            })
                        })
                    },function(response){
                        ToastService.create(response, 'danger');
                    })
                })
                complex.houses = items;
                return complex;
            }, function(response){
                ToastService.create(response.data, 'danger');
            })              
        },
        getTemplate : function(templateid){
            return $http.get('/api/templates/'+templateid).then(function(response){
                return response.data;
            },function(response){                        
                ToastService.create(response.data, 'danger');
            })
        },        
        getTemplates : function(){
            return $http.get('/api/templates').then(function(response){
                return response.data;
            }, function(response){
                ToastService.create(response.data, 'danger');
            })
        }
    }
        
}]