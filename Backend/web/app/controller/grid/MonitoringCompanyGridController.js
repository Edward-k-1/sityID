app.controller('MonitoringCompanyGridController', ['$scope', '$rootScope', '$http', '$mdDialog', '$filter', 'ParksRestService', 'LanguageService',
  'AuthService', 'FullPopupLoader', 'MonitoringCompanyRestService', 'uiGridConstants', 'customUnixTimeOnlyFilter',
  'VehicleModelsRestService', 'RoutesRestService', 'GraphsRestService',"GlobalStorage",
  function ($scope, $rootScope, $http, $mdDialog, $filter, ParksRestService, LanguageService,
            AuthService, FullPopupLoader, MonitoringCompanyRestService, uiGridConstants, customUnixTimeOnlyFilter,
            VehicleModelsRestService, RoutesRestService, GraphsRestService,GlobalStorage) {

    $('#chekpoints-loading-wraper').fadeIn(500);

    $scope.userData = $rootScope.UserData;
    $scope.gridOptions = new GridController(null, null);
    $scope.date = $filter('date')(new Date(), 'yyyy-MM-dd');
    $scope.stack = undefined;

    $scope.gridOptions.flatEntityAccess = true;
    $scope.gridOptions.minRowsToShow = 10;
    $scope.gridOptions.filters.Vehicle = [];
    $scope.gridOptions.enableFiltering = false;
    $scope.gridOptions.enableColumnMenus = false;
    $scope.for_grid = {};

    $scope.gridOptions.initColumnDefs = function () {
      // var templateRG = '<div class="ui-grid-cell-contents red-left-border">' +
      //   '{{grid.appScope._showRoutesParks(row.entity.routes_id,row.entity.graphs_id)}}</div>';

      /**
       * Defined columns for grid
       */
      $scope.gridOptions.headerTemplate = 'app/templates/grid/category/categoryHeader.tpl.html';
      $scope.gridOptions.category = [
        {name: 'column4', visible: true,showCatName: false},
        {name: 'Vehicle', dName:'Автомобіль', visible: true,showCatName: true},
          // {name: 'column2', visible: true,showCatName: false},
          // {name: 'column3', visible: true,showCatName: false},

        {name: 'Driver', dName:'Водій', visible: true,showCatName: true},
        {name: 'ATP', dName:'АТП Виїзд', visible: true,showCatName: true},
        {name: 'column5', visible: true,showCatName: false},
        {name: 'Conductor', dName:'Кондуктор', visible: true,showCatName: true},
        {name: 'column6', visible: true,showCatName: false},
        {name: 'column7', visible: true,showCatName: false},
        {name: 'column8', visible: true,showCatName: false},
        {name: 'column9', visible: true,showCatName: false}
      ];

      $scope.gridOptions.columnDefs = [

        {name: 'id', enableCellEdit: false, width: 70, visible: false},
        {name: 'routes/graphs',
          category:"column4",
          enableCellEdit: false,
          width: 70,
          cellTemplate: '<div class="ui-grid-cell-contents red-left-border">{{row.entity.route}} / {{row.entity.graph}}</div>',
          sortingAlgorithm: sortMG,
          sort: { direction: 'asc', priority: 0 }
        },
        {
          name: 'vehicles_board',
          cellTemplate: '<div class="ui-grid-cell-contents red-left-border">{{row.entity.workshift_1.vehicle.state_number}}</div>',
          category:"Vehicle",
          displayName: "Board",
          enableCellEdit: false,
          width: 70
        },
        {
          name: 'vehicles_state_number',
          cellTemplate: '<div class="ui-grid-cell-contents red-left-border">{{row.entity.workshift_1.vehicle.name}}</div>',
          category:"Vehicle",
          displayName: "State number",
          enableCellEdit: false,
          width: 110
        },
        {
          name: 'vehicles_models',
          cellTemplate: '<div class="ui-grid-cell-contents red-left-border">{{row.entity.workshift_1.vehicle.board_number}}</div>',
          category:"Vehicle",
          displayName: "Vehical Models",
          enableCellEdit: false,
          width: 120,
          // cellFilter: "vehicleMCModelMap"
        },
        {
          name: 'driver_workers_name',
          cellTemplate: '<div class="ui-grid-cell-contents red-left-border">{{row.entity.workshift_1.driver.name CUSTOM_FILTERS}}</div>',
          category: 'Driver',
          displayName: "Drivers name",
          enableCellEdit: false,
          width: 150,
          cellClass: cellClassVname,
          cellFilter: 'FullNameToShort'
        },
        {
          name: 'driver_workers_number',
          cellTemplate: '<div class="ui-grid-cell-contents red-left-border">{{row.entity.workshift_1.driver.basic_number}}</div>',
          category: 'Driver',
          displayName: "Drivers number",
          enableCellEdit: false,
          width: 70
        },
        {
          name: 'arrival',
          cellTemplate: '<div class="ui-grid-cell-contents red-left-border">{{row.entity.graph_data.s1_a CUSTOM_FILTERS}}</div>',
          category: 'ATP',
          enableCellEdit: false,
          width: 90,
          cellFilter: "sliceTime",
          cellClass: cellClassMCArrival
        },
        {
          name: 'departure_plan',
          cellTemplate: '<div class="ui-grid-cell-contents red-left-border">{{row.entity.graph_data.s1_s CUSTOM_FILTERS}}</div>',
          category: 'ATP',
          enableCellEdit: false,
          width: 90,
          cellFilter: 'sliceTime'
        },
        {
          name: 'departure_fact',
          cellTemplate: '<div class="ui-grid-cell-contents red-left-border">{{row.entity.graph_data.s1_e CUSTOM_FILTERS}}</div>',
          category: 'ATP',
          enableCellEdit: false,
          width: 90,
          cellFilter: "sliceTime",
          cellClass: cellClassMCDepartureFact
        },
        {
          name: 'state',
          field: 'state',
          category: 'column5',
          enableCellEdit: false,
          width: 100,
          cellFilter: 'stateMCMap',
          cellClass: 'red-left-border'
        },
        {
          name: 'conductor_workers_name',
          cellTemplate: '<div class="ui-grid-cell-contents red-left-border">{{row.entity.workshift_1.conductor.name CUSTOM_FILTERS}}</div>',
          category: 'Conductor',
          displayName: "Conductors name",
          enableCellEdit: false,
          width: 150,
          cellClass: 'red-left-border',
          cellFilter: 'FullNameToShort'
        },
        {
          name: 'conductor_workers_number',
          cellTemplate: '<div class="ui-grid-cell-contents red-left-border">{{row.entity.workshift_1.conductor.basic_number}}</div>',
          category: 'Conductor',
          displayName: "Conductors numbers",
          enableCellEdit: false,
          width: 70
        },
        {
          name: 'fuel',
          category: 'column6',
          width: 80,
          enableFiltering: false,
          enableCellEdit: false,
          cellFilter: "fuelMCMap",
          cellClass: 'red-left-border'
        },
        {
          name: 'medical_service',
          field: 'mc',
          category: 'column7',
          enableCellEdit: false,
          width: 80,
          enableFiltering: false,
          cellTemplate: '<div ng-dblclick="grid.appScope.McChange(row)" external-scopes="gridHandlers"  class="ui-grid-cell-contents">+</div>',
          cellClass: cellClassMCVtkMs,
          cellFilter: "mapMCMedicalService"
        },
        {
          name: 'technical_control',
          field: 'tcd',
          category: 'column8',
          enableCellEdit: false,
          width: 80,
          enableFiltering: false,
          cellTemplate: '<div ng-dblclick="grid.appScope.TcdChange(row)" external-scopes="gridHandlers"  class="ui-grid-cell-contents">+</div>',
          cellClass: cellClassMCVtkMs,
          cellFilter: "mapMCVTK"
        },
        {
          name: 'gates',
          field: 'gt',
          category: 'column9',
          enableCellEdit: false,
          width: 80,
          enableFiltering: false,
          cellFilter: "mapMCGates",
          cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
            return grid.getCellValue(row, col) === 2 ? "cell-green" : "";
          }
        }
      ];
    };
    /**
     * Defined translate function
     */
    $scope.gridOptions.initColumnNameDefs = function () {

      $scope.gridOptions.columnDefs[0].displayName = $scope.lang.words["id"];
      $scope.gridOptions.columnDefs[1].displayName = $scope.lang.words["r-g"];
      $scope.gridOptions.columnDefs[2].displayName = $scope.lang.words["SN"];
      $scope.gridOptions.columnDefs[3].displayName = $scope.lang.words["vehicle models"];
      $scope.gridOptions.columnDefs[4].displayName = $scope.lang.words["BN"];
      $scope.gridOptions.columnDefs[5].displayName = $scope.lang.words["Full name"];
      $scope.gridOptions.columnDefs[6].displayName = $scope.lang.words["Tab N"];
      $scope.gridOptions.columnDefs[7].displayName = $scope.lang.words["Arrival"];
      $scope.gridOptions.columnDefs[8].displayName = $scope.lang.words["Departure Plan"];
      $scope.gridOptions.columnDefs[9].displayName = $scope.lang.words["Departure Fact"];
      $scope.gridOptions.columnDefs[10].displayName = $scope.lang.words["State"];
      $scope.gridOptions.columnDefs[11].displayName = $scope.lang.words["Full name"];
      $scope.gridOptions.columnDefs[12].displayName = $scope.lang.words["Tab N"];
      $scope.gridOptions.columnDefs[13].displayName = $scope.lang.words["Fuel"];
      $scope.gridOptions.columnDefs[14].displayName = $scope.lang.words["Medical Service"];
      $scope.gridOptions.columnDefs[15].displayName = $scope.lang.words["Technical Control"];
      $scope.gridOptions.columnDefs[16].displayName = $scope.lang.words["Gates"];

      $scope.gridOptions.category[1].dName = $scope.lang.words["Vehicle"];
      $scope.gridOptions.category[2].dName = $scope.lang.words["Driver"];
      $scope.gridOptions.category[3].dName = $scope.lang.words["ATP arrival"];
      $scope.gridOptions.category[5].dName = $scope.lang.words["Conductor"];
      $scope.gridOptions.updateData();
    };

    $scope.gridOptions.initColumnDefs();
    $scope.gridOptions._init();

    /**
     * Defined language settings
     */
    $scope.gridOptions.lang = $scope.lang;
    if ($scope.lang.hasOwnProperty('words')) {
      $scope.gridOptions.initColumnNameDefs();
    }
    $scope.$on('LanguageChanged', function (event, data) {
      $scope.gridOptions.initColumnNameDefs();
    });

    /**
     * Defined function loaData for grid
     */
    $scope.gridOptions.loadData = function (obj, gridOptions) {
      if ($scope.gridOptions.parksFilter >= 0){
        obj.parks_id = $scope.gridOptions.parksFilter;
      } else {
        obj.parks_id = $scope.userData.pid;
      }
      // obj.date = Date.parse($scope.date+" 22:00:00")/1000 + 60*60*2;
      loadMonitoringCompany(obj, gridOptions);
    };


    /**
     *  Function calback on select_updater
     */
    $scope.timerCallback = function () {
      $scope.gridOptions.reloadCurrentData();
    };

    $scope.TcdChange = function(ev) {
      $mdDialog.show({
        controller: 'vtkStatusChangeController',
        templateUrl: 'app/templates/popup/vtkStatusChange.tpl.html',
        parent: angular.element(document.body),
        clickOutsideToClose:false,
        locals: {row: ev.entity, grid: $scope.gridOptions, parks_id:$scope.orders.parks_id}
      })
          .then(function() {
            $scope.gridOptions.reloadCurrentData();
          }, function() {

          });
    };

    $scope.McChange = function(ev) {
      // Appending dialog to document.body to cover sidenav in docs app

      $mdDialog.show({
        controller: 'mcStatusChangeController',
        templateUrl: 'app/templates/popup/mcStatusChange.tpl.html',
        parent: angular.element(document.body),
        // targetEvent: ev,
        clickOutsideToClose:false,
        locals: {row: ev.entity, grid: $scope.gridOptions, parks_id:$scope.orders.parks_id}
        // fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
      })
          .then(function() {
            $scope.gridOptions.reloadCurrentData();
          }, function() {

          });


    };
    /**
     * Loadinig data for grid
     */
    function loadStack() {
      var res = MonitoringCompanyRestService.getResource();
      res.get({gate_stack:$scope.userData.pid, date:$scope.date}, function(data, response) {
        console.log('ld',data);
        $scope.stack = data;
      }, function(error) {console.log(error);});
    }
    loadStack();

    function loadMonitoringCompany(obj, gridOptions) {
      //FullPopupLoader.showPopup();
      var resource = MonitoringCompanyRestService.getResource();
      resource.query(obj, function (data, response) {
        var headers = response();
        console.log('1111', data);
        gridOptions.data = data;
        gridOptions.totalItems = parseInt(headers['x-pagination-total-count']);
        $('#chekpoints-loading-wraper').fadeOut(500);
       // FullPopupLoader.hidePopup();
      }, function (error) {
      //  FullPopupLoader.hidePopup();
      });
    }
    // $scope.gridOptions.filters.Parks =  GlobalStorage.getStorage("Parks");
    $scope.gridOptions.filters.Users =  GlobalStorage.getStorage("Users");
    // $scope.gridOptions.filters.Graphs =  GlobalStorage.getStorage("Graphs");
    // $scope.gridOptions.filters.Routes =  GlobalStorage.getStorage("Routes");
    // $scope.gridOptions.filters.VehicleModels = GlobalStorage.getStorage("VehicleModels");
    $scope.gridOptions.loadData({'parks_id': $scope.userData.pid, date: $scope.date}, $scope.gridOptions);
    $scope.$on('PageMonitoringContentChanged',function (event,data) {
      $('#chekpoints-loading-wraper').fadeIn(500);
      $scope.gridOptions.parksFilter = data;
      $scope.gridOptions.reloadCurrentData();
    });
    /**
     * Function pseudo filter for displaying field "Routes and Grapth" in grid for cell template
     */
    // $scope._showRoutesParks = function (routes_id, graphs_id) {
    //   var routes = "NONE", graphs = 'NONE';
    //   var arrRoutes = $scope.gridOptions.filters.Routes;
    //   for (var i = 0; i < arrRoutes.length; i++) {
    //     if (arrRoutes[i].id == routes_id) {
    //       routes = arrRoutes[i].name;
    //       break;
    //     }
    //   }
    //   var arrGraphs = $scope.gridOptions.filters.Graphs;
    //   for (var i = 0; i < arrGraphs.length; i++) {
    //     if (arrGraphs[i].id == graphs_id) {
    //       graphs = arrGraphs[i].name;
    //       break;
    //     }
    //   }
    //   return routes + "/" + graphs;
    // };

    $scope.toggleBS = function() {
      if($('#ms-bottom-screen').hasClass('expanded')) {
        $('#ms-bottom-screen').removeClass('expanded');
      } else {
        $('#ms-bottom-screen').addClass('expanded');
      }
    };

    $scope.confirmAction = function(d, item) {
      var res = MonitoringCompanyRestService.getGatesResource();
      var note = {
        workshift_id: item.id,
        vehicles_id: item.veh,
        status: 0,
        author_id: $scope.userData.id,
        date: $scope.date,
        time: $filter('date')(new Date(), 'HH:mm:ss')
      };
      if(d == 'in') {
        note.status = 1;
      }
      res.save(note, function(data, response) {
        console.log('pg-saved', data);
      }, function(error){console.log(error);});
    };
    $scope.discardAction = function(d, item) {

    };


    $scope.toggleButtons = function ($event) {
      var el = angular.element($event.currentTarget);
      // $('li.show-control').removeClass('show-control');
      if(el.hasClass('show-control')) {
        el.removeClass('show-control');
      } else {
        el.addClass('show-control');
      }

    };
    /**
     * Filter for grids cell vehicle model
     */
    app.filter('vehicleMCModelMap', function () {
      return function (id) {
            for (var j = 0; j < $scope.gridOptions.filters.VehicleModels.length; j++) {
              if ($scope.gridOptions.filters.VehicleModels[j].id == id) {
                return $scope.gridOptions.filters.VehicleModels[j].name;
              }
            }
        return id;
      };
    });
    app.filter('FullNameToShort', function() {
      return function(input) {
        if(input) {
          var names = input.split(' ');
          return names[0] + ' ' + names[1].charAt(0) + '. ' + names[2].charAt(0);
        } else  {
          return '';
        }

      }
    });
  }]);

