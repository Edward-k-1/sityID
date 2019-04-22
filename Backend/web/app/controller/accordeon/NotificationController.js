app.controller('NotificationController', ['$scope', '$rootScope', function ($scope, $rootScope) {
  $scope.notification = [];
  if ($scope.lang.words !== undefined) {
  }
  $scope.$on('LanguageChanged', function (event, data) {
  });
  $scope.$on('selection-changed', function (e, node) {
    $rootScope.$broadcast("PageContentChanged",'notifications');
  });
}]);