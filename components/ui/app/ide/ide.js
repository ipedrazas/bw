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
                var entry = {};
                if ($scope.htmlVariable) {
                    entry = {title: $scope.title, body: $scope.htmlVariable, id: $scope.oid};
                    console.log(entry);
                    IdeService.save(entry)
                        .success(function(data){
                            var oid = data['$oid'];
                            $scope.oid = oid;
                             loadEntries();
                        });

                };
                $scope.isDirty = false;
            }

        },5000);


        $scope.loadEntry = function(oid){
            console.log(oid);
            IdeService.getEntry(oid).success(function(data){
                 $scope.htmlVariable = data['body'];
                 $scope.title = data['title'];
                 var oid = data['_id'];
                 $scope.oid = oid['$oid'];
            });
        };

        var loadEntries = function(){
            IdeService.list().success(function(data){
                            $scope.files = data;
                        });
        };

        loadEntries();

}])
.factory('IdeService', ['$http', function($http){

    var save = function(entry) {
        return $http.post('/api/entries', entry);
    };

    var list = function(){
        return $http.get('/api/entries');
    };

    var getEntry = function(oid){
        return $http.get('/api/entries/' + oid);
    };


  return {
    save: save,
    list: list,
    getEntry: getEntry,

  };
}]);


