app.controller('ReportsController', ['$scope','$rootScope', function ($scope,$rootScope) {
  $scope.report=[];
    $scope.$on('selection-changed', function (e, node) {
    $rootScope.$broadcast("PageContentChanged",'reports');
  });
}]);



