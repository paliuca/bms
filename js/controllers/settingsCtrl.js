
module.exports = ["$scope", "$http", "$window", function($scope, $http, $window) {


    $scope.resetModules = function(){
        $scope.isLoading = true;
        ModulesQueryBuilder.clearDB().then(function(data){
            ZonesQueryBuilder.clearDB().then(function(data){
                $scope.isLoading = false;
            })
        });        
    }


	$http.get('/api/getWordsConfig').success(function(response) {
		$scope.items = response;
	});

	$scope.save = function(form){
		if(form.$valid){
			var json = {};
			_.each($scope.items, function(value, key){
				json[key] = form[key].$modelValue;				
			})
			$http.post('/api/setWordsConfig', {'json':json}).success(function(response) {
				$window.location.reload();
			});
		}
	}  
}];