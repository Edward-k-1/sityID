/**
 * Created by walex on 14.11.16.
 */
app.controller('ChekpointsGridController', ['$scope', '$rootScope', '$interval', '$http', '$mdDialog', 'ParksRestService', 'LanguageService',
    'AuthService', 'FullPopupLoader', 'CardListenerRestService', 'MedicalServiceRestService', 'VehiclesTcdRestService', 'CheckpointRestService',
    'uiGridConstants', 'customUnixTimeOnlyFilter',
    'VehicleModelsRestService', 'RoutesRestService', 'GraphsRestService',"GlobalStorage",
    function ($scope, $rootScope, $interval, $http, $mdDialog, ParksRestService, LanguageService,
              AuthService, FullPopupLoader, CardListenerRestService, MedicalServiceRestService, VehiclesTcdRestService, CheckpointRestService,
              uiGridConstants, customUnixTimeOnlyFilter,
              VehicleModelsRestService, RoutesRestService, GraphsRestService,GlobalStorage) {


        $scope.userData = $rootScope.UserData;
        $scope.gridOptions = new GridController(null, null);

        $scope.dataType = $scope._checkpointData;

        // $rootScope.dataType = [
        // ];
        $scope.listenerState = 0;

        $scope.screenTitle = 'Точки контролю';

        $scope.gridOptions.flatEntityAccess = true;
        $scope.gridOptions.minRowsToShow = 10;
        $scope.gridOptions.filters.Vehicle = [];
        $scope.gridOptions.enableFiltering = true;
        $scope.gridOptions.enableColumnMenus = false;
        $scope.for_grid = {};

        $scope.gridOptions.initColumnDefs = function (type) {
            // var templateRG = '<div class="ui-grid-cell-contents ">' +
            //     '{{grid.appScope._showRoutesParks(row.entity.routes_id,row.entity.graphs_id)}}</div>';

            /**
             * Defined columns for grid
             */
            // $scope.gridOptions.headerTemplate = 'app/templates/grid/category/categoryHeader.tpl.html';
            // $scope.gridOptions.category = [
            //     {name: 'column1', visible: true,showCatName: false},
            //     {name: 'column2', visible: true,showCatName: false},
            //     {name: 'column3', visible: true,showCatName: false},
            //     {name: 'column4', visible: true,showCatName: false},
            //     {name: 'Driver', dName:'Водій', visible: true,showCatName: true},
            //     {name: 'ATP', dName:'АТП Виїзд', visible: true,showCatName: true},
            //     {name: 'column5', visible: true,showCatName: false},
            //     {name: 'Conductor', dName:'Кондуктор', visible: true,showCatName: true},
            //     {name: 'column6', visible: true,showCatName: false},
            //     {name: 'column7', visible: true,showCatName: false},
            //     {name: 'column8', visible: true,showCatName: false},
            //     {name: 'column9', visible: true,showCatName: false},
            // ];

                switch(type) {
                    case 'MC':
                        $scope.gridOptions.columnDefs = [

                            {name: 'id', enableCellEdit: false, width: 70, visible: false},
                            {
                                name: 'Driver',
                                field: 'name',
                                displayName: "Driver",
                                enableCellEdit: false,
                                width: 360
                            },
                            {
                                name: 'action_date',
                                field: 'action_date',
                                displayName: "Date",
                                enableCellEdit: false,
                                width: 180,
                                cellFilter: 'customUnixDate'
                            },
                            {
                                name: 'action_time',
                                field: 'action_date',
                                displayName: "Time",
                                enableCellEdit: false,
                                width: 180,
                                cellFilter: 'customUnixTimeOnly'
                            },
                            {
                                name: 'status',
                                field: 'status',
                                displayName: "Status",
                                enableCellEdit: false,
                                width: 180,
                                cellFilter: 'mcStatusFilter',
                                cellClass: cellClassMsStatus
                            },
                            {
                                name: 'Message',
                                field: 'message',
                                displayName: "Description",
                                enableCellEdit: false
                            }
                        ];
                        break;
                    case 'TCD':
                        $scope.gridOptions.columnDefs = [

                            {name: 'id', enableCellEdit: false, width: 70, visible: false},
                            {
                                name: 'Driver',
                                field: 'driver_name',
                                displayName: "Driver",
                                enableCellEdit: false,
                                width: 270
                            },
                            {
                                name: 'Vehicle',
                                field: 'name',
                                displayName: "Vehicle",
                                enableCellEdit: false,
                                width: 270
                            },
                            {
                                name: 'Vehicle_number',
                                field: 'state_number',
                                displayName: "Vehicle_number",
                                enableCellEdit: false,
                                width: 120
                            },
                            {
                                name: 'Status',
                                field: 'status',
                                displayName: "Status",
                                enableCellEdit: false,
                                width: 90,
                                cellFilter: 'mcStatusFilter',
                                cellClass: cellClassMsStatus
                            },
                            {
                                name: 'Date',
                                field: 'action_date',
                                displayName: "Date",
                                enableCellEdit: false,
                                cellFilter: 'customUnixDate',
                                width: 90
                            },
                            {
                                name: 'Description',
                                field: 'message',
                                displayName: "Description",
                                enableCellEdit: false
                            }
                        ];
                        break;
                    case 'PG':
                        $scope.gridOptions.columnDefs = [

                            {name: 'id', enableCellEdit: false, width: 70, visible: false},
                            {
                                name: 'Driver',
                                field: 'name',
                                displayName: "Driver",
                                enableCellEdit: false,
                                width: 270
                            },
                            {
                                name: 'Status',
                                field: 'status',
                                displayName: "Status",
                                enableCellEdit: false,
                                width: 90,
                                cellFilter: 'pgStatusFilter',
                                cellClass: cellClassPgStatus
                            },
                            {
                                name: 'Date',
                                field: 'action_time',
                                displayName: "Date",
                                enableCellEdit: false,
                                cellFilter: 'customUnixDate',
                                width: 90
                            },
                            {
                                name: 'Time',
                                field: 'action_time',
                                displayName: "Time",
                                enableCellEdit: false,
                                cellFilter: 'customUnixTimeOnly',
                                width: 90
                            }
                        ];
                        break;
                    case 'MS':
                        break;
                    case 'ass':
                        break;
                    case 'CardMonitoring':
                        break;
                    default:
                        $scope.gridOptions.columnDefs = [

                            {name: 'id', enableCellEdit: false, width: 70, visible: false},
                            {
                                name: 'driver_id',
                                field: 'drivers_id',
                                displayName: "Driver",
                                enableCellEdit: false,
                                width: 180
                            }]
                        break;
                }




            // $scope.gridOptions.columnDefs = [
            //
            //     {name: 'id', enableCellEdit: false, width: 70, visible: false},
            //     {
            //         name: 'smart_id',
            //         field: 'card_id',
            //         category:"column1",
            //         displayName: "Board",
            //         enableCellEdit: false,
            //         width: 90
            //     }
            // ];
        };
        /**
         * Defined translate function
         */
        $scope.gridOptions.initColumnNameDefs = function (type) {
            console.log(type);
                switch(type) {
                    case 'MC':
                        $scope.gridOptions.columnDefs[0].displayName = $scope.lang.words["id"];
                        $scope.gridOptions.columnDefs[1].displayName = $scope.lang.words["Driver"];
                        $scope.gridOptions.columnDefs[2].displayName = $scope.lang.words["Action date"];
                        $scope.gridOptions.columnDefs[3].displayName = $scope.lang.words["Action time"];
                        $scope.gridOptions.columnDefs[4].displayName = $scope.lang.words["status"];
                        $scope.gridOptions.columnDefs[5].displayName = $scope.lang.words["MC Description"];

                        $scope.screenTitle = $scope.lang.words["Medical service"];
                        break;
                    case 'TCD':
                        $scope.gridOptions.columnDefs[0].displayName = $scope.lang.words["id"];
                        $scope.gridOptions.columnDefs[1].displayName = $scope.lang.words["Driver"];
                        $scope.gridOptions.columnDefs[2].displayName = $scope.lang.words["Vehicle"];
                        $scope.gridOptions.columnDefs[3].displayName = $scope.lang.words["state number"];
                        $scope.gridOptions.columnDefs[4].displayName = $scope.lang.words["status"];
                        $scope.gridOptions.columnDefs[5].displayName = $scope.lang.words["Action date"];
                        $scope.gridOptions.columnDefs[6].displayName = $scope.lang.words["VTK Description"];

                        $scope.screenTitle = $scope.lang.words["TCD"];
                        break;
                    case 'PG':
                        $scope.gridOptions.columnDefs[0].displayName = $scope.lang.words["id"];
                        $scope.gridOptions.columnDefs[1].displayName = $scope.lang.words["Driver"];
                        $scope.gridOptions.columnDefs[2].displayName = $scope.lang.words["status"];
                        $scope.gridOptions.columnDefs[3].displayName = $scope.lang.words["Action date"];
                        $scope.gridOptions.columnDefs[4].displayName = $scope.lang.words["Action time"];

                        $scope.screenTitle = $scope.lang.words["Checkpoint"];
                        break;
                    case 'MS':
                        $scope.screenTitle = 'Диспетчер';
                        break;
                    case 'ASS':
                        $scope.screenTitle = 'АЗС';
                        break;
                }
            // $scope.gridOptions.columnDefs[0].displayName = $scope.lang.words["id"];
            // $scope.gridOptions.columnDefs[1].displayName = $scope.lang.words["Vehicles Board"];
            // $scope.gridOptions.columnDefs[2].displayName = $scope.lang.words["Vehicles State number"];
            // $scope.gridOptions.columnDefs[3].displayName = $scope.lang.words["vehicle models"];
            // $scope.gridOptions.columnDefs[4].displayName = $scope.lang.words["Routes and Graphs"];
            // $scope.gridOptions.columnDefs[5].displayName = $scope.lang.words["Full name"];
            // $scope.gridOptions.columnDefs[6].displayName = $scope.lang.words["Driver worker number"];
            // $scope.gridOptions.columnDefs[7].displayName = $scope.lang.words["Arrival"];
            // $scope.gridOptions.columnDefs[8].displayName = $scope.lang.words["Departure Plan"];
            // $scope.gridOptions.columnDefs[9].displayName = $scope.lang.words["Departure Fact"];
            // $scope.gridOptions.columnDefs[10].displayName = $scope.lang.words["State"];
            // $scope.gridOptions.columnDefs[11].displayName = $scope.lang.words["Full name"];
            // $scope.gridOptions.columnDefs[12].displayName = $scope.lang.words["Conductors number"];
            // $scope.gridOptions.columnDefs[13].displayName = $scope.lang.words["Fuel"];
            // $scope.gridOptions.columnDefs[14].displayName = $scope.lang.words["Medical Service"];
            // $scope.gridOptions.columnDefs[15].displayName = $scope.lang.words["Technical Control"];
            // $scope.gridOptions.columnDefs[16].displayName = $scope.lang.words["Gates"];
            //
            // $scope.gridOptions.category[4].dName = $scope.lang.words["Driver"];
            // $scope.gridOptions.category[5].dName = $scope.lang.words["ATP arrival"];
            // $scope.gridOptions.category[7].dName = $scope.lang.words["Conductor"];
            $scope.gridOptions.updateData();
        };

        console.log('111111',$scope.dataType);

        if($scope.dataType) {
            if($scope.dataType.type) {
                $scope.gridOptions.initColumnDefs($scope.dataType.type);
            } else {
                $scope.gridOptions.initColumnDefs('CardMonitoring');
            }
        } else {
            $scope.gridOptions.initColumnDefs('default');
        }
        // $scope.gridOptions._init();

        /**
         * Defined language settings
         */
        $scope.gridOptions.lang = $scope.lang;
        if ($scope.lang.hasOwnProperty('words')) {
            if($scope.dataType && $scope.dataType.type) {
                $scope.gridOptions.initColumnNameDefs($scope.dataType.type);
            } else {
                $scope.gridOptions.initColumnNameDefs('default');
            }
        }
        $scope.$on('LanguageChanged', function (event, data) {
            if($scope.dataType && $scope.dataType.type) {
                $scope.gridOptions.initColumnNameDefs($scope.dataType.type);
            } else {
                $scope.gridOptions.initColumnNameDefs('default');
            }
        });


        $scope.startListener = function(service, obj, opts) {
            $scope.listenerState = 1;
            obj.type = service;
            $scope.listener =  $interval(listen, 500, 0, true, obj, opts);

            // if($scope.listenerState == 0) {
            //     clearInterval(refreshIntervalId);
            // }
            // while($scope.listenerState !== 0) {
            //     console.log('1');
            // }
        };
        $scope.$on("$destroy", function() {
            $interval.cancel($scope.listener);
        });

        function listen(obj, opts) {
            // if($scope.listenerState == 0) {
            //     return;
            // }
            var resource = CardListenerRestService.getResource();
            resource.query(obj, function (data, response) {
                // console.log(data);
                if(data[0]){
                    $interval.cancel($scope.listener);
                    $mdDialog.show({
                        controller: opts.controller,
                        templateUrl: 'app/templates/popup/'+opts.template+'.tpl.html',
                        parent: angular.element(document.body),
                        // targetEvent: ev,
                        clickOutsideToClose:false,
                        locals: {row: data[0]}
                        // fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
                    })
                        .then(function() {
                            // var resource = CheckpointMCRestService.getResource();
                            $scope.gridOptions.reloadCurrentData();
                            if($scope.listenerState == 0) {
                                $scope.startListener(obj.type, obj, opts);
                            }
                        }, function() {
                            $scope.gridOptions.reloadCurrentData();
                            if($scope.listenerState == 0) {
                                $scope.startListener(obj.type, obj, opts);
                            }
                        });
                }
                // FullPopupLoader.hidePopup();
            }, function (error) {
                //  FullPopupLoader.hidePopup();
            });
        }



        /**
         * Defined function loaData for grid
         */
        $scope.gridOptions.loadData = function (obj, gridOptions) {
            showLoader();
            // console.log($scope.dataType);
            if($scope.listenerState == 1) {
                $interval.cancel($scope.listener);
                $scope.listenerState = 0;
            }
            var res2load = CardListenerRestService.getResource();
            if($scope.dataType) {
                obj.parks_id = $scope.dataType.id;
                if($scope.dataType.type) {
                    obj.type = $scope.dataType.type;
                    var opts = {"controller": '', "template": ''};
                    switch($scope.dataType.type) {
                        case 'MC':
                            opts.controller = 'mcWindowController';
                            opts.template = 'mcWindow';
                            res2load = MedicalServiceRestService.getResource();
                            $scope.gridOptions.initColumnDefs('MC');
                            $scope.gridOptions.initColumnNameDefs('MC');
                            $scope.startListener('MC', obj, opts);
                            break;
                        case 'TCD':
                            opts.controller = 'tcdWindowController';
                            opts.template = 'tcdWindow';
                            res2load = VehiclesTcdRestService.getResource();
                            $scope.gridOptions.initColumnDefs('TCD');
                            $scope.gridOptions.initColumnNameDefs('TCD');
                            $scope.startListener('TCD', obj, opts);
                            break;
                        case 'PG':
                            opts.controller = 'pgWindowController';
                            opts.template = 'pgWindow';
                            res2load = CheckpointRestService.getResource();
                            $scope.gridOptions.initColumnDefs('PG');
                            $scope.gridOptions.initColumnNameDefs('PG');
                            $scope.startListener('PG', obj, opts);
                            break;
                        case 'MS':
                            $scope.gridOptions.initColumnNameDefs('MS');
                            break;
                        case 'ASS':
                            $scope.gridOptions.initColumnNameDefs('ASS');
                            break;
                    }
                }
                // else {
                //     obj.parks_id = $scope.dataType.id;
                //     // var resource = CardListenerRestService.getResource();
                // }

            }
            // else {
            //     // var resource = CardListenerRestService.getResource();
            // }


            // if ($scope.gridOptions.parksFilter >=0){
            //     obj.parks_id =  $scope.gridOptions.parksFilter;
            // }
            loadCheckpointActions(res2load, obj, gridOptions);
        };


        /**
         *  Function calback on select_updater
         */
        $scope.timerCallback = function () {
            $scope.gridOptions.reloadCurrentData();
        };

        // $scope.TcdChange = function(ev) {
        //     $mdDialog.show({
        //         controller: 'vtkStatusChangeController',
        //         templateUrl: 'app/templates/popup/vtkStatusChange.tpl.html',
        //         parent: angular.element(document.body),
        //         clickOutsideToClose:false,
        //         locals: {row: ev.entity, grid: $scope.gridOptions, parks_id:$scope.orders.parks_id}
        //     })
        //         .then(function() {
        //             $scope.gridOptions.reloadCurrentData();
        //         }, function() {
        //
        //         });
        // };
        //
        // $scope.McChange = function(ev) {
        //     // Appending dialog to document.body to cover sidenav in docs app
        //
        //     $mdDialog.show({
        //         controller: 'mcStatusChangeController',
        //         templateUrl: 'app/templates/popup/mcStatusChange.tpl.html',
        //         parent: angular.element(document.body),
        //         // targetEvent: ev,
        //         clickOutsideToClose:false,
        //         locals: {row: ev.entity, grid: $scope.gridOptions, parks_id:$scope.orders.parks_id}
        //         // fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        //     })
        //         .then(function() {
        //             $scope.gridOptions.reloadCurrentData();
        //         }, function() {
        //
        //         });
        //
        //
        // };
        /**
         * Loadinig data for grid
         */
        function loadCheckpointActions(res2load, obj, gridOptions) {
            //FullPopupLoader.showPopup();
            // var resource = CheckpointMCRestService.getResource();
            // var res2load = CardListenerRestService.getResource();
            res2load.query(obj, function (data, response) {
                var headers = response();
                gridOptions.data = data;
                gridOptions.totalItems = parseInt(headers['x-pagination-total-count']);
                hideLoader();
                // FullPopupLoader.hidePopup();
            }, function (error) {
                //  FullPopupLoader.hidePopup();
            });
        }
        // $scope.gridOptions.filters.Parks =  GlobalStorage.getStorage("Parks");
        // $scope.gridOptions.filters.Users =  GlobalStorage.getStorage("Users");
        // $scope.gridOptions.filters.Graphs =  GlobalStorage.getStorage("Graphs");
        // $scope.gridOptions.filters.Routes =  GlobalStorage.getStorage("Routes");
        // $scope.gridOptions.filters.VehicleModels = GlobalStorage.getStorage("VehicleModels");
        $scope.gridOptions.loadData({'per-page': $scope.gridOptions.paginationPageSize, page: 1}, $scope.gridOptions);
        $scope.$on('PageCheckpointsContentChanged',function (event,data) {
            $scope.dataType = data;
            $scope.gridOptions.reloadCurrentData();
        });
        $scope.$on('UnConfirmComplite',function (event,data) {
            $scope.gridOptions.reloadCurrentData();
        });
        /**
         * Function pseudo filter for displaying field "Routes and Grapth" in grid for cell template
         */
        // $scope._showRoutesParks = function (routes_id, graphs_id) {
        //     var routes = "NONE", graphs = 'NONE';
        //     var arrRoutes = $scope.gridOptions.filters.Routes;
        //     for (var i = 0; i < arrRoutes.length; i++) {
        //         if (arrRoutes[i].id == routes_id) {
        //             routes = arrRoutes[i].name;
        //             break;
        //         }
        //     }
        //     var arrGraphs = $scope.gridOptions.filters.Graphs;
        //     for (var i = 0; i < arrGraphs.length; i++) {
        //         if (arrGraphs[i].id == graphs_id) {
        //             graphs = arrGraphs[i].name;
        //             break;
        //         }
        //     }
        //     return routes + "/" + graphs;
        // };

        /**
         * Filter for grids cell vehicle model
         */
        // app.filter('vehicleMCModelMap', function () {
        //     return function (id) {
        //         for (var j = 0; j < $scope.gridOptions.filters.VehicleModels.length; j++) {
        //             if ($scope.gridOptions.filters.VehicleModels[j].id == id) {
        //                 return $scope.gridOptions.filters.VehicleModels[j].name;
        //             }
        //         }
        //         return id;
        //     };
        // });

        function showLoader() {
            $('#chekpoints-loading-wraper').fadeIn(1);
        }
        function hideLoader() {
            $('#chekpoints-loading-wraper').fadeOut(1000);
        }



        function cellClassMsStatus(grid, row, col, rowRenderIndex, colRenderIndex) {
            switch (grid.getCellValue(row,col)) {
                case '2':
                    return 'cell-green';
                    break;
                case '1':
                    return 'cell-red';
                    break;
                default:
                    return 'cell-default';
                    break;
            }
        }

        function cellClassPgStatus(grid, row, col, rowRenderIndex, colRenderIndex) {
            switch (grid.getCellValue(row,col)) {
                case '1':
                    return 'cell-green';
                    break;
                case '0':
                    return 'cell-red';
                    break;
                default:
                    return 'cell-default';
                    break;
            }
        }

        app.filter('mcStatusFilter', function() {
            return function(input) {
                switch(input) {
                    case '1':
                        return "-";
                        break;
                    case '2':
                        return "+";
                        break;
                    default:
                        return "?";
                        break;
                }
            }
        });

        app.filter('pgStatusFilter', function() {
            return function(input) {
                switch(input) {
                    case '1':
                        return "Зайшов";
                        break;
                    case '0':
                        return "Вийшов";
                        break;
                    default:
                        return "?";
                        break;
                }
            }
        });

        $scope.dataType  = $scope._checkpointData;
        $scope.gridOptions.reloadCurrentData();

    }]);



