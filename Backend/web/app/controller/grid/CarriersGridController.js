app.controller('CarriersGridController', ['$scope', '$http','CarrierRestService','UserRestService',
  'EditedDataStorage','$mdDialog','FullPopupLoader','customUnixTimeFilter',
  function ($scope, $http,CarrierRestService,UserRestService,EditedDataStorage,$mdDialog,FullPopupLoader,customUnixTimeFilter) {

    /**
     * id	name	users_id	created_at	updated_at	author_id	updater_id
     * @type {GridController}
     */
    EditedDataStorage.createNewStorage('carriers');
    var editStorage  = EditedDataStorage.getStorage('carriers');
$scope.gridOptions = new GridController(CarrierRestService,editStorage,$mdDialog);
    $scope.gridOptions.filters ={};
    $scope.gridOptions.filters.Users = [];
    $scope.gridOptions.initColumnDefs = function () {
      $scope.gridOptions.columnDefs = [
        {name: 'id',displayName:"id", enableCellEdit: false, width: 40},
        {name: 'name',      enableCellEdit: false,   width: 160},
        {name: 'created_at',enableCellEdit: false,  width: 180, cellFilter: 'customUnixTime' },
        {name: 'updated_at',enableCellEdit: false,  width: 100, cellFilter: 'customUnixTime'},
        {name: 'author_id', enableCellEdit: false,  width: 180, cellFilter: 'userMap',type:"number"},
        {name: 'updater_id',enableCellEdit: false,  width: 120, cellFilter: 'userMap'}
      ];
    };

    /**
     * Set header text from language words store
     */
    $scope.gridOptions.initColumnNameDefs = function () {
      $scope.gridOptions.columnDefs[0].displayName = $scope.lang.words["id"];
      $scope.gridOptions.columnDefs[1].displayName = $scope.lang.words["name"];;
      $scope.gridOptions.columnDefs[2].displayName = $scope.lang.words["created_at"];;
      $scope.gridOptions.columnDefs[3].displayName = $scope.lang.words["updated_at"];;
      $scope.gridOptions.columnDefs[4].displayName = $scope.lang.words["author_id"];;
      $scope.gridOptions.columnDefs[5].displayName = $scope.lang.words["updater_id"];;
      $scope.gridOptions.updateData();
    };

    /**
     *Init Grid options
     */
    $scope.gridOptions.initColumnDefs ();
    $scope.gridOptions._init();
    $scope.gridOptions.lang = $scope.lang;

    /**
     * Language preferense
     */
    if($scope.lang.hasOwnProperty('words')){
      $scope.gridOptions.initColumnNameDefs();
    }
    $scope.$on('LanguageChanged',function (event,data) {
      $scope.gridOptions.initColumnNameDefs();
    });

    /**
     * Loading data for grid
     * @param obj
     */
    $scope.gridOptions.loadData = function (obj,gridOptions){
      loadCarriers(obj,gridOptions);
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
     *Load carriers for grid.
     */
    function loadCarriers(obj,gridOptions) {
      FullPopupLoader.showPopup();
      var resource = CarrierRestService.getResource();
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
     * Filter user for grid
     */
    app.filter('userMap', function () {
      return function (id) {
        for (var i = 0; i < $scope.gridOptions.filters.Users.length; i++) {
          if ($scope.gridOptions.filters.Users[i].id == id) {
            return $scope.gridOptions.filters.Users[i].username;
          }
        }
        return 'undefined';
      };
    });
  }]);

