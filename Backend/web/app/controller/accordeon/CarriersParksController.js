app.controller('CarriersParksController', ['$scope', '$rootScope', function ($scope, $rootScope) {
  var carriers = {
    name: "Перевізники",
  type:"carriers"
  };
  var parks = {
    name: "Перевізники",
    type:"parks"
  };
  $scope.carriers = [carriers, parks];
  if ($scope.lang.words !== undefined) {
    carriers.name = $scope.lang.words['Carriers'];
    parks.name = $scope.lang.words['Parks'];
  }
  $scope.$on('LanguageChanged', function (event, data) {
    carriers.name = $scope.lang.words['Carriers'];
    parks.name = $scope.lang.words['Parks'];
  });

  $scope.$on('selection-changed', function (e, node) {
   $rootScope.$broadcast("PageContentChanged",node.type);



  });
}]);