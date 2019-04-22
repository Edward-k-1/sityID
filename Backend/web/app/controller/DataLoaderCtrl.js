app.controller('DataLoaderCtrl', ['$scope','$http',"$rootScope","FullPopupLoader",
  "CarrierRestService","ParksRestService","GraphsRestService",
  "RoutesRestService","UserRestService","VehicleModelsRestService",
  "VehicleModelsViewsRestService","VehiclesRestService","VehicleTypesRestService",
  "WorkersRestService","WorkerViewsRestService","GlobalStorage","AuthService",

  function ($scope,$http,$rootScope,FullPopupLoader ,
   CarrierRestService  , ParksRestService , GraphsRestService ,
   RoutesRestService , UserRestService , VehicleModelsRestService ,
   VehicleModelsViewsRestService , VehiclesRestService , VehicleTypesRestService ,
   WorkersRestService , WorkerViewsRestService , GlobalStorage,AuthService ) {

    var count = 12;
  //  var user_parks_limit =  $rootScope.UserData.pid;
    if ($rootScope.UserData==undefined||$rootScope.UserData.pid == undefined)
    {
      user_parks_limit =  AuthService.getUserPark();
    }

   /// FullPopupLoader.showPopup();
    var resource = VehicleTypesRestService.getResource();
    resource.query({"get-all": true}, function (data, response) {
      GlobalStorage.setStorage("VehicleTypes", data);
      count--;
      checkStartDownload();
    }, function (error) {
    });

    var resource = ParksRestService.getResource();
    resource.query({'get-all': true}, function (data, response) {
      GlobalStorage.setStorage("Parks", data);
      count--;
      checkStartDownload();
    }, function (error) {
    });

    var resource = UserRestService.getResource();
    resource.query({}, function (data, response) {
      GlobalStorage.setStorage("Users", data);
      count--;
      checkStartDownload();
    }, function (error) {

    });




      var resource = WorkerViewsRestService.getResource();
      resource.query({'get-all': true}, function (data, response) {
        GlobalStorage.setStorage("WorkerViews", data);
        count--;
        checkStartDownload();
      }, function (error) {
      });



      var resource = WorkersRestService.getResource();
      // obj["worker-view"] = $scope.workers.view;
    var params_workers  = {'get-all': true};
    console.log("Fuuuuuu" , user_parks_limit);
    if (user_parks_limit>0)
    {
      params_workers.parks_id = user_parks_limit;
    }
      resource.query(params_workers, function (data, response) {
        GlobalStorage.setStorage("Workers", data);
        count--;
        checkStartDownload();
      }, function (error) {

      });


    var resource = CarrierRestService.getResource();
    resource.query({'get-all': true}, function (data, response) {
      GlobalStorage.setStorage("Carriers", data);
      count--;
      checkStartDownload();
    }, function (error) {
    });


    var resource = VehiclesRestService.getResource();
    var params_vehicles  = {'get-all': true};
    if (user_parks_limit>0)
    {
      params_vehicles.parks_id = user_parks_limit;
    }
    resource.query(params_vehicles, function (data, response) {
      GlobalStorage.setStorage("Vehicles", data);
      count--;
      checkStartDownload();
    }, function (error) {
    });

    var resource = VehicleModelsRestService.getResource();
    resource.query({'get-all': true}, function (data, response) {
      GlobalStorage.setStorage("VehicleModels", data);
      count--;
      checkStartDownload();
    }, function (error) {
    });


    var resource = VehicleTypesRestService.getResource();
    resource.query({'get-all': true}, function (data, response) {
      GlobalStorage.setStorage("VehicleTypes", data);
      count--;
      checkStartDownload();
    }, function (error) {
    });

    var resource = VehicleModelsViewsRestService.getResource();
    resource.query({'get-all': true}, function (data, response) {
      GlobalStorage.setStorage("VehicleModelsViews", data);
      count--;
      checkStartDownload();
    }, function (error) {
    });


    var resource = RoutesRestService.getResource();
    resource.query({'get-all': true}, function (data, response) {
      GlobalStorage.setStorage("Routes", data);
      count--;
      checkStartDownload();
    }, function (error) {
    });

    var resource = GraphsRestService.getResource();
    resource.query({'get-all': true}, function (data, response) {
      GlobalStorage.setStorage("Graphs", data);
      count--;
      checkStartDownload();
    }, function (error) {
    });

    function checkStartDownload() {
      if (count == 0)
      {
       // FullPopupLoader.hidePopup();
        $rootScope.loading.isDataLoaded = true;
      }
    };


  }
]);