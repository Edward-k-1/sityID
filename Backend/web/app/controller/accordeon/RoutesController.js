app.controller('RoutesController', ['$scope', '$rootScope', function ($scope, $rootScope) {
  var buses = {
    name: '', expanded: false,
    children: [
      {name: "1", children: [{name: "1"}, {name: "2"}], expanded: false},
      {name: "2", children: [{name: "1"}, {name: "2"}], expanded: false},
      {name: "3", children: [{name: "1"}, {name: "2"}], expanded: false},
      {name: "4", children: [{name: "1"}, {name: "2"}], expanded: false},
      {name: "5", children: [{name: "1"}, {name: "2"}], expanded: false},
      {name: "6", children: [{name: "1"}, {name: "2"}], expanded: false},
      {name: "7", children: [{name: "1"}, {name: "2"}], expanded: false},
      {name: "8", children: [{name: "1"}, {name: "2"}], expanded: false},
      {name: "9", children: [{name: "1"}, {name: "2"}], expanded: false}

    ]
  };
  var trolet = angular.copy(buses);
  var tram = angular.copy(buses);
  var light_rail = angular.copy(buses);
  var train = angular.copy(buses);
  $scope.routes = [
    buses, trolet, tram, light_rail, train
  ];
  if ($scope.lang.words !== undefined) {
    buses.name = $scope.lang.words['Buses'];
    tram.name = $scope.lang.words['Tram'];
    trolet.name = $scope.lang.words['Trolleys'];
    light_rail.name = $scope.lang.words['Light rail'];
    train.name = $scope.lang.words['Train'];
  }
  $scope.$on('LanguageChanged', function (event, data) {

    buses.name = $scope.lang.words['Buses'];
    tram.name = $scope.lang.words['Tram'];
    trolet.name = $scope.lang.words['Trolleys'];
    light_rail.name = $scope.lang.words['Light rail'];
    train.name = $scope.lang.words['Train'];

  });
  $scope.$on('selection-changed', function (e, node) {
    $rootScope.$broadcast("PageContentChanged",'routes');
  });

}]);