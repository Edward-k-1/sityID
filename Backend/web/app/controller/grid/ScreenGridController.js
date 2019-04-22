/**
 * Created by walex on 04.12.16.
 */
app.controller('ScreenGridController', ['$scope', '$rootScope', '$filter', '$http', '$interval', 'OrdersRestService', 'LanguageService',
    'AuthService', 'uiGridConstants', "GlobalStorage", "AlertsRestService", "SettingsRestService","$mdDialog",
    function ($scope, $rootScope, $filter, $http, $interval, OrdersRestService, LanguageService,
              AuthService, uiGridConstants, GlobalStorage, AlertsRestService, SettingsRestService,$mdDialog) {

        // $scope.repeatCheker = null;
        $scope.userData = $rootScope.UserData;
        $('#chekpoints-loading-wraper').fadeIn(500);
        $scope.gridOptions = new GridController(null, null);

        $scope.date = $filter('date')(new Date(), 'yyyy-MM-dd');
        $scope.gridOptions.flatEntityAccess = true;
        $scope.gridOptions.minRowsToShow = 22;
        $scope.gridOptions.enableFiltering = false;
        $scope.gridOptions.enableColumnMenus = false;
        // $scope.gridOptions.enableSorting = true;
        // $scope.gridOptions.animateRows = true;
        // $scope.gridOptions.enableColumnReordering = true;
        // $scope.gridOptions.jqueryUITheme = true;

        $scope.gridOptions.initColumnDefs = function() {
            // $scope.gridOptions.headerTemplate = 'app/templates/grid/category/categoryHeader.tpl.html';
            // $scope.gridOptions.category = [
            //     {name: 'column0', visible: true,showCatName: false},
            //     {name: 'workshift1', dName:'Зміна 1', visible: true,showCatName: true},
            //     {name: 'Time', dName:'Час', visible: true,showCatName: true},
            //     {name: 'workshift2', dName:'Зміна 2', visible: true,showCatName: true}
            // ];
            $scope.gridOptions.columnDefs = [];
            var columns = [
                {name:'Worker',field:'name',category:'workshift1',displayName:"Водій",enableCellEdit:false,width:200,
                    // cellTemplate:'<div class="ui-grid-cell-contents red-left-border" >{{row.entity.workshift_1.driver.name CUSTOM_FILTERS}}</div>',
                    cellFilter: 'FullNameToShort',
                    // cellClass: RepeatsHightlighter1d
                },
                {name: 'Worker number',field: 'bn', category: 'workshift1',displayName: "Т.№",enableCellEdit: false,width: 100,
                    // cellTemplate:'<div class="ui-grid-cell-contents red-left-border" >{{row.entity.workshift_1.driver.name CUSTOM_FILTERS}}</div>',
                    // cellFilter: 'FullNameToShort',
                    // cellClass: RepeatsHightlighter1d
                },
                {name: 'Vehicle 1 BN',field:'vehicle1_bn', category: 'workshift1',displayName: "ТЗ Б№ (1)",enableCellEdit: false,width: 90,
                    // cellTemplate:'<div class="ui-grid-cell-contents" >{{row.entity.workshift_1.vehicle.state_number}}</div>'
                },
                {name: 'Vehicle 1 SN',field:'vehicle1_sn', category: 'workshift1',displayName: "ТЗ Д№ (1)",enableCellEdit: false,width: 90,
                    // cellTemplate:'<div class="ui-grid-cell-contents" >{{row.entity.workshift_1.vehicle.state_number}}</div>'
                },

                {name: 'route/graph/1',field:'rg_1', category: 'column0', displayName: "М/Г(1)",enableCellEdit: false,width: 60,
                    // cellTemplate:'<div class="ui-grid-cell-contents" >{{row.entity.route}} / {{row.entity.graph}}</div>',
                    // sortingAlgorithm: sortMG,
                    // sort: { direction: 'asc', priority: 0 }
                },

                {name: 'arrival', category: 'Time',field: 'arrival',displayName: "Явка",enableCellEdit: false,width: 70,
                    // cellTemplate:'<div class="ui-grid-cell-contents red-left-border" >{{row.entity.order_data.arrival CUSTOM_FILTERS}}</div>',
                    // cellFilter:'sliceTime'
                },
                {name: 'start_time',field:'t1_s', category: 'Time',displayName: "Початок",enableCellEdit: false,width: 70,
                    // cellTemplate:'<div class="ui-grid-cell-contents red-left-border" >{{row.entity.order_data.time_start CUSTOM_FILTERS}}</div>',
                    cellFilter:'sliceTime'
                },
                {name: 'workshift_time', category: 'Time',displayName: "Перерва",enableCellEdit: false,width: 120,
                    cellTemplate:'<div class="ui-grid-cell-contents" >{{row.entity.t1_e CUSTOM_FILTERS}} | {{row.entity.t2_s CUSTOM_FILTERS}}</div>', cellFilter:'sliceTime'},

                {name: 'end_time',field:'t2_e', category: 'Time',displayName: "Кінець",enableCellEdit: false,width: 70,
                    // cellTemplate:'<div class="ui-grid-cell-contents red-left-border" >{{row.entity.order_data.time_start CUSTOM_FILTERS}}</div>',
                    cellFilter:'sliceTime'
                },

                {name: 'Vehicle 2 BN',field:'vehicle2_bn', category: 'workshift2',displayName: "ТЗ Б№ (2)",enableCellEdit: false,width: 90,
                    // cellTemplate:'<div class="ui-grid-cell-contents" >{{row.entity.workshift_1.vehicle.state_number}}</div>'
                },
                {name: 'Vehicle 2 SN',field:'vehicle2_sn', category: 'workshift2',displayName: "ТЗ Д№ (2)",enableCellEdit: false,width: 90,
                    // cellTemplate:'<div class="ui-grid-cell-contents" >{{row.entity.workshift_1.vehicle.state_number}}</div>'
                },
                {name: 'route/graph/2',field:'rg_2', category: 'column0', displayName: "М/Г(2)",enableCellEdit: false,width: 60,
                    // cellTemplate:'<div class="ui-grid-cell-contents" >{{row.entity.route}} / {{row.entity.graph}}</div>',
                    // sortingAlgorithm: sortMG,
                    // sort: { direction: 'asc', priority: 0 }
                },


                // {name: 'id',field: 'name',displayName: "id",enableCellEdit: false,width: 120},


                // {name: 'Desc', category: 'workshift1',displayName: "Desc",enableCellEdit: false,width: 50,
                //     cellTemplate:'<div class="ui-grid-cell-contents red-left-border" >{{row.entity.change_data.route}} / {{row.entity.change_data.graph}}</div>'},
                //
                // {name: 'conductor', category: 'workshift1',displayName: "Conductor",enableCellEdit: false,width: 200,
                //     cellTemplate:'<div class="ui-grid-cell-contents" >{{row.entity.workshift_1.conductor.name CUSTOM_FILTERS}}</div>',
                //     cellFilter: 'FullNameToShort', cellClass: RepeatsHightlighter1c },
                //  {name: 'end_time', category: 'Time',field: 'name',displayName: "Time to",enableCellEdit: false,width: 70,
                //     cellTemplate:'<div class="ui-grid-cell-contents" >{{row.entity.order_data.time_end CUSTOM_FILTERS}}</div>', cellFilter:'sliceTime'},
                // {name: 'driver2', category: 'workshift2',displayName: "Driver",enableCellEdit: false,width: 200,
                //     cellTemplate:'<div class="ui-grid-cell-contents red-left-border" >{{row.entity.workshift_2.driver.name CUSTOM_FILTERS}}</div>',
                //     cellFilter: 'FullNameToShort', cellClass: RepeatsHightlighter2d },
                // {name: 'vehicle2', category: 'workshift2',displayName: "Vehicle",enableCellEdit: false,width: 90,
                //     cellTemplate:'<div class="ui-grid-cell-contents" >{{row.entity.workshift_2.vehicle.state_number}}</div>'},
                // {name: 'conductor2', category: 'workshift2',displayName: "Conductor",enableCellEdit: false,width: 200,
                //     cellTemplate:'<div class="ui-grid-cell-contents" >{{row.entity.workshift_2.conductor.name CUSTOM_FILTERS}}</div>',
                //     cellFilter: 'FullNameToShort', cellClass: RepeatsHightlighter2c },
            ];
            $scope.pre_columns = angular.extend(columns, false);
            var res = SettingsRestService.getResource();
            res.get({uid:$scope.userData.id, zone:'screen'}, function(data, response) {
                // data = data.join();
                console.log('settings_screen',data);

                var col_order = data.screen.split('-');
                var col_defs = [];
                for(var i = 0; i < col_order.length; i++) {
                    col_defs.push(columns[col_order[i]]);
                }
                $scope.gridOptions.columnDefs = col_defs;
                $scope.gridOptions._init();
                // $scope.gridOptions.initColumnNameDefs();
                // console.log('cols',$scope.gridOptions.columnDefs);
            }, function(error) {console.log(error);});

            // $scope.gridOptions.columnDefs = [
            //     // {name: 'id',field: 'name',displayName: "id",enableCellEdit: false,width: 120},
            //     {name: 'route/graph', category: 'column0', displayName: "r-g",enableCellEdit: false,width: 60,
            //         cellTemplate:'<div class="ui-grid-cell-contents" >{{row.entity.route}} / {{row.entity.graph}}</div>',
            //         // sortingAlgorithm: sortMG,
            //         // sort: { direction: 'asc', priority: 0 }
            //     },
            //     {name: 'driver', category: 'workshift1',displayName: "Driver",enableCellEdit: false,width: 200,
            //         cellTemplate:'<div class="ui-grid-cell-contents red-left-border" >{{row.entity.workshift_1.driver.name CUSTOM_FILTERS}}</div>',
            //         cellFilter: 'FullNameToShort', cellClass: RepeatsHightlighter1d },
            //     {name: 'Desc', category: 'workshift1',displayName: "Desc",enableCellEdit: false,width: 50,
            //         cellTemplate:'<div class="ui-grid-cell-contents red-left-border" >{{row.entity.change_data.route}} / {{row.entity.change_data.graph}}</div>'},
            //     {name: 'vehicle', category: 'workshift1',displayName: "Vehicle",enableCellEdit: false,width: 90,
            //         cellTemplate:'<div class="ui-grid-cell-contents" >{{row.entity.workshift_1.vehicle.state_number}}</div>'},
            //     {name: 'conductor', category: 'workshift1',displayName: "Conductor",enableCellEdit: false,width: 200,
            //         cellTemplate:'<div class="ui-grid-cell-contents" >{{row.entity.workshift_1.conductor.name CUSTOM_FILTERS}}</div>',
            //         cellFilter: 'FullNameToShort', cellClass: RepeatsHightlighter1c },
            //     {name: 'arrival', category: 'Time',field: 'name',displayName: "Arrival",enableCellEdit: false,width: 70,
            //         cellTemplate:'<div class="ui-grid-cell-contents red-left-border" >{{row.entity.order_data.arrival CUSTOM_FILTERS}}</div>', cellFilter:'sliceTime'},
            //     {name: 'start_time', category: 'Time',field: 'name',displayName: "Time from",enableCellEdit: false,width: 70,
            //         cellTemplate:'<div class="ui-grid-cell-contents red-left-border" >{{row.entity.order_data.time_start CUSTOM_FILTERS}}</div>', cellFilter:'sliceTime'},
            //     {name: 'workshift_time', category: 'Time',displayName: "shift change",enableCellEdit: false,width: 120,
            //         cellTemplate:'<div class="ui-grid-cell-contents" >{{row.entity.order_data.time_to CUSTOM_FILTERS}} | {{row.entity.order_data.time_from CUSTOM_FILTERS}}</div>', cellFilter:'sliceTime'},
            //     {name: 'end_time', category: 'Time',field: 'name',displayName: "Time to",enableCellEdit: false,width: 70,
            //         cellTemplate:'<div class="ui-grid-cell-contents" >{{row.entity.order_data.time_end CUSTOM_FILTERS}}</div>', cellFilter:'sliceTime'},
            //     {name: 'driver2', category: 'workshift2',displayName: "Driver",enableCellEdit: false,width: 200,
            //         cellTemplate:'<div class="ui-grid-cell-contents red-left-border" >{{row.entity.workshift_2.driver.name CUSTOM_FILTERS}}</div>',
            //         cellFilter: 'FullNameToShort', cellClass: RepeatsHightlighter2d },
            //     {name: 'vehicle2', category: 'workshift2',displayName: "Vehicle",enableCellEdit: false,width: 90,
            //         cellTemplate:'<div class="ui-grid-cell-contents" >{{row.entity.workshift_2.vehicle.state_number}}</div>'},
            //     {name: 'conductor2', category: 'workshift2',displayName: "Conductor",enableCellEdit: false,width: 200,
            //         cellTemplate:'<div class="ui-grid-cell-contents" >{{row.entity.workshift_2.conductor.name CUSTOM_FILTERS}}</div>',
            //         cellFilter: 'FullNameToShort', cellClass: RepeatsHightlighter2c },
            // ]
        };

        $scope.gridOptions.initColumnNameDefs = function() {
            for(var i = 0; i < $scope.gridOptions.columnDefs.length; i++) {
                $scope.gridOptions.columnDefs[i].displayName = $scope.lang.words[$scope.gridOptions.columnDefs[i].displayName];
            }
            $scope.gridOptions.updateData();
        };

        $scope.gridOptions.initColumnDefs();



        $scope.$on('LanguageChanged', function (event, data) {
            $scope.gridOptions.initColumnNameDefs();
        });

        ////////////////////
        $scope.loadOptions = {
            parks_id: 0
        };
        /**
         * Function which load data for grid
         */
        $scope.gridOptions.loadData = function (obj, gridOptions) {
            // if($scope.loadOptions.parks_id != 0) {
                obj.pid = $scope.userData.pid;
            // }
            if($filter('date')(new Date(), 'HH') > 12) {
                // obj.date = Date.parse($scope.date+" 22:00:00")/1000 + 60*60*2 + 60*60*24;
                var dd = new Date();
                dd.setDate(dd.getDate() + 1);
                obj.d = $filter('date')(dd, 'yyyy-MM-dd');
            } else {
                obj.d = $filter('date')(new Date(), 'yyyy-MM-dd');
            }
            console.log('obj', obj);
            loadOrders(obj, gridOptions);
            loadAlerts(obj);
        };

        function loadAlerts(obj) {
            var alerts_res = AlertsRestService.getResource();
            alerts_res.query({'parks_id':$scope.loadOptions.parks_id, 'display': 1}, function(data, response) {
                $scope.alerts = data;
                console.log('alerts', data);
            }, function(error) {console.log(error);})
        }

        /**
         * Load Orders to grid
         */
        function loadOrders(obj, gridOptions) {
            if(!obj){
                obj = {
                    d: $filter('date')(new Date(), 'yyyy-MM-dd'),
                    pid: 4
                }
            }
            obj.type = 'screen';
            var resource = OrdersRestService.getOrdersResource();
            resource.query(obj, function (data, response) {
                console.log('data', data);
                var headers = response();
                gridOptions.totalItems = parseInt(headers['x-pagination-total-count']);
                // var ii = data.length - 1;
                // $scope.repeatCheker = data[ii].rrr;
                // gridOptions.data = data;
                change(data, gridOptions);
                $('#chekpoints-loading-wraper').fadeOut(500);
                $interval.cancel($scope.changer);
                $scope.changer =  $interval(change, 20000, 0, true, data, gridOptions);
                gridOptions.updateData();

            }, function (error) {
                gridOptions.updateData();
            });
        }

        $scope.loadOptions.parks_id = $scope._screenPark.park_id;
        // $scope.gridOptions.reloadCurrentData();
        $scope.timerCallback = function () {
            $scope.gridOptions.reloadCurrentData();
        };
        $scope.gridOptions.loadData({'per-page': $scope.gridOptions.paginationPageSize, page: 1}, $scope.gridOptions);
        $scope.$on('PageScreenContentChanged',function (event,data) {
            $('#chekpoints-loading-wraper').fadeIn(500);
            $scope.loadOptions.parks_id = data.id;
            $scope.gridOptions.reloadCurrentData();
        });


        $scope.counter = 0;
        $scope.max_c = 24;
        function change(data, gridOptions) {

            var data_show = [];
            if($scope.max_c > data.length) {
                $scope.max_c = data.length;
            }
            for(var i = $scope.counter; i < $scope.max_c; i++) {
                data_show.push(data[i]);
            }
            gridOptions.data = data_show;
            gridOptions.updateData();
            if($scope.max_c >= data.length) {
                $scope.max_c = 24;
                $scope.counter = 0;
            } else {
                $scope.counter = $scope.max_c;
                $scope.max_c = $scope.max_c + 24;
            }
        }

        $scope.showScreenSettings = function() {
            $mdDialog.show({
                controller: 'ScreenSettingsController',
                templateUrl: 'app/templates/popup/screenSettings.tpl.html',
                parent: angular.element(document.body),
                clickOutsideToClose:false,
                locals: {cols: $scope.pre_columns}
            }).then(function() {
                $scope.gridOptions.initColumnDefs();
                $scope.gridOptions.reloadCurrentData();
            }, function() {
                $scope.gridOptions.initColumnDefs();
                $scope.gridOptions.reloadCurrentData();
            });
        }





        $scope.toggleSmartScreen = function() {
            if($('#screen-smart-panel').hasClass('expanded')) {
                $('#screen-smart-panel').removeClass('expanded');
            } else {
                $('#screen-smart-panel').addClass('expanded');
            }
        }

        // function RepeatsHightlighter1d(grid, row, col, rowRenderIndex, colRenderIndex) {
        //     if(row.entity.order && row.entity.order.dw && row.entity.order.dw[0]) {
        //         if($scope.repeatCheker.hasOwnProperty(row.entity.order.dw[0].drivers_id)) {
        //             return 'cell-green-back';
        //         } else {
        //             return 'cell-default';
        //         }
        //     }
        //
        // }
        // function RepeatsHightlighter1c(grid, row, col, rowRenderIndex, colRenderIndex) {
        //     if(row.entity.order && row.entity.order.cw && row.entity.order.cw[0]) {
        //         if($scope.repeatCheker.hasOwnProperty(row.entity.order.cw[0].conductors_id)) {
        //             return 'cell-green-back';
        //         } else {
        //             return 'cell-default';
        //         }
        //     }
        //
        // }
        // function RepeatsHightlighter2d(grid, row, col, rowRenderIndex, colRenderIndex) {
        //     if(row.entity.order && row.entity.order.dw && row.entity.order.dw[1]) {
        //         if($scope.repeatCheker.hasOwnProperty(row.entity.order.dw[1].drivers_id)) {
        //             return 'cell-green-back';
        //         } else {
        //             return 'cell-default';
        //         }
        //     }
        //
        // }
        // function RepeatsHightlighter2c(grid, row, col, rowRenderIndex, colRenderIndex) {
        //     if(row.entity.order && row.entity.order.cw && row.entity.order.cw[1]) {
        //         if($scope.repeatCheker.hasOwnProperty(row.entity.order.cw[1].conductors_id)) {
        //             return 'cell-green-back';
        //         } else {
        //             return 'cell-default';
        //         }
        //     }
        //
        // }
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

// app.filter('sliceWorkshiftTime', function() {
//     return function(input) {
//         if(input){
//             var data = input.split('-');
//
//             data[0] = data[0].split(':');
//             data[1] = data[1].split(':');
//
//             return data[0][0] + ':' + data[0][1] + ' | ' + data[1][0] + ':' + data[1][1];
//         } else {
//             return '';
//         }
//
//     }
// });


// function sortMG (a, b, rowA, rowB, direction) {
//     var a_arg = parseInt(rowA.entity.rname);
//     var b_arg = parseInt(rowB.entity.rname);
//     // console.log('11111',a_arg);
//     if ( a_arg < b_arg )
//         return -1;
//     if ( a_arg > b_arg )
//         return 1;
//     return 0;
// }




