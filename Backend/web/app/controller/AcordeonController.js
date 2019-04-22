app.controller('AcordeonController', ['$scope','$http','UserRestService','AuthService', function ($scope,$http,UserRestService,AuthService) {

  $scope.$on('selection-changed', function (e, node) {  });
  $scope.$on('expanded-state-changed', function (e, node) {
  });
  $scope.$on('LanguageChanged',function (event,data) {
   });

    $scope.userData = UserRestService.getUserData();
    console.log('user0',$scope.userData);



}]);