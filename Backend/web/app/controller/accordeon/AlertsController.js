/**
 * Created by walex on 12.12.16.
 */
app.controller('AlertsController', ['$scope','$rootScope', "ParksRestService","GlobalStorage", function ($scope,$rootScope,ParksRestService,GlobalStorage) {
    $scope.userData = $rootScope.UserData;

    $scope.alerts = [{name: "Alerts"}];

    if($scope.userData.pid !== 0) {
        var res = ParksRestService.getResource();
        res.query({'id': $scope.userData.pid}, function(data, response) {
            $scope.alerts[0] = data[0];
        }, function(error) {console.log(error);});
    } else {
        if($scope.lang.words !==undefined){
            $scope.alerts[0].name=$scope.lang.words['Parks'];
        }
        $scope.alerts[0].children = GlobalStorage.getStorage("Parks");
        $scope.$on('LanguageChanged',function (event,data) {
            $scope.alerts[0].name=$scope.lang.words['Parks'];
        });
    }
    $scope.$on('selection-changed', function (e, node) {
        $rootScope.$broadcast("PageContentChanged",'alerts');
        $rootScope.$broadcast("PageAlertsContentChanged",node.id);
    });

}]);