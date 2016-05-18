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
        $scope.doc = {};

         $scope.$watch('htmlVariable',function(){
            $scope.isDirty = true;
            $scope.doc.body = $scope.htmlVariable;
        });

        $interval(function(){
            if($scope.isDirty){
                if ($scope.htmlVariable) {
                    console.log($scope.doc);
                    IdeService.save($scope.doc)
                        .success(function(data){
                            console.log(data);
                            setDoc(data, $scope);
                            console.log(data);
                            // var oid = data['_id'];
                            // $scope.doc.oid = oid['$oid'];
                             loadEntries();
                        });

                };
                $scope.isDirty = false;
            }

        },5000);


        $scope.loadEntry = function(oid){
            console.log(oid);
            IdeService.getEntry(oid).success(function(data){
                setDoc(data, $scope);
            });
        };


        var setDoc = function(entry, $scope){
                var doc = {};
                console.log(entry);
                 $scope.htmlVariable = entry['body'];
                 doc.title = entry['title'];
                 doc.parent = entry['parent'];
                 doc.key = entry['key'];
                 var oid = entry['_id'];
                 doc.oid = oid['$oid'];
                 doc.body = entry['body'];
                 $scope.doc = doc;
                 console.log(doc);
        }

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

    var getVersions = function(oid){
        return $http.get('/api/versions/' + oid);
    }


  return {
    save: save,
    list: list,
    getEntry: getEntry,

  };
}]);


