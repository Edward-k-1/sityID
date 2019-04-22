//var app = angular.module('MakAtp');
app.controller('MainController', ['$scope', '$rootScope', '$http', 'LanguageService', 'AuthService',
  function ($scope, $rootScope, $http, LanguageService, AuthService) {
    function init() {

    }

    init();
    /***
     * Return is user autentificated.
     */
    $scope.isAuthenticated = function () {
      return AuthService.isAuthenticated();
    };
    $scope.isAuth = false;
    $scope.getUserName = function()
    {
     return AuthService.getUserName();
    }
    $scope.getUserEmail = function(){
      return AuthService.getUserEmail();
    };
    $rootScope.loading = {};
    $rootScope.loading.isDataLoaded = false;
    $scope.loading  =$rootScope.loading;
    /*****
     * button for logout
     */
    $scope.logout = function () {
      AuthService.logout();
    }

    $scope.showMenu = function() {
      console.log('ssssss');
      $('#main-menu-container').addClass('menu-expanded');
    }
    $scope.hideMenu = function() {
      $('#main-menu-container').removeClass('menu-expanded');
    }

  }]);
app.config(function($mdDateLocaleProvider) {
  $mdDateLocaleProvider.months = ['Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень', 'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'];
  $mdDateLocaleProvider.shortMonths = ['Січ.', 'Лют.', 'Бер.', 'Квіт.', 'Трав.', 'Черв.', 'Лип.', 'Серп.', 'Вер.', 'Жовт.', 'Лист.', 'Груд.'];
  $mdDateLocaleProvider.shortDays = ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  $mdDateLocaleProvider.firstDayOfWeek = 1;
});
