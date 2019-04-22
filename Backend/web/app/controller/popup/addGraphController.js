/**
 * Created by walex on 16.12.16.
 */
app.controller('AddGraphController', ['$scope', '$http', '$filter', '$q', 'WorkshiftsRestService', 'RoutesRestService', 'GraphsRestService',
    "FullPopupLoader", 'customUnixTimeFilter', 'pid', 'AuthService', 'UserRestService', 'SchedulesRestService', "$timeout", "$mdDialog","$rootScope",
    function ($scope, $http, $filter, $q, WorkshiftsRestService, RoutesRestService, GraphsRestService, FullPopupLoader,
              customUnixTimeFilter, pid, AuthService, UserRestService, SchedulesRestService, $timeout, $mdDialog,$rootScope) {

        $scope.lang = $rootScope.lang;

        $scope.date = Math.round((new Date()).getTime() / 1000);
        $scope.userId = 0;

        $scope.pid = pid;
        console.log('pid', pid);

        $scope.hide = function () {
            $mdDialog.hide();
        };

        $scope.cancel = function () {
            $mdDialog.cancel();
        };

        $scope.answer = function (answer) {
            $mdDialog.hide(answer);
        };

        $scope.data = {
            "routes": null,
            "selectedRoute": null,
            "myGraphs": null
        };
        function setUserId() {
            var usrName = AuthService.getUserName();
            var resource = UserRestService.getResource();
            resource.query({'name': usrName}, function (data, response) {
                $scope.userId = data[0].id;
            }, function(error) {console.log(error);});
        }

        setUserId();

        $scope.loadMyGraphs = function(route) {
            console.log('r',route);
            var res = GraphsRestService.getResource();
            res.query({'uid': $scope.userId, 'route':route}, function(data, response) {
                console.log('my-g', data);
                $scope.data.myGraphs = data;
            }, function(error) {console.log(error);});
        };
        $scope.deleteGraph = function(id,$event) {
            console.log('for-del',id);
            var gres = GraphsRestService.getResource();
            gres.delete({'id':id}, function(data, response) {
                var el = angular.element($event.currentTarget.parentNode);
                el.html('<p>Видалено</p>');
            }, function(error) {console.log(error);})
        }

        $scope.loadData = function (pid) {
            var resource = RoutesRestService.getResource();
            resource.query({'parks_id': pid}, function(data, response) {
                $scope.data.routes = data;
            }, function(error) {console.log(error);});
        };

        $scope.loadData($scope.pid);



        $scope.confirmAdd = function() {
            console.log('sg', $scope.data.selectedRoute);
            var resource = GraphsRestService.getResource();
            resource.query({"route": $scope.data.selectedRoute}, function(data, response) {
                if(data.length == 0) {
                    var new_name = 1;
                } else {
                    var new_name = parseInt(data[data.length - 1].name) + 1;
                }
                var item = {
                    "name": String(new_name),
                    "routes_id": $scope.data.selectedRoute,
                    "created_at": $scope.date,
                    "updated_at": $scope.date,
                    "author_id": $scope.userId,
                    "updater_id": $scope.userId,
                };
                console.log('new_graph', item);
                resource.save(item, function(data, response) {
                    var schedule1 = {
                        "graphs_id": data.id,
                        "create_date": $filter('date')(new Date(), 'yyyy-MM-dd'),
                        "schedule_types_id": 1,
                        "status": 'yes'
                    };
                    var schedule2 = {
                        "graphs_id": data.id,
                        "create_date": $filter('date')(new Date(), 'yyyy-MM-dd'),
                        "schedule_types_id": 2,
                        "status": 'yes'
                    };

                    var sch_res = SchedulesRestService.getResource();
                    sch_res.save(schedule1, function(data, response) {
                        console.log('s1s', data);
                        var wrkshft1 = {
                            "schedules_id": data.id,
                            "number": 1,
                            "duration_limit": 43200,
                            "duration": 0,
                            "start_time": 20400,
                            "end_time": 51360
                        }
                        var wrkshft2 = {
                            "schedules_id": data.id,
                            "number": 2,
                            "duration_limit": 43200,
                            "duration": 0,
                            "start_time": 51360,
                            "end_time": 83520
                        }
                        var wkht_res = WorkshiftsRestService.getResource();
                        wkht_res.save(wrkshft1, function(data, response) {
                            console.log('s1_w1', data);
                        }, function(error) {console.log(error);})
                        wkht_res.save(wrkshft2, function(data, response) {
                            console.log('s1_w2', data);
                        }, function(error) {console.log(error);})
                    }, function(error) {console.log(error);});
                    sch_res.save(schedule2, function(data, response) {
                        console.log('s2s', data);
                        var wrkshft1 = {
                            "schedules_id": data.id,
                            "number": 1,
                            "duration_limit": 43200,
                            "duration": 0,
                            "start_time": 20400,
                            "end_time": 51360
                        }
                        var wrkshft2 = {
                            "schedules_id": data.id,
                            "number": 2,
                            "duration_limit": 43200,
                            "duration": 0,
                            "start_time": 51360,
                            "end_time": 83520
                        }
                        var wkht_res = WorkshiftsRestService.getResource();
                        wkht_res.save(wrkshft1, function(data, response) {
                            console.log('s2_w1', data);
                        }, function(error) {console.log(error);})
                        wkht_res.save(wrkshft2, function(data, response) {
                            console.log('s2_w2', data);
                        }, function(error) {console.log(error);})

                        $mdDialog.hide();

                    }, function(error) {console.log(error);});
                }, function(error) {console.log(error);});


            }, function(error) {console.log(error);})
        }
    }
]);
