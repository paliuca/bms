'use strict';
var app = angular.module('arena');


app.controller('loginCtrl', require('./loginCtrl'));

app.controller('homeCtrl', require('./homeCtrl'));

app.controller('floorCtrl', require('./floorCtrl'));

app.controller('roomCtrl', require('./roomCtrl'));

app.controller('houseCtrl', require('./houseCtrl'));


app.controller('treeCtrl', require('./treeCtrl'));


app.controller('settingsCtrl', require('./settingsCtrl'));
app.controller('wizzardCtrl', require('./wizzardCtrl'));


app.controller('typeCtrl', require('./typeCtrl'));
app.controller('apCtrl', require('./apCtrl'));

app.controller('sessionsCtrl', require('./sessionsCtrl'));


app.controller('usersCtrl', require('./wizzard/usersCtrl'));
app.controller('objectsToRoomsCtrl', require('./wizzard/objectsToRoomsCtrl'));
app.controller('roomsToHouseCtrl', require('./wizzard/roomsToHouseCtrl'));
app.controller('objectsControllsCtrl', require('./wizzard/objectsControllsCtrl'));
app.controller('templatesCtrl', require('./wizzard/templatesCtrl'));
app.controller('objectsToTemplateCtrl', require('./wizzard/objectsToTemplateCtrl'));


