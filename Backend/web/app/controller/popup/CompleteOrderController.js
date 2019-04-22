/**
 * Created by walex on 03.01.17.
 */
app.controller('CompleteOrderController', ['$scope', '$http', '$filter', '$q', 'RoutesRestService', 'GraphsRestService',
    "FullPopupLoader", 'customUnixTimeFilter', 'orderData', 'AuthService', 'UserRestService', "$mdDialog","$rootScope",
    'SchedulesRestService', 'WorkshiftsRestService',
    function ($scope, $http, $filter, $q, RoutesRestService, GraphsRestService, FullPopupLoader,
              customUnixTimeFilter, orderData, AuthService, UserRestService, $mdDialog,$rootScope,SchedulesRestService,WorkshiftsRestService) {

        $scope.lang = $rootScope.lang;

        $scope.date = Math.round((new Date()).getTime() / 1000);
        $scope.userData = $rootScope.UserData;

        $scope.orderData = orderData;

        $scope.conc = {
            enter_data: {
                workshift1: {
                    driver: {
                        id: orderData.order.dw[0].drivers_id,
                        name: orderData.order.dw[0].name
                    },
                    vehicle: {
                        id: orderData.order.vw[0].vehicles_id,
                        bn: orderData.order.vw[0].bord_number,
                        sn: orderData.order.vw[0].state_number
                    },
                    conductor: {
                        id: orderData.order.cw[0].conductors_id,
                        name: orderData.order.cw[0].name
                    },
                    time: {
                        start: orderData.order.dw[0].time_from,
                        end: orderData.order.dw[0].time_to
                    }
                },
                workshift2: {
                    driver: {
                        id: orderData.order.dw[1].drivers_id,
                        name: orderData.order.dw[1].name
                    },
                    vehicle: {
                        id: orderData.order.vw[1].vehicles_id,
                        bn: orderData.order.vw[1].bord_number,
                        sn: orderData.order.vw[1].state_number
                    },
                    conductor: {
                        id: orderData.order.cw[1].conductors_id,
                        name: orderData.order.cw[1].name
                    },
                    time: {
                        start: orderData.order.dw[1].time_from,
                        end: orderData.order.dw[1].time_to
                    }
                }
            },
            order_id: $scope.orderData.order.id,
            flights: 1,
            pressed: 0
        };

        $scope.loadData = function() {

        };

        $scope.hide = function () {
            $mdDialog.hide();
        };

        $scope.cancel = function () {
            $mdDialog.cancel();
        };

        $scope.answer = function (answer) {
            $mdDialog.hide(answer);
        };


        $scope.performCounting = function() {

        };

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
    }
]);