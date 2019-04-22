/**
 * Created by walex on 13.02.17.
 */
app.controller('CheckOrdersController', ['$scope', '$rootScope', '$http', '$mdDialog', 'VehiclesTcdRestService',
    'MessagesRestService', 'LanguageService', 'UserRestService', 'AuthService', 'date','$filter','OrdersRestService',
    function ($scope, $rootScope, $http, $mdDialog, VehiclesTcdRestService, MessagesRestService, LanguageService,
              UserRestService, AuthService, date,$filter,OrdersRestService) {

        // $scope.item = {};
        //$scope.date = Math.round((new Date()).getTime() / 1000);
        $scope.userData = $rootScope.UserData;
        $scope.mes = 'Зачекайте - іде перевірка';
        $scope.answer_data = 0;
        $scope.hide = function() {
            $mdDialog.hide();
        };

        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        $scope.answer = function(answer) {
            $mdDialog.hide(answer);
        };

        $scope.do_check = function(date) {
            // console.log('dsdsdsd',date);
            var d = $filter('date')(date , 'yyyy-MM-dd');
            console.log('asdasdasdas',d);
            var res = OrdersRestService.getOrdersResource();
            res.get({action:1, date:d}, function(data, response){
                console.log('check',data);

                if(data.length > 1) {
                    $scope.mes = 'Помилка заповнення рознарядки';
                    $scope.answer_data = data;
                }

            }, function(error) {console.log(error);})
        };

        $scope.do_check(date);

        $scope.confirmError = function() {
            $scope.answer($scope.answer_data);
        }

    }

]);