/**
 * Filter for grids cell "gates".
 */
app.filter('mapMCGates', function () {
  var typeHash = {
    1: '?',
    2: '+',
    0: '?',
    3: '?'
  };
  return function (input) {
    if (input == null) {
      return '';
    } else {
      return typeHash[input];
    }
  };
});

/**
 * Filter for grid cell "VTK".
 */
app.filter('mapMCVTK', function () {
  var typeHash = {
    1: '?',
    2: '+',
    3: '-',
    0: '-'
  };
  return function (input) {
    if (input == null) {
      return '';
    } else {
      return typeHash[input];
    }
  };
});

/**
 * Filter for grids cell "Medical Service".
 */
app.filter('mapMCMedicalService', function () {
  var typeHash = {
    1: '?',
    2: '+',
    3: '-',
    0: '-'
  };
  return function (input) {
    if (input == null) {
      return '';
    } else {
      return typeHash[input];
    }
  };
});

/**
 * Filter for grid cell "fuel"
 */
app.filter('fuelMCMap', function () {
  return function (input) {
    if (input == -2) {
      return 'не заправлявся';
    }
    if (input == -1) {
      return 'відмітився';
    }
    if (input >= 0) {
      return input + "";
    }
  };
});

/**
 * Fileter for grids cell "state"
 */
