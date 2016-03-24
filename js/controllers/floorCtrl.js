
module.exports = ["$scope", "floor", "rooms", "type", "helperObjectService","batApiSrv","objects",  function($scope, floor, rooms, type, helperObjectService, batApiSrv, objects) {

    $scope.title = floor.name;

    if(floor.house_id){
        $scope.floorObj = floor;        
        $scope.backUrl = '#/house/'+floor.house_id;
    }else{
        $scope.backUrl = '#/tree';
    }
    $scope.zones = rooms;

    $scope.room = 'floor';

    $scope.zone = 'rooms';

    $scope.items = batApiSrv.getLiveList(objects);    

    $scope.$on('$destroy', function () {
        batApiSrv.clearObjects();
    });    

    $scope.treeConfig = {   
        handle: ".my-handle",
        onEnd: function (evt) {
            var items = evt.models;
            helperObjectService.reorder(items, 'ap').then(function(){
            }, function(){
                
            });
        }
    };
}];

