app.controller("AddSmartCardsDialogController", ["$scope", '$mdDialog',"CardListenerRestService","$timeout",
  "GlobalStorage","SmartCardRestService","$rootScope",
  function ($scope, $mdDialog,CardListenerRestService,$timeout,GlobalStorage,SmartCardRestService,$rootScope)
  {
    $scope.lang = $rootScope.lang;
    console.log("AddSmartCardsDialogController run");
    $scope.isSmartCardLoaded = false;
    $scope.loadedData = null;
    var isTimerRun = false;
   var isTimerNotBreak = true;
    $scope.cancel = function () {
      $mdDialog.cancel();
    };
    $scope.filters = {};
    $scope.filters.Workers =  GlobalStorage.getStorage("Workers");

   function isEmpty (obj)
   {
      for (var i in obj) if (obj.hasOwnProperty(i)) return false;
      return true;
    };
    function checkCards() {
      if(isTimerNotBreak!==true)
      {return}
      var resource = CardListenerRestService.getResource();

      resource.getExt({service:"CREATE"}, function (data, response) {
        if (!data.hasOwnProperty("card_id"))
        {
          console.log("is empty  ==true");
          $timeout(checkCards, 500);
        }
        else {
          console.log("is empty  ==false",data);
          $scope.loadedData=data;
          $scope.isSmartCardLoaded = true;
          isTimerRun = false;
        }
      }, function (error) {
        $timeout(checkCards, 500);
      });

    }
    isTimerRun = true;
    $timeout(checkCards, 500);
    $scope.removeListenCart = function()
    {
      removeListenCartById($scope.loadedData.id);

    };

    $scope.getWorkerNumberById = function (id) {
      var workers = $scope.filters.Workers;
      for (var i = 0; i < workers.length; i++) {
        if (workers[i].id == id) {
          return workers[i].basic_number;
        }
      }
      return "undefined";
    };


    $scope.getWorkerNameById = function (id) {
      var workers = $scope.filters.Workers;
      for (var i = 0; i < workers.length; i++) {
        if (workers[i].id == id) {
          return workers[i].name;
        }
      }
      return "";
    };
    $scope.getWorkerViewsByIdWorkers = function (id) {
      var workers = $scope.filters.Workers;
      for (var i = 0; i < workers.length; i++) {
        if (workers[i].id == id) {
          return getWorkersViewsByID(workers[i].worker_views_id);
        }
      }
      return "";
    };

    function getWorkersViewsByID(id)
    {
      var workerViews =  GlobalStorage.getStorage("WorkerViews");
      for(var i = 0;i<workerViews.length;i++)
      {
        if(workerViews[i].id == id)
        {
          return workerViews[i].name;
        }
      }
      return "";
    }


    
    $scope.editCurrentCard = function () {

      openEditSmartCardDialog($scope.loadedData.dep.card);

    };

    $scope.saveCurrentCard = function () {
      console.log("saveCurrentCard",$scope.loadedData);
      var obj = {};
      obj.parks_id = parseInt( $scope.loadedData.parks_id);
      obj.status = 0;
      obj.card_key  = $scope.loadedData.card_id;
      var id =  $scope.loadedData.id;
      var resource  = SmartCardRestService.getResource();
      resource.save(obj, function (data, response) {
        console.log("saveCurrentCard", data);
        $scope.isSmartCardLoaded = false;
        $scope.loadedData = null;
        removeListenCartById(id);

      }, function (error) {
        console.log("saveCurrentCard error", error);
      });
    };
    $scope.saveAndEditCurrentCard = function () {
      console.log("saveAndEditCurrentCard",$scope.loadedData);
      var obj = {};
      obj.parks_id = parseInt( $scope.loadedData.parks_id);
      obj.card_key  = $scope.loadedData.card_id;
      obj.status = 0;
      obj.parks_id = $scope.loadedData.parks_id;
      var id =  $scope.loadedData.id;
      var resource  = SmartCardRestService.getResource();
      resource.save(obj, function (data, response) {
        console.log("saveCurrentCard", data);
        $scope.isSmartCardLoaded = false;
        $scope.loadedData = null;
        removeListenCartById(id);
        openEditSmartCardDialog(data);
      }, function (error) {
        console.log("saveCurrentCard error", error);
      });
    };

    function returnToAddSmartcardDialog()
    {
      $mdDialog.show({
        controller: "AddSmartCardsDialogController",
        templateUrl: 'app/templates/grid/smartcards/smartcards_add_dialog.tpl.html',
        parent: angular.element(document.body),
        clickOutsideToClose: false,
        locals: {}
      })
        .then(function () {
        }, function () {
        });

    }

    function openEditSmartCardDialog(row)
    {
      console.log("openEditSmartCardDialog",row);
      $mdDialog.show({
        controller: "EditSmartCardsDialogController",
        templateUrl: 'app/templates/grid/smartcards/smartcards_edit_dialog.tpl.html',
        parent: angular.element(document.body),
        clickOutsideToClose: false,
        locals: {row:row, grid:null}
      })
        .then(function () {
          returnToAddSmartcardDialog();

        }, function () {
          returnToAddSmartcardDialog();
        });

    }
    function removeListenCartById(id)
    {
      var resource = CardListenerRestService.getResource();
      resource.delete({id:id},function () {
        $scope.loadedData = null;
        $scope.isSmartCardLoaded = false;
        isTimerRun==false?$timeout(checkCards, 500):null;

      },function()
      {
        $scope.loadedData = null;
        $scope.isSmartCardLoaded = false;
        isTimerRun==false?$timeout(checkCards, 500):null;
        console.log("delete error");
      })
    }
    $scope.$on("$destroy", function() {
     isTimerNotBreak = false;
    });



  }]);