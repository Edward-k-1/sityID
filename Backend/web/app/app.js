var app = angular.module('MakAtp', ['ngMaterial','ngCookies','vAccordion','TreeWidget','ui.grid','ngResource',
  'ui.grid.edit', 'ui.grid.cellNav', 'ui.grid.autoResize', 'ui.grid.resizeColumns', 'ui.grid.pagination','ui.date',
  'ui.grid.expandable', 'ui.grid.selection', 'ui.grid.pinning',"ngFileUpload","ngImgCrop","dndLists",'textAngular','ngSanitize','io.dennis.contextmenu','ngDragDrop','angularResizable',
  'ng-sortable', 'ngDialog']);
app.run(function ($rootScope) {
  $rootScope.lang = {};
});
app.config(['$filterProvider', function($filterProvider){
  app.filter = $filterProvider.register;
}]);