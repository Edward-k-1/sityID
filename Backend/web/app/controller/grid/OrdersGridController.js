app.controller('OrdersGridController', ['$scope','$http','OrdersRestService','FullPopupLoader','customUnixTimeFilter','$filter','$timeout',
    '$mdDialog','$rootScope','GlobalStorage','ngDialog',
    function ($scope,$http,OrdersRestService,FullPopupLoader,customUnixTimeFilter,$filter,$timeout,$mdDialog,$rootScope,GlobalStorage,ngDialog) {

        $('#chekpoints-loading-wraper').fadeIn(500);

        ////////////////////////////////default locals////////////////////////////////////////
        $rootScope.dialogs = {};
        $scope.lang = $rootScope.lang;
        var default_date = new Date();
        default_date.setDate(default_date.getDate() + 1);

        $scope.userData = $rootScope.UserData;

        $scope.presets = {
            date:{
                js:default_date,
                db:$filter('date')(default_date, 'yyyy-MM-dd'),
                display:$filter('date')(default_date, 'dd-MM-yyyy')
            },
            dayType:{
                id:undefined,
                str:undefined
            }

        };
        $scope.forExport = {
            'workers':0,
            'vehicles':0
        };

        $scope.orders = [];

        $scope.r = OrdersRestService.loadPublicResources();
        ////////////////////////////////Grid setup////////////////////////////////////////

        $scope.gridOptions = new GridController(null, null);
        $scope.gridOptions.enableFiltering = false;
        $scope.gridOptions.enableColumnMenus = false;
        $scope.gridOptions.rowHeight = 50;
        $scope.gridOptions.columnVirtualizationThreshold = 20;
        $scope.gridOptions.virtualizationThreshold = 200;

        $scope.gridOptions.rowTemplate = '<div contextmenu-item="row" ng-click="grid.options.toggleSelected($event, row)" ng-dblclick="grid.options.showEditPopup(row)" ' +
            'ng-class="{ \'grid-row-edited\':row.entity.__changed, \'grid-row-new\':row.entity.__isNew}">' +
            '<div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name"' +
            ' class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }" ui-grid-cell></div></div>';
        $scope.gridOptions.initColumnDefs = function () {
            $scope.gridOptions.headerTemplate = 'app/templates/grid/category/categoryHeader.tpl.html';
            $scope.gridOptions.category = [
                {name:'column0',langName:'id',visible:false,showCatName:false},
                {name:'Route-graph',langName:'r-g',dName:'М/Г',visible:true,showCatName:true},
                {name:'Time',langName:'Action time',dName:'Час дії',visible:true,showCatName:true},
                {name:'Driver1',langName:'Driver',dName:'Водій',visible:true,showCatName:true},
                {name:'Vehicle1',langName:'Vehicle',dName:'Транпорт',visible:true,showCatName:true},
                {name:'Conductor1',langName:'Conductor',dName:'Кондуктор',visible:true,showCatName:true}
            ];
            $scope.gridOptions.columnDefs = [
                {name:'id',langName:'id',category:"column0",displayName:'id',enableCellEdit:false,width:50,pinnedLeft:true,visible:false},
                {name:'routes_id',langName:'R',category:"Route-graph",field:'name',displayName:'Routes',enableCellEdit:false,width:40,type:'number',sort:{direction:'asc',priority:0},cellTemplate:'<div class="ui-grid-cell-contents"><div class="single">{{row.entity.route}}</div></div>'},
                {name:'graphs_id',langName:'G',category:"Route-graph",field:'graph',displayName:'Graphs',enableCellEdit:false,width:30,cellTemplate:'<div class="ui-grid-cell-contents"><div class="single">{{row.entity.graph}}</div></div>'},
                {name:'workshift',langName:'Workshift',category:"Time",field:'none',displayName:'Workshift',enableCellEdit:false,width:60,cellTemplate:'<div class="ui-grid-cell-contents red-left-border"><div>1</div><div>2</div></div>'},
                {name:'arrival',langName:'Arrival',category:"Time",field:'arrival',displayName:'Arrival',enableCellEdit:false,width:60,cellTemplate:'<div class="ui-grid-cell-contents red-left-border"><div>{{row.entity.graph_data.s1_a CUSTOM_FILTERS}}</div><div></div></div>',cellFilter:'sliceTime'},
                {name:'time_from',langName:'order_from',category:"Time",displayName:'time_from1',enableCellEdit:false,width:60,cellTemplate:'<div class="ui-grid-cell-contents"><div>{{row.entity.graph_data.s1_s CUSTOM_FILTERS}}</div><div></div></div>',cellFilter:'sliceTime'},
                {name:'shift_change',langName:'shift change',field:"workshift_time",category:"Time",displayName:'Shift change',enableCellEdit:false,width:60,cellTemplate:'<div class="ui-grid-cell-contents"><div>{{row.entity.graph_data.s1_e CUSTOM_FILTERS}}</div><div>{{row.entity.graph_data.s2_s CUSTOM_FILTERS}}</div></div>',cellFilter:'sliceTime'},
                {name:'time_to',langName:'order_to',category:"Time",displayName:'time_to1',enableCellEdit:false,width:60,cellTemplate:'<div class="ui-grid-cell-contents"><div></div><div>{{row.entity.graph_data.s2_e CUSTOM_FILTERS}}</div></div>',cellFilter:'sliceTime'},
                {name:'all_time',langName:'time',category:"Time",displayName:'time_all',enableCellEdit:false,width:60,cellTemplate:'<div class="ui-grid-cell-contents"><div>{{row.entity.graph_data.s1_t}}</div><div>{{row.entity.graph_data.s2_t}}</div></div>',cellFilter:'sliceTime'},
                {name:'driver_0.name',langName:'name',category:"Driver1",field:"driver_0",displayName:'Driver name',enableCellEdit:false,width:120,cellTemplate:'<div class="ui-grid-cell-contents red-left-border"><div class="w-{{row.entity.workshift_1.driver.id}}">{{row.entity.workshift_1.driver.name CUSTOM_FILTERS}}</div><div class="w-{{row.entity.workshift_2.driver.id}} i-{{row.entity.route}}-{{row.entity.graph}}">{{row.entity.workshift_2.driver.name CUSTOM_FILTERS}}</div></div>',cellFilter:'FullNameToShort', cellClass:HightlightChanged},
                {name:'driver_0.basic_number',langName:'Tab N',category:"Driver1",field:"driver_0",displayName:'Driver #',enableCellEdit:false,width:60,cellTemplate:'<div class="ui-grid-cell-contents"><div class="w-{{row.entity.workshift_1.driver.id}}">{{row.entity.workshift_1.driver.basic_number}}</div><div class="w-{{row.entity.workshift_2.driver.id}} i-{{row.entity.route}}-{{row.entity.graph}}">{{row.entity.workshift_2.driver.basic_number}}</div></div>', cellClass:HightlightChanged},
                {name:'driver_0.desc',langName:'Desc',category:"Driver1",field:"driver_0",displayName:'Driver #',enableCellEdit:false,width:60,cellTemplate:'<div class="ui-grid-cell-contents"><div ng-if="row.entity.workshift_1.c_data">{{row.entity.workshift_1.c_data.route}} / {{row.entity.workshift_1.c_data.graph}}</div><div class="i-{{row.entity.route}}-{{row.entity.graph}}" ng-if="row.entity.workshift_2.original">{{row.entity.workshift_2.original.route}} / {{row.entity.workshift_2.original.graph}}</div></div>'},
                {name:'vehicle_0_board',langName:'BN',category:"Vehicle1",field:"order.vw[0].board_number",displayName:'Board',enableCellEdit:false,width:70,cellTemplate:'<div class="ui-grid-cell-contents red-left-border"><div>{{row.entity.workshift_1.vehicle.board_number}}</div><div class="i-{{row.entity.route}}-{{row.entity.graph}}">{{row.entity.workshift_2.vehicle.board_number}}</div></div>', cellClass:HightlightChanged},
                {name:'vehicle_0.state_number',langName:'SN',category:"Vehicle1",field:"state_number",displayName:'State number',enableCellEdit:false,width:100,cellTemplate:'<div class="ui-grid-cell-contents"><div>{{row.entity.workshift_1.vehicle.state_number}}</div><div class="i-{{row.entity.route}}-{{row.entity.graph}}">{{row.entity.workshift_2.vehicle.state_number}}</div></div>', cellClass:HightlightChanged},
                {name:'conductor_0.name',langName:'name',category:"Conductor1",field:"conductor_0",displayName:'Conductor name',enableCellEdit:false,width:120,cellTemplate:'<div class="ui-grid-cell-contents red-left-border"><div class="w-{{row.entity.workshift_1.conductor.id}}">{{row.entity.workshift_1.conductor.name CUSTOM_FILTERS}}</div><div class="w-{{row.entity.workshift_2.conductor.id}} i-{{row.entity.route}}-{{row.entity.graph}}">{{row.entity.workshift_2.conductor.name CUSTOM_FILTERS}}</div></div>',cellFilter:'FullNameToShort'},
                {name:'conductor_0.basic_number',langName:'Tab N',category: "Conductor1",field:"conductor_0",displayName:'Conductor #',enableCellEdit:false,width:60,cellTemplate:'<div class="ui-grid-cell-contents"><div class="w-{{row.entity.workshift_1.conductor.id}}">{{row.entity.workshift_1.conductor.basic_number}}</div><div class="w-{{row.entity.workshift_2.conductor.id}} i-{{row.entity.route}}-{{row.entity.graph}}">{{row.entity.workshift_2.conductor.basic_number}}</div></div>'},
            ];
        };
        $scope.gridOptions.initColumnNameDefs = function () {
            for(var i = 0; i < $scope.gridOptions.columnDefs.length; i++) {
                $scope.gridOptions.columnDefs[i].displayName = $scope.lang.words[$scope.gridOptions.columnDefs[i].langName];
            }
            for(var j =0; j < $scope.gridOptions.category.length; j++) {
                $scope.gridOptions.category[j].dName = $scope.lang.words[$scope.gridOptions.category[j].langName];
            }
            $scope.gridOptions.updateData();
        };

        ////////////////////////////////NEW//////////////////////////////////////////

        $scope.loadData = function() {
            $scope.presets.date.db = $filter('date')($scope.presets.date.js, 'yyyy-MM-dd');
            $scope.presets.date.display = $filter('date')($scope.presets.date.js, 'dd-MM-yyyy');
            $('#chekpoints-loading-wraper').fadeIn(500);
            $scope.r.calendar.query({date:$scope.presets.date.db}, function(data, responce) {
                      if(data.length < 1) {
                          console.log('error_11:no record for this date');
                          // $scope.rpw = ngDialog.open({template:'<p>Зачекайте іде синхронізація календаря</p>',plain:true,className:'ngdialog-theme-default'});
                          $scope.rpw = $scope.displaySimplePopUp('Зачекайте іде синхронізація календаря');
                          $scope.r.calendar.get({action:'sync', date:$scope.presets.date.db}, function(data, response) {
                              if($scope.rpw) {
                                  $scope.rpw.close();
                              }
                              console.log('cd',data);
                              if(data.success) {
                                  $scope.displaySimplePopUp('Календар успішно синхронизовано');
                                  // ngDialog.open({template:'<p>Календар успішно синхронизовано</p>',plain:true,className:'ngdialog-theme-default'});
                                  $scope.loadData();
                              } else {
                                  $scope.displaySimplePopUp('На задану дату немае даних');
                                  // ngDialog.open({template:'<p>На задану дату немае даних</p>',plain:true,className:'ngdialog-theme-default'});
                                  $('#chekpoints-loading-wraper').fadeOut(500);
                              }
                          }, function(error) {console.log(error);});
                          return;
                      } else {
                          $scope.presets.dayType.id = data[0].type;
                          if(parseInt(data[0].type) == 1) {
                              $scope.presets.dayType.str = 'Робочий';
                          } else {
                              $scope.presets.dayType.str = 'Вихідний';
                          }
                      }
                      console.log('presets',$scope.presets);

                $scope.rpw = $scope.displaySimplePopUp('Зачекайте іде оновлення Розкладу');
                $scope.r.orders.sync_graphs({t:$scope.presets.dayType.id,d:$scope.presets.date.db}, function(data, responce) {
                    if(data[0] == 0) {
                        alert('error loading routes');
                    }
                    if($scope.rpw) {
                        $scope.rpw.close();
                    }
                    $scope.rpw = $scope.displaySimplePopUp('Синхронізація графіків пройшла успішно');
                    $scope.r.orders.query({pid: $scope.userData.pid, date: $scope.presets.date.db}, function(data, response){
                        console.log('loaded_orders',data);
                        $scope.gridOptions.data = data;
                        $scope.gridOptions.updateData();
                        $('#chekpoints-loading-wraper').fadeOut(500);
                    }, function(error){console.log(error);});
                    // $scope.gridOptions.reloadCurrentData();
                    // $('#chekpoints-loading-wraper').fadeOut(500);
                }, function(error) {});



            }, function(error) {console.log('error_1:load calendar day type failed',error);});
        };

        $scope.displaySimplePopUp = function(str) {
          return ngDialog.open({template:'<p>'+str+'</p><div class="head-block"><h3></h3></div>',plain:true,className:'ngdialog-theme-default'});
        };

        $scope.loadOrders = function() {
            $scope.presets.date.db = $filter('date')($scope.presets.date.js, 'yyyy-MM-dd');
            $scope.presets.date.display = $filter('date')($scope.presets.date.js, 'dd-MM-yyyy');
            $scope.r.orders.query({pid: $scope.userData.pid, date: $scope.presets.date.db}, function(data, response){
                console.log('loaded_orders',data);
                $scope.gridOptions.data = data;
                $scope.gridOptions.updateData();
                $('#chekpoints-loading-wraper').fadeOut(500);
            }, function(error){console.log(error);});
        };

        $scope.gridOptions.initColumnDefs();
        $scope.gridOptions.initColumnNameDefs();
        $scope.loadData();

        if($scope.lang.hasOwnProperty('words')) {
            $scope.gridOptions.initColumnNameDefs();
        }
        $scope.$on('LanguageChanged', function (event, data) {
            $scope.gridOptions.initColumnNameDefs();
        });

        $scope.excelExport = function() {
            $mdDialog.show({
                controller: 'OrdersExportController',
                templateUrl: 'app/templates/popup/ordersExport.tpl.html',
                parent: angular.element(document.body),
                clickOutsideToClose:false,
                hasBackdrop:false,
                multiple:true,
                autoWrap:false,
                skipHide: true,
                locals: {data: $scope.gridOptions.data, data2: $scope.forExport}
            })
        };

        $scope.ExportOrdersASDU = function() {
            var res = OrdersRestService.getOrdersResource();

            var date = $filter('date')($scope.presets.date.js, 'yyyy-MM-dd');
            console.log('asdadad',date);
            res.query({action:'ex', date:date}, function(data, response) {
                if(data) {
                    console.log('export', data);
                    $mdDialog.show(
                        $mdDialog.alert()
                            .parent(angular.element(document.querySelector('#popupContainer')))
                            .clickOutsideToClose(true)
                            .title('Синхронізація завершена')
                            .textContent('Синхронізація пройшла успішно')
                            .ariaLabel('Export complete')
                            .ok('ok')
                    );
                }
            }, function(error) {console.log(error);});

        };
        $scope.gridOptions.toggleSelected = function($event, row) {
            var el = angular.element($event.currentTarget);
            if ($event.ctrlKey) {
                if(el.hasClass('row-selected')) {
                    el.removeClass('row-selected');
                } else {
                    el.addClass('row-selected');
                }
            } else {
                $('.red-cell').removeClass('red-cell');
                $('.green-cell').removeClass('green-cell');
                if(row.entity.workshift_1 && row.entity.workshift_1.c_data) {
                    $('.i-'+row.entity.workshift_1.c_data.route+'-'+row.entity.workshift_1.c_data.graph).addClass('red-cell');
                }
                if(row.entity.workshift_2) {
                    $('.w-'+ row.entity.workshift_2.driver.id).addClass('green-cell');
                }

                $('.row-selected').removeClass('row-selected');
                el.addClass('row-selected');
            }
        };
        /////////////////////////////////////////////////////////////////////////////
        $scope.syncCalendar = function() {
            var r = OrdersRestService.getCalendarResource();
            r.get({action:'sync', date:$filter('date')($scope.presets.date.js, 'yyyy-MM-dd')}, function(data, response) {
                console.log('ssssssss',data);
                $scope.displaySimplePopUp('Календар успішно синхронизовано');
            }, function(error) {console.log(error);});
        };

        $scope.gridOptions.loadData = function (obj, gridOptions) {
            $scope.loadOrders();
        };

        $scope.timerCallback = function () {
            $scope.gridOptions.reloadCurrentData();
        };

        $scope.$on('PageOrdersContentChanged',function (event,data) {
            $('#chekpoints-loading-wraper').fadeIn(500);
            $scope.gridOptions.reloadCurrentData();
        });

        $scope.deleteOrder = function(item) {
            console.log('dddddeeeee', item);

            var confirm = $mdDialog.confirm()
                .title('Ви впевнені, що бажаете видалити наряд?')
                .textContent('Данні наряду відновленню не підлягатимуть.')
                .ariaLabel('Confirm delete')
                .ok('Видалити')
                .cancel('Відміна');

            $mdDialog.show(confirm).then(function() {
                OrdersRestService.deleteByDate(item.route, item.graph, $scope.presets.date.js);
                $scope.gridOptions.reloadCurrentData();
            }, function() {

            });
        };


        $scope.gridOptions.showEditPopup = function (row, grid) {
            if($scope.presets.date.js <= new Date()) {
                $scope.displaySimplePopUp('Редагування нарядів на цей день заборонено');
                return;
            }
            $mdDialog.show({
                controller: 'AddOrderController',
                templateUrl: 'app/templates/popup/addOrderWindow.tpl.html',
                parent: angular.element(document.body),
                clickOutsideToClose:false,
                hasBackdrop:false,
                multiple:true,
                autoWrap:false,
                skipHide: true,
                locals: {row: row.entity, date:$scope.presets.date.js}
            })
                .then(function() {
                    $scope.gridOptions.reloadCurrentData();
                }, function() {
                    $scope.gridOptions.reloadCurrentData();
                });
        };

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

        $scope.GenerateOrders = function() {
            $mdDialog.show({
                controller: 'GenerateOrdersController',
                templateUrl: 'app/templates/popup/generateOrdersWindow.tpl.html',
                parent: angular.element(document.body),
                clickOutsideToClose:false,
                hasBackdrop:false,
                multiple:true,
                autoWrap:false,
                skipHide: true,
                locals: {data: $scope.gridOptions.data}
            })
        };

        $scope.openOverPage = function() {
            $mdDialog.show({
                controller: 'manageWorkersStatesController',
                templateUrl: 'app/templates/popup/workersStatesWindow.tpl.html',
                parent: angular.element(document.body),
                clickOutsideToClose:false,
                hasBackdrop:false,
                multiple:true,
                autoWrap:false,
                skipHide: true,
                locals: {date: $scope.presets.date.js}
            }).then(function(answer) {
                console.log('answer', answer);
                $scope.forExport.workers = answer;
            });
        };
        $scope.openOverPageVeh = function() {
            $mdDialog.show({
                controller: 'manageVehiclesStatesController',
                templateUrl: 'app/templates/popup/vehiclesStatesWindow.tpl.html',
                parent: angular.element(document.body),
                clickOutsideToClose:false,
                hasBackdrop:false,
                multiple:true,
                skipHide: true,
                autoWrap:false,
                locals: {date: $scope.presets.date.js}
            }).then(function(answer) {
                console.log('answer', answer);
                $scope.forExport.vehicles = answer;
            })
        };

        function HightlightChanged(grid, row, col, rowRenderIndex, colRenderIndex) {
            if(row.entity.change_data) {
                return 'cell-green-back1';
            } else {
                return 'cell-default';
            }
        }
    }]);





