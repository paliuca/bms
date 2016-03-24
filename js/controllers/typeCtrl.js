
module.exports = ["$scope", "title", "type", "batApiSrv", "objects","zones","typeId","routes","ObjectIconService","$routeParams", 

function($scope, title, type, batApiSrv, objects, zones, typeId, routes, ObjectIconService, $routeParams) {

	$scope.title = title;

    $scope.type   = type;
    $scope.room   = 'type';

    $scope.ObjectIconService = ObjectIconService;

    $scope.items = batApiSrv.getLiveList(objects);
    $scope.zones = zones;
    $scope.routes = routes;


    $scope.baseUrl = '#/type/'+typeId;
    if($routeParams.q){
        $scope.checked = true;
    }else{
        $scope.checked = false;
    }

    $scope.toggle = function(){
        $scope.checked = !$scope.checked;
    }

    $scope.$on('$destroy', function () {        
        batApiSrv.clearObjects();
    });   

     console.log();
}];
