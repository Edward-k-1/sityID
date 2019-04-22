app.controller('SmartCardCreatorGridController', ['$scope', '$rootScope', '$mdDialog', 'LanguageService'
  , 'FullPopupLoader', 'uiGridConstants', 'customUnixTimeOnlyFilter', "GlobalStorage", "SmartCardRestService",
  "FilterWorkerNameByIdFilter", "FilterWorkerNumberByIdFilter", "FilterStatusSmartCardsFilter", "customUnixTimeFilter",
  "FilterUserNameByIdFilter",
  function ($scope, $rootScope, $mdDialog, LanguageService
    , FullPopupLoader, uiGridConstants, customUnixTimeOnlyFilter, GlobalStorage, SmartCardRestService
    , FilterWorkerNameByIdFilter, FilterWorkerNumberByIdFilter, FilterStatusSmartCardsFilters, customUnixTimeFilter,
            FilterUserNameByIdFilter) {
    $scope.lang = $rootScope.lang;
    $scope.gridOptions = new GridController(null, null);

    /**
     * Define grid column
     */
    $scope.gridOptions.initColumnDefs = function () {
      $scope.gridOptions.columnDefs = [
        {name: 'id', displayName: 'id', enableCellEdit: false, width: 40, visible: false,headerCellClass:"grid-cell-header"},
        {name: 'card_key',displayName: '',  enableCellEdit: false, width: 160,headerCellClass:"grid-cell-header"},
        {
          name: 'workers_name', field: "workers_id",displayName: '', enableCellEdit: false, width: 160,
          cellFilter: "FilterWorkerNameById",headerCellClass:"grid-cell-header"
        },
        {
          name: 'workers_number', field: "workers_id",displayName: '', enableCellEdit: false, width: 160,
          cellFilter: "FilterWorkerNumberById",headerCellClass:"grid-cell-header"
        },
        {
          name: 'status', field: "status",displayName: '', enableCellEdit: false, width: 160,
          cellFilter: "FilterStatusSmartCards",headerCellClass:"grid-cell-header"
        },
        {
          name: 'activation_date',displayName: '',field: "activation_date",
          enableCellEdit: false, width: 160, cellFilter: "customUnixTime",headerCellClass:"grid-cell-header"
        },
        {name: 'created_at',displayName: '', enableCellEdit: false, width: 180, cellFilter: "customUnixTimeOnly",headerCellClass:"grid-cell-header"},
        {name: 'updated_at',displayName: '', enableCellEdit: false, width: 100, cellFilter: "customUnixTimeOnly",headerCellClass:"grid-cell-header"},
        {name: 'author_id', displayName: '', enableCellEdit: false, width: 180, cellFilter: "FilterUserNameById",headerCellClass:"grid-cell-header"},
        {name: 'updater_id',displayName: '', enableCellEdit: false, width: 120, cellFilter: "FilterUserNameById",headerCellClass:"grid-cell-header"}
      ];
    };

    $scope.gridOptions.rowTemplate = '<div ng-dblclick="grid.options.showEditPopup(row)" ' +
      'ng-class="{ \'grid-row-edited\':row.entity.__changed, \'grid-row-new\':row.entity.__isNew}">' +
      '<div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name"' +
      ' class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }" ui-grid-cell></div></div>';

    /**
     * Define function for display or change grid header text
     */
    $scope.gridOptions.initColumnNameDefs = function () {
      console.log("initColumnNameDefs");
      var i = 0;
      $scope.gridOptions.columnDefs[i].displayName = $scope.lang.words["id"];
      i++;
      $scope.gridOptions.columnDefs[i].displayName = $scope.lang.words["Smart-cards UID"];
      i++;
      $scope.gridOptions.columnDefs[i].displayName = $scope.lang.words["Worker name"];
      i++;
      $scope.gridOptions.columnDefs[i].displayName = $scope.lang.words["Worker number"];
      i++;
      $scope.gridOptions.columnDefs[i].displayName = $scope.lang.words["status"];
      i++;
      $scope.gridOptions.columnDefs[i].displayName = $scope.lang.words["Date of activation"];
      i++;
      $scope.gridOptions.columnDefs[i].displayName = $scope.lang.words["created_at"];i++;
      $scope.gridOptions.columnDefs[i].displayName = $scope.lang.words["updated_at"];i++;
      $scope.gridOptions.columnDefs[i].displayName = $scope.lang.words["author_id"];i++;
      $scope.gridOptions.columnDefs[i].displayName = $scope.lang.words["updater_id"];i++;
      $scope.gridOptions.updateData();
    };

    /***
     * Define language settings
     */
    $scope.gridOptions.initColumnDefs();
    if ($scope.lang.hasOwnProperty('words')) {
      $scope.gridOptions.initColumnNameDefs();
    }
    $scope.$on('LanguageChanged', function (event, data) {
      $scope.gridOptions.initColumnNameDefs();
    });


    /**
     * Display popup for edit smart-card.
     */
    $scope.gridOptions.showEditPopup = function (row, grid) {
      var grid = $scope.gridOptions;
      $mdDialog.show({
        controller: "EditSmartCardsDialogController",
        templateUrl: 'app/templates/grid/smartcards/smartcards_edit_dialog.tpl.html',
        parent: angular.element(document.body),
        clickOutsideToClose: false,
        locals: {row: row.entity, grid: $scope.gridOptions}
      })
        .then(function () {
          $scope.gridOptions.reloadCurrentData();
        }, function () {
          $scope.gridOptions.reloadCurrentData();
        });
    };
    
    $scope.addSmartCarts = function () {
      console.log("addSmartCarts");
      $mdDialog.show({
        controller: "AddSmartCardsDialogController",
        templateUrl: 'app/templates/grid/smartcards/smartcards_add_dialog.tpl.html',
        parent: angular.element(document.body),
        clickOutsideToClose: false,
        locals: {}
      })
        .then(function () {
       /****/
        }, function () {
         /*
         *
         * **/
        });
    };

    /**
     * Load smart-card from server
     */
    function loadSmartCards(obj, gridOptions) {
      var resource = SmartCardRestService.getResource();
      resource.query(obj, function (data, response) {
        gridOptions.data = data;
      }, function (error) {
      });
    }

    $scope.gridOptions.loadData = function (obj, gridOptions) {
      loadSmartCards(obj, gridOptions);
    };
    $scope.gridOptions.reloadCurrentData();
  }]);

