
module.exports = ["$scope", "title", "batApiSrv", "objects","type", function($scope, title, batApiSrv, objects, type) {

   
    $scope.title = title;

    $scope.room   = 'type';

    $scope.type   = type;

    $scope.items = batApiSrv.getLiveList(objects);    

    $scope.$on('$destroy', function () {
        batApiSrv.clearObjects();
    });

}];