app.controller('VehiclesController', ['$scope', 'VehicleTypesRestService','FullPopupLoader','$rootScope',"GlobalStorage",
  function ($scope, VehicleTypesRestService,FullPopupLoader,$rootScope,GlobalStorage) {

    $scope.transTools=[ {
      name: "vehicle types",
      children: [],
      id:-1,
      type:"vehicle_type",
      nodeId:"vehicle_type"
    },
      {
        name: "parks",
        children: [],
        id:-1,
        type:"parks",
        nodeId:"parks"
      }
    ];

  $scope.transTools[0].children = GlobalStorage.getStorage("VehicleTypes");
  $scope.transTools[1].children = GlobalStorage.getStorage("Parks");

  $scope.$on('selection-changed', function (e, node) {
  $rootScope.$broadcast("PageContentChanged","vehicles");
    $rootScope.$broadcast("PageVehiclesContentChanged",node);
  });
    if ($scope.lang.hasOwnProperty('words')) {
      $scope.transTools[0].name= $scope.lang.words['vehicle models types'];
      $scope.transTools[1].name= $scope.lang.words['parks'];
    }
    $scope.$on('LanguageChanged', function (event, data) {
      $scope.transTools[0].name= $scope.lang.words['vehicle models types'];
      $scope.transTools[1].name= $scope.lang.words['parks'];

    });
}]);