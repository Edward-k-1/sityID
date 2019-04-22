app.controller('MonitoringController', ['$scope','$rootScope', "ParksRestService","GlobalStorage", function ($scope,$rootScope,ParksRestService,GlobalStorage) {
  $scope.userData = $rootScope.UserData;

  $scope.monitoring = [{name: "Monitoring"}];

  if($scope.userData.pid !== 0) {
    var res = ParksRestService.getResource();
    res.query({'id': $scope.userData.pid}, function(data, response) {
      $scope.monitoring[0] = data[0];
    }, function(error) {console.log(error);});
  } else {
    if($scope.lang.words !==undefined){
      $scope.monitoring[0].name = $scope.lang.words['Parks'];
    }
    $scope.monitoring[0].children = GlobalStorage.getStorage("Parks");
  }

  $scope.$on('LanguageChanged',function (event,data) {
    // $scope.monitoring[0].name = $scope.lang.words['Parks'];
  });

  $scope.$on('selection-changed', function (e, node) {
    $rootScope.$broadcast("PageContentChanged",'monitoring');
    $rootScope.$broadcast("PageMonitoringContentChanged",node.id);
  });

}]);