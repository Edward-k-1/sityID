app.controller('WorkersGridController', ['$scope', '$http', 'WorkersRestService','WorkerViewsRestService',
  "FullPopupLoader",'ParksRestService','UserRestService','customUnixTimeFilter',"GlobalStorage","customUnixDateFromDBFilter",
  function ($scope, $http, WorkersRestService,WorkerViewsRestService, FullPopupLoader,ParksRestService,UserRestService,
            customUnixTimeFilter,GlobalStorage,customUnixDateFromDBFilter) {


    $scope.gridOptions = new GridController(null, null);
    /**
     * Defined columns for grid
     */
    $scope.gridOptions.initColumnDefs = function () {
      $scope.gridOptions.columnDefs = [
        {name: 'id', displayName: 'id', enableCellEdit: false, width: 60,visible: false,headerCellClass:"worker-name-cell-template"},
     /*   {name: 'last_name', displayName: 'Last name', enableCellEdit: false},
        {name: 'first_name', displayName: 'First  name', enableCellEdit: false},
        {name: 'middle_name', displayName: 'Middle name', enableCellEdit: false},*/
        {name: 'name', displayName: 'Name', enableCellEdit: false, width: 160,headerCellClass:"worker-name-cell-template"},
        {name: 'basic_number', displayName: 'basic_number', enableCellEdit: false, width: 160,headerCellClass:"worker-name-cell-template"},
        {name: 'company_number', displayName: 'company_number',visible: false, enableCellEdit: false, width: 160,headerCellClass:"worker-name-cell-template"},
        {name: 'parks_id', displayName: 'parks_id', enableCellEdit: false, width: 160,cellFilter: 'ParksMap',headerCellClass:"worker-name-cell-template"},
        {name: 'worker_views_id', displayName: 'worker_views_id', enableCellEdit: false, width: 160, cellFilter: 'WorkerViewsMap',headerCellClass:"worker-name-cell-template"},
        {name: 'status', displayName: 'status', enableCellEdit: false, width: 160,headerCellClass:"worker-name-cell-template"},
        {name: 'date_added', displayName: 'date_added', enableCellEdit: false, width: 160,cellFilter:"customUnixDateFromDB",headerCellClass:"worker-name-cell-template"},
        {name: 'date_of_dismissal', displayName: 'date_of_dismissal', enableCellEdit: false, width: 160,cellFilter:"customUnixDateFromDB",headerCellClass:"worker-name-cell-template"},
        {name: 'created_at', displayName: 'created_at',enableCellEdit: false,width: 180,cellFilter: 'customUnixTime',headerCellClass:"worker-name-cell-template"},
        {name: 'updated_at',displayName: 'updated_at',enableCellEdit: false,width: 180,cellFilter: 'customUnixTime',headerCellClass:"worker-name-cell-template"},
        {name: 'author_id', displayName: 'author_id', enableCellEdit: false, width: 180, cellFilter: 'userMap',headerCellClass:"worker-name-cell-template"},
        {name: 'updater_id', displayName: 'updater_id', enableCellEdit: false, width: 120, cellFilter: 'userMap',headerCellClass:"worker-name-cell-template"}
      ];
    };
    $scope.gridOptions.useExternalPagination =false;
    $scope.selectFilter={searchWorkerView:""};
    $scope.workersTypes={selected:[]};
    $scope.workersParks={selected:[]};
    $scope.workersTypes.list =  GlobalStorage.getStorage("WorkerViews");

    /**
     * Set header text from language words store
     */
    $scope.gridOptions.initColumnNameDefs = function () {
      var i =0;
      $scope.gridOptions.columnDefs[i].displayName = $scope.lang.words["id"];i++;
     /* $scope.gridOptions.columnDefs[i].displayName = $scope.lang.words["Last name"];i++;
      $scope.gridOptions.columnDefs[i].displayName = $scope.lang.words["First name"];i++;
      $scope.gridOptions.columnDefs[i].displayName = $scope.lang.words["Middle name"];i++;*/
      $scope.gridOptions.columnDefs[i].displayName = $scope.lang.words["name"];i++;
      $scope.gridOptions.columnDefs[i].displayName = $scope.lang.words["basic number"];i++;
      $scope.gridOptions.columnDefs[i].displayName = $scope.lang.words["company number"];i++;
      $scope.gridOptions.columnDefs[i].displayName = $scope.lang.words["parks"];i++;
      $scope.gridOptions.columnDefs[i].displayName = $scope.lang.words["workers views"];i++;
      $scope.gridOptions.columnDefs[i].displayName = $scope.lang.words["status"];i++;
      $scope.gridOptions.columnDefs[i].displayName = $scope.lang.words["date added"];i++;
      $scope.gridOptions.columnDefs[i].displayName = $scope.lang.words["date of dismissal"];i++;
      $scope.gridOptions.columnDefs[i].displayName = $scope.lang.words["created_at"];i++;
      $scope.gridOptions.columnDefs[i].displayName = $scope.lang.words["updated_at"];i++;
      $scope.gridOptions.columnDefs[i].displayName = $scope.lang.words["author_id"];i++;
      $scope.gridOptions.columnDefs[i].displayName = $scope.lang.words["updater_id"];i++;
      $scope.gridOptions.updateData();
    };

    /**
     * Language preference
     */
    $scope.gridOptions.initColumnDefs();
    if ($scope.lang.hasOwnProperty('words')) {
      $scope.gridOptions.initColumnNameDefs();
    }
    $scope.$on('LanguageChanged', function (event, data) {
      $scope.gridOptions.initColumnNameDefs();
    });

   /* $scope.$on('PageWorkerContentChanged',function (event,data) {
      $scope.gridOptions.loadData( );
    });*/

    /**
     * Function which load data for grid
     */
    $scope.gridOptions.loadData = function () {
      loadWorkers();
    };

/**
  * Executes the function when changing the ID of the park to reload the data in the grid
  */
    var listenerChangeParks = function (newValue, oldValue, scope) {
      if (newValue === oldValue) {
        return;
      }
        $scope.workersTypes.selected =[];
        $scope.gridOptions.loadData();

    };
      $scope.$watch('workers.parks_id', listenerChangeParks);


    /***
     * Applies filter to select when event md-on-close
     */
    $scope.applyFilter = function() {
      $scope.selectFilter.searchWorkerView = "";
      $scope.selectFilter.searchWorkerParks = "";
      console.log("applyFilter");
      var workersGrid = [];
      var workers = GlobalStorage.getStorage("Workers");
      if ($scope.workers.parks_id > 0) {
        for (var i = 0; i < workers.length; i++) {
          if (workers[i].parks_id == $scope.workers.parks_id) {
            workersGrid.push(workers[i]);
          }
        }
      }
      else if ($scope.workersParks.selected.length>0)
      {
        var selected = $scope.workersParks.selected;
;        console.log("99999999",selected,workers);

        for (var i = 0; i < workers.length; i++) {
          for (var j = 0; j < selected.length; j++) {
            if (workers[i].parks_id == selected[j]) {
              workersGrid.push(workers[i]);
              break;
            }
          }
        }


      }
      else {
        workersGrid = workers;
      }
      if ($scope.workersTypes.selected.length > 0) {
        var workersGridFiltered = [];
        for (var i = 0; i < workersGrid.length; i++) {
          for (var j = 0; j < $scope.workersTypes.selected.length; j++) {
            if (workersGrid[i].worker_views_id == $scope.workersTypes.selected[j]) {
              workersGridFiltered.push(workersGrid[i]);
              break;
            }
          }
        }
      }
      else{workersGridFiltered  = workersGrid};
      $scope.gridOptions.data =  workersGridFiltered;
    };
    /**
     * Load workers to grid
     */
    function loadWorkers() {
      var workersGrid = [];
      var workers = GlobalStorage.getStorage("Workers");
      if ($scope.workers.parks_id>0) {
        for (var i = 0; i < workers.length; i++) {
          if (workers[i].parks_id == $scope.workers.parks_id) {
            workersGrid.push(workers[i]);
          }
        }
      }
      else{
        workersGrid = workers;      }
      $scope.gridOptions.data = workersGrid;
    }

    $scope.gridOptions.filters.Parks =  GlobalStorage.getStorage("Parks");
    $scope.gridOptions.filters.Users =  GlobalStorage.getStorage("Users");
    $scope.gridOptions.filters.WorkerViews =  GlobalStorage.getStorage("WorkerViews");
    loadWorkers({'per-page': $scope.gridOptions.paginationPageSize, page: 1},$scope.gridOptions);
    /**
     * Filters for grid.
     */
    app.filter('userMap', function () {
      return function (id) {
        for (var i = 0; i < $scope.gridOptions.filters.Users.length; i++) {
          if ($scope.gridOptions.filters.Users[i].id == id) {
            return $scope.gridOptions.filters.Users[i].username;
          }
        }
        return 'undefined';
      };
    });

    app.filter('WorkerViewsMap', function () {
      return function (id) {
        for (var i = 0; i < $scope.gridOptions.filters.WorkerViews.length; i++) {
          if ($scope.gridOptions.filters.WorkerViews[i].id == id) {
            return $scope.gridOptions.filters.WorkerViews[i].name;
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
  }]);

