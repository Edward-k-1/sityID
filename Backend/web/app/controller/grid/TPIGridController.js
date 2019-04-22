app.controller('DictionaryGridController', ['$scope',
  function ($scope) {
    $scope.tpiType = "tpi";
    //$scope.dictionaryType = "fuel_consumption";
    //$scope.dictionaryType = "zero_flight";
    $scope.$on("PageTPIContentChanged",function (event,data) {
      $scope.tpiType = data;

    });

  }]);