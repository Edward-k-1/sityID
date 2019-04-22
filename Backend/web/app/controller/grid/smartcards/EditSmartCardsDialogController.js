app.controller("EditSmartCardsDialogController", ["$scope", '$mdDialog', 'row',
  'grid', 'GlobalStorage', "$rootScope", 'Upload', "$timeout", 'AuthService', "$http",
  "SmartCardRestService",
  function ($scope, $mdDialog, row, grid, GlobalStorage, $rootScope, Upload, $timeout
    , AuthService, $http, SmartCardRestService) {
    $scope.lang = $rootScope.lang;
    $scope.workers = GlobalStorage.getStorage("Workers");
    $scope.workers_filter = [];
    for (var i =0 ;i<$scope.workers.length;i++)
    {
      if(parseInt($scope.workers[i].parks_id)==parseInt(row.parks_id)) {
        $scope.workers_filter.push($scope.workers[i]);
      }
    }
    $scope.workerViews = GlobalStorage.getStorage("WorkerViews");
    $scope.selected = 1;
    $scope.field = "name";
    $scope.workerPhoto = "";
    $scope.hasPhoto;
    $scope.row_original = row;
    $scope.row = angular.extend({}, row);
    $scope.imageChanging = false;
    $scope.hasVisibleBackgroung = true;
    var photoPath = "image/worker_photo/";
    defineCurrentPicture();
    function defineCurrentPicture() {
      if (row.workers_id !== null) {
        $scope.hasSavedWorker = true;
        $http.head(photoPath+"/photo_" + row.workers_id + ".png").success(function (data, status, headers) {
          $scope.hasPhoto = true;
          $scope.workerPhoto = photoPath+"/photo_" + row.workers_id + ".png?" + Math.random() * (10000000000 - 1) + 1;
          }).error(function (data, status, headers) {
          $scope.hasPhoto = false;
          $scope.workerPhoto = photoPath+"/no_photo.png";
        });
      }
      else {
        $scope.hasSavedWorker = false;
        $scope.hasPhoto = false;
        $scope.workerPhoto = photoPath+"/no_photo.png";
      }
    }

    /**
     * Delete workers_id from smart-cards
     */
    $scope.deleteWorkerFromSmartCart = function () {
      var resource = SmartCardRestService.getResource();
      $scope.row = angular.extend({}, row);
      $scope.row.workers_id = null;
      resource.update({id: row.id}, $scope.row, function (data, response) {
        row = data;
        $scope.row = angular.extend({}, row);
        $scope.row_original = row;
        defineCurrentPicture();
      }, function (error) {
        $scope.init();
      });
    };
    /**
     * Save change of smart-cards;
     */
    $scope.saveWorkerForSmartCart = function () {
      var resource = SmartCardRestService.getResource();
      resource.update({id: $scope.row.id}, $scope.row, function (data, response) {
        row = data;
        $scope.row_original = row;
        defineCurrentPicture();
        $scope.row = angular.extend({}, row);
      }, function (error) {
      });
    };
    /**
     * Displaying block for edit image
     */
    $scope.changePhoto = function () {
      $scope.imageChanging = true;
      $scope.hasVisibleBackgroung = true;
    };
    $scope.calcelchangePhoto = function () {
      $scope.imageChanging = false;
    };
    $scope.getWorkerNumberById = function (id) {
      var workers = $scope.workers;
      for (var i = 0; i < workers.length; i++) {
        if (workers[i].id == id) {
          return workers[i].basic_number;
        }
      }
      return "undefined";
    };
    $scope.getWorkerNameById = function (id) {
      var workers = $scope.workers;
      for (var i = 0; i < workers.length; i++) {
        if (workers[i].id == id) {
          return workers[i].name;
        }
      }
      return "";
    };
    $scope.getWorkerViewById = function (id) {
      var workers = $scope.workers;
      for (var i = 0; i < workers.length; i++) {
        if (workers[i].id == id) {
          var workerViewId = workers[i].worker_views_id;
          var workerViews = $scope.workerViews;
          for (var j = 0; j<workerViews.length; j++) {
            if (workerViews[j].id == workerViewId) {
              return workerViews[j].name;
            }
          }
        }
      }
      return "";
    };

    var listenerChangelang = function (newValue, oldValue, scope) {
      if (newValue === oldValue) {
        return;
      }
      $scope.selectlabel = $scope.lang.words["Workers"];
      $scope.selectPlaceholder = $scope.lang.words["name"];
    };
    $scope.$watch('lang', listenerChangelang);
    /**
     * Close dialog window
     */
    $scope.cancel = function () {
      $mdDialog.cancel();
    };
    /**
     * Upload image to server
     */
    $scope.upload = function (dataUrl) {
      console.log("dataUrl", dataUrl);
      var autorization = 'Bearer ' + AuthService.getToken();
      var headers = {'Authorization': autorization};
      Upload.upload({
        url: '/v1/workers-photo/set-image',
        data: {
          imageFile: Upload.dataUrltoBlob(dataUrl, "imageFile.png"),
          workers_id: row.workers_id
        },
        headers: headers
      }).then(function (response) {
        $scope.imageChanging = false;
        $scope.workerPhoto = photoPath+"/photo_" + row.workers_id + ".png?" + Math.random() * (10000000000 - 1) + 1;

      }, function (response) {
        if (response.status > 0)
          $scope.errorMsg = response.status + ': ' + response.data;
      }, function (evt) {
        $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
      });
    };
  }]);