/**
 * Filter for grids cell "gates".
 */
// app.filter('mapMCGates', function () {
//     var typeHash = {
//         1: '?',
//         2: '+',
//         0: '?',
//         3: '?'
//     };
//     return function (input) {
//         if (input == null) {
//             return '';
//         } else {
//             return typeHash[input];
//         }
//     };
// });
//
// /**
//  * Filter for grid cell "VTK".
//  */
// app.filter('mapMCVTK', function () {
//     var typeHash = {
//         1: '?',
//         2: '+',
//         3: '-',
//         0: '-'
//     };
//     return function (input) {
//         if (input == null) {
//             return '';
//         } else {
//             return typeHash[input];
//         }
//     };
// });
//
// /**
//  * Filter for grids cell "Medical Service".
//  */
// app.filter('mapMCMedicalService', function () {
//     var typeHash = {
//         1: '?',
//         2: '+',
//         3: '-',
//         0: '-'
//     };
//     return function (input) {
//         if (input == null) {
//             return '';
//         } else {
//             return typeHash[input];
//         }
//     };
// });
//
// /**
//  * Filter for grid cell "fuel"
//  */
// app.filter('fuelMCMap', function () {
//     return function (input) {
//         if (input == -2) {
//             return 'не заправлявся';
//         }
//         if (input == -1) {
//             return 'відмітився';
//         }
//         if (input >= 0) {
//             return input + "";
//         }
//     };
// });
//
// /**
//  * Fileter for grids cell "state"
//  */
// app.filter('stateMCMap', function () {
//     return function (input) {
//         if (input == 1)
//             return 'Наряд';
//         if (input == 3)
//             return 'Депо';
//         if (input == 2)
//             return 'Лінія';
//         if (input == 0)
//             return 'Наряд';
//     };
// });
//
// /**
//  * Function added css class for VTK cell.
//  */
// function cellClassMCVtkMs(grid, row, col, rowRenderIndex, colRenderIndex) {
//     switch (grid.getCellValue(row,col)) {
//         case '2': {
//             return 'cell-green';
//         }
//             break;
//         case '3': {
//             return 'cell-red';
//         }
//             break;
//         default: {
//             return grid.getCellValue(row,col);
//         }
//             break;
//     }
//
// }
// function cellClassVname(grid, row, col, rowRenderIndex, colRenderIndex) {
//     if(row.entity.medical_service !== '2' || row.entity.vtk !== '2' || row.entity.pass !== '2') {
//         return 'cell-red';
//     } else {
//
//     }
// }
// /**
//  * Function added css class for Arrival cell.
//  */
// function cellClassMCArrival(grid, row, col, rowRenderIndex, colRenderIndex) {
//     if (row.entity.arrival < row.entity.departure_plan) {
//         return 'cell-green';
//     }
//     return 'cell-red';
//
// }
//
// /**
//  * Function added css class for "Departure Fact" cell.
//  */
// function cellClassMCDepartureFact(grid, row, col, rowRenderIndex, colRenderIndex) {
//     if (row.entity.departure_plan < row.entity.departure_fact) {
//         return 'cell-green';
//     }
//     return 'cell-red';
// }
