app.controller('TechnicalPerformanceIndicatorController', ['$scope','$rootScope', function ($scope,$rootScope) {
  $scope.teps=[
    {name :"Тепи ",
      nodeId:"technical_performance_indicator",
      id:-1
    },

    {name :"Тепи по маршрутах (Фільтр)",
      nodeId:"routes_technical_performance_indicator",
      id:-1
    },
    {name :"Тепи по Нарядах(Редарування)",
      nodeId:"technical_performance_indicator_workshift",
      id:-1
    }
  ];


  $scope.$on('selection-changed', function (e, node) {
    $rootScope.$broadcast("PageContentChanged",'technical_performance_indicator');
    $rootScope.$broadcast("PageTPIContentChanged",node);


  });

}]);