/****
 * Service for storing and updatind landuges data and info.
 */

app.service('LanguageService', ['$rootScope', '$http','FullPopupLoader',"i18nService", function ($rootScope, $http,FullPopupLoader,i18nService) {
  var self = this;
  var main_scope = $rootScope;
  main_scope.lang = {};
  FullPopupLoader.showPopup();
  $http.get('v1/languages').success(function (data) {
    main_scope.lang.list = data;
    main_scope.lang.current = main_scope.lang.list[0];
    self.setLanguage(main_scope.lang.current.code)
    FullPopupLoader.hidePopup();
  }).error(function () {
    FullPopupLoader.hidePopup();
  });
  this.getLanguages = function () {
    return main_scope.lang.list;
  }
  this.getCurrentLanguages = function () {
    return main_scope.lang.current;
  }
  this.setLanguage = function (lang) {
    for (var i = 0; i < main_scope.lang.list.length; i++) {
      if (main_scope.lang.list[i].code == lang) {
        FullPopupLoader.showPopup();
        $http.get('/lang/' + main_scope.lang.list[i].code + '.json').success(function (data) {
          main_scope.lang.words = data;
          main_scope.lang.current = main_scope.lang.list[i];
          main_scope.$broadcast('LanguageChanged', main_scope.lang.current);
          i18nService.setCurrentLang(main_scope.lang.current.code);
          FullPopupLoader.hidePopup();
        }).error(function () {
          FullPopupLoader.hidePopup();
        });
        break;
      }
    }
  }

}]);