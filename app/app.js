'use strict';

// Declare app level module which depends on views, and components
var myApp = angular.module('myApp', [
  'ngRoute',
  'myApp.view1',
  'myApp.view2',
  'myApp.view3',
  'myApp.version'
]).
config(['$routeProvider', function($routeProvider) {
      $routeProvider.otherwise({redirectTo: '/accueil'});
}]);


myApp.controller('MenuController', ['$scope', '$location', function ($scope, $location) {
  $scope.getClass = function (path) {
    if ($location.path().substr(0, path.length) == path) {
      return "active"
    } else {
      return ""
    }
  }
}]);