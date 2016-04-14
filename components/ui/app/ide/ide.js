'use strict';

angular.module('myApp.ide', ['ngRoute', 'textAngular'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/ide', {
    templateUrl: 'ide/ide.html',
    controller: 'IdeCtrl'
  });
}])

.controller('IdeCtrl', [function() {

}])
.service('IdeService', ['$http',  function($http){
    this.save = function(entry) {
        $http.get(APIHOST + 'POST /sys/capabilities')
            .success(function(data) {
                onSuccess(data)
            }).error(function(data){
                onError(data)
            });
    };
}]);


