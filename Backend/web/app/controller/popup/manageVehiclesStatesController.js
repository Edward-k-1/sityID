/**
 * Created by walex on 25.12.16.
 */
/**
 * Created by walex on 23.12.16.
 */
app.controller('manageVehiclesStatesController', ['$scope','$http','OrdersRestService','FullPopupLoader','customUnixTimeFilter','$filter','$timeout',
    '$mdDialog','$rootScope','VehiclesStatesRestService','VehiclesRestService','$q','GlobalStorage','date','ngDialog',
    function ($scope,$http,OrdersRestService,FullPopupLoader,customUnixTimeFilter,$filter,$timeout,$mdDialog,$rootScope,VehiclesStatesRestService,
              VehiclesRestService,$q,GlobalStorage,date,ngDialog) {

        $scope.userData = $rootScope.UserData;
        $scope.lang = $rootScope.lang;

        $scope.dispalyWSdate = date;
        $scope.displayDate = $filter('date')($scope.dispalyWSdate, 'dd-MM-yyyy');
        $scope.loadedId = 0;

        $scope.addData = {
            from:new Date(),
            to:new Date(),
            ifEdit:0
        };
        $scope.states = [
            {id:1, name:'довгостроковий ремонт (ДВС)'},
            {id:2, name:'поточний ремонт'},
            {id:3, name:'СТО (СУРС та ТІ)'},
            {id:4, name:'ТО-2 (СТО-А)'},
            {id:5, name:'інші'}
        ];

        $scope.gridOptions = new GridController(null, null);
        $scope.gridOptions.enableFiltering = false;
        $scope.gridOptions.enableColumnMenus = false;
        $scope.gridOptions.enableRowSelection = false;
        $scope.gridOptions.enableCellEditOnFocus = true;
        $scope.gridOptions.multiSelect = false;
        $scope.gridOptions.enableColumnMenus = false;
        $scope.gridOptions.columnVirtualizationThreshold = 20;

        $scope.gridOptions.rowTemplate = '<div ng-dblclick="grid.options.deleteVstate(row)" ' +
            'ng-class="{ \'grid-row-edited\':row.entity.__changed, \'grid-row-new\':row.entity.__isNew}">' +
            '<div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name"' +
            ' class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }" ui-grid-cell></div></div>';

        $scope.gridOptions.initColumnDefs = function () {
            $scope.gridOptions.headerTemplate = 'app/templates/grid/category/categoryHeader.tpl.html';
            $scope.gridOptions.category = [
                {name:'column0',langName:'id',visible:false,showCatName:false},
                {name:'vehicle',langName:'Vehicles',dName:'Працівник',visible:true,showCatName:true},
                {name:'status',langName:'state',dName:'Статус',visible:true,showCatName:true},
                {name:'period',langName:'period',dName:'Період',visible:true,showCatName:true},
                // {name:'user',langName:'User',dName:'Користувач',visible:true,showCatName:true},
            ];

            $scope.gridOptions.columnDefs = [
                {name:'id',category:'column0',langName:'id',field:'id',displayName:'id',enableCellEdit:false,width:50,pinnedLeft:true,visible:false},
                {name:'board_number',category:'vehicle',langName:'BN',field:"board_number",displayName:'id',enableCellEdit:false,width:80,pinnedLeft:true,visible:true},
                {name:'state_number',category:'vehicle',langName:'SN',field:"state_number",displayName:'id',enableCellEdit:false,width:100,pinnedLeft:true,visible:true},
                {name:'state',category:'status',langName:'state',field:"state",displayName:'id',width:250,pinnedLeft:true,visible:true,enableCellEdit:false,cellFilter:'mapVStates'},
                // {name:'reason',category:'status',langName:'reason',field:"reason",displayName:'id',enableCellEdit:false,width:150,pinnedLeft:true,visible:true},
                {name:'from',category:'period',langName:'Time from',field:"from",displayName:'id',enableCellEdit:false,width:100,pinnedLeft:true,visible:true,type:'date',cellFilter: 'date:\'dd-MM-yyyy\''},
                {name:'to',category:'period',langName:'Time to',field:"to",displayName:'id',enableCellEdit:false,width:100,pinnedLeft:true,visible:true,type:'date',cellFilter: 'date:\'dd-MM-yyyy\''},
                // {name:'created_at',category:'user',langName:'created_at',field:"created_at",displayName:'created_at',enableCellEdit:false,width:150,pinnedLeft:true,visible:true,cellFilter:'customUnixTime'},
                // {name:'updated_at',category:'user',langName:'updated_at',field:"updated_at",displayName:'updated_at',enableCellEdit:false,width:150,pinnedLeft:true,visible:true,cellFilter:'customUnixTime'},
                // {name:'author_id',category:'user',langName:'author_id',field:"author_id",displayName:'author_id',enableCellEdit:false,width:100,pinnedLeft:true,visible:true,cellFilter:'userMap'},
                // {name:'updater_id',category:'user',langName:'updater_id',field:"updater_id",displayName:'updater_id',enableCellEdit:false,width:100,pinnedLeft:true,visible:true,cellFilter:'userMap'},
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
            // console.log('obj111', obj);

            loadVehiclesStates($scope.dispalyWSdate);
        };

        $scope.removeVehicleState = function() {
            var res = VehiclesStatesRestService.getResource();
            res.delete({id:parseInt($scope.loadedId)},function(data, response) {
                $scope.gridOptions.loadData({parks_id:$scope.userData.pid}, $scope.gridOptions);
                $scope.loadedId = 0;
            }, function(error) {console.log(error);});
        };

        $scope.gridOptions.deleteVstate = function(row) {
            // var res = VehiclesStatesRestService.getResource();
            // res.query({vid:row.entity.vehicles_id,date:$filter('date')($scope.dispalyWSdate, 'yyyy-MM-dd')}, function(data, response) {
            //     console.log('catch', data);
            //     if(data && data[0]) {
                    $scope.addData.state = row.entity.state;
                    // $scope.addData.reason = row.entity.reason;

                    $scope.addData.veh = {id:row.entity.vehicles_id, state_number: row.entity.state_number, board_number: row.entity.board_number};
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
                // }

            // }, function (error) {console.log(error);});
            ngDialog.open({ template: 'mvs-popup', scope:$scope });
            // console.log('rd',row);
            // var res = VehiclesStatesRestService.getResource();
            // res.delete({id:parseInt(row.entity.id)},function(data, response) {
            //     $scope.gridOptions.loadData({parks_id:$scope.userData.pid}, $scope.gridOptions);
            // }, function(error) {console.log(error);});
        };

        function loadVehiclesStates(date) {
            if(!date) {
                var date = new Date();
            }

            var resource = VehiclesStatesRestService.getResource();
            date = $filter('date')(date, 'yyyy-MM-dd');
            resource.query({date:date, pid:$scope.userData.pid}, function (data, response) {
                console.log('ws_loaded_data',data);
                var headers = response();
                $scope.gridOptions.totalItems = parseInt(headers['x-pagination-total-count']);
                $scope.gridOptions.data = data;
                $scope.gridOptions.updateData();
                // $('#chekpoints-loading-wraper').fadeOut(500);
            }, function (error) {
                $scope.gridOptions.updateData();
                console.log(error);
            });
        }

        $scope.gridOptions.loadData();


        $scope.queryVehicleSearch = function(query) {
            var search_string = query ? query : '';
            var resource = VehiclesRestService.getResource();
            var deferred = $q.defer();
            resource.query({'type': 0, 'parks_id': $scope.userData.pid, 's': search_string}, function(data, response) {
                console.log(data);
                deferred.resolve(data);
            }, function(error) {console.log(error)});

            return deferred.promise;
        };

        $scope.selectedVehicleChange = function(input) {
            $scope.loadedId = 0;
            if(input) {
                $scope.addData.vid = input.id;

                var res = VehiclesStatesRestService.getResource();
                res.query({vid:input.id,date:$filter('date')($scope.dispalyWSdate, 'yyyy-MM-dd')}, function(data, response) {
                    console.log('catch', data);
                    if(data && data[0]) {
                        $scope.addData.state = data[0].state;
                        $scope.addData.reason = data[0].reason;

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
                    }

                }, function (error) {console.log(error);});
            }
        };

        $scope.newState = function() {
            ngDialog.open({ template: 'mvs-popup', scope:$scope });
        };

        $scope.addVehicleState = function() {
            var res = VehiclesStatesRestService.getResource();
            if($scope.loadedId != 0) {
                console.log('lid',$scope.loadedId);
                res.delete({id:parseInt($scope.loadedId)});
            }
            var item = {
                'vehicles_id': $scope.addData.veh.id,
                'state': parseInt($scope.addData.state),
                'reason': $scope.addData.reason,
                'from': $filter('date')($scope.addData.from, 'yyyy-MM-dd'),
                'to': $filter('date')($scope.addData.to, 'yyyy-MM-dd'),
                'created_at': Math.round(new Date().getTime()/1000),
                'updated_at': Math.round(new Date().getTime()/1000),
                'author_id': $scope.userData.id,
                'updater_id': $scope.userData.id
            };
            if(!item.from) {
                item.from = $filter('date')(new Date(), 'yyyy-MM-dd');
            }
            if(!item.to) {
                item.to = $filter('date')(new Date(), 'yyyy-MM-dd');
            }
            console.log('itemS', item);

            res.save(item, function(data, response) {
                $scope.addData.state = 1;
                $scope.addData.reason = undefined;
                $scope.addData.from = new Date();
                $scope.addData.to = $scope.dispalyWSdate;
                $scope.loadedId = 0;
                $scope.addData.veh = undefined;
                // $scope.gridOptions.data.push(data);
                $scope.gridOptions.loadData({parks_id:$scope.userData.pid}, $scope.gridOptions);
            }, function(error) {console.log(error);})
        };

        app.filter('mapVStates', function() {
            return function(input) {
                switch(input) {
                    case '1':
                        return 'довгостроковий ремонт (ДВС)';
                        break;
                    case '2':
                        return 'поточний ремонт';
                        break;
                    case '3':
                        return 'СТО (СУРС та ТІ)';
                        break;
                    case '4':
                        return 'ТО-2 (СТО-А)';
                        break;
                    case '5':
                        return 'інші';
                        break;
                }
            }
        });

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