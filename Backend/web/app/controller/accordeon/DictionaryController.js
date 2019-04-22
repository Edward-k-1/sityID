app.controller('DictionaryController', ['$scope','$rootScope', function ($scope,$rootScope) {


  $scope.$on('LanguageChanged',function (event,data) {
    //$scope.monitoring[0].name=$scope.lang.words['Parks'];
  });

  $scope.$on('selection-changed', function (e, node) {
    $rootScope.$broadcast("PageContentChanged",'dictionary');
    $rootScope.$broadcast("PageDictionaryContentChanged",node);
  });
  $scope.dictionary =  [
    {name: "Довжина рейсу", id: 0, type:"routes_length"},
    {name: "Нульвий пробіг", id: 1, type:"zero_flight"},
    {name: "Витрати пального по плану", id:2, type:"fuel_consumption"}
  ]


}]);