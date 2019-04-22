app.controller('OrdersController', ['$scope','$rootScope',"ParksRestService","GlobalStorage", function ($scope, $rootScope,ParksRestService,GlobalStorage) {
  $scope.orders=[{
    name: "Наряди",
    root:true,
    id:-1
  },
  //   {
  //   name: "Конструктор автоповторення",
  //   root:true,
  //   id:-1
  // }
  ];

  $scope.userData = $rootScope.UserData;

  if($scope.userData.pid !== 0) {
    var res = ParksRestService.getResource();
    res.query({'id': $scope.userData.pid}, function(data, response) {
      $scope.orders[0] = data[0];
    }, function(error) {console.log(error);});

  } else {
    if($scope.lang.words !== undefined)  {
      $scope.orders[0].name=$scope.lang.words['Parks'];
      // $scope.orders[1].name='Конструктор автоповторення';
    }


    $scope.orders[0].children = GlobalStorage.getStorage("Parks");
  }
  // $scope.orders[1] = {
  //   name: 'Calendar',
  //   id: 'c',
  //   type: 'orders_calendar'
  // };

  // $scope.orders[1].children = [
  //   {"name": 'Календар', 'id': 'n'},
  //   {"name": 'Шаблони', 'id': 's'}
  // ]



  $scope.$on('LanguageChanged',function (event,data) {
    $scope.orders[0].name=$scope.lang.words['Order'];
  });

  $scope.$on('selection-changed', function (e, node) {
    $rootScope.$broadcast("PageContentChanged",'orders');
    $rootScope.$broadcast("PageOrdersContentChanged",node.id);
  });


}]);