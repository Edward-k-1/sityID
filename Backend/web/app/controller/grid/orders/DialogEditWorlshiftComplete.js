app.controller("DialogEditWorkshiftComplete", ["$scope", '$mdDialog',"CardListenerRestService","$timeout",
  "GlobalStorage","WorkshiftCompleteRestService","$rootScope","row",
  function ($scope, $mdDialog,CardListenerRestService,$timeout,GlobalStorage,WorkshiftCompleteRestService,$rootScope,row)
  {
    $scope.cancel = function () {
      $mdDialog.cancel();
    };
    $scope.data= [];
console.log("DialogEditWorkshiftComplete");
    var resource = WorkshiftCompleteRestService.getResource();
    resource.getExt({workshift_orders_id:row.workshift_orders_id}, function (data, response) {
      console.log("DialogEditWorkshiftComplete query",data);
      $scope.data = data;
    }, function (error) {

    });


    $scope.generateCompleteWorkshift = function ()
    {
      console.log("generateCompleteWorkshift   6666",row);
      var resource = WorkshiftCompleteRestService.getResource();
      resource.generateCompeteWorkshift({workshifts_orders_id:row.workshifts_orders_id,

        drivers_workshift_id:row.drivers_workshift_id,number_workshift:row.number_workshift}, function (data, response) {
        console.log("generateCompleteWorkshift query",data);
        $scope.data = data;
      }, function (error) {

      });



    }


  }]);