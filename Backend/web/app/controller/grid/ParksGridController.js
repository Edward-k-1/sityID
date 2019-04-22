app.controller('ParksGridController', ['$scope', '$http', 'CarrierRestService', 'ParksRestService',
  'UserRestService', "FullPopupLoader",'customUnixTimeFilter',
  function ($scope, $http, CarrierRestService, ParksRestService, UserRestService, FullPopupLoader,customUnixTimeFilter) {
    $scope.gridOptions = new GridController(null, null);
    $scope.gridOptions.filters.User = [];
    $scope.gridOptions.filters.Carriers = [];

    /**
     * Defined column for grid
     */
    $scope.gridOptions.initColumnDefs = function () {
      $scope.gridOptions.columnDefs = [
        {name: 'id', displayName: 'id', enableCellEdit: false, width: 40,visible: false},
        {name: 'name', displayName: 'Name', enableCellEdit: false, width: 160},
        {name: 'carriers_id', displayName: 'carriers_id', enableCellEdit: false, width: 160, cellFilter: 'carriersMap'},
        {name: 'created_at',displayName: 'created_at', enableCellEdit: false, width: 180, cellFilter: 'customUnixTime'},
        {name: 'updated_at',displayName: 'updated_at',enableCellEdit: false, width: 100, cellFilter: 'customUnixTime'},
        {name: 'author_id', displayName: 'author_id', enableCellEdit: false, width: 180, cellFilter: 'userMap'},
        {name: 'updater_id', displayName: 'updater_id', enableCellEdit: false, width: 120, cellFilter: 'userMap'}
      ];
    };
    $scope.gridOptions.initColumnDefs();

    /**
     * Set header text from language words store
     */
    $scope.gridOptions.initColumnNameDefs = function () {
      $scope.gridOptions.columnDefs[0].displayName = $scope.lang.words["id"];
      $scope.gridOptions.columnDefs[1].displayName = $scope.lang.words["name"];
      $scope.gridOptions.columnDefs[2].displayName = $scope.lang.words["carriers_id"];
      $scope.gridOptions.columnDefs[3].displayName = $scope.lang.words["created_at"];
      $scope.gridOptions.columnDefs[4].displayName = $scope.lang.words["updated_at"];
      $scope.gridOptions.columnDefs[5].displayName = $scope.lang.words["author_id"];
      $scope.gridOptions.columnDefs[6].displayName = $scope.lang.words["updater_id"];
      $scope.gridOptions.updateData();
    };

    /**
     * Language preferense
     */
    if ($scope.lang.hasOwnProperty('words')) {
      $scope.gridOptions.initColumnNameDefs();
    }
    $scope.$on('LanguageChanged', function (event, data) {
      $scope.gridOptions.initColumnNameDefs();
    });

    /**
     * Defided function for loading data and map for filters
     * @param obj
     */
    $scope.gridOptions.loadData = function (obj,gridOptions) {
      loadParks(obj,gridOptions);
    };

    /**
     *Load users for filter userMap.
     */
    function loadUsers(obj,gridOptions) {
      FullPopupLoader.showPopup();
      var resource = UserRestService.getResource();
      resource.query({}, function (data, response) {
        gridOptions.filters.Users= data;
        loadCarriers(obj,gridOptions);
        FullPopupLoader.hidePopup();
      }, function (error) {
        FullPopupLoader.hidePopup();
      });
    }

    /**
     *Load carriers for carriersMap.
     */
    function loadCarriers(obj,gridOptions) {
      FullPopupLoader.showPopup();
      var resource = CarrierRestService.getResource();
      resource.query(obj, function (data, response) {
        gridOptions.filters.Carriers= data;
        loadParks(obj,gridOptions);
        FullPopupLoader.hidePopup();
      }, function (error) {
        FullPopupLoader.hidePopup();
      });
    }

    /**
     *  Load data for grid
     */
    function loadParks(obj,gridOptions) {
      FullPopupLoader.showPopup();
      var resource = ParksRestService.getResource();
      resource.query(obj, function (data, response) {
        var headers = response();
        gridOptions.data= data;
        gridOptions.totalItems = parseInt(headers['x-pagination-total-count']);
        FullPopupLoader.hidePopup();
      }, function (error) {
        FullPopupLoader.hidePopup();
      });
    }

    loadUsers({
      'per-page': $scope.gridOptions.paginationPageSize,
      page: 1
    },$scope.gridOptions);

    /**
     * Filters
     */
    app.filter('userMap', function () {
      return function (id) {
        for (var i = 0; i < $scope.gridOptions.filters.User.length; i++) {
          if ($scope.gridOptions.filters.User[i].id == id) {
            return $scope.gridOptions.filters.User[i].username;
          }
        }
        return '';
      };
    });

    app.filter('carriersMap', function () {
      return function (id) {
        for (var i = 0; i < $scope.gridOptions.filters.Carriers.length; i++) {
          if ($scope.gridOptions.filters.Carriers[i].id == id) {
            return $scope.gridOptions.filters.Carriers[i].name;
          }
        }
        return '';
      };
    });
  }]);

