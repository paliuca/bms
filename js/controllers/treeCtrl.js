module.exports = ["$scope", "items", "type", "title", "zone", "helperObjectService","objects","batApiSrv", function($scope, items, type, title, zone, helperObjectService, objects, batApiSrv) {
	
    $scope.title = title;
            
    $scope.type = type;    
    
    $scope.zones = items;
        
    $scope.zone = zone;

    $scope.items = batApiSrv.getLiveList(objects);    
    
    
    $scope.room = 'tree';

    $scope.$on('$destroy', function () {
        batApiSrv.clearObjects();
    });

    $scope.treeConfig = {   
        handle: ".my-handle",
        onEnd: function (evt) {
            var items = evt.models;
            helperObjectService.reorder(items, $scope.type).then(function(response){                
            }, function(){
            });
        }
    };   
}];