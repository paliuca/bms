'use strict';

module.exports = function() {    

    var template = {};
    template.L = [];
    template.CM = [];
    template.RM = [];
    template.H = [];
    template.SC = [];
    template.SE = [];
    
    template.L.push({id:1, name:'light-switch-with-one-button', human:'Light switch with one button'});
    template.L.push({id:2, name:'light-switch-with-two-buttons', human:'Lights switch with 2 buttons'});
    template.L.push({id:3, name:'light-dimming-two-buttons', human:'Dimmer with 2 buttons'});
    template.L.push({id:4, name:'light-dimming-with-slider', human:'Dimmer with slider'});
    template.L.push({id:5, name:'light-dimming-with-or-without-memory', human:'Dimmer with or without memory'});
    
    
    
    template.RM.push({id:1, name:'shutters-one', human:'Shutters with 2 buttons'});


    template.H.push({id:1, name:'heating-one', human:'Heating control with 2 buttons'});

    template.SC.push({id:1, name:'scenario-one', human:'Scenario with one set/reset'});

    template.SE.push({id:1, name:'smoke-detector-circuit', human:'Smoke detector with reset circuit'});
    template.SE.push({id:2, name:'flood-detector', human:'Flood detector'});
    template.SE.push({id:3, name:'door-yale', human:'Door yale'});
    template.SE.push({id:4, name:'magnetic-contactor', human:'Magentic contactors'});

    return {
        getTemplates : function(key) {
            return template[key];
        },
        getTemplate : function(key, id) {
            var key1 = _.findLastIndex(template[key], {id: id});
            return template[key][key1];
        }        
    }
        
}