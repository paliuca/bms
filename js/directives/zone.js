'use strict';

module.exports = ["ObjectIconService", "$http", "UserFactory", "RoomFactory", "FloorFactory", "HouseFactory", function(ObjectIconService, $http, UserFactory, RoomFactory, FloorFactory, HouseFactory) {
	return {
		restrict: 'E',
		templateUrl: 'views/directives/zone.html',
		replace: true,
        scope:{
            type : '@type',
            zone : '@zone',
            item: '=item',
            floor:'=floor',
            orderBar : '=orderBar'
        },
		link: function($scope){
            switch($scope.zone){
                case 'houses':
                    $scope.link = "#/house/"+$scope.item.id;
                break;
                case 'floors':
                    $scope.link = "#/floor/"+$scope.item.id;
                break;
                case 'rooms':
                    $scope.link = "#/room/"+$scope.item.id;
                break;
            }        

            $scope.nameEditorEnabled = false;
            $scope.iconEditorEnabled = false;
            $scope.ObjectIconService = ObjectIconService;
            $scope.enableNameEditor = function() {
                $scope.zoneName = $scope.item.name;
                $scope.nameEditorEnabled = true;
            };

            $scope.enableIconEditor = function() {
                $scope.iconsArray = ObjectIconService.getIcons($scope.zone);
                if($scope.item.icon_id){
                    var key1 = _.findLastIndex($scope.iconsArray, {id: $scope.item.icon_id});
                    $scope.selectedIcon = $scope.iconsArray[key1];
                }
                $scope.editorIconEnabled = true;
            };            

            $scope.saveZone = function(form){
                if(form.$valid){
                    if($scope.selectedIcon){
                        $scope.item.icon_id = $scope.selectedIcon.id;                             
                    }
                    if(form.zoneName){
                        $scope.item.name = form.zoneName.$modelValue;                        
                    }
                    switch($scope.zone){
                        case 'rooms':
                            RoomFactory.update($scope.item).then(function(){
                                $scope.disableEditor();
                            }, function(){
                                $scope.disableEditor();
                            })                            
                        break;
                        case 'floors':
                            FloorFactory.update($scope.item).then(function(){
                                $scope.disableEditor();
                            }, function(){
                                $scope.disableEditor();
                            })                                          
                        break;
                        case 'houses':
                            HouseFactory.update($scope.item).then(function(){
                                $scope.disableEditor();
                            }, function(){
                                $scope.disableEditor();
                            })
                        break;
                    }                    
                }
            }


            $scope.disableEditor = function() {
                $scope.nameEditorEnabled = false;
                $scope.editorIconEnabled = false;
            };           
		}
	}
}];