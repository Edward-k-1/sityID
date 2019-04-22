app.controller('DictionaryGridController', ['$scope',
  function ($scope) {
    $scope.dictionaryType = "routes_length";
    //$scope.dictionaryType = "fuel_consumption";
    //$scope.dictionaryType = "zero_flight";
    $scope.$on("PageDictionaryContentChanged",function (event,data) {
      $scope.dictionary = data;

    });

  }]);