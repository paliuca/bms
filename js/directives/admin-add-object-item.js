'use strict';

module.exports = ["ObjectTemplateService", "ObjectIconService", "ToastService", "ObjectFactory","$route", function(ObjectTemplateService, ObjectIconService, ToastService, ObjectFactory, $route) {
	return {
		restrict: 'E',
		templateUrl: 'views/directives/admin-add-object-item.html',
		replace: true,
        scope:{
            house : '@house',
            floor : '@floor',            
            room : '@room',
            user : '@user'
        },
		link: function($scope){
            $scope.object = {};

            $scope.ObjectTemplateService = ObjectTemplateService;
            $scope.ObjectIconService = ObjectIconService;

            $scope.nameEditorEnabled = false;


            $scope.enableNameEditor = function() {
                if($scope.object.category){
                    if($scope.object.template_id){
                        $scope.template = ObjectTemplateService.getTemplate($scope.object.category, $scope.object.template_id);
                    }
                    if($scope.object.icon_id){
                        $scope.icon = ObjectIconService.getIcon($scope.object.category, $scope.object.icon_id);
                    }
                }
                $scope.nameEditorEnabled = true;                
            };

            $scope.disableNameEditor = function() {
                $scope.nameEditorEnabled = false;
            };

            $scope.saveObject = function(form) {
                if(form.$valid){
                    $scope.object.room_id = $scope.room;
                    $scope.object.floor_id = $scope.floor;
                    $scope.object.house_id = $scope.house;
                    $scope.object.user_id = $scope.user;                    
                    $scope.object.icon_id = $scope.icon?$scope.icon.id:null;
                    $scope.object.template_id = $scope.template.id;
                    ObjectFactory.create($scope.object).then(function(response){
                        $route.reload();
                    }, function(){
                        ToastService.create('Object already exists','warning');
                    })                                        
                }
            };
        }
	}
}]