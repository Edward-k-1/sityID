app.controller('AddOrderController', ['$scope', '$http', '$filter', '$q', 'WorkshiftsRestService', 'WorkersRestService', 'VehiclesRestService',
    "FullPopupLoader", 'customUnixTimeFilter', 'row', 'AuthService', 'UserRestService', 'OrdersRestService', 'VehiclesWorkshiftRestService',
    'DriversWorkshiftRestService', 'ConductorsWorkshiftRestService', 'RepeatOptionsRestService', 'OrdersPrinterRestService',
    "$timeout", "$mdDialog","$rootScope","GlobalStorage","uiGridConstants","rowSorter", 'WorkshiftsOrdersRestService','WorkersStatesRestService','date', 'VehiclesStatesRestService','ngDialog',
    function ($scope, $http, $filter, $q, WorkshiftsRestService, WorkersRestService, VehiclesRestService, FullPopupLoader,
              customUnixTimeFilter, row, AuthService, UserRestService, OrdersRestService, VehiclesWorkshiftRestService,
              DriversWorkshiftRestService, ConductorsWorkshiftRestService, RepeatOptionsRestService, OrdersPrinterRestService,
              $timeout, $mdDialog,$rootScope,GlobalStorage,uiGridConstants,rowSorter,WorkshiftsOrdersRestService,WorkersStatesRestService,date,VehiclesStatesRestService,ngDialog) {

        $scope.lang = $rootScope.lang;
        $scope.row = row;
        $scope.date = Math.round((new Date()).getTime() / 1000);
        $scope.userData = $rootScope.UserData;
        $scope.error = 0;
        $scope.inputError = 0;
        console.log('root',$rootScope);

        // ngDialog.open({ template: '<p>my template</p>',
        //     plain: true, className: 'ngdialog-theme-default' });

        if($scope.userData.access_level.orders > 1) {
            $scope.error = 'You dont have permission to change orders';
        }

        $scope.hide = function() {
            $mdDialog.hide();
        };

        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        $scope.answer = function(answer) {
            // $rootScope.dialogs['ao-'+$scope.row.route+$scope.row.graph].hide(answer);
            $mdDialog.hide(answer);
        };

        $scope.data = {
            "workshift_count": 0,
            "workshifts": {
                "vehicle": [],
                "driver": [],
                "conductor": [],
                "time_start": [],
                "time_end": [],
                "desc": []
            },
            "graph_id": $scope.row.gid,
            "route_id": $scope.row.id,
            "repeatOptions": {
                "type": 0,
                "option": '0'
            },
            orderType:undefined
        };
        $scope.data.OrderDate = date;
        $scope.selectedVItem1 = 0;
        $scope.opts = {
            graphTypeShow: 1,
            dateCheck: $scope.data.OrderDate
        };
        $scope.dayType = 1;
        if((date).getDay() > 5 || (date).getDay() < 1) {
            $scope.dayType = 2;
        }

        // $scope.disError = function(mess) {
        //
        // };

        $scope.loadSubGraph = function() {
            $('.sub-wsft').removeClass('red-state');
            if(!$('.red-state')) {
                $scope.inputError = 0;
            }
            $('.wsft-error').remove();
            if($scope.order.workshift_1.change_data.graph == undefined) {
                $scope.order.workshift_1.change_data = undefined;
                return;
            }
            var c_res = OrdersRestService.getOrdersResource();
            c_res.get({r:$scope.order.workshift_1.change_data.route,g:$scope.order.workshift_1.change_data.graph,d:$filter('date')($scope.data.OrderDate, 'yyyy-MM-dd')}, function(data, response) {
                console.log('check_usage', data);
                if(data.error.length > 0) {
                    for(var i = 0; i < data.error.length; i++) {
                        if($scope.order.route == data.error[i].route && $scope.order.graph == data.error[i].graph) {
                            continue;
                        }
                        $scope.inputError = 1;
                        $('.sub-wsft').addClass('red-state');
                        $('.sub-wsft').after('<div class="wsft-error"><p>Занаряджено: ('+data.error[i].route+'/'+data.error[i].graph+')</p></div>');
                    }
                }
                // if(data.info.length > 0) {
                //     // $scope.selectedDItem1 = {'id': data.info[0].drv, 'name': data.info[0].name, 'basic_number': data.info[0].basic_number};
                //     $scope.order.workshift_1.driver.id = data.info[0].drv;
                //     $scope.order.workshift_1.driver.data.name = data.info[0].name;
                //     $scope.order.workshift_1.driver.data.bn = data.info[0].basic_number;
                //     // $scope.selectedDriverChange({'id': data.info[0].drv, 'name': data.info[0].name, 'basic_number': data.info[0].basic_number}, 1);
                //
                //     $scope.selectedVItem1 = {'id': data.info[0].veh, 'state_number': data.info[0].state_number, 'board_number':data.info[0].board_number};
                //     $scope.order.workshift_1.vehicle.id = data.info[0].veh;
                //     $scope.order.workshift_1.vehicle.data.bn = data.info[0].board_number;
                //     $scope.order.workshift_1.vehicle.data.sn = data.info[0].state_number;
                //     $scope.order.workshift_1.vehicle.data.model = data.info[0].vn;
                // }
            }, function(error) {console.log(error);});




            var resource = OrdersRestService.getGraphsDataResource();
            resource.get({r:$scope.order.workshift_1.change_data.route,g:$scope.order.workshift_1.change_data.graph,day:$scope.dayType}, function(data, response) {
                console.log('chandddd', data);
                if(!data[1]) {
                    console.log('notttttt');
                    $scope.inputError = 1;
                    $('.sub-wsft').addClass('red-state');
                    return;
                }

                var t1 = data[1].smen_e.split(' ')[1];

                var tarr1 = data[1].smen_s.split(':');
                var tarr2 = t1.split(':');

                var ts1 = tarr2[0] - tarr1[0];
                if(ts1 < 0) {ts1 = 24 + ts1;}
                ts1 = ts1 * 60;
                var ts2 = tarr2[1] - tarr1[1];

                var ac_tm = ts1 + ts2 - data[1].din1_l - data[1].din2_l;

                var ah = parseInt(ac_tm/60) + $scope.order.workshift_1.time.work_time.hour;
                var am = Math.round((ac_tm/60)%1 * 60) + parseInt($scope.order.workshift_1.time.work_time.minutes);

                if(am > 60) {am = am - 60;ah = ah + 1;}
                if(am < 10) {
                    am = '0'+am;
                }

                var ac_tmm = Math.round((ac_tm/60)%1 * 60);
                if(ac_tmm < 10) {
                    ac_tmm = '0'+ac_tmm;
                }

                $scope.order.workshift_1.change_data.time = {
                    from:data[1].smen_s,
                    to: data[1].smen_e.split(' ')[1],
                    dinner: {
                        1: {
                            from:undefined,
                            duration:undefined,
                            place:undefined
                        },
                        2: {
                            from:undefined,
                            duration:undefined,
                            place:undefined
                        }
                    },
                    checkpoint: {
                        start: {
                            time:undefined,
                            place:undefined
                        },
                        end: {
                            time:undefined,
                            place:undefined
                        }
                    },
                    work_time: {
                        full: ac_tm,
                        hour: parseInt(ac_tm/60),
                        minutes: ac_tmm,
                        all:ah+':'+am
                    }
                };
                if($scope.order.workshift_1.time.to > $scope.order.workshift_1.change_data.time.from) {
                    $('.sub-wsft').addClass('red-state');
                    ngDialog.open({ template: '<p>Перехрестя часу роботи</p>',
                        plain: true, className: 'ngdialog-theme-default' });
                }
                if($scope.order.workshift_2) {
                    if($scope.order.workshift_1.driver.id == $scope.order.workshift_2.driver.id) {
                        $('.sub-wsft').addClass('red-state');
                        ngDialog.open({ template: '<p>Перехрестя часу роботи</p>',
                            plain: true, className: 'ngdialog-theme-default' });
                    }
                }
                var chek_over = $scope.order.workshift_1.change_data.time.work_time.hour + $scope.order.workshift_1.time.work_time.hour;
                var mins = $scope.order.workshift_1.change_data.time.work_time.minutes + $scope.order.workshift_1.time.work_time.minutes;
                if(parseInt(mins) > 60) {
                    chek_over = chek_over + 1;
                }
                console.log(chek_over);
                if(chek_over > 11) {
                    $scope.inputError = 1;
                    $('.sub-wsft').addClass('red-state');
                    ngDialog.open({ template: '<p>Більше 12 годин роботи водія</p>',
                        plain: true, className: 'ngdialog-theme-default' });
                }
            }, function(error) {});
            console.log('o11111111111111111o',$scope.order);
        };

        $scope.loadGraphData = function() {
            var resource = OrdersRestService.getGraphsDataResource();
            resource.get({r:$scope.row.route,g:$scope.row.graph,day:$scope.dayType}, function (data, response) {
                console.log('aaasssqqqq', data);
                if(!data[0]) {
                    $scope.error = 'Error loading graph data';
                    return;
                }

                switch (data[0].smen_type_id) {
                    case 1:
                        $scope.data.orderType = '0';
                        break;
                    case 2:
                        $scope.data.orderType = '1';
                        break;
                    case 3:
                        $scope.data.orderType = '1';
                        break;
                    case 4:
                        $scope.data.orderType = '2';
                        break;
                    case 5:
                        $scope.data.orderType = '2';
                        break;
                }
                $scope.order = OrdersRestService.newOrder($scope.row.route,$scope.row.graph, $scope.data.orderType);
                $scope.order.setDate(date);

                for(var i = 0; i < data.length; i++) {
                    var t1 = data[i].smen_e.split(' ')[1];

                    var tarr1 = data[i].smen_s.split(':');
                    var tarr2 = t1.split(':');

                    var ts1 = tarr2[0] - tarr1[0];
                    if(ts1 < 0) {ts1 = 24 + ts1;}
                    ts1 = ts1 * 60;
                    var ts2 = tarr2[1] - tarr1[1];

                    var ac_tm = ts1 + ts2 - data[i].din1_l - data[i].din2_l;

                    var minutes = Math.round((ac_tm/60)%1 * 60);
                    if(minutes < 10) {minutes = '0'+minutes;}
                    $scope.order['workshift_' + (i+1)].time = {
                        from:data[i].smen_s,
                        to:t1,
                        dinner: {
                            1: {
                                from:data[i].din1_s,
                                duration:data[i].din1_l,
                                place:data[i].din1_pl
                            },
                            2: {
                                from:data[i].din2_s,
                                duration:data[i].din2_l,
                                place:data[i].din2_pl
                            }
                        },
                        checkpoint: {
                            start: {
                                time:data[i].time_s,
                                place:data[i].point_s
                            },
                            end: {
                                time:data[i].time_e,
                                place:data[i].point_e
                            }
                        },
                        work_time: {
                            full: ac_tm,
                            hour: parseInt(ac_tm/60),
                            minutes: minutes
                        }
                    };
                    $scope.order['workshift_' + (i+1)].use = {
                        veh: data[i].type_pe
                    };
                }

                console.log('eoeoeoe', $scope.order);

                if($scope.row.order_data != 0) {
                    console.log('rowww',$scope.row);

                    $scope.order.date = $scope.row.order_data.action_date;

                    if($scope.row.workshift_1.c_data) {
                        $scope.order.workshift_1.change_data.route = $scope.row.workshift_1.c_data.route;
                        $scope.order.workshift_1.change_data.graph = $scope.row.workshift_1.c_data.graph;
                        $scope.loadSubGraph();
                    }

                    var parts = $scope.row.order_data.action_date.split("-");
                    $scope.data.OrderDate =  new Date(parts[0], parts[1] - 1, parts[2]);

                    $scope.order.graph_type = $scope.row.order_data.graph_type;

                    console.log('oee',$scope.order);
                    $scope.data.orderType =$scope.row.order_data.type;

                    $scope.opts.graphTypeShow = 0;

                    if($scope.row.workshift_1.driver) {
                        $scope.selectedDItem1 = {'id': $scope.row.workshift_1.driver.id, 'name': $scope.row.workshift_1.driver.name, 'basic_number': $scope.row.workshift_1.driver.basic_number};
                        $scope.order.workshift_1.driver.id = $scope.row.workshift_1.driver.id;
                        $scope.order.workshift_1.driver.data.name = $scope.row.workshift_1.driver.name;
                        $scope.order.workshift_1.driver.data.bn = $scope.row.workshift_1.driver.basic_number;
                    }
                    if($scope.row.workshift_1.vehicle) {
                        $scope.selectedVItem1 = {'id': $scope.row.workshift_1.vehicle.id, 'state_number': $scope.row.workshift_1.vehicle.state_number, 'board_number':$scope.row.workshift_1.vehicle.board_number};
                        $scope.order.workshift_1.vehicle.id = $scope.row.workshift_1.vehicle.id;
                        $scope.order.workshift_1.vehicle.data.bn = $scope.row.workshift_1.vehicle.board_number;
                        $scope.order.workshift_1.vehicle.data.sn = $scope.row.workshift_1.vehicle.state_number;
                        $scope.order.workshift_1.vehicle.data.model = $scope.row.workshift_1.vehicle.name;
                    }
                    if($scope.row.workshift_1.conductor) {
                        $scope.selectedCItem1 = {'id': $scope.row.workshift_1.conductor.id, 'name': $scope.row.workshift_1.conductor.name, 'basic_number': $scope.row.workshift_1.conductor.basic_number};
                        $scope.order.workshift_1.conductor.id = $scope.row.workshift_1.conductor.id;
                        $scope.order.workshift_1.conductor.data.name = $scope.row.workshift_1.conductor.name;
                        $scope.order.workshift_1.conductor.data.bn = $scope.row.workshift_1.conductor.basic_number;
                    }

                    switch($scope.row.order_data.type) {
                        case '0':
                            break;
                        default:
                            if($scope.row.workshift_2 && $scope.row.workshift_2.driver) {
                                $scope.selectedDItem2 = {'id': $scope.row.workshift_2.driver.id, 'name': $scope.row.workshift_2.driver.name, 'basic_number': $scope.row.workshift_2.driver.basic_number};
                                $scope.order.workshift_2.driver.id = $scope.row.workshift_2.driver.id;
                                $scope.order.workshift_2.driver.data.name = $scope.row.workshift_2.driver.name;
                                $scope.order.workshift_2.driver.data.bn = $scope.row.workshift_2.driver.basic_number;
                            }
                            if($scope.row.workshift_2.conductor) {
                                $scope.selectedCItem2 = {'id': $scope.row.workshift_2.conductor.id, 'name': $scope.row.workshift_2.conductor.name, 'basic_number': $scope.row.workshift_2.conductor.basic_number};
                                $scope.order.workshift_2.conductor.id = $scope.row.workshift_2.conductor.id;
                                $scope.order.workshift_2.conductor.data.name = $scope.row.workshift_2.conductor.name;
                                $scope.order.workshift_2.conductor.data.bn = $scope.row.workshift_2.conductor.basic_number;
                            }
                            if($scope.row.workshift_2.vehicle) {
                                $scope.selectedVItem2 = {'id': $scope.row.workshift_2.vehicle.id, 'state_number': $scope.row.workshift_2.vehicle.state_number, 'board_number':$scope.row.workshift_2.vehicle.board_number};

                                $scope.order.workshift_2.vehicle.id = $scope.row.workshift_2.vehicle.id;
                                $scope.order.workshift_2.vehicle.data.bn = $scope.row.workshift_2.vehicle.board_number;
                                $scope.order.workshift_2.vehicle.data.sn = $scope.row.workshift_2.vehicle.state_number;
                                $scope.order.workshift_2.vehicle.data.model = $scope.row.workshift_2.vehicle.name;
                            }

                            break;
                    }
                } else {
                    if($scope.row.workshift_2 && $scope.row.workshift_2.vehicle && $scope.row.workshift_2.driver) {
                        $scope.selectedDItem2 = {'id': $scope.row.workshift_2.driver.id, 'name': $scope.row.workshift_2.driver.name, 'basic_number': $scope.row.workshift_2.driver.basic_number};
                        $scope.order.workshift_2.driver.id = $scope.row.workshift_2.driver.id;
                        $scope.order.workshift_2.driver.data.name = $scope.row.workshift_2.driver.name;
                        $scope.order.workshift_2.driver.data.bn = $scope.row.workshift_2.driver.basic_number;

                        $scope.selectedVItem2 = {'id': $scope.row.workshift_2.vehicle.id, 'state_number': $scope.row.workshift_2.vehicle.state_number, 'board_number':$scope.row.workshift_2.vehicle.board_number};

                        $scope.order.workshift_2.vehicle.id = $scope.row.workshift_2.vehicle.id;
                        $scope.order.workshift_2.vehicle.data.bn = $scope.row.workshift_2.vehicle.board_number;
                        $scope.order.workshift_2.vehicle.data.sn = $scope.row.workshift_2.vehicle.state_number;
                        $scope.order.workshift_2.vehicle.data.model = $scope.row.workshift_2.vehicle.name;

                        if($scope.row.workshift_2.conductor) {
                            $scope.selectedCItem2 = {'id': $scope.row.workshift_2.conductor.id, 'name': $scope.row.workshift_2.conductor.name, 'basic_number': $scope.row.workshift_2.conductor.basic_number};
                            $scope.order.workshift_2.conductor.id = $scope.row.workshift_2.conductor.id;
                            $scope.order.workshift_2.conductor.data.name = $scope.row.workshift_2.conductor.name;
                            $scope.order.workshift_2.conductor.data.bn = $scope.row.workshift_2.conductor.basic_number;
                        }
                    }
                }

                // if($scope.order.workshift_1.time.dinner[1].duration == 0) {
                //     $scope.order.workshift_1.time.dinner[1] = {
                //         from:'--:--:--',
                //         duration:'-',
                //         place:undefined
                //     }
                // }
                // if($scope.order.workshift_1.time.dinner[2].duration == 0) {
                //     $scope.order.workshift_1.time.dinner[2] = {
                //         from:'--:--:--',
                //         duration:'-',
                //         place:undefined
                //     }
                // }
                // if($scope.order.workshift_2) {
                //     if($scope.order.workshift_2.time.dinner[1].duration == 0) {
                //         $scope.order.workshift_2.time.dinner[1] = {
                //             from:'--:--:--',
                //             duration:'-',
                //             place:undefined
                //         }
                //     }
                //     if($scope.order.workshift_2.time.dinner[2].duration == 0) {
                //         $scope.order.workshift_2.time.dinner[2] = {
                //             from:'--:--:--',
                //             duration:'-',
                //             place:undefined
                //         }
                //     }
                // }

            }, function (error) {console.log(error);});
        };
        $scope.loadGraphData();

        $scope.setOrderDate = function() {
            if($scope.order) {
                $scope.order.setDate($scope.data.OrderDate);
            } else {
                $scope.data.OrderDate = new Date();
            }
        };

        $scope.saveOrder = function() {
            $scope.order.setUser($scope.userData);


            console.log('newOrder',$scope.order);

            if($scope.row.order_data != 0) {
                OrdersRestService.deleteSave($scope.row.order_data.route, $scope.row.order_data.graph, $scope.row.order_data.action_date, $scope.order);
            } else {
                try {
                    OrdersRestService.save($scope.order);
                } catch (e) {
                    console.log('error', e);
                }
            }

            $mdDialog.hide();

        };

        $scope.simulateQuery = false;
        $scope.isDisabled    = false;

        $scope.queryDriverSearch = function(query) {
            // console.log('queryyy', query);
            var search_string = query ? query : '';
            var resource = WorkersRestService.getResource();
            var deferred = $q.defer();
            resource.query({'type': 'driver', 'parks_id': $scope.userData.pid, 's': search_string}, function(data, response) {
                deferred.resolve(data);
                // console.log('ssaass',data);
            }, function(error) {console.log(error)});

            return deferred.promise;
        };
        $scope.queryVehicleSearch = function(query) {
            var search_string = query ? query : '';
            var resource = VehiclesRestService.getResource();
            var deferred = $q.defer();
            resource.query({'type': $scope.row.vehicle_types_id, 'parks_id': $scope.userData.pid, 's': search_string}, function(data, response) {
                deferred.resolve(data);
            }, function(error) {console.log(error)});

            return deferred.promise;
        };
        $scope.queryConductorSearch = function(query) {
            var search_string = query ? query : '';
            var resource = WorkersRestService.getResource();
            var deferred = $q.defer();
            resource.query({'type': 'conductor', 'parks_id': $scope.userData.pid, 's': search_string}, function(data, response) {
                deferred.resolve(data);
            }, function(error) {console.log(error)});

            return deferred.promise;
        };

        $scope.selectedVehicleChange = function(item, number) {
            $('.veh-auto.va'+number).removeClass('red-state');
            $('.veh'+number+'-error').remove();
            $('.veh'+number+'-info').remove();
            if(!$('.red-state')) {
                $scope.inputError = 0;
            }
            if(!item){
                $('.veh-auto').removeClass('yellow-light');
                $scope.order['workshift_'+number].vehicle.id = undefined;
                $scope.order['workshift_'+number].vehicle.data.bn = undefined;
                $scope.order['workshift_'+number].vehicle.data.sn = undefined;
                $scope.order['workshift_'+number].vehicle.data.model = undefined;
                return;
            }

            $scope.order['workshift_'+number].vehicle.id = item.id;
            $scope.order['workshift_'+number].vehicle.data.bn = item.board_number;
            $scope.order['workshift_'+number].vehicle.data.sn = item.state_number;
            $scope.order['workshift_'+number].vehicle.data.model = item.name;

            if($scope.order.workshift_2) {
                if($scope.order.workshift_1.vehicle.id == $scope.order.workshift_2.vehicle.id) {
                    $('.veh-auto').addClass('yellow-light');
                } else {
                    $('.veh-auto').removeClass('yellow-light');
                }
            }


            var resource = VehiclesStatesRestService.getResource();
            var date = $filter('date')($scope.data.OrderDate, 'yyyy-MM-dd');
            resource.query({date:date, pid:$scope.userData.pid, vid:item.id}, function(data, response) {
                if(data[0]) {
                    var pm = data[0].to.split('-');
                    $scope.msg_veh = 'В ремонті до ' + pm[2] + '-' + pm[1] + '-' + pm[0];
                    $scope.inputError = 1;
                    $('.veh-auto.va'+number).addClass('red-state');
                    ngDialog.open({ template: '<p>'+$scope.msg_veh+'</p>',
                        plain: true, className: 'ngdialog-theme-default' });
                    // $('.veh-auto.va'+number).after('<div class="veh'+number+'-error"><p>'+$scope.msg_veh+'</p></div>');
                } else {
                    $scope.GlobalCheckVehicle(item.id, $scope.order.date, $scope.order.route, $scope.order.graph, number);
                }
            }, function(error) {console.log(error);});
            // var ifs = 0;
            // for(var i = 0; i < $scope.data.workshifts.vehicle.length; i++) {
            //     if($scope.data.workshifts.vehicle[i].id == item.id) {
            //         ifs = 1;
            //         $('.veh-auto').addClass('yellow-light');
            //     }
            // }
            // if(ifs == 0) {
            //     $('.veh-auto').removeClass('yellow-light');
            // }
            // if(vcheck.hasOwnProperty(item.id)) {
            //     $('.veh-auto.va'+(count+1)).addClass('red-state');
            // } else {
            //     $('.veh-auto.va'+(count+1)).removeClass('red-state');
            // }
            // $scope.data.workshifts.vehicle[count] = item;
        };
        $scope.selectedDriverChange = function(item, number) {
            $('.drv'+number+'-error').remove();
            $('.drv'+number+'-info').remove();
            $('.drv-auto.va'+number).removeClass('red-state');
            $('.all-time-info').remove();
            if(!$('.red-state')) {
                $scope.inputError = 0;
            }

            if(!item){
                $('.drv-auto').removeClass('yellow-light');
                $scope.order['workshift_' + number].driver.id = undefined;
                $scope.order['workshift_' + number].driver.data.name = undefined;
                $scope.order['workshift_' + number].driver.data.bn = undefined;
                return;
            }

            $scope.order['workshift_' + number].driver.id = item.id;
            $scope.order['workshift_' + number].driver.data.name = item.name;
            $scope.order['workshift_' + number].driver.data.bn = item.basic_number;

            var res = OrdersRestService.getWorkersTimeResource();
            $scope.times = {};
            res.GetWorkersJobWeekTime({workers_id:item.id}, function(data, response) {
                $scope.times.week = data.time;
                res.GetWorkersJobMonthTime({workers_id:item.id}, function(data, response) {
                    $scope.times.month = data.time;
                    $('.drv-auto.va'+number).after('<div class="drv'+number+'-info"><p>'+$scope.times.week+'/'+$scope.times.month+'</p></div>');
                }, function(error) {console.log(error);});
            }, function(error) {console.log(error);});

            var resource = WorkersStatesRestService.getResource();
            var date = $filter('date')($scope.data.OrderDate, 'yyyy-MM-dd');
            resource.query({date:date, pid:$scope.userData.pid, wid:item.id}, function (data, response) {
                console.log('ded_data',data);
                if(data[0]) {
                    var pm = data[0].to.split('-');
                    $scope.msg = 'відсутній до ' + pm[2] + '-' + pm[1] + '-' + pm[0];
                    $scope.inputError = 1;
                    $('.drv-auto.va'+number).addClass('red-state');
                    ngDialog.open({ template: '<p>'+$scope.msg+'</p>',
                        plain: true, className: 'ngdialog-theme-default' });
                    // $('.drv-auto.va'+number).after('<div class="drv'+number+'-error"><p>'+$scope.msg+'</p></div>');
                } else {
                    $scope.GlobalCheckDriver(item.id, $scope.order.date, $scope.order.route, $scope.order.graph, number);
                }
            }, function (error) {console.log(error);});

            if($scope.order.workshift_2) {
                if($scope.order.workshift_1.driver.id == $scope.order.workshift_2.driver.id) {
                    $('.drv-auto').addClass('yellow-light');
                    var hh = $scope.order.workshift_1.time.work_time.hour + $scope.order.workshift_2.time.work_time.hour;
                    var mm = $scope.order.workshift_1.time.work_time.minutes + $scope.order.workshift_2.time.work_time.minutes;
                    if(mm > 60) {
                        mm = mm - 60;
                        hh = hh + 1;
                    }
                    var inf_blk = '<p class="all-time-info">Робота водія: '+hh+':'+mm+'</p>';
                    $('.right.step-inner-block').append(inf_blk);
                    if($scope.order.workshift_1.change_data.time.work_time) {
                        $scope.inputError = 1;
                        $('.drv-auto.va'+number).addClass('red-state');
                        ngDialog.open({ template: '<p>Перехрестя часу роботи водія</p>',
                            plain: true, className: 'ngdialog-theme-default' });
                    }
                    if($scope.order.workshift_1.time.work_time.hour + $scope.order.workshift_2.time.work_time.hour > 11) {
                        $('.drv-auto.va'+number).addClass('red-state');
                        ngDialog.open({ template: '<p>Більше 12 годин роботи водія</p>',
                            plain: true, className: 'ngdialog-theme-default' });
                    }
                } else {
                    $('.drv-auto').removeClass('yellow-light');
                }

            }
        };
        $scope.GlobalCheckDriver = function(id, d, r, g, w) {
            // $scope.inputError = 0;
            var resource = WorkersRestService.getResource();
            var date = $filter('date')(d, 'yyyy-MM-dd');
            console.log('0000',date);
            resource.get({check:id,date:date,r:r,g:g,w:w}, function(data, response) {
                console.log('checkdata',data);
                if(data.error) {
                    for(var i = 0; i < data.error.length; i++) {
                        $scope.inputError = 1;
                        var dd = angular.extend(data.error[i], false);
                        $('.drv-auto.va'+w).addClass('red-state');
                        ngDialog.open({ template: '<p>Занаряджений на: '+dd.route+'/'+dd.graph+'('+dd.number+')'+'</p>',
                            plain: true, className: 'ngdialog-theme-default' });
                        // $('.drv-auto.va'+w).after('<div class="drv'+w+'-error"><p>Занаряджений на: '+dd.route+'/'+dd.graph+'('+dd.number+')'+'</p></div>');
                    }
                }
                if(data.info) {
                    for(var i = 0; i < data.info.length; i++) {
                        if(data.info[i] == 1) {continue;}

                        $('.drv-auto.va'+w).after('<div class="drv'+w+'-info"><p>Занаряджений на: '+data.info[i].route+'/'+data.info[i].graph+'('+data.info[i].number+')'+'</p></div>');
                        if(w == 1) {
                            $scope.order.workshift_1.change_data.route = data.info[i].route;
                            $scope.order.workshift_1.change_data.graph = data.info[i].graph;
                            $scope.loadSubGraph();
                            // if($scope.order.workshift_1.time.to > $scope.order.workshift_1.change_data.time.from) {
                            //     $scope.inputError = 1;
                            //     $('.drv-auto.va'+w).addClass('red-state');
                            //     $('.drv-auto.va'+w).after('<div class="drv'+w+'-error"><p>Перехрестя часів роботи</p></div>');
                            // }
                        } else {
                            if(data.info[i].time_end > $scope.order.workshift_2.time.from) {
                                $scope.inputError = 1;
                                $('.drv-auto.va'+w).addClass('red-state');
                                ngDialog.open({ template: '<p>Перехрестя часів роботи: '+data.info[i].route+'/'+data.info[i].graph+'('+data.info[i].number+')'+'</p>',
                                    plain: true, className: 'ngdialog-theme-default' });
                                // $('.drv-auto.va'+w).after('<div class="drv'+w+'-error"><p>Перехрестя часів роботи</p></div>');
                            }
                        }

                        // if($scope.order.workshift_2) {
                        //     if(data.info[i].time_end > $scope.order.workshift_2.time.from) {
                        //         $scope.inputError = 1;
                        //         $('.drv-auto.va'+w).addClass('red-state');
                        //         $('.drv-auto.va'+w).after('<div class="drv'+w+'-error"><p>Перехрестя часів роботи</p></div>');
                        //     }
                        // }
                        // if($scope.order.workshift_1.change_data) {
                        //
                        // }

                    }
                }
            }, function(error) {console.log(error);})
        };
        $scope.GlobalCheckVehicle = function(id, d, r, g, w) {
            // $scope.inputError = 0;
            var resource = VehiclesRestService.getResource();
            var date = $filter('date')(d, 'yyyy-MM-dd');
            console.log('0000',date);
            resource.get({check:id,date:date,r:r,g:g,w:w}, function(data, response) {
                console.log('checkdata',data);
                if(data.error) {
                    for(var i = 0; i < data.error.length; i++) {
                        $scope.inputError = 1;
                        var dd = angular.extend(data.error[i], false);
                        $('.veh-auto.va'+w).addClass('red-state');
                        ngDialog.open({ template: '<p>Занаряджений на: '+dd.route+'/'+dd.graph+'('+dd.number+')'+'</p>',
                            plain: true, className: 'ngdialog-theme-default' });
                        // $('.veh-auto.va'+w).after('<div class="veh'+w+'-error"><p>Занаряджений на: '+dd.route+'/'+dd.graph+'('+dd.number+')'+'</p></div>');
                    }
                }
                if(data.info) {
                    for(var i = 0; i < data.info.length; i++) {
                        if(data.info[i] == 1) {continue;}
                        $('.veh-auto.va'+w).after('<div class="veh'+w+'-info"><p>Занаряджений на: '+data.info[i].route+'/'+data.info[i].graph+'('+data.info[i].number+')'+'</p></div>');
                    }
                }
            }, function(error) {console.log(error);})
        };

        $scope.selectedConductorChange = function(item, number) {
            if(!item){return;}

                    $scope.order['workshift_' + number].conductor.id = item.id;
                    $scope.order['workshift_' + number].conductor.data.name = item.name;
                    $scope.order['workshift_' + number].conductor.data.bn = item.basic_number;


            // var ifs = 0;
            // for(var i = 0; i < $scope.data.workshifts.conductor.length; i++) {
            //     if($scope.data.workshifts.conductor[i].id == item.id) {
            //         ifs = 1;
            //         $('.con-auto').addClass('yellow-light');
            //     }
            // }
            // if(ifs == 0) {
            //     $('.con-auto').removeClass('yellow-light');
            // }
            // if(checkData.hasOwnProperty(item.id)) {
            //     $('.con-auto.va'+(count+1)).addClass('red-state');
            // } else {
            //     $('.con-auto.va'+(count+1)).removeClass('red-state');
            // }
            // $scope.data.workshifts.conductor[count] = item;
        };
        app.filter('sliceTimeO', function() {
            return function(input) {
                if(input) {
                    if(input == '00:00:00') {
                        input = input.replace('00', '--');
                        input = input.replace('00', '--');
                    }
                    var data = input.split(':');
                    return data[0]+':'+data[1];

                } else {
                    return '';
                }
            }
        });
        app.filter('ParseNulls', function() {
            return function(input) {
                if(input > '00:00:00') {
                    return input;
                } else {
                    return input.replaceAll('00', '--');
                }
            }
        });
    }])
    .config(function($mdDateLocaleProvider) {
        $mdDateLocaleProvider.formatDate = function(date) {
            return moment(date).format('DD-MM-YYYY');
        };
    });