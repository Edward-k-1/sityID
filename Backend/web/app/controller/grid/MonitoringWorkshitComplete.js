app.controller('MonitoringWorkshitComplete', ['$scope', '$http','$resource','FullPopupLoader','AuthService',"OrdersRestService","$mdDialog",
  function ($scope, $http,$resource,FullPopupLoader,AuthService,OrdersRestService,$mdDialog) {

//$scope.scope = $scope;
    console.log("MonitoringWorkshitComplete",$scope);
    $scope.gridOptions = {};
$scope.gridOptions.data=[];
   var resource =  OrdersRestService.getResource();
    resource.getCurrentOrders({parks_id:4}, function (data, response) {
      $scope.gridOptions.data = data;
      console.log("data MonitoringWorkshitComplete", data);
    }, function (error) {

    });
    $scope.gridOptions.rowTemplate = '<div ng-dblclick="grid.options.showEditPopup(row)" ' +
      'ng-class="{ \'grid-row-edited\':row.entity.__changed, \'grid-row-new\':row.entity.__isNew,\'not-complete\':row.entity.com_driver_workshift == null}">' +
      '<div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name"' +
      ' class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }" ui-grid-cell></div></div>';



    $scope.gridOptions.initColumnDefs = function () {
      $scope.gridOptions.columnDefs = [
        {name: 'id',displayName:"Number orders", enableCellEdit: false, width: 100},
        {name: 'graphs_id', displayName:"Graphs",     enableCellEdit: false,   width: 160},
        {name: 'drivers_name', field:"drivers_id", displayName:"Driver name" ,    enableCellEdit: false,   width: 160},
        {name: 'drivers_number', field:"drivers_id",  displayName:"Base number" ,    enableCellEdit: false,   width: 160},
        {name: 'time_from',  displayName:"Time Start",    enableCellEdit: false,   width: 160},
        {name: 'time_to',   displayName:"Time End",   enableCellEdit: false,   width: 160},
        {name: 'number_workshift', displayName:" Number of workshift", enableCellEdit: false,   width: 160}

      ];
    };
    $scope.gridOptions.initColumnDefs();

    /**
     * Set header text from language words store
     */
    $scope.gridOptions.initColumnNameDefs = function () {
      $scope.gridOptions.columnDefs[0].displayName = $scope.lang.words["id"];
      $scope.gridOptions.columnDefs[1].displayName = $scope.lang.words["name"];;
      $scope.gridOptions.columnDefs[2].displayName = $scope.lang.words["created_at"];;
      $scope.gridOptions.columnDefs[3].displayName = $scope.lang.words["updated_at"];;
      $scope.gridOptions.columnDefs[4].displayName = $scope.lang.words["author_id"];;
      $scope.gridOptions.columnDefs[5].displayName = $scope.lang.words["updater_id"];;
      $scope.gridOptions.updateData();
    };
$scope.gridOptions.showEditPopup = function(row)
{
console.log("ShowEdit Popup",row);

    console.log("addSmartCarts");
    $mdDialog.show({
      controller: "DialogEditWorkshiftComplete",
      templateUrl: 'app/templates/grid/orders/dialog_edit_workshift_complete.tpl.html',
      parent: angular.element(document.body),
      clickOutsideToClose: false,
      locals: {row:row.entity}
    })
      .then(function () {
        /****/
      }, function () {
        /*
         *
         * **/
      });
  };

}]);



