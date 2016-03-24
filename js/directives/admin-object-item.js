'use strict';

module.exports = ["ObjectTemplateService", "ObjectIconService","$http", "ToastService", "ObjectFactory", function(ObjectTemplateService, ObjectIconService, $http, ToastService, ObjectFactory) {
	return {
		restrict: 'E',
		templateUrl: 'views/directives/admin-object-item.html',
		replace: true,
        scope:{
            object : '=object'            
        },
		link: function($scope){

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
                    $scope.object.icon_id = $scope.icon?$scope.icon.id:null;
                    $scope.object.template_id = $scope.template.id;
                    ObjectFactory.update($scope.object).then(function(){

                    }, function(){

                    })                    
                }
            };
        }
	}
}]