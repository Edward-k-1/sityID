app.controller('WorkersGraphsGridController', ['$scope', '$http', 'WorkersRestService','WorkerViewsRestService',
  "FullPopupLoader",'ParksRestService','UserRestService','customUnixTimeFilter',"GlobalStorage","customUnixDateFromDBFilter",
  "WorkersGraphsRestService","$filter","uiGridConstants","$window","$mdDialog",
  function ($scope, $http, WorkersRestService,WorkerViewsRestService, FullPopupLoader,ParksRestService,UserRestService,
            customUnixTimeFilter,GlobalStorage,customUnixDateFromDBFilter,WorkersGraphsRestService,$filter,uiGridConstants,$window,$mdDialog) {
    $scope.currentWorkerDate = {year: 2017, month: 1};

    $scope.current_month = new Date();
    //  $scope.current_month.setYear(2017);
    $scope.current_month.setMonth(1);
    //  $scope.current_month.setDate(26);
    $scope.example = {
      value: new Date(2017, 9, 1)
    };
    var flag_has_edit = false;
    var current_grid_menu_value = null;

    /*
     * Loading grapth when load
     *
     * **/
    $scope.dataPickerChange = function () {

      var month = $filter('date')($scope.current_month, 'M');
      var year = $filter('date')($scope.current_month, 'yyyy');

      var array_list = [];
      for (var i = 0; i < array_to_grid.length; i++) {
        array_list.push(parseInt(array_to_grid[i].id));
      }

      // console.d($scope.current_month);
      loadGraphs(array_list, month, year);


    };

    $scope.reloadCurrentData = function () {
      var array_to_grid = [];
      var month = $filter('date')($scope.current_month, 'M');
      var year = $filter('date')($scope.current_month, 'yyyy');
      var newPage = $scope.gridOptions.paginationCurrentPage;
      var pageSize = $scope.gridOptions.paginationPageSize;
      for (var i = (newPage-1)*pageSize; i < (newPage-1)*pageSize + pageSize && worker_array.length>i; i++) {
        array_to_grid.push(worker_array[i]);

      }


      console.log("dataPickerChange", $scope.current_month, year);
      // console.d($scope.current_month);
      loadGraphs(array_to_grid,month,year);


    };




    $scope.currentWorkerDate.month = ($scope.current_month.getMonth());
    $scope.gridOptions = new GridController(null, null);


    /**
     * Defined columns for grid
     */
    $scope.gridOptions.initColumnDefs = function (count_day) {

      $scope.gridOptions.columnDefs = [
        {name: 'id', displayName: 'id', enableCellEdit: false, width: 60, visible: false},
        {
          name: 'name',
          displayName: 'Name',
          enableCellEdit: false,
          width: 160,
          headerCellClass: "worker-name-cell-template",
          cellTemplate: '<div  ng-mousedown="grid.options.RightMenu($event,row)" oncontextmenu="return false" class="ui-grid-cell-contents id-{{row.entity.id}}" >{{grid.getCellValue(row, col)}}</div>'
        },
      ];
      for (var i = 0; i < count_day; i++) {

        var editDropDown1 = {id: 0};
        editDropDown1["_" + (i + 1)] = "Вих.";
        var editDropDown2 = {id: 1};
        editDropDown2["_" + (i + 1)] = "Пр.";
        var date = new Date();
        date.setYear($scope.current_month.getYear());
        date.setMonth($scope.current_month.getMonth());
        date.setDate(i + 1);
        var number_of_week = date.getDay();
        var days = ['Нед', 'Пон', 'Вів', 'Сер', 'Чет', 'Пят', 'Суб'];
        var header_template = '<div class="day-cell-template"><div style="text-align: center">' + (i + 1) + '</div><div style="text-align: center;font-size: 10px">' + days[number_of_week] + '</div></div>';
        $scope.gridOptions.columnDefs.push({
          name: "_" + (i + 1),
          displayName: "" + (i + 1),
          cellEditableCondition: flag_has_edit,
          enableCellEdit: true,
          width: 40,
          enableSorting: false,
          enableHiding: false,
          enableColumnMenu: false,
          cellFilter: "WorkerGraphsMap",
          cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
            //  console.log("cellStyle",grid, row, col, rowRenderIndex, colRenderIndex);
            var colv = grid.getCellValue(row, col);
            switch (colv) {
              case 0: {
                return 'red';
              }
              case 1: {
                return 'green';
              }
              default: {
                return '';
              }
            }
          },
          editableCellTemplate: 'ui-grid/dropdownEditor',
          editDropdownValueLabel: "_" + (i + 1),
          editDropdownOptionsArray: [
            editDropDown1,
            editDropDown2
          ],
          headerCellTemplate: header_template
        });
      }
    };
    /*
     * End init column define;
     * **/
    $scope.gridOptions.RightMenu = function ($event, row) {
      if (flag_has_edit==false)
      {
        return;
      }
      console.log("deleteGridRow", $event,row);
      $event.stopPropagation();
      showContextMenu($event);
      current_grid_menu_value = row;

    }
    $scope.fillAllWorked = function () {
      hideContextMenu();


        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm()
          .title('Ви справді хочете заповнити всі дні робочими')
          .textContent('Всі дні в даному місяці для даного працівника '+current_grid_menu_value.entity.name+' будуть заповнені робочими.')
          .ariaLabel('')
          .ok('Підтвердити')
          .cancel('Відміна');

        $mdDialog.show(confirm).then(function() {
          var month = $filter('date')($scope.current_month, 'M');
          var year = $filter('date')($scope.current_month, 'yyyy');
          var workers_id = current_grid_menu_value.entity.id;
          saveFillAllWorkersDay(workers_id, month,year,1);

        }, function() {

        });
    }



    $scope.fillAllFree = function () {
      hideContextMenu();
      // Appending dialog to document.body to cover sidenav in docs app
      var confirm = $mdDialog.confirm()
        .title('Ви справді хочете заповнити всі дні вихідними')
        .textContent('Всі дні в даному місяці для даного працівника '+current_grid_menu_value.entity.name+' будуть заповнені віхідними.')
        .ariaLabel('')
        .ok('Підтвердити')
        .cancel('Відміна');

      $mdDialog.show(confirm).then(function() {
        var workers_id = current_grid_menu_value.entity.id;
        var month = $filter('date')($scope.current_month, 'M');
        var year = $filter('date')($scope.current_month, 'yyyy');
        console.log("workers_id, month,year,2",workers_id, month,year,2);
        saveFillAllWorkersDay(workers_id, month,year,2);
      }, function() {

      });


    };

    function saveFillAllWorkersDay(workers_id, month,year,type)
    {
      var resource = WorkersGraphsRestService.getResource();
      resource.fillWorkerMonthGraphs({'workers_id': workers_id,month:month,year:year,type:type}, function (data, response) {
        console.log("saveFillAllWorkersDay    ok");
        $scope.reloadCurrentData();
      }, function (error) {
        console.log("saveFillAllWorkersDay    false");
      });
    }

    function hideContextMenu()
    {
      $("#grid-worker-context-menu-name").fadeOut(100);

    }
    function showContextMenu($event)
    {
      $("#grid-worker-context-menu-name").fadeIn(100);
      $("#grid-worker-context-menu-name").css("top",$event.pageY);
      $("#grid-worker-context-menu-name").css("left",$event.pageX);

    }

    $window.onmousedown = function(){
      hideContextMenu();
    };




    var worker_array  = GlobalStorage.getStorage("Workers");
    $scope.gridOptions.totalItems = worker_array.length ;
    var  array_to_grid = [];
    for (var i = 0; i<255;i++)
    {
      array_to_grid.push(worker_array[i]);
    }
    $scope.dataPickerChange();




    $scope.gridOptions.onRegisterApi = function (gridApi) {
      $scope.gridApi = gridApi;

      /***
       * Save value after edit
       */
      gridApi.edit.on.afterCellEdit(null/*$scope*/, function (rowEntity, colDef, newValue, oldValue) {
        if (newValue != oldValue) {
          var workers_id  =rowEntity.id;
          console.log("afterCellEdit",rowEntity, colDef, newValue, oldValue);
            var date =  $filter('date')($scope.current_month, 'yyyy')+"-"+$filter('date')($scope.current_month, 'M')+"-"+colDef.displayName;
          var resource =  WorkersGraphsRestService.getResource();
          resource.saveWorkerDay({'workers_id': workers_id,date:date,type: newValue}, function (data, response) {

          }, function (error) {
          });

        }
      });

      /**
       * Pagination change
       */

        gridApi.pagination.on.paginationChanged(null, function (newPage, pageSize) {
          array_to_grid = [];
          $scope.gridOptions.totalItems = worker_array.length ;

          //if (worker_array.length>newPage*pageSize){

          for (var i = (newPage-1)*pageSize; i < (newPage-1)*pageSize + pageSize && worker_array.length>i; i++) {
              array_to_grid.push(worker_array[i]);

            }
          var month = $filter('date')($scope.current_month, 'M');
          var year = $filter('date')($scope.current_month, 'yyyy');
            loadGraphs(array_to_grid,month,year);
        //}
        });
    };

    /**
     *
     * @param array_list
     * @param month
     * @param year
     */
    function loadGraphs(array_list,month,year) {
      $("#chekpoints-loading-wraper").fadeIn(100);
      var array_list = [];
      for (var i = 0; i < array_to_grid.length; i++) {
        array_list.push(parseInt(array_to_grid[i].id));
      }
      var resource = WorkersGraphsRestService.getResource();
      resource.getWorkersCalendar({'workers_ids': array_list,month:month,year:year}, function (data, response) {
        console.log("Get workers graphs data", data);
        for (var i = 0; i < array_to_grid.length; i++) {
          angular.extend(array_to_grid[i], data.array[i]);
        }
        flag_has_edit= data.hasedit;
        $scope.gridOptions.initColumnDefs(daysInMonth(month,year));
        $scope.gridOptions.data = array_to_grid;
        $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
        $("#chekpoints-loading-wraper").fadeOut(100);
      }, function (error) {
        $("#chekpoints-loading-wraper").fadeOut(100);

      });

    }
/**
 * ***/
    app.filter('WorkerGraphsMap', function () {
      return function (type) {
        switch (type)
        {
          case 0:
          {
            return "Вих.";
          }break;
          case 1:
          {
            return "Пр.";
          }break;
          default:
          {
            return "";
          }
          break;
        }

      };
    });



    function daysInMonth(month,year) {
      return new Date(year, month, 0).getDate();

    }


  }]);

