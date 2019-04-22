/**
 * Created by walex on 23.12.16.
 */
app.controller('manageWorkersStatesController', ['$scope','$http','OrdersRestService','FullPopupLoader','customUnixTimeFilter','$filter','$timeout',
    '$mdDialog','$rootScope','WorkersStatesRestService','WorkersRestService','$q','GlobalStorage','date','ngDialog',
    function ($scope,$http,OrdersRestService,FullPopupLoader,customUnixTimeFilter,$filter,$timeout,$mdDialog,$rootScope,WorkersStatesRestService,
              WorkersRestService,$q,GlobalStorage,date,ngDialog) {

        $scope.userData = $rootScope.UserData;
        $scope.lang = $rootScope.lang;


        $scope.loadedId = 0;
        $scope.loadedState = 0;
        $scope.dispalyWSdate = date;
        $scope.displayDate = $filter('date')($scope.dispalyWSdate, 'yyyy-MM-dd');

        $scope.addData = {
            from:new Date(),
            to:new Date(),
            ifEdit:0
        };
        $scope.states = [
            {id:1,name:'Хворий'},
            {id:2,name:'Вихідний'},
            {id:3,name:'Відпустка'}
        ];

        $scope.gridOptions = new GridController(null, null);
        $scope.gridOptions.enableFiltering = false;
        $scope.gridOptions.enableColumnMenus = false;
        $scope.gridOptions.enableRowSelection = true;
        $scope.gridOptions.enableCellEditOnFocus = false;
        $scope.gridOptions.multiSelect = false;
        $scope.gridOptions.enableColumnMenus = false;
        $scope.gridOptions.columnVirtualizationThreshold = 20;

        $scope.gridOptions.rowTemplate = '<div ng-dblclick="grid.options.deleteWstate(row)" ' +
            'ng-class="{ \'grid-row-edited\':row.entity.__changed, \'grid-row-new\':row.entity.__isNew}">' +
            '<div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name"' +
            ' class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }" ui-grid-cell></div></div>';
        $scope.gridOptions.initColumnDefs = function () {
            $scope.gridOptions.headerTemplate = 'app/templates/grid/category/categoryHeader.tpl.html';
            $scope.gridOptions.category = [
                {name:'column0',langName:'id',visible:false,showCatName:false},
                {name:'worker',langName:'Workers',dName:'Працівник',visible:true,showCatName:true},
                {name:'status',langName:'state',dName:'Статус',visible:true,showCatName:false},
                {name:'period',langName:'period',dName:'Період',visible:true,showCatName:true},
            ];

            $scope.gridOptions.columnDefs = [
                {name:'id',category:'column0',langName:'id',field:'id',displayName:'id',enableCellEdit:false,width:50,pinnedLeft:true,visible:false},
                {name:'name',category:'worker',langName:'name',field:"name",displayName:'id',enableCellEdit:false,width:240,pinnedLeft:true,visible:true,cellClass:displayCurrent},
                {name:'basic_number',category:'worker',langName:'Tab N',field:"basic_number",displayName:'id',enableCellEdit:false,width:80,pinnedLeft:true,visible:true,cellClass:displayCurrent},
                {name:'state',category:'status',langName:'state',field:"state",displayName:'id',width:100,pinnedLeft:true,visible:true,enableCellEdit:false,cellFilter:'mapStates'},
                {name:'from',category:'period',langName:'Time from',field:"from",displayName:'id',enableCellEdit:false,width:100,pinnedLeft:true,visible:true,type:'date',cellFilter: 'date:\'dd-MM-yyyy\''},
                {name:'to',category:'period',langName:'Time to',field:"to",displayName:'id',enableCellEdit:false,width:100,pinnedLeft:true,visible:true,type:'date',cellFilter: 'date:\'dd-MM-yyyy\''},
            ]
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

            $scope.gridOptions.initColumnDefs();
        $scope.gridOptions.initColumnNameDefs();

        if($scope.lang.hasOwnProperty('words')) {
            $scope.gridOptions.initColumnNameDefs();
        }
        $scope.$on('LanguageChanged', function (event, data) {
            $scope.gridOptions.initColumnNameDefs();
        });

        $scope.gridOptions.loadData = function() {
            loadWorkersStates($scope.dispalyWSdate);
        };


        $scope.loadWSbyDate = function() {
            $scope.gridOptions.loadData();
        };

        $scope.removeWorkerState = function() {
            var res = WorkersStatesRestService.getResource();
            res.delete({id:parseInt($scope.loadedId)},function(data, response) {
                // $scope.gridOptions.loadData({parks_id:$scope.userData.pid}, $scope.gridOptions);
                $scope.gridOptions.loadData();
            }, function(error) {console.log(error);});
        };


        $scope.gridOptions.deleteWstate = function(row) {

            $scope.addData.state = parseInt(row.entity.state);
            $scope.addData.wid = {id:row.entity.worker_id, name:row.entity.name, basic_number:row.entity.basic_number}

            var dfa = row.entity.from.split('-');
            var df = new Date();
            df.setYear(dfa[0]);
            df.setMonth(dfa[1] - 1);
            df.setDate(dfa[2]);

            var dsa = row.entity.to.split('-');
            var ds = new Date();
            ds.setYear(dsa[0]);
            ds.setMonth(dsa[1] - 1);
            ds.setDate(dsa[2]);

            $scope.addData.from = df;
            $scope.addData.to = ds;

            $scope.loadedId = row.entity.id;
            $scope.loadedState = row.entity.state;

            $scope.editDialog = ngDialog.open({ template: 'mws-popup', scope:$scope });
            $('#mws-popup-window li:last-child div.btns').addClass('extended');
            // console.log('rd',row);
            // var res = WorkersStatesRestService.getResource();
            // res.delete({id:parseInt(row.entity.id)},function(data, response) {
            //     // $scope.gridOptions.loadData({parks_id:$scope.userData.pid}, $scope.gridOptions);
            //     $scope.gridOptions.loadData();
            // }, function(error) {console.log(error);});
        };

        $scope.newState = function() {
            $scope.addData.state = 1;
            // $scope.addData.reason = data[0].reason;

            $scope.addData.wid = undefined;

            $scope.addData.from = new Date();
            $scope.addData.to = new Date();

            $scope.loadedId = 0;
            $scope.loadedState = 0;
            $('#mws-popup-window li:last-child div.btns').removeClass('extended');
            $scope.editDialog = ngDialog.open({ template: 'mws-popup', scope:$scope });
        };

        $scope.editState = function(row) {
            console.log('11111111111');
            var ss = $scope.myGridApi.selection.getSelectedRows();
            console.log('ss',ss);
            $scope.addData.state = parseInt(row.state);

            $scope.addData.wid = {
                id:parseInt(row.id),
                name:row.name,
                basic_number:row.basic_number
            }

            var ds = new Date, time = $row.from.split(/\:|\-/g);
            ds.setYear(time[0])
            ds.setMonth(time[1])
            ds.setDate(time[2])
            $scope.addData.from = ds;
            var ds2 = new Date, time2 = $row.to.split(/\:|\-/g);
            ds2.setYear(time2[0])
            ds2.setMonth(time2[1])
            ds2.setDate(time2[2])
            $scope.addData.to = ds2;
        };

        function loadWorkersStates(date) {
            if(!date) {
                var date = new Date();
            }

            var resource = WorkersStatesRestService.getResource();
            date = $filter('date')(date, 'yyyy-MM-dd');
            resource.query({date:date, pid:$scope.userData.pid}, function (data, response) {
                console.log('ws_loaded_data',data);
                var headers = response();
                $scope.gridOptions.totalItems = parseInt(headers['x-pagination-total-count']);
                $scope.gridOptions.data = data;
                $scope.gridOptions.updateData();
                // $('#chekpoints-loading-wraper').fadeOut(500);
            }, function (error) {
                gridOptions.updateData();
                console.log(error);
            });
        }

        $scope.gridOptions.loadData();


        $scope.queryWorkerSearch = function(query) {
            var search_string = query ? query : '';
            var resource = WorkersRestService.getResource();
            var deferred = $q.defer();
            resource.query({'type': 'all', 'parks_id': $scope.userData.pid, 's': search_string}, function(data, response) {
                // console.log($scope.row.parks_id);
                //console.log(data);
                deferred.resolve(data);
            }, function(error) {console.log(error)});

            return deferred.promise;
        };

        $scope.selectedWorkerChange = function(input) {
            $scope.loadedId = 0;
            $('#mws-popup-window li:last-child div.btns').removeClass('extended');
            if(input) {
                $scope.addData.state = input;
                $scope.addData.state = 1;
                var res = WorkersStatesRestService.getResource();
                res.query({wid:input.id,date:$filter('date')($scope.dispalyWSdate, 'yyyy-MM-dd')}, function(data, response) {
                    console.log('catch', data);
                    if(data && data[0]) {
                        $scope.addData.state = data[0].state;
                        // $scope.addData.reason = data[0].reason;

                        var dfa = data[0].from.split('-');
                        var df = new Date();
                        df.setYear(dfa[0]);
                        df.setMonth(dfa[1] - 1);
                        df.setDate(dfa[2]);

                        var dsa = data[0].to.split('-');
                        var ds = new Date();
                        ds.setYear(dsa[0]);
                        ds.setMonth(dsa[1] - 1);
                        ds.setDate(dsa[2]);

                        $scope.addData.from = df;
                        $scope.addData.to = ds;

                        $scope.loadedId = data[0].id;
                        $scope.loadedState = data[0].state;
                        $('#mws-popup-window li:last-child div.btns').addClass('extended');
                    }

                }, function (error) {console.log(error);});
            }
        };

        $scope.addWorkerState = function() {
            var res = WorkersStatesRestService.getResource();

            if($scope.addData.from > $scope.addData.to) {
                ngDialog.open({template:'<p>Помилка вибору періода</p>',plain:true,className:'ngdialog-theme-default'});
                return;
            }

            res.query({action:'check', wid:$scope.addData.wid.id}, function(data, responce) {
                if(data[0]) {
                    for( var i = 0; i < data.length; i++ ) {
                        if($filter('date')($scope.addData.from, 'yyyy-MM-dd') < data[i].to) {
                            ngDialog.open({template:'<p>Перехрестя періодів відсутності</p>',plain:true,className:'ngdialog-theme-default'});
                            return;
                        }
                    }
                }
                if($scope.loadedId != 0 && $scope.loadedState == $scope.addData.state) {
                    res.delete({id:parseInt($scope.loadedId)});
                }
                var item = {
                    'worker_id': $scope.addData.wid.id,
                    'state': parseInt($scope.addData.state),
                    'from': $filter('date')($scope.addData.from, 'yyyy-MM-dd'),
                    'to': $filter('date')($scope.addData.to, 'yyyy-MM-dd'),
                    'created_at': Math.round(new Date().getTime()/1000),
                    'updated_at': Math.round(new Date().getTime()/1000),
                    'author_id': $scope.userData.id,
                    'updater_id': $scope.userData.id
                };
                console.log('itemS', item);

                res.save(item, function(data, response) {
                    $scope.addData.state = 1;
                    $scope.addData.from = new Date();
                    $scope.addData.to = $scope.dispalyWSdate;
                    $scope.addData.wid = undefined;

                    $scope.loadedId = 0;
                    // $scope.gridOptions.data.push(data);
                    if($scope.editDialog) {
                        $scope.editDialog.close();
                    }
                    $scope.gridOptions.loadData();
                }, function(error) {console.log('error_21: cant save worker state data',error);})
            }, function(error) {console.log('error_22: cant load worker states data',error);})
        };

        app.filter('mapStates', function() {
            return function(input) {
                switch(input) {
                    case '1':
                        return 'Хворий';
                        break;
                    case '2':
                        return 'Вихідний';
                        break;
                    case '3':
                        return 'Відпустка';
                        break;
                }
            }
        });

        function displayCurrent(grid, row, col, rowRenderIndex, colRenderIndex) {
            if(row.entity.to >= $scope.displayDate && row.entity.from <= $scope.displayDate) {
                return 'cel-current';
            }
        }

        $scope.gridOptions.filters.Users = GlobalStorage.getStorage("Users");

        app.filter('userMap', function () {
            return function (id) {
                for (var i = 0; i < $scope.gridOptions.filters.Users.length; i++) {
                    if ($scope.gridOptions.filters.Users[i].id == id) {
                        return $scope.gridOptions.filters.Users[i].username;
                    }
                }
                return '';
            };
        });

        $scope.hide = function() {
            $mdDialog.hide($scope.gridOptions.data);
        };

        $scope.cancel = function() {
            $mdDialog.hide($scope.gridOptions.data);
        };

        $scope.answer = function(answer) {
            $mdDialog.hide($scope.gridOptions.data);
        };


    }]);