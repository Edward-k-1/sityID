/**
 * Created by walex on 16.12.16.
 */
app.controller('AddRouteController', ['$scope', '$http', '$filter', '$q', 'RoutesRestService', 'GraphsRestService',
    "FullPopupLoader", 'customUnixTimeFilter', 'pid', 'AuthService', 'UserRestService', "$mdDialog","$rootScope",
    'SchedulesRestService', 'WorkshiftsRestService',
    function ($scope, $http, $filter, $q, RoutesRestService, GraphsRestService, FullPopupLoader,
              customUnixTimeFilter, pid, AuthService, UserRestService, $mdDialog,$rootScope,SchedulesRestService,WorkshiftsRestService) {

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

        function setUserId() {
            var usrName = AuthService.getUserName();
            var resource = UserRestService.getResource();
            resource.query({'name': usrName}, function (data, response) {
                $scope.userId = data[0].id;
                $scope.loadMyRoutes();
            }, function(error) {console.log(error);});
        }

        setUserId();

        $scope.data = {
            "routeName": null,
            "routeFullName": null,
            "myRoutes": null
        };

        $scope.loadMyRoutes = function() {
            var res = RoutesRestService.getResource();
            console.log('u', $scope.userId);
            res.query({'uid': $scope.userId}, function(data, response) {
                console.log('my-r', data);
                $scope.data.myRoutes = data;
            }, function(error) {console.log(error);});
        };



        $scope.deleteRoute = function(id,$event) {
            console.log('for-del',id);
            var rres = RoutesRestService.getResource();
            rres.delete({'id':id}, function(data, response) {
                var el = angular.element($event.currentTarget.parentNode);
                el.html('<p>Видалено</p>');
            }, function(error) {console.log(error);})
        }


        $scope.confirmAdd = function() {
            var item = {
                "name": $scope.data.routeName,
                "route_name": $scope.data.routeFullName,
                "vehicle_types_id": 0,
                "parks_id": $scope.pid,
                "created_at": $scope.date,
                "updated_at": $scope.date,
                "author_id": $scope.userId,
                "updater_id": $scope.userId
            };
            console.log('new_route',item);
            var resource = RoutesRestService.getResource();
            resource.save(item, function(data, response) {
                console.log('saved!');

            var res2 = GraphsRestService.getResource();
                var item = {
                    "name": '1',
                    "routes_id": data.id,
                    "created_at": $scope.date,
                    "updated_at": $scope.date,
                    "author_id": $scope.userId,
                    "updater_id": $scope.userId,
                };
                console.log('new_graph', item);
                res2.save(item, function(data, response) {
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


            }, function(error) {});
        }
    }
]);