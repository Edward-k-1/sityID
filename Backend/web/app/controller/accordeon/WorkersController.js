app.controller('WorkersController', ['$scope','FullPopupLoader','WorkerViewsRestService','$rootScope',"ParksRestService","GlobalStorage",
  function ($scope,FullPopupLoader,WorkerViewsRestService,$rootScope,ParksRestService,GlobalStorage) {

  $scope.treeWorker=[
    {name:"Працівники",type:'workers',children: GlobalStorage.getStorage("Parks"),expanded:false,nodeId:"Workers",id:-1},
    {name:"Експорт",type:'workers_export',nodeId:"Export",id:-1},
    {name:"Графік роботи",type:'workers_graphs',nodeId:"workers_graphs",id:-1}
  ];
  if ($scope.lang.hasOwnProperty('words')) {
    $scope.treeWorker[0].name= $scope.lang.words['Workers'];
    $scope.treeWorker[1].name= $scope.lang.words['Export'];
  }
  $scope.$on('LanguageChanged', function (event, data) {
    $scope.treeWorker[0].name= $scope.lang.words['Workers'];
    $scope.treeWorker[1].name= $scope.lang.words['Export'];
  });
  $scope.$on('selection-changed', function (e, node) {
    $rootScope.$broadcast("PageContentChanged","workers");
    $rootScope.$broadcast("PageWorkerContentChanged",node);
  });
}]);