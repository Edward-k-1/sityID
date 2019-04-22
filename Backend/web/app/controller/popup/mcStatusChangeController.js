/**
 * Created by walex on 07.11.16.
 */
app.controller('mcStatusChangeController', ['$scope', '$rootScope', '$http', '$mdDialog', 'row', 'grid', 'parks_id', 'MedicalServiceRestService',
    'MessagesRestService', 'LanguageService', 'UserRestService', 'AuthService',
    function ($scope, $rootScope, $http, $mdDialog, row, grid, parks_id, MedicalServiceRestService, MessagesRestService, LanguageService,
              UserRestService, AuthService) {

        // $scope.item = {};
        $scope.date = Math.round((new Date()).getTime() / 1000);
        $scope.user = AuthService.getUserName();

        $scope.hide = function() {
            $mdDialog.hide();
        };

        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        $scope.answer = function(answer) {
            $mdDialog.hide(answer);
        };

        $scope.changeMcStatus = function() {
            var message = {};
            message.message = $scope.mcDescription.description;
            message.created_at = $scope.date;
            message.updated_at = $scope.date;
            var resource = UserRestService.getResource();
            resource.query({'name': $scope.user}, function (data, response) {
                message.author_id = data[0].id;
                message.updater_id = data[0].id;
            }, function(error) {
                console.log(error);
            });

            resource = MessagesRestService.getResource();
            resource.save(message, function (data, response) {
                $scope.messageId = data.id;
            }, function(error) {

            });

            resource = MedicalServiceRestService.getResource();
            // resource.query({'driver': row.driver_id}, function (data, response) {
                var item = {
                    'drivers_id': row.driver_id
                };

                item.status = $scope.getMcStatus();
                item.action_date = Math.round((new Date()).getTime() / 1000);
                item.created_at = item.action_date;
                item.updated_at = item.action_date;
                // item.message_id = $scope.messageId;

                resource.save(item, function (data, response) {
                    $mdDialog.hide();
                }, function (error) {
                    console.log(error);
                });
            // }, function (error) {
            //     console.log(error);
            // });
        };

        $scope.getMcStatus = function() {
            if($scope.selectedMcOption.id) {
                return $scope.selectedMcOption.id;
            } else {
                return $scope.selectedMcOption;
            }
        };

        $scope.initLocal = function () {
            $scope.mcOptions[0].name = $rootScope.lang.words["Not pass"];
            $scope.mcOptions[1].name = $rootScope.lang.words["All Clear"];
            $scope.mcOptions[2].name = $rootScope.lang.words["Not ready"];

            $scope.mcDescription.description = $rootScope.lang.words["MC Description default"];

            $scope.lHeader = $rootScope.lang.words["MC status title"];
            $scope.lSelect = $rootScope.lang.words["MC Status"];
            $scope.lInput = $rootScope.lang.words["MC Description"];

            $scope.mRequired = $rootScope.lang.words["This is required."];
            $scope.mCharacters = $rootScope.lang.words["The description must be less than 30 characters long."];

            $scope.bConfirm = $rootScope.lang.words["Confirm"];
            $scope.bCancel = $rootScope.lang.words["Cancel"];
        };

        $scope.lHeader = 'MC Status change';
        $scope.lSelect = 'Status MC';
        $scope.lInput = 'Description';

        $scope.mRequired = 'This is required.';
        $scope.mharacters = 'The description must be less than 30 characters long.';

        $scope.bConfirm = 'Confirm';
        $scope.bCancel = 'Cancel';

        $scope.mcOptions = [
            { id: 1, name: 'Not pass' },
            { id: 2, name: 'All clear' },
            { id: 3, name: 'Not Ready' }
        ];
        $scope.mcDescription = {
            description: 'Nuclear Missile Defense System',
            rate: 500
        };

        $scope.initLocal();

        switch(row.medical_service) {
            case 1:
                var name = $scope.mcOptions[0].name;
                break;
            case 2:
                var name = $scope.mcOptions[1].name;
                break;
            case 3:
                var name = $scope.mcOptions[2].name;
                break;
            case 0:
                var name = $scope.mcOptions[2].name;
                break;
        }
        $scope.selectedMcOption = { id: row.medical_service, name: name };


    }

]);
