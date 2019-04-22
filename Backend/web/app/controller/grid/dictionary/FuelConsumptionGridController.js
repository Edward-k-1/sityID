


app.controller('FuelConsumptionGridController', ['$scope',"$rootScope","FuelConsumptionRestService","GlobalStorage","$mdDialog",
  function ($scope,$rootScope,FuelConsumptionRestService,GlobalStorage,$mdDialog) {
    $scope.gridOptions = new GridController(null, null);
    $scope.gridOptions.useExternalPagination = false;
    $scope.lang = $rootScope.lang;


    $scope.gridOptions.initColumnNameDefs = function () {
      console.log("initColumnNameDefs");
      var i = 0;
      $scope.gridOptions.columnDefs[i].displayName = $scope.lang.words["id"];
      i++;
      $scope.gridOptions.columnDefs[i].displayName = $scope.lang.words["Routes"];
      i++;
      $scope.gridOptions.columnDefs[i].displayName = $scope.lang.words["Vehicle"];
      i++;
      $scope.gridOptions.columnDefs[i].displayName = $scope.lang.words["Fuel"];
      i++;
      $scope.gridOptions.columnDefs[i].displayName = $scope.lang.words["created_at"];i++;
      $scope.gridOptions.columnDefs[i].displayName = $scope.lang.words["updated_at"];i++;
      $scope.gridOptions.columnDefs[i].displayName = $scope.lang.words["author_id"];i++;
      $scope.gridOptions.columnDefs[i].displayName = $scope.lang.words["updater_id"];i++;
      $scope.gridOptions.updateData();
    };

    $scope.gridOptions.initColumnDefs = function () {
      $scope.gridOptions.columnDefs = [
        {name: 'id', displayName: 'id', enableCellEdit: false, width: 40, visible: false,headerCellClass:"grid-cell-header"},
        {name: 'routes_id',displayName: '',  enableCellEdit: false, width: 100,cellFilter:"FilterRoutesNameById",
          sortingAlgorithm:algiritmSortingRoutesNameById,headerCellClass:"grid-cell-header"
        },
        {name: 'vehicle_models_id',displayName: '',  enableCellEdit: false, width: 180,cellFilter:"FilterVehicleModelNameById",
          sortingAlgorithm:algiritmSortingVehicleModelsNameById,headerCellClass:"grid-cell-header"},
        {name: 'value', displayName: '', enableCellEdit: false, width: 90,headerCellClass:"grid-cell-header"},
        {name: 'created_at',displayName: '', enableCellEdit: false, width: 180, cellFilter: "customUnixTime",headerCellClass:"grid-cell-header"},
        {name: 'updated_at',displayName: '', enableCellEdit: false, width: 180, cellFilter: "customUnixTime",headerCellClass:"grid-cell-header"},
        {name: 'author_id', displayName: '', enableCellEdit: false, width: 180, cellFilter: "FilterUserNameById",headerCellClass:"grid-cell-header"},
        {name: 'updater_id',displayName: '', enableCellEdit: false, width: 120, cellFilter: "FilterUserNameById",headerCellClass:"grid-cell-header"}
      ];
    };
    $scope.gridOptions.initColumnDefs();
    if ($scope.lang.hasOwnProperty('words')) {
      $scope.gridOptions.initColumnNameDefs();
    }
    $scope.$on('LanguageChanged', function (event, data) {
      $scope.gridOptions.initColumnNameDefs();
    });

    if (GlobalStorage.isStorageExist("FuelConsumption"))
    {
      $scope.gridOptions.data =angular.copy(GlobalStorage.getStorage("FuelConsumption"));
    }
    else{
      var resource = FuelConsumptionRestService.getResource();
      resource.query({}, function (data, response) {
        GlobalStorage.setStorage("FuelConsumption",data);
        $scope.gridOptions.data = angular.copy (data);
        console.log("http result",data);
      },function (error) {
        console.log("http error",error);
        $mdDialog.show(
          $mdDialog.alert()
            .parent(angular.element(document.body))
            .clickOutsideToClose(true)
            .title('Помилка')
            .textContent(error.statusText)
            .ariaLabel(' ')
            .ok('Ok')
        );
      });
    }

    function getRoutesNameById(id){
      var routes = GlobalStorage.getStorage("Routes");
      console.log("getRoutesNameById.",id);
      for (var i = 0 ; i<routes.length;i++) {
        if (routes[i].id == id){
          return routes[i].name;
        }
      }
      return '';
    }
    function getVehicleModelsNameById(id){
      var vehicle_models = GlobalStorage.getStorage("VehicleModels");
      console.log("getRoutesNameById.",id);
      for (var i = 0 ; i<vehicle_models.length;i++) {
        if (vehicle_models[i].id == id){
          return vehicle_models[i].name;
        }
      }
      return '';
    }


    function algiritmSortingRoutesNameById (a, b, rowA, rowB, direction) {
      var a_name = getRoutesNameById(a).toLowerCase();
      var b_name = getRoutesNameById(b).toLowerCase();
      console.log(a_name,b_name," end");
      if ( a_name < b_name )
        return -1;
      if ( a_name > b_name )
        return 1;
      return 0;
    }

    function algiritmSortingVehicleModelsNameById (a, b, rowA, rowB, direction) {
      var a_name = getVehicleModelsNameById(a).toLowerCase();
      var b_name = getVehicleModelsNameById(b).toLowerCase();
      if ( a_name < b_name )
        return -1;
      if ( a_name > b_name )
        return 1;
      return 0;
    }




  }
]);