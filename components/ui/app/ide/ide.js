'use strict';

angular.module('myApp.ide', ['ngRoute', 'textAngular'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/ide', {
    templateUrl: 'ide/ide.html',
    controller: 'IdeCtrl'
  });
}])

.controller('IdeCtrl', ['$scope', '$interval', 'IdeService', function($scope, $interval, IdeService) {
        $scope.isDirty = false;

         $scope.$watch('htmlVariable',function(){
            $scope.isDirty = true;
        });

        $interval(function(){
            if($scope.isDirty){
                IdeService.save($scope.htmlVariable);
                console.log("save");
                $scope.isDirty = false;
            }

            },1000);
}])
.service('IdeService', ['$http', function($http){
    this.save = function(entry) {
        $http({
          method  : 'POST',
          url     : '/api/entries',
          data    : "entry=" + entry,
          headers : {'Content-Type': 'application/x-www-form-urlencoded'}
         })
          .success(function(data) {
                console.log(data);
                if (data.errors) {
                } else {
                }
          });

    };
}]);


