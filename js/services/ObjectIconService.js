'use strict';

module.exports = function() {

    var icons = {};
    icons.L = [];
    icons.RM = [];
    icons.H = [];
    icons.SC = [];
    icons.SE = [];

    icons.houses = [];
    icons.floors = [];
    icons.rooms = [];
    
    icons.L.push({id:1, name:'lights-01', type : 'icon'});
    icons.L.push({id:2, name:'lights-02', type : 'icon'});
    icons.L.push({id:3, name:'lights-03', type : 'icon'});
    icons.L.push({id:4, name:'lights-04', type : 'icon'});
    
    icons.L.push({id:5, name:'lights-05', type : 'icon'});
    icons.L.push({id:6, name:'lights-06', type : 'icon'});
    icons.L.push({id:7, name:'lights-07', type : 'icon'});
    icons.L.push({id:8, name:'lights-08', type : 'icon'});
    icons.L.push({id:9, name:'lights-09', type : 'icon'});
    icons.L.push({id:10, name:'lights-10', type : 'icon'});
    icons.L.push({id:11, name:'lights-11', type : 'icon'});
    icons.L.push({id:12, name:'lights-12', type : 'icon'});
    icons.L.push({id:13, name:'fa fa-battery-half', type : 'progress-bar-horisontal-01'});
    icons.L.push({id:14, name:'fa fa-circle-o-notch', type : 'progress-round-01'});



    icons.RM.push({id:1, name:'fa fa-bars'});

    icons.SC.push({id:1, name:'fa fa-power-off'});
    icons.SC.push({id:2, name:'fa fa-television'});
    icons.SC.push({id:3, name:'fa fa-volume-up'});
    icons.SC.push({id:4, name:'fa fa-volume-off'});
    icons.SC.push({id:5, name:'fa fa-bell'});
    icons.SC.push({id:6, name:'fa fa-bell-slash'});
    icons.SC.push({id:7, name:'fa fa-circle'});
    icons.SC.push({id:8, name:'fa fa-check-circle'});
    icons.SC.push({id:9, name:'fa fa-toggle-on'});
    icons.SC.push({id:10, name:'fa fa-toggle-off'});
    icons.SC.push({id:11, name:'fa fa-bed'});

    icons.SE.push({id:1, name:'fa fa-fire'});
    icons.SE.push({id:2, name:'fa fa-tint'});
    icons.SE.push({id:3, name:'contactors-window-1'});
    icons.SE.push({id:4, name:'contactors-door-1'});


    icons.houses.push({id:1, name:'houses-01', human:'human'});
    icons.houses.push({id:2, name:'houses-02', human:'human'});
    icons.houses.push({id:3, name:'houses-03', human:'human'});
    icons.houses.push({id:4, name:'houses-04', human:'human'});
    

    icons.floors.push({id:1, name:'floors-01', human:'human'});
    icons.floors.push({id:2, name:'floors-02', human:'human'});
    icons.floors.push({id:3, name:'floors-03', human:'human'});
    icons.floors.push({id:4, name:'floors-04', human:'human'});
    icons.floors.push({id:5, name:'floors-05', human:'human'});

    icons.floorsAll = [];
    icons.floorsAll.push({id:1, name:'floors-all-2', human:'For 2 stories building'});
    icons.floorsAll.push({id:2, name:'floors-all-3', human:'For 3 stories building'});
    


    icons.rooms.push({id:1, name:'rooms-01', human:'room'});
    icons.rooms.push({id:2, name:'rooms-02', human:'room'});
    //icons.rooms.push({id:3, name:'rooms-03', human:'room'});
    icons.rooms.push({id:4, name:'rooms-04', human:'room'});
    icons.rooms.push({id:5, name:'rooms-05', human:'room'});
    icons.rooms.push({id:6, name:'rooms-06', human:'room'});
    icons.rooms.push({id:7, name:'rooms-07', human:'room'});
    icons.rooms.push({id:8, name:'rooms-08', human:'room'});
    icons.rooms.push({id:9, name:'rooms-09', human:'room'});
    icons.rooms.push({id:10, name:'rooms-10', human:'room'});
    icons.rooms.push({id:11, name:'rooms-11', human:'room'});
    //icons.rooms.push({id:12, name:'rooms-12', human:'room'});
    
    return {
        getIcons : function(key) {
            return icons[key];
        },
        getIcon : function(key, id) {
            if(key){
                var key1 = _.findLastIndex(icons[key], {id: id});
                return icons[key][key1];                
            }
        }
    }
}