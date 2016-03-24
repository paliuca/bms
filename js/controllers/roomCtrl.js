
module.exports = ["$scope", "room", "type", "typeId", "batApiSrv", "objects", "$routeParams", function($scope, room, type, typeId, batApiSrv, objects, $routeParams) {

    
    if(room.floor_id){
        $scope.backUrl = '#/floor/'+room.floor_id;
    }else{
        $scope.backUrl = '#/tree';
    }    
    $scope.baseUrl = '#/room/'+room.id; 

    
    
    $scope.title = room.name;
    $scope.type   = type;
    $scope.typeId   = typeId;
    $scope.room   = 'room';
        

    if($routeParams.q){
        $scope.checked = true;
    }else{
        $scope.checked = false;
    }


    $scope.toggle = function(){
        $scope.checked = !$scope.checked
    }
    $scope.items = batApiSrv.getLiveList(objects);    

    $scope.$on('$destroy', function () {
        batApiSrv.clearObjects();
    });
}];