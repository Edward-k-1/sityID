//var app = angular.module('MakAtp');
app.controller('MainPageHeaderController', ['$scope', '$rootScope', '$http', 'LanguageService', 'AuthService',
  function ($scope, $rootScope, $http, LanguageService, AuthService) {
    $scope.select_lang={};
    if ($scope.lang.current!==undefined)
    {
      $scope.select_lang = {current_lang : $scope.lang.current.code};
    }
    $scope.$on('LanguageChanged',function (event,data) {
      $scope.select_lang={current_lang : data.code};
    });
    $scope.logout = function () {
      AuthService.logout();
    };
    $scope.languageSelectChange = function () {
      LanguageService.setLanguage($scope.select_lang.current_lang);
    };
    $scope.openMenu = function($mdOpenMenu, ev) {
      originatorEv = ev;
      $mdOpenMenu(ev);
    };
    $scope.getUserName = function () {
      return AuthService.getUserName();
    }
  }]);
