app.controller('UsersController', ['$scope', '$rootScope', function ($scope, $rootScope) {
  var users = {
    name: "Користувачі",
    children: []
  };
  $scope.Users = [users];
  if ($scope.lang.words !== undefined) {
    users.name = $scope.lang.words['Users'];
  }
  $scope.$on('LanguageChanged', function (event, data) {
    users.name = $scope.lang.words['Users'];
  });
  $scope.$on('selection-changed', function (e, node) {
    $rootScope.$broadcast("PageContentChanged",'users');
  });
}]);