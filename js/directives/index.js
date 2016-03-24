'use strict';
var app = angular.module('arena');

app.directive('zone', require('./zone'));
app.directive('adminObjectItem', require('./admin-object-item'));

app.directive('adminAddObjectItem', require('./admin-add-object-item'));