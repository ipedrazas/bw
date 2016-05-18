'use strict';

angular.module('myApp.md', ['ngRoute', 'ui.codemirror'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/md', {
    templateUrl: 'md/md.html',
    controller: 'mdCtrl'
  });
}])

.controller('mdCtrl', ['$scope', '$interval', 'mdService', function($scope, $interval, mdService) {


        $scope.editorOptions = {
        lineWrapping : true,
        lineNumbers: true,
        theme : 'solarized light',
        // readOnly: 'nocursor',
        // mode: 'xml',
    };



}])
.factory('mdService', ['$http', function($http){

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


