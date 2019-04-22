/**
 * Created by walex on 13.12.16.
 */
app.controller('AlertsGridController', ['$scope', '$rootScope', '$http', '$mdDialog', '$filter', 'ParksRestService', 'LanguageService',
    'AuthService', 'FullPopupLoader', 'AlertsRestService', 'uiGridConstants', 'customUnixTimeOnlyFilter',
    'VehicleModelsRestService', 'RoutesRestService', 'GraphsRestService',"GlobalStorage",
    function ($scope, $rootScope, $http, $mdDialog, $filter, ParksRestService, LanguageService,
              AuthService, FullPopupLoader, AlertsRestService, uiGridConstants, customUnixTimeOnlyFilter,
              VehicleModelsRestService, RoutesRestService, GraphsRestService,GlobalStorage) {

        $('#chekpoints-loading-wraper').fadeIn(500);
        $scope.pid = 0;

        console.log('pid', $scope.pid);
        $scope.lang = $rootScope.lang;
        $scope.models = {
            selected: null,
            templates: [
                {type: "item", id: 2}
            ],
            dropzones: {
                "A": [
                    {
                        "type": "item",
                        "id": "4"
                    },
                    {
                        "type": "item",
                        "id": "5"
                    },
                    {
                        "type": "item",
                        "id": "6"
                    }
                ],
                "B": [
                    {
                        "type": "item",
                        "id": 7
                    },
                    {
                        "type": "item",
                        "id": "8"
                    },

                    {
                        "type": "item",
                        "id": 16
                    }
                ],
                "C": []
            }
        };

        $scope.$watch('models.dropzones', function(model) {
            $scope.modelAsJson = angular.toJson(model, true);
        }, true);

        $scope.loadData = function() {
            // if(!obj) {
            //     var obj = {};
            // }
            // if(!pid) {
            //     var pid = 0;
            // }
            var resource = AlertsRestService.getResource();
            resource.query({'parks_id': $scope.pid}, function(data, responce) {
                console.log(data);
                var d = [];
                var h = [];
                for(var i = 0; i < data.length; i++) {
                    data[i].type = 'item';
                    if(data[i].display == 0) {
                        h.push(data[i]);
                    } else {
                        d.push(data[i]);
                    }
                }

                $scope.models.dropzones = {
                    "A": d,
                    "B": h,
                    "C":[]
                }
                $('#chekpoints-loading-wraper').fadeOut(500);
            }, function(error) {});
            // console.log(pid);
        }

        $scope.saveAlerts = function() {
            console.log('dd', $scope.models.dropzones);
            var resource = AlertsRestService.getResource();
            for(var i = 0; i < $scope.models.dropzones.A.length; i++) {
                var item = $scope.models.dropzones.A[i];
                item.display = 1;
                item.order = i;
                if(item.id) {
                    resource.delete({"id":item.id});
                }
                resource.save(item, function(data, response) {
                    console.log(data);
                }, function(error) {console.log(error);});
            }
            for(var i = 0; i < $scope.models.dropzones.B.length; i++) {
                var item = $scope.models.dropzones.B[i];
                item.display = 0;
                item.order = i;
                if(item.id) {
                    resource.delete({"id":item.id});
                }
                resource.save(item, function(data, response) {
                    console.log(data);
                }, function(error) {console.log(error);});
            }
            for(var i = 0; i < $scope.models.dropzones.C.length; i++) {
                var item = $scope.models.dropzones.C[i];
                if(item.id) {
                    resource.delete({"id":item.id});
                }
            }
            $scope.loadData();
        }

        $scope.newAlert = function() {
            console.log('new alert');
            var newItem = {
                'type': 'item',
                'parks_id': $scope.pid,
                'title': 'Назва',
                'body': 'Повідомлення',
                'display': 0,
            };
            $scope.models.dropzones.B.push(newItem);
        }

        $scope.editAlert = function(item) {
            console.log('to edit',item);
            $mdDialog.show({
                controller: 'AlertEditController',
                templateUrl: 'app/templates/popup/alertEditWindow.tpl.html',
                parent: angular.element(document.body),
                clickOutsideToClose:true,
                locals: {item: item}
            })
                .then(function() {
                    console.log('edited');
                    // var resource = CheckpointMCRestService.getResource();
                    // $scope.gridOptions.reloadCurrentData();
                }, function() {
                    console.log('canxeled');
                    //$scope.gridOptions.reloadCurrentData();
                    // $scope.gridOptions.reloadCurrentData();
                });
        }
        $scope.pid = $scope._alertPark.park_id;
        $scope.loadData();
        $scope.$on('PageAlertsContentChanged',function (event,data) {
            $('#chekpoints-loading-wraper').fadeIn(500);
            // $('#chekpoints-loading-wraper').fadeIn(500);
            $scope.pid = $scope._alertPark.park_id;
            $scope.pid = data;
            $scope.loadData();

        });
    }]);