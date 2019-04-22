app.controller('PageContentController', ['$scope', '$rootScope', '$http', 'LanguageService', 'AuthService',
  function ($scope, $rootScope, $http, LanguageService, AuthService) {
  $scope.userData = $rootScope.UserData;
  $scope.contentname = $scope.userData.options.index;
  $scope.workers = {};
  $scope.vehicles = {};
  $scope.orders = {parks_id:-1
  };
    $scope.$on('PageContentChanged',function (event,data) {
      $scope.contentname = data;
    });
    $scope.$on('PageWorkerContentChanged',function (event,data) {
      $scope.workers.parks_id = data.id;

      if (data.hasOwnProperty('type'))
      {
        $scope.workers.type = data.type;
      }
      else{
        if (data.hasOwnProperty("parentId")&&data.parentId == "Workers")
        {
          $scope.workers.type = "workers";
        }
      }
    });
    $scope.$on('PageVehiclesContentChanged',function (event,data) {
      $scope.vehicles.id = data.id;
      $scope.vehicles.type = data.hasOwnProperty("type")?data.type:data.parentId;
    });
    $scope.$on('PageOrdersContentChanged',function (event,data) {
      $scope.orders.parks_id = data;
    });
    $scope.$on("PageCheckpointsContentChanged",function (event,data) {
      $scope._checkpointData = data;
    });
    $scope.$on("PageAlertsContentChanged",function (event,data) {
      $scope._alertPark = {};
      $scope._alertPark.park_id = data.id;
    });
    $scope.$on("PageScreenContentChanged",function (event,data) {
      $scope._screenPark = {};
      $scope._screenPark.park_id = data.id;
    });
    $scope.$on("PageDictionaryContentChanged",function (event,data) {
      $scope.dictionary = data;
    });
    $scope.$on("PageTPIContentChanged",function (event,data) {
      $scope._tpi = data;
    });





  }]);
