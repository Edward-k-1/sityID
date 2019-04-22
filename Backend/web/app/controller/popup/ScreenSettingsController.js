/**
 * Created by walex on 13.03.17.
 */
app.controller('ScreenSettingsController', ['$scope', '$rootScope', '$http', '$mdDialog', 'VehiclesTcdRestService',
    'MessagesRestService', 'LanguageService', 'UserRestService', 'AuthService','SettingsRestService','cols',
    function ($scope, $rootScope, $http, $mdDialog, VehiclesTcdRestService, MessagesRestService, LanguageService,
              UserRestService, AuthService,SettingsRestService,cols) {

        // $scope.date = Math.round((new Date()).getTime() / 1000);
        $scope.lang = $rootScope.lang;
        $scope.userData = $rootScope.UserData;
        $scope.settings_data = [];
        $scope.loaded_id = undefined;


        $scope.loadData = function() {
            var res = SettingsRestService.getResource();
            res.get({uid:$scope.userData.id, zone:'screen'}, function(data, response) {
                // data = data.join();
                // console.log('settings_screen',data);
                console.log('111',data);
                $scope.loaded_id = data.id;
                $scope.col_order = data.screen.split('-');
                for(var i = 0; i < $scope.col_order.length; i++) {
                    var item = {
                        'n': $scope.col_order[i],
                        'name': cols[parseInt($scope.col_order[i])].displayName
                    };
                    $scope.settings_data.push(item);
                }
                // $scope.col_order.each(function(n) {
                //     var item = {
                //         'n': n,
                //         'name': $scope.lang.words(cols[n].displayName)
                //     };
                //     $scope.settings_data.push(item);
                // });
                console.log('sdd',$scope.settings_data);
            }, function(error) {console.log(error);});
        };

        $scope.loadData();

        $scope.hide = function() {
            $mdDialog.hide();
        };

        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        $scope.answer = function(answer) {
            $mdDialog.hide(answer);
        };


        $scope.saveSettings = function() {
            var res = SettingsRestService.getResource();
            var els = $('.screen-set-ul li');
            var settings_array = [];
            els.each(function(key, el) {
                settings_array.push(el.getAttribute('id'));
            });

            var item = {
                user_id: $scope.userData.id,
                screen: settings_array.join('-')
            };
            console.log('lid',$scope.loaded_id);
            res.save(item, function(data, response) {
                res.delete({id:$scope.loaded_id});
                $scope.hide();
            }, function(error) {console.log(error);});

        }

    }

]);
