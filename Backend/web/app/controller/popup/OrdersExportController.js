/**
 * Created by walex on 05.12.16.
 */
app.controller('OrdersExportController', ['$scope', '$http', '$filter', 'data', 'data2', 'OrdersRestService',
    "FullPopupLoader", 'customUnixTimeFilter',
    "$timeout", "$mdDialog","$rootScope","GlobalStorage","uiGridConstants","rowSorter", 'WorkshiftsOrdersRestService',
    function ($scope, $http, $filter, data, data2, OrdersRestService , FullPopupLoader,
              customUnixTimeFilter, $timeout, $mdDialog,$rootScope,GlobalStorage,uiGridConstants,rowSorter,WorkshiftsOrdersRestService) {

        $scope.hide = function() {
            $mdDialog.hide();
        };

        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        $scope.answer = function(answer) {
            $mdDialog.hide(answer);
        };


        $scope.lang = $rootScope.lang;
        $scope.date = $filter('date')(new Date(), 'yyyy-MM-dd');

        $scope.rows = data;
        // $scope.rows = $filter('orderBy')(data, ['name', 'graph'], false);
        $scope.data = {
            's':[],
            'd':[],
            'v':[],
            'vehicles':data2.vehicles
        };

        for(var i = 0; i < data2.workers.length; i++) {
            switch(data2.workers[i].state){
                case '1':
                    $scope.data.s.push(data2.workers[i]);
                    break;
                case '2':
                    $scope.data.d.push(data2.workers[i]);
                    break;
                case '3':
                    $scope.data.v.push(data2.workers[i]);
                    break;
            }
        }

        console.log($scope.data);
        app.filter('sliceWorkshiftTime', function() {
            return function(input) {
                if(input){
                    var data = input.split('-');

                    data[0] = data[0].split(':');
                    data[1] = data[1].split(':');

                    return data[0][0] + ':' + data[0][1] + ' | ' + data[1][0] + ':' + data[1][1];
                } else {
                    return '';
                }

            }
        });
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

        app.filter('scheduleTypeFilter', function() {
            return function(input) {
                switch(input) {
                    case '1':
                        return 'Робочий';
                        break;
                    case '2':
                        return 'Вихідний';
                        break;
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

    }]);
