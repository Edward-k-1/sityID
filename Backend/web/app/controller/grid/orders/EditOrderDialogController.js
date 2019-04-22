app.controller("EditOrderDialogController",["$scope", '$mdDialog', 'row', 'grid', 'parks_id', 'WorkshiftsOrdersRestService', 'VehiclesWorkshiftRestService',
  'DriversWorkshiftRestService', 'ConductorsWorkshiftRestService', '$rootScope',"filter","$filter","$timeout" ,function ($scope, $mdDialog, row, grid, parks_id, WorkshiftsOrdersRestService, VehiclesWorkshiftRestService,
                                   DriversWorkshiftRestService, ConductorsWorkshiftRestService, $rootScope,filter,$filter,$timeout) {
  $scope.lang = $rootScope.lang;
  $scope.init = function () {
    var resource = WorkshiftsOrdersRestService.getResource();
    resource.query({'get-all': true, orders_id: row.id}, function (data, response) {
      $scope.workshift_orders = data;
      $scope.vehiclesWorkshift = {};
      $scope.current={Workshift :data[0]};
      if (data.length == 0)
      {
        $scope.is_loaded = true;
        $scope.is_empty = true;
      }
      for (var i = 0; i < data.length; i++) {
        data[i]._hasedit = true;
        data[i].dep = {};
        getVehicles(i, data[i]);
      }
    }, function (error) {
    });
  };
  $scope.current = {Workshift:{}};
  $scope.filter = {};
  $scope.filter.vehicles = [];
  $scope.filter.workers = [];
  $scope.selectfilters = {};
  $scope.row = row;
  $scope.grid = grid;
  $scope.init();
    var filter = filter;
   $scope.filter = filter;
  $scope.cancel = function () {
    $mdDialog.cancel();
  };
  $scope.filterVehiclesParks = function (item) {
    return item.parks_id === $scope.current.Workshift.parks_id;
  };

  /**
   * Save current Workshift
   */
  $scope.saveCurrentWorkshift = function () {
    $scope.is_loaded = false;
    var driver = $scope.current.Workshift.dep.driversWorkshift;
    var conductor = $scope.current.Workshift.dep.conductorsWorkshift;
    var vehicle = $scope.current.Workshift.dep.vehiclesWorkshift;
    var is_saved = 0;
    if (driver.hasOwnProperty('_is_new')) {
      driver.workshifts_orders_id = $scope.current.Workshift.id;
      createDriver(driver);
    }
    else {
      saveDriver(driver);
    }
    if (vehicle.hasOwnProperty('_is_new')) {
      vehicle.workshifts_orders_id = $scope.current.Workshift.id;
      createVehicle(vehicle);
    }
    else {
      saveVehicle(vehicle);
    }
    if (conductor.hasOwnProperty('_is_new')) {
      conductor.workshifts_orders_id = $scope.current.Workshift.id;
      createConductor(conductor);
    }
    else {
      saveConductor(conductor);
    }
  };
  function saveDriver(item) {
    var resource = DriversWorkshiftRestService.getResource();
    delete item._backup;
    resource.update({id: item.id}, item, function (data, response) {
      $scope.init();
    }, function (error) {
      $scope.init();
    });
  }

  function createDriver(item) {
    var resource = DriversWorkshiftRestService.getResource();
    resource.save(item, function (data, response) {
      $scope.init();
    }, function (error) {
      $scope.init();
    });
  };
  function saveConductor(item) {
    var resource = ConductorsWorkshiftRestService.getResource();
    delete item._backup;
    resource.update({id: item.id}, item, function (data, response) {
      $scope.init();
    }, function (error) {
      $scope.init();
    });
  }

  function createConductor(item) {
    var resource = ConductorsWorkshiftRestService.getResource();
    resource.save(item, function (data, response) {
      $scope.init();
    }, function (error) {
      $scope.init();
    });
  };

  function saveVehicle(item) {
    var resource = VehiclesWorkshiftRestService.getResource();
    delete item._backup;
    resource.update({id: item.id}, item, function (data, response) {
      $scope.init();
      $timeout(function(){
        grid.reloadCurrentData();
      }, 500);
    }, function (error) {
      $scope.init();

    });
  }

  function createVehicle(item) {
    var resource = VehiclesWorkshiftRestService.getResource();
    resource.save(item, function (data, response) {
      $scope.init();
      $timeout(function(){
        grid.reloadCurrentData();
      }, 500);
    }, function (error) {
      $scope.init();
    });
  };

  $scope.deleteCurrentWorkshift = function () {
    var workshiftOrderresource = WorkshiftsOrdersRestService.getResource();
    workshiftOrderresource.deleteWithdep({'id': $scope.current.Workshift.id}, function (data, response) {
      $scope.init();
    }, function (error) {
      $scope.init();
    });
  };
  $scope.exportWorkshitsFromDate = function () {

  };
  /**
   * Clear filters in text input for selects {vehicle,driver,conductor}
   */
  $scope.limitDrivers = 10;
  $scope.limitConductors = 10;
  $scope.limitVehicles = 10;
  $scope.clearFilterDrivers = function () {
    $scope.selectfilters.searchDriverName = '';
    $scope.filter.workersDriver = [];
    if($scope.current.Workshift.dep.driversWorkshift == undefined)
    {
      return;
    }
    var current = $scope.current.Workshift.dep.driversWorkshift.drivers_id;
    for (var i = 0; i < $scope.filter.workers.length; i++)
    {
      var item = $scope.filter.workers[i];
      if (current == item.id )
      {
        $scope.filter.workersDriver.push( item);
        return;
      }
    }
  };

    /**
     * Load more items for select
     */
    $scope.loadMoreDrivers = function (){
      $scope.limitDrivers += 30;
      $scope.filter.workersDriver = filterWorkers($scope.filter.workers,$scope.limitDrivers,$scope.selectfilters.searchDriverName);
    };
    /**
     * Load limit count items when Select Opened.
     */
    $scope.onOpenSelectDrivers= function (){
      $scope.limitDrivers = 10;
      $scope.filter.workersDriver = filterWorkers($scope.filter.workers,$scope.limitDrivers,$scope.selectfilters.searchDriverName);
    };

    /**
     * Aplies filter when input changed.
     */
    $scope.changeInputFilterDrivers = function()
    {
      $scope.limitDrivers=10;
      $scope.filter.workersDriver = filterWorkers($scope.filter.workers,$scope.limitDrivers,$scope.selectfilters.searchDriverName);
    };

/**
 *
 ****/

    $scope.clearFilterConductors = function () {
      $scope.selectfilters.searchConductorsName = '';
      $scope.filter.workersConductors= [];
      if($scope.current.Workshift.dep.conductorsWorkshift == undefined){
        return;
      }
      var current = $scope.current.Workshift.dep.conductorsWorkshift.conductors_id;
      for (var i = 0; i < $scope.filter.workers.length; i++)
      {
        var item = $scope.filter.workers[i];
        if (current == item.id )
        {
          $scope.filter.workersConductors.push( item);
          return;
        }
      }
    };

    /**
     * Load more items for select
     */
    $scope.loadMoreConductors = function (){
      $scope.limitConductors += 30;
      $scope.filter.workersConductors = filterWorkers($scope.filter.workers,$scope.limitConductors,$scope.selectfilters.searchConductorsName);
    };
    /**
     * Load limit count items when Select Opened.
     */
    $scope.onOpenSelectConductors= function (){
      $scope.limitConductors = 10;
      $scope.filter.workersConductors = filterWorkers($scope.filter.workers,$scope.limitConductors,$scope.selectfilters.searchConductorsName);
    };
    /**
     * Aplies filter when input changed.
     */
    $scope.changeInputFilterConductors = function(){
      $scope.limitConductors=10;
      $scope.filter.workersConductors = filterWorkers($scope.filter.workers,$scope.limitConductors,$scope.selectfilters.searchConductorsName);
    };
    $scope.clearFilterVehicles = function () {
      $scope.selectfilters.searchVehicleStateNumber = '';
      $scope.filter.vehiclesFilter= [];
      if($scope.current.Workshift.dep.vehiclesWorkshift == undefined){
        return;
      }
      var current = $scope.current.Workshift.dep.vehiclesWorkshift.vehicles_id;
      for (var i = 0; i < $scope.filter.vehicles.length; i++){
        var item = $scope.filter.vehicles[i];
        if (current == item.id ){
          $scope.filter.vehiclesFilter.push( item);
          return;
        }
      }
    };
    /**
     * Load more items for select
     */
    $scope.loadMoreVehicles = function () {
      $scope.limitVehicles += 30;
      $scope.filter.vehiclesFilter = filterVehicles($scope.filter.vehicles,$scope.limitVehicles,$scope.selectfilters.searchVehicleStateNumber);
    };
    /**
     * Load limit count items when Select Opened.
     */
    $scope.onOpenSelectVehicles= function (){
      $scope.limitVehicles = 10;
      $scope.filter.vehiclesFilter = filterVehicles($scope.filter.vehicles,$scope.limitVehicles,$scope.selectfilters.searchVehicleStateNumber);
    };
    /**
     * Aplies filter when input changed.
     */
    $scope.changeInputFilterVehicles = function() {
      $scope.limitVehicles=10;
      $scope.filter.vehiclesFilter = filterVehicles($scope.filter.vehicles,$scope.limitVehicles,$scope.selectfilters.searchVehicleStateNumber);
    };
    $scope.selectWorkshiftChanged = function () {
      $scope.clearFilterDrivers();
      $scope.clearFilterConductors();
      $scope.clearFilterVehicles();
    };

    function filterWorkers(list,count,textFilt) {
      var result = [];
      var textFilter = textFilt!==undefined?textFilt.toLowerCase():"";
      var currentCount = 0;
      for (var i = 0; i < list.length; i++) {
        var currentText = list[i].name.toLowerCase();
        if (currentText.match(textFilter)) {
          currentCount++;
          result.push(list[i]);
        }
        if (currentCount == count){
          break;
        }
      }
      return result;
    }
    function filterVehicles(list,count,textFilt) {
      var result = [];
      var textFilter = textFilt!==undefined?textFilt.toLowerCase():"";
      var currentCount = 0;
      for (var i = 0; i < list.length; i++) {
        var currentText = list[i].state_number.toLowerCase();
        if (currentText.match(textFilter)) {
          currentCount++;
          result.push(list[i]);
        }
        if (currentCount == count){
          break;
        }
      }
      return result;
    }

  /**
   * returns worker's name by id
   */
  $scope.getWorkerNumberById = function (id) {
    var workers = $scope.grid.filters.Workers;
    for (var i = 0; i < workers.length; i++) {
      if (workers[i].id == id) {
        return workers[i].basic_number;
      }
    }
    return "undefined";
  };
  /**
   * returns vehicles's board name by id
   */
  $scope.getVehicleBoardById = function (id) {
    var vehicles = $scope.grid.filters.Vehicle;
    for (var i = 0; i < vehicles.length; i++) {
      if (vehicles[i].id == id) {
        return vehicles[i].board_number;
      }
    }
    return "undefined";
  };
    $scope.getVehicleStateNumberById = function (id) {
      var vehicles = $scope.grid.filters.Vehicle;
      for (var i = 0; i < vehicles.length; i++) {
        if (vehicles[i].id == id) {
          return vehicles[i].state_number;
        }
      }
      return "undefined";
    };

  /**
   * Load vehiclesworkshift for workshift
   **/
  function getVehicles(i, row) {
    var vehiclesResource = VehiclesWorkshiftRestService.getResource();
    vehiclesResource.getByParams({'workshifts_orders_id': row.id}, function (data, response) {
      row.dep["vehiclesWorkshift"] = data.length > 0 ? data[0] : {_is_new: true};
      getDrivers(i, row);
    }, function (error) {
    });
  };
  /**
   * Load driversworkshift for workshift
   **/
  function getDrivers(i, row) {
    var vehiclesResource = DriversWorkshiftRestService.getResource();
    vehiclesResource.getByParams({'workshifts_orders_id': row.id}, function (data, response) {
      row.dep["driversWorkshift"] = data.length > 0 ? data[0] : {_is_new: true};
      getConductors(i, row)
    }, function (error) {
    });
  }

  /**
   * Load conductorssworkshift for workshift
   **/
  function getConductors(i, row) {
    var vehiclesResource = ConductorsWorkshiftRestService.getResource();
    vehiclesResource.getByParams({'workshifts_orders_id': row.id}, function (data, response) {
      row.dep["conductorsWorkshift"] = data.length > 0 ? data[0] : {_is_new: true};
      $scope.selectWorkshiftChanged();
      $scope.is_loaded = true;
    }, function (error) {
    });
  }
}]);