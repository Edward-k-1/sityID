/**
 * Created by walex on 17.11.16.
 */
app.controller('tcdWindowController', ['$scope', '$rootScope', '$http', '$mdDialog', 'row', 'CardListenerRestService', 'SmartCardRestService',
    'WorkersRestService', 'VehiclesTcdRestService', 'DriversWorkshiftRestService',
    'MessagesRestService', 'LanguageService', 'UserRestService', 'AuthService', 'GlobalStorage',
    function ($scope, $rootScope, $http, $mdDialog, row, CardListenerRestService, SmartCardRestService, WorkersRestService, VehiclesTcdRestService,
              DriversWorkshiftRestService, MessagesRestService, LanguageService,
              UserRestService, AuthService, GlobalStorage) {

        $scope.lang = $rootScope.lang;

        $scope.date = Math.round((new Date()).getTime() / 1000);
        $scope.userId = 0;
        $scope.notExistWorkshift = false;

        $scope.gridOptions = new GridController(null, null);

        $scope.gridOptions.flatEntityAccess = true;
        $scope.gridOptions.minRowsToShow = 10;
        $scope.gridOptions.enableColumnMenus = false;

        $scope.gridOptions.initColumnDefs = function () {
            $scope.gridOptions.columnDefs = [
                {name: 'id', enableCellEdit: false, width: 70, visible: false},
                {name: 'action_date',field: 'action_date',displayName: "Date",enableCellEdit: false,width: 180,cellFilter: "customUnixTimeOnly"},
                {name: 'Driver',field: 'driver_name',displayName: "Driver",enableCellEdit: false,width: 180},
                {name: 'status',field: 'status',displayName: "Status",enableCellEdit: false,width: 180, cellFilter: "tcdStatusFilter", cellClass: cellClassTcdStatus},
                {name: 'message',field: 'message',displayName: "Description",enableCellEdit: false}
            ];
        };
        /**
         * Defined translate function
         */
        $scope.gridOptions.initColumnNameDefs = function () {

            $scope.gridOptions.columnDefs[0].displayName = $scope.lang.words["id"];
            $scope.gridOptions.columnDefs[1].displayName = $scope.lang.words["Action date"];
            $scope.gridOptions.columnDefs[2].displayName = $scope.lang.words["Driver"];
            $scope.gridOptions.columnDefs[3].displayName = $scope.lang.words["status"];
            $scope.gridOptions.columnDefs[4].displayName = $scope.lang.words["VTK Description"];

            $scope.gridOptions.updateData();
        };

        $scope.gridOptions.initColumnDefs();
        $scope.gridOptions.initColumnNameDefs();
        $scope.gridOptions._init();

        $scope.hide = function() {
            $mdDialog.hide();
        };

        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        $scope.answer = function(answer) {
            $mdDialog.hide(answer);
        };

        setUserId();
        setup_data();

        // Function to load all needed data for display and handle some errors wile loading
        function setup_data() {
            $scope.worker_data = {'card_key': row.card_id };

            var resource = SmartCardRestService.getResource();
            resource.query({'card_key': row.card_id}, function(data, response) {

                if(!data[0]){console.log('Invalid Card Key');$scope.error = $scope.lang.words["Invalid card key"];return;}

                $scope.worker_data.worker_id = data[0].workers_id;

                resource = WorkersRestService.getResource();
                resource.query({'id': data[0].workers_id}, function(data, response) {
                    $scope.worker_data.info = data[0];
                    $scope.worker_data.info.worker_job = getWorkerJob(data[0].worker_views_id);

                    resource = DriversWorkshiftRestService.getResource();
                    resource.query({'get_current_vehicle': data[0].id}, function (data, response) {
                        if(!data[0]){
                            console.log('No Workshifts for Worker');
                           // $scope.error = $scope.lang.words["No Workshifts for worker"];return;
                            $scope.notExistWorkshift = true;
                            return;
                        }
                        $scope.vehicle_data = data[0];
                        resource = VehiclesTcdRestService.getResource();
                        resource.query({'vehicle_id': $scope.vehicle_data.vehicles_id}, function (data, response) {
                            var headers = response();
                            $scope.gridOptions.data = data;
                            $scope.gridOptions.totalItems = parseInt(headers['x-pagination-total-count']);
                            }, function (error) {console.log(error);});
                        }, function (error) {console.log(error);});

                }, function(error) {console.log(error);});

            }, function(error) {console.log(error);});
        }

        // Function return worker job name by job id
        function getWorkerJob(id) {
            var worker_views = GlobalStorage.getStorage('WorkerViews');
            for(var i = 0; i < worker_views.length; i++) {
                if(worker_views[i].id == id) {
                    return worker_views[i].name;
                }
            }
        }

        // Function to set current user ID into variable $scope.userId
        function setUserId() {
            var usrName = AuthService.getUserName();
            var resource = UserRestService.getResource();
            resource.query({'name': usrName}, function (data, response) {
                $scope.userId = data[0].id;
            }, function(error) {console.log(error);});
        }

        //Function for message construction - because may called several times
        function constructMessage(message) {
            var message_row = {
                "message": message,
                "created_at": $scope.date,
                "updated_at": $scope.date,
                "author_id": $scope.userId,
                "updater_id": $scope.userId
            };
            return message_row;
        }

        //Function for TCD item construction - because may called several times
        function constructItem() {
            var item = {
                "drivers_id":  $scope.worker_data.worker_id,
                "status": 0,
                "action_date": $scope.date,
                "message_id": 0,
                "vehicles_id": $scope.vehicle_data.vehicles_id,
                "created_at": $scope.date,
                "updated_at": $scope.date,
                "author_id": $scope.userId,
                "updater_id": $scope.userId
            };
            return item;
        }

        //Function for user selected - all clear option  - generate item and save it - delete current instance in listener table
        $scope.AllClear = function() {
            var item = constructItem();
            var resource = VehiclesTcdRestService.getResource();

            item.status = 2;

            resource.save(item, function (data, response) {
                deleteInstanse();
            }, function (error) {console.log(error);});
        }

        //If user press cancel - delete current instance in listener table
        $scope.CancelWorker = function() {
            deleteInstanse();
        }

        //If user press all bad option - construct message snd item - save it  - delete current instance in listener table
        $scope.AllBad = function() {
            var confirm = $mdDialog.prompt()
                .title($scope.lang.words["Description"])
                .textContent($scope.lang.words["Define reason"])
                .placeholder($scope.lang.words["Reason"])
                .ariaLabel($scope.lang.words["Reason"])
                .initialValue($scope.lang.words["Departure prohibited"])
                .ok($scope.lang.words["Confirm"])
                .cancel($scope.lang.words["Cancel"]);

            $mdDialog.show(confirm).then(function(result) {
                var message = constructMessage(result);
                var item = constructItem();

                var resource = MessagesRestService.getResource();
                resource.save(message, function (data, response) {

                    resource = VehiclesTcdRestService.getResource();

                    item.status = 1;
                    item.message_id = data.id;

                    resource.save(item, function (data, response) {
                        deleteInstanse();
                    }, function (error) {console.log(error);});

                }, function(error) {console.log(error);});
                $rootScope.$broadcast("UnConfirmComplite",1);
            }, function() {
                $rootScope.$broadcast("UnConfirmComplite",1);
            });
        }

        // function for deleting current instance in listener table
        function deleteInstanse() {
            var resource = CardListenerRestService.getResource();
            resource.delete({id: row.id}, function (data, response) {
                $mdDialog.hide();
            }, function (error) {console.log(error);});
        }

        // Function to define cell class
        function cellClassTcdStatus(grid, row, col, rowRenderIndex, colRenderIndex) {
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

        // Filter for status cells
        app.filter('tcdStatusFilter', function() {
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

    }

]);
