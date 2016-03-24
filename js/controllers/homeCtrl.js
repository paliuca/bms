'use strict';

module.exports = ["$scope", "batApiSrv", "$http", "WeatherIconService", "AuthentificationService", "objects", "type", "title", "CookiesService", 
    function($scope, batApiSrv, $http, WeatherIconService, AuthentificationService, objects, type, title, CookiesService) {

    $scope.hour = null;
    $scope.day = null;    
    $scope.AuthentificationService = AuthentificationService;
    $scope.title = title;
        
    $scope.type   = type;
    $scope.room   = 'home';

    var lang = CookiesService.get('language')?CookiesService.get('language'):'ro';
    var updateTime = function (){
        $scope.day = moment().locale(lang).format('dddd Do MMM YYYY');
        $scope.hour = moment().locale(lang).format('HH : mm');
    }
    
    var updateLater = function () {
        setTimeout(function() {
          updateTime();
          updateLater();
        }, 100);
    }        
    updateLater();
        
    $http.get('/helpers/weather', {}).success(function(response){
        $scope.weather = {};
        $scope.weather.description = response.current.skytext;
        $scope.weather.icon = response.current.imageUrl;
        $scope.weather.temperature = response.current.temperature;
        $scope.weather.humidity = response.current.humidity;        
        $scope.weather.wind = response.current.winddisplay;
    }).error(function(response){
        console.log(response);
    })    

    

    $scope.items = batApiSrv.getLiveList(objects);



    $scope.removeFavorite = function(object){
        var key = _.findLastIndex($scope.items, {
            BMSID: object.BMSID
        });
        $scope.items.splice(key,1);
    }

    $scope.logOut = function(){
        batApiSrv.clearObjects();
        AuthentificationService.logout();
    }


    $scope.$on('$destroy', function () {        
        batApiSrv.clearObjects();
    });
    
}];