app.controller('VehiclesGridController', ['$scope', '$http',
  "FullPopupLoader",'VehiclesRestService','customUnixTimeFilter',"GlobalStorage",
  function ($scope, $http,FullPopupLoader,VehiclesRestService,customUnixTimeFilter,GlobalStorage) {

    $scope.gridOptions = new GridController(null, null);
    $scope.gridOptions.filters.Parks = [];
    $scope.gridOptions.filters.VehicleModels =[];
    $scope.gridOptions.filters.Users =[];
    $scope.gridOptions.filters.Carriers =[];
    $scope.gridOptions.filters.VehicleModelsViews =[];
    $scope.gridOptions.filters.VehicleModelsTypes =[];
    $scope.gridOptions.useExternalPagination =false;

    /**
     * Defined columns for grid
     */
    $scope.gridOptions.initColumnDefs = function () {
      $scope.gridOptions.columnDefs = [
        {name: 'id', displayName: 'id', enableCellEdit: false, width: 40,visible: false},
        {name: 'state_number', displayName: 'state_number', enableCellEdit: false, width: 160},
        {name: 'vehicle_models_id', displayName: 'vehicle_models_id', enableCellEdit: false, width: 160, cellFilter:'vehicleModelsMap'},
        {name: 'carriers_id', displayName: 'carriers_id', enableCellEdit: false, width: 160, cellFilter:'carriersMap'},
        {name: 'parks_id', displayName: 'parks_id', enableCellEdit: false, width: 160, cellFilter:'ParksMap'},
        {name: 'garage_number', displayName: 'garage_number', enableCellEdit: false, width: 160},
        {name: 'board_number', displayName: 'board_number', enableCellEdit: false, width: 160},
        {name: 'vehicle_models_views_id', displayName: 'vehicle_models_views_id', enableCellEdit: false, width: 160,cellFilter:'VehicleModelsViewsMap'},
        {name: 'vehicle_models_types_id', displayName: 'vehicle_models_types_id', enableCellEdit: false, width: 160,cellFilter:'VehicleModelsTypesMap'},
        {name: 'created_at',displayName: 'created_at',enableCellEdit: false,width: 180,cellFilter:"customUnixTime"},
        {name: 'updated_at',displayName: 'updated_at',enableCellEdit: false,width: 100,cellFilter:"customUnixTime"},
        {name: 'author_id', displayName: 'author_id', enableCellEdit: false, width: 180,cellFilter:'userMap'},
        {name: 'updater_id', displayName: 'updater_id', enableCellEdit: false, width: 120,cellFilter:'userMap'}
      ];
    };

    /**
     * Set header text from language words store
     */
    $scope.gridOptions.initColumnNameDefs = function () {
      $scope.gridOptions.columnDefs[0].displayName = $scope.lang.words["id"];
      $scope.gridOptions.columnDefs[1].displayName = $scope.lang.words["state number"];
      $scope.gridOptions.columnDefs[2].displayName = $scope.lang.words["vehicle models"];
      $scope.gridOptions.columnDefs[3].displayName = $scope.lang.words["Carriers"];
      $scope.gridOptions.columnDefs[4].displayName = $scope.lang.words["parks"];
      $scope.gridOptions.columnDefs[5].displayName = $scope.lang.words["garage number"];
      $scope.gridOptions.columnDefs[6].displayName = $scope.lang.words["board number"];
      $scope.gridOptions.columnDefs[7].displayName = $scope.lang.words["Vehicle models views"];
      $scope.gridOptions.columnDefs[8].displayName = $scope.lang.words["vehicle models types"];
      $scope.gridOptions.columnDefs[9].displayName = $scope.lang.words["created_at"];
      $scope.gridOptions.columnDefs[10].displayName = $scope.lang.words["updated_at"];
      $scope.gridOptions.columnDefs[11].displayName = $scope.lang.words["author_id"];
      $scope.gridOptions.columnDefs[12].displayName = $scope.lang.words["updater_id"];
      $scope.gridOptions.updateData();
    };

    $scope.gridOptions.initColumnDefs();
    if ($scope.lang.hasOwnProperty('words')) {
      $scope.gridOptions.initColumnNameDefs();
    }
    $scope.$on('LanguageChanged', function (event, data) {
      $scope.gridOptions.initColumnNameDefs();
    });

    /**
     * Loading data for grid
     * @param obj
     */
    $scope.gridOptions.loadData = function (obj,gridOptions) {
      switch ($scope.vehicles.type)
      {
        case "parks":
        {
          loadVehiclesParks(gridOptions);
        }
        break;
        case "vehicle_type":
        {
          loadVehiclesByType(gridOptions);
        }
        break;
      }

    };
    function loadVehiclesByType(gridOptions) {
      console.log("loadVehiclesByType");
      var vehiclesGrid = [];
      var vehicles = GlobalStorage.getStorage("Vehicles");
      if($scope.vehicles.id<1)
      {
        var vehiclesGrid =  GlobalStorage.getStorage("Vehicles");
      }
     for (var i =0;i<vehicles.length;i++)
     {
       if(vehicles[i].vehicle_models_types_id == $scope.vehicles.id)
       {
         vehiclesGrid.push(vehicles[i]);
       }
     }
      gridOptions.data = vehiclesGrid;
    }

    function loadVehiclesParks(gridOptions) {
      console.log("loadVehiclesParks");
      var vehiclesGrid = [];
      var vehicles = GlobalStorage.getStorage("Vehicles");
      if($scope.vehicles.id<1)
      {
        var vehiclesGrid =  GlobalStorage.getStorage("Vehicles");
      }
      for (var i =0;i<vehicles.length;i++)
      {
        if(vehicles[i].parks_id== $scope.vehicles.id)
        {
          vehiclesGrid.push(vehicles[i]);
        }
      }
      gridOptions.data = vehiclesGrid;
    }






    $scope.gridOptions.filters.Parks =  GlobalStorage.getStorage("Parks");
    $scope.gridOptions.filters.Users =  GlobalStorage.getStorage("Users");
    $scope.gridOptions.filters.Graphs =  GlobalStorage.getStorage("Graphs");
    $scope.gridOptions.filters.Routes =  GlobalStorage.getStorage("Routes");
    $scope.gridOptions.filters.VehicleModels = GlobalStorage.getStorage("VehicleModels");

    $scope.gridOptions.filters.VehicleModelsTypes = GlobalStorage.getStorage("VehicleTypes");
    $scope.gridOptions.filters.VehicleModelsViews = GlobalStorage.getStorage("VehicleModelsViews");
    $scope.gridOptions.filters.Carriers = GlobalStorage.getStorage("Carriers");

    /**
     * Defined function load data
     */
    $scope.gridOptions.loadData ({
      'per-page': $scope.gridOptions.paginationPageSize,
      page: $scope.gridOptions.paginationCurrentPage
    },$scope.gridOptions);

    $scope.$on('PageVehiclesContentChanged',function (event,data) {
      console.log('PageVehiclesContentChanged',data,$scope.vehicles);
      $scope.gridOptions.loadData({
        'per-page': $scope.gridOptions.paginationPageSize,
        page: 1
      },$scope.gridOptions);
    });

    /***
     * Filters for grid
     */
    app.filter('userMap', function() {
      return function(id) {
        for (var i = 0;i<$scope.gridOptions.filters.Users.length;i++ ){
          if($scope.gridOptions.filters.Users[i].id == id ){
            return $scope.gridOptions.filters.Users[i].username;
          }
        }
        return 'undefined';
      };
    });

    app.filter('ParksMap', function () {
      return function (id) {
        for (var i = 0; i < $scope.gridOptions.filters.Parks.length; i++) {
          if ($scope.gridOptions.filters.Parks[i].id == id) {
            return $scope.gridOptions.filters.Parks[i].name;
          }
        }
        return 'undefined';
      };
    });
    app.filter('vehicleModelsMap', function () {
      return function (id) {
        for (var i = 0; i < $scope.gridOptions.filters.VehicleModels.length; i++) {
          if ($scope.gridOptions.filters.VehicleModels[i].id == id) {
            return $scope.gridOptions.filters.VehicleModels[i].name;
          }
        }
        return 'undefined';
      };
    });
    app.filter('carriersMap', function () {
      return function (id) {
        for (var i = 0; i < $scope.gridOptions.filters.Carriers.length; i++) {
          if ($scope.gridOptions.filters.Carriers[i].id == id) {
            return $scope.gridOptions.filters.Carriers[i].name;
          }
        }
        return 'undefined';
      };
    });

    app.filter('VehicleModelsViewsMap', function () {
      return function (id) {
        for (var i = 0; i < $scope.gridOptions.filters.VehicleModelsViews.length; i++) {
          if ($scope.gridOptions.filters.VehicleModelsViews[i].id == id) {
            return $scope.gridOptions.filters.VehicleModelsViews[i].name;
          }
        }
        return 'undefined';
      };
    });

    app.filter('VehicleModelsTypesMap', function () {
      return function (id) {
        for (var i = 0; i < $scope.gridOptions.filters.VehicleModelsTypes.length; i++) {
          if ($scope.gridOptions.filters.VehicleModelsTypes[i].id == id) {
            return $scope.gridOptions.filters.VehicleModelsTypes[i].name;
          }
        }
        return 'undefined';
      };
    });
  }]);

