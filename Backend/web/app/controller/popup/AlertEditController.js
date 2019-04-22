/**
 * Created by walex on 15.12.16.
 */
app.controller('AlertEditController', ['$scope', '$rootScope', '$http', '$mdDialog', 'item', 'MedicalServiceRestService',
    'MessagesRestService', 'LanguageService', 'UserRestService', 'AuthService',
    function ($scope, $rootScope, $http, $mdDialog, item, MedicalServiceRestService, MessagesRestService, LanguageService,
              UserRestService, AuthService) {

        // $scope.item = {};
        $scope.date = Math.round((new Date()).getTime() / 1000);
        $scope.user = AuthService.getUserName();
        $scope.item = item;

        $scope.hide = function () {
            $mdDialog.hide();
        };

        $scope.cancel = function () {
            $mdDialog.cancel();
        };

        $scope.answer = function (answer) {
            $mdDialog.hide(answer);
        };

    }
]);
