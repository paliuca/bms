'use strict';
var app = angular.module('arena');




app.factory('UserFactory', require('./UserFactory'));
app.factory('ObjectFactory', require('./ObjectFactory'));
app.factory('RoomFactory', require('./RoomFactory'));
app.factory('FloorFactory', require('./FloorFactory'));
app.factory('HouseFactory', require('./HouseFactory'));


app.factory('ItemFactory', require('./ItemFactory'));



