/**
 * Created by walex on 15.02.17.
 */
app.controller('CalendarGridController', ['$scope','$http','OrdersRestService','FullPopupLoader','customUnixTimeFilter','$filter','$timeout',
    '$mdDialog','$rootScope','GlobalStorage',
    function ($scope,$http,OrdersRestService,FullPopupLoader,customUnixTimeFilter,$filter,$timeout,$mdDialog,$rootScope,GlobalStorage) {
        // $('#chekpoints-loading-wraper').fadeIn(500);
        // $('#chekpoints-loading-wraper').fadeIn(500);
        $scope.userData = $rootScope.UserData;
        $scope.gridOptions = new GridController(null, null);

        $scope.obj = {
            month:undefined,
            year:undefined
        };
        $scope.lang = $rootScope.lang;
        $scope.gridOptions.enableFiltering = false;
        $scope.gridOptions.enableColumnMenus = false;
        $scope.gridOptions.rowHeight = 25;

        $scope.gridOptions.columnVirtualizationThreshold = 20;
        $scope.gridOptions.virtualizationThreshold = 200;

        $scope.date = $filter('date')(new Date(), 'yyyy-MM-dd');

        $scope.gridOptions.rowTemplate = '<div ng-dblclick="grid.options.showDaysTypes(row)" ' +
            'ng-class="{ \'grid-row-edited\':row.entity.__changed, \'grid-row-new\':row.entity.__isNew}">' +
            '<div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name"' +
            ' class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }" ui-grid-cell></div></div>';

        $scope.gridOptions.columnDefs = [
            {name:'id',langName:'id',category:"column0",displayName:'id',enableCellEdit:false,width:50,pinnedLeft:true,visible:false},
            // {name:'routes_id',langName:'R',category:"Route-graph",field:'name',displayName:'',enableCellEdit:false,width:100},
            {name:'month',langName:'M',category:"Route-graph",field:'month',displayName:'Місяць',enableCellEdit:false,width:100},
            {name:'year',langName:'Y',category:"Route-graph",field:'year',displayName:'Рік',enableCellEdit:false,width:100},
            {name:'days',langName:'D',category:"Route-graph",field:'days',displayName:'Розклад',enableCellEdit:false,width:100,cellTemplate:'<div class="ui-grid-cell-contents">www</div>'},
        ]

        $scope.gridOptions.loadData = function() {
            // var resource = OrdersRestService.getCalendarResource();
            // resource.query(obj, function(data, response) {
            //
            // }, function(error) {console.log(error);});
            $scope.gridOptions.data = [
                {month:1,year:2017},
                {month:2,year:2017},
                {month:3,year:2017},
                {month:4,year:2017},
                {month:5,year:2017},
                {month:6,year:2017},
                {month:7,year:2017},
                {month:8,year:2017},
                {month:9,year:2017},
                {month:10,year:2017},
                {month:11,year:2017},
                {month:12,year:2017}
            ]
        }
        $scope.gridOptions.loadData();
        $scope.gridOptions.showDaysTypes = function(row) {
            $mdDialog.show({
                controller: 'CalendarEditController',
                templateUrl: 'app/templates/popup/calendarEditWindows.tpl.html',
                parent: angular.element(document.body),
                clickOutsideToClose:false,
                locals: {row: row}
            }).then(function() {
                $scope.gridOptions.reloadCurrentData();
            }, function() {
                $scope.gridOptions.reloadCurrentData();
            });
        };

    }]);