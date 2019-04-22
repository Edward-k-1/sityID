/**
 * Created by walex on 21.11.16.
 */
app.controller('pgWindowController', ['$scope', '$rootScope', '$http', '$mdDialog', 'row', 'CardListenerRestService', 'SmartCardRestService',
    'WorkersRestService', 'CheckpointRestService', 'MessagesRestService', 'LanguageService', 'UserRestService', 'AuthService', 'GlobalStorage',
    function ($scope, $rootScope, $http, $mdDialog, row, CardListenerRestService, SmartCardRestService, WorkersRestService,
              CheckpointRestService, MessagesRestService, LanguageService, UserRestService, AuthService, GlobalStorage) {

        $scope.lang = $rootScope.lang;

        $scope.date = Math.round((new Date()).getTime() / 1000);
        $scope.userId = 0;

        $scope.gridOptions = new GridController(null, null);

        $scope.gridOptions.flatEntityAccess = true;
        $scope.gridOptions.minRowsToShow = 10;
        $scope.gridOptions.enableColumnMenus = false;

        $scope.gridOptions.initColumnDefs = function () {
            $scope.gridOptions.columnDefs = [
                {name: 'id', enableCellEdit: false, width: 70, visible: false},
                {name: 'action_date',field: 'action_time',displayName: "Date",enableCellEdit: false,width: 180,cellFilter: "customUnixDate"},
                {name: 'action_time',field: 'action_time',displayName: "Time",enableCellEdit: false,width: 180,cellFilter: "customUnixTimeOnly"},
                {name: 'status',field: 'status',displayName: "Status",enableCellEdit: false, cellFilter: "pgStatusFilter", cellClass: cellClassPgStatus},
            ];
        };
        /**
         * Defined translate function
         */
        $scope.gridOptions.initColumnNameDefs = function () {

            $scope.gridOptions.columnDefs[0].displayName = $scope.lang.words["id"];
            $scope.gridOptions.columnDefs[1].displayName = $scope.lang.words["Action date"];
            $scope.gridOptions.columnDefs[2].displayName = $scope.lang.words["Action time"];
            $scope.gridOptions.columnDefs[3].displayName = $scope.lang.words["status"];

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

        setUserId(); // Get and set into variable $scope.userId - ID of current user
        setup_data();

        // Function to get all needed data from different REST Services, put it into object variable $scope.worker_data
        //  and setup grid of last MC activity
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

                    resource = CheckpointRestService.getResource();
                    resource.query({'driver': data[0].id}, function (data, response) {
                        var headers = response();
                        $scope.gridOptions.data = data;
                        $scope.gridOptions.totalItems = parseInt(headers['x-pagination-total-count']);

                    }, function (error) {console.log(error);});

                }, function(error) {console.log(error);});

            }, function(error) {console.log(error);});
        }

        // Get job name of worker by worker id
        function getWorkerJob(id) {
            var worker_views = GlobalStorage.getStorage('WorkerViews');
            for(var i = 0; i < worker_views.length; i++) {
                if(worker_views[i].id == id) {
                    return worker_views[i].name;
                }
            }
        }

        // Function to set id of current user into variable $scope.userId;
        function setUserId() {
            var usrName = AuthService.getUserName();
            var resource = UserRestService.getResource();
            resource.query({'name': usrName}, function (data, response) {
                $scope.userId = data[0].id;
            }, function(error) {console.log(error);});
        }

        //Function for MC item construction - because may called several times
        function constructItem() {
            var item = {
                "workers_id":  $scope.worker_data.worker_id,
                "status": 0,
                "action_time": $scope.date,
                "created_at": $scope.date,
                "updated_at": $scope.date,
                "author_id": $scope.userId,
                "updater_id": $scope.userId
            };
            return item;
        }

        // If User click on ok button - setup item to save - save item and delete row in listener table if item saved
        $scope.AllClear = function(type) {
            var item = constructItem();
            var resource = CheckpointRestService.getResource();

            item.status = type;

            resource.save(item, function (data, response) {
                deleteInstanse();
            }, function (error) {console.log(error);});
        };

        // If User click on cancel button - delete row in listener table only
        $scope.CancelWorker = function() {
            deleteInstanse();
        };

        // Function to delete row from Listener table
        function deleteInstanse() {
            var resource = CardListenerRestService.getResource();
            resource.delete({id: row.id}, function (data, response) {
                $mdDialog.hide();
            }, function (error) {console.log(error);});
        }

        // Function to define cell class
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

        // Filter for status cells
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

    }

]);
