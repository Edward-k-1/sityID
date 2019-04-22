app.controller('SmartCardController', ['$scope','$rootScope', function ($scope,$rootScope) {
  $scope.smartCart=[
    {name :"Конструктор смарт-карток",
     nodeId:"smartCardConstructor",
      id:-1
    }
  ];


  $scope.$on('selection-changed', function (e, node) {
    $rootScope.$broadcast("PageContentChanged",'smartcards');
  });

}]);