/**
 * Created by walex on 14.11.16.
 */
app.controller('CheckpointsController', ['$scope','$rootScope', "ParksRestService","GlobalStorage", function ($scope,$rootScope,ParksRestService,GlobalStorage) {
    $scope.userData = $rootScope.UserData;

    $scope.checkpoints = [{name: "Checkpoints"}];

    if($scope.userData.pid !== 0) {
        var res = ParksRestService.getResource();
        res.query({'id': $scope.userData.pid}, function(data, response) {
            console.log('dataaa',data[0]);
            $scope.checkpoints[0] = data[0];
            $scope.checkpoints[0].children = [
                {name: "Прохідна", type: "PG", id: $scope.userData.pid},
                // {name: "Диспетчер", type: "MS", id: $scope.userData.pid},
                {name: "Медична служба", type: "MC", id: $scope.userData.pid},
                {name: "ВТК", type: "TCD", id: $scope.userData.pid},
                {name: "АЗС", type: "ASS", id: $scope.userData.pid}
            ];
        }, function(error) {console.log(error);});
    } else {
        var parks = GlobalStorage.getStorage("Parks");
        var checkpoints = [];
        for(var i = 0; i < parks.length; i++) {
            var check = angular.extend({expanded:false},parks[i]);
            check.children = [
                {name: "Прохідна", type: "PG", id: check.id},
                // {name: "Диспетчер", type: "MS", id: check.id},
                {name: "Медична служба", type: "MC", id: check.id},
                {name: "ВТК", type: "TCD", id: check.id},
                {name: "АЗС", type: "ASS", id: check.id}
            ];
            checkpoints.push(check);
        }
        $scope.checkpoints  =  checkpoints;
    }

    if($scope.lang.words !==undefined){
        // $scope.checkpoints[0].name=$scope.lang.words['Parks'];
    }





    $scope.$on('LanguageChanged',function (event,data) {
        // $scope.checkpoints[0].name=$scope.lang.words['Parks'];
    });
    // $rootScope.type = '0';
    $scope.$on('selection-changed', function (e, node) {
        // console.log(node.id);
        // $rootScope.type = node.id;
        $rootScope.$broadcast("PageContentChanged",'checkpoints');
        $rootScope.$broadcast("PageCheckpointsContentChanged",node);
    });

}]);