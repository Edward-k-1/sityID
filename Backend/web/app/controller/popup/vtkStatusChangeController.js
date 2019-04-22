/**
 * Created by walex on 03.11.16.
 */
app.controller('vtkStatusChangeController', ['$scope', '$rootScope', '$http', '$mdDialog', 'row', 'grid', 'parks_id', 'VehiclesTcdRestService',
    'MessagesRestService', 'LanguageService', 'UserRestService', 'AuthService',
    function ($scope, $rootScope, $http, $mdDialog, row, grid, parks_id, VehiclesTcdRestService, MessagesRestService, LanguageService,
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

        $scope.changeVtkStatus = function() {
            var message = {};
            message.message = $scope.vtkDescription.description;
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

            resource = VehiclesTcdRestService.getResource();
            // resource.query({'vehicle_id': row.vehicle_id}, function (data, response) {
                var item = {
                    'vehicles_id': row.vehicle_id
                };

                item.status = $scope.getVtcStatus();
                item.action_date = Math.round((new Date()).getTime() / 1000);
                item.created_at = item.action_date;
                item.updated_at = item.action_date;
                item.message_id = $scope.messageId;

                resource.save(item, function (data, response) {
                    $mdDialog.hide();
                }, function (error) {
                    console.log(error);
                });
            // }, function (error) {
            //     console.log(error);
            // });
        };

        $scope.getVtcStatus = function() {
          if($scope.selectedVtkOption.id) {
              return $scope.selectedVtkOption.id;
          } else {
              return $scope.selectedVtkOption;
          }
        };

        $scope.initLocal = function () {
            $scope.VtkOptions[0].name = $rootScope.lang.words["Not pass"];
            $scope.VtkOptions[1].name = $rootScope.lang.words["All Clear"];
            $scope.VtkOptions[2].name = $rootScope.lang.words["Malfuncion"];

            $scope.vtkDescription.description = $rootScope.lang.words["Vtk Description default"];

            $scope.lHeader = $rootScope.lang.words["TCD status title"];
            $scope.lSelect = $rootScope.lang.words["VTK Status"];
            $scope.lInput = $rootScope.lang.words["VTK Description"];

            $scope.mRequired = $rootScope.lang.words["This is required."];
            $scope.mCharacters = $rootScope.lang.words["The description must be less than 30 characters long."];

            $scope.bConfirm = $rootScope.lang.words["Confirm"];
            $scope.bCancel = $rootScope.lang.words["Cancel"];
        };

        $scope.lHeader = 'TCD Status change';
        $scope.lSelect = 'Status TCD';
        $scope.lInput = 'Description';

        $scope.mRequired = 'This is required.';
        $scope.mharacters = 'The description must be less than 30 characters long.';

        $scope.bConfirm = 'Confirm';
        $scope.bCancel = 'Cancel';

        $scope.VtkOptions = [
            { id: 1, name: 'Not pass' },
            { id: 2, name: 'All clear' },
            { id: 3, name: 'Malfunction' }
        ];
        $scope.vtkDescription = {
            description: 'Nuclear Missile Defense System',
            rate: 500
        };

        $scope.initLocal();

        switch(row.vtk) {
            case 1:
                var name = $scope.VtkOptions[0].name;
                break;
            case 2:
                var name = $scope.VtkOptions[1].name;
                break;
            case 3:
                var name = $scope.VtkOptions[2].name;
                break;
            case 0:
                var name = $scope.VtkOptions[2].name;
                break;
        }
        $scope.selectedVtkOption = { id: row.vtk, name: name };


    }

    ]);