app.filter('stateMCMap', function () {
  return function (input) {
    if (input == 0)
      return 'Наряд';
    if (input == 1)
      return 'Депо';
    if (input == 2)
      return 'Лінія';
    if (input == 3)
      return 'Перезміна';
    if (input == 4)
      return 'Завершено';
    if (input == 5)
      return 'Перерва';
  };
});
app.filter('sliceTime', function() {
  return function(input) {
    if(input) {
      var data = input.split(':');
      return data[0]+':'+data[1];
    } else {
      return '';
    }
  }
});

/**
 * Function added css class for VTK cell.
 */
function cellClassMCVtkMs(grid, row, col, rowRenderIndex, colRenderIndex) {
  switch (grid.getCellValue(row,col)) {
    case '2': {
      return 'cell-green';
    }
      break;
    case '3': {
      return 'cell-red';
    }
      break;
    default: {
      return grid.getCellValue(row,col);
    }
      break;
  }

}
function cellClassVname(grid, row, col, rowRenderIndex, colRenderIndex) {
  if(row.entity.mc !== '2' || row.entity.tcd !== '2' || row.entity.gt !== '2') {
    return 'cell-red red-left-border';
  } else {
    return 'red-left-border';
  }
}
/**
 * Function added css class for Arrival cell.
 */
function cellClassMCArrival(grid, row, col, rowRenderIndex, colRenderIndex) {
  if (row.entity.arrival < row.entity.departure_plan) {
    return 'cell-green red-left-border';
  }
  return 'cell-red red-left-border';
}

/**
 * Function added css class for "Departure Fact" cell.
 */
function cellClassMCDepartureFact(grid, row, col, rowRenderIndex, colRenderIndex) {
  if (row.entity.departure_plan < row.entity.departure_fact) {
    return 'cell-green';
  }
  return 'cell-red';
}

function sortMG (a, b, rowA, rowB, direction) {
  var a_arg = parseInt(rowA.entity.rname);
  var b_arg = parseInt(rowB.entity.rname);
  // console.log('11111',a_arg);
  if ( a_arg < b_arg )
    return -1;
  if ( a_arg > b_arg )
    return 1;
  return 0;
}