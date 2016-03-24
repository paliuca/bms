
module.exports = ["$scope", "house", "floors", "type", "helperObjectService","objects","batApiSrv", function($scope, house, floors, type, helperObjectService, objects, batApiSrv) {

    $scope.title = house.name;
    
    $scope.backUrl = '#/tree';
    
    $scope.zones = floors;

    $scope.zone = 'floors';
    
    $scope.type = type;

    $scope.room = 'house';

    $scope.items = batApiSrv.getLiveList(objects);    

    $scope.$on('$destroy', function () {
        batApiSrv.clearObjects();
    });

    $scope.treeConfig = {   
        handle: ".my-handle",
        onEnd: function (evt) {
            var items = evt.models;
            helperObjectService.reorder(items, 'house').then(function(){                
            }, function(){
            });
        }
    };
}];