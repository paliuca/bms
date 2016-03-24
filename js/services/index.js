'use strict';

var app = angular.module('arena');


app.service('AuthentificationService', require('./AuthentificationService'));

app.service('configSrv', require('./configSrv'));

app.service('helperObjectService', require('./helperObjectService'));

app.service('batApiSrv', require('./batApiSrv'));




app.service('ObjectIconService', require('./ObjectIconService'));
app.service('ObjectTemplateService', require('./ObjectTemplateService'));
app.service('TranslateService', require('./TranslateService'));
app.service('WeatherIconService', require('./WeatherIconService'));
app.service('CookiesService', require('./CookiesService'));
app.service('ToastService', require('./ToastService'));
