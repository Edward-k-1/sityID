/**
 * Created by walex on 03.12.16.
 */
app.controller('ScreenController', ['$scope','$rootScope', "ParksRestService","GlobalStorage", function ($scope,$rootScope,ParksRestService,GlobalStorage) {
    $scope.userData = $rootScope.UserData;
    $scope.screen = [{name: "Screen"}];

    if($scope.userData.pid !== 0) {
        var res = ParksRestService.getResource();
        res.query({'id': $scope.userData.pid}, function(data, response) {
            $scope.screen[0] = data[0];
        }, function(error) {console.log(error);});
    } else {
        if($scope.lang.words !==undefined){
            $scope.screen[0].name=$scope.lang.words['Parks'];
        }
        $scope.screen[0].children = GlobalStorage.getStorage("Parks");
    }


    // var checkpoints = [];
    // for(var i = 0; i < parks.length; i++) {
    //     var check = angular.extend({expanded:false},parks[i]);
    //     check.children = [
    //         {name: "Прохідна", type: "PG", id: check.id},
    //         {name: "Диспетчер", type: "MP", id: check.id},
    //         {name: "Медична служба", type: "MC", id: check.id},
    //         {name: "ВТК", type: "TCD", id: check.id},
    //         {name: "АЗС", type: "ASS", id: check.id}
    //     ];
    //     checkpoints.push(check);
    // }
    // $scope.checkpoints  =  checkpoints;
    $scope.$on('LanguageChanged',function (event,data) {
        // $scope.checkpoints[0].name=$scope.lang.words['Parks'];
    });
    // $rootScope.type = '0';
    $scope.$on('selection-changed', function (e, node) {
        // console.log(node.id);
        // $rootScope.type = node.id;
        $rootScope.$broadcast("PageContentChanged",'screen');
        $rootScope.$broadcast("PageScreenContentChanged",node);
    });

}]);