//var app = angular.module('MakAtp');
app.controller('LoginCtrl', ['$scope', '$http', '$rootScope', '$mdDialog',
  'LanguageService', 'AuthService','FullPopupLoader',
  function ($scope, $http, $rootScope, $mdDialog, LanguageService, AuthService,FullPopupLoader) {
  /****
   * Binding language store.
   */
   var this_scope = $scope;

  function DialogController($scope, $mdDialog) {
    /***
     * $scope.lp_invalid - displayed warning about incorrect login or password
     */

    $scope.$on('LanguageChanged',function (event,data) {
      $scope.current_lang = data.code;
    });
    if (LanguageService.getCurrentLanguages()!==undefined)
    {
      $scope.current_lang = LanguageService.getCurrentLanguages().code;
    }

    $scope.lp_invalid = false;
    /****
     * Binding language store.
     */
    $scope.lang = this_scope.lang;

    /****
     * Submiting form and if submit success return token , hide form.
     */
    $scope.submit = function () {
      FullPopupLoader.showPopup();
      $http.post('auth/login', {login: $scope.user.login, password: $scope.user.password})
        .success(function (data, response) {
          FullPopupLoader.hidePopup();
          if (data.success == false) {
            $scope.lp_invalid = true;
            return;
          }
          else {
            AuthService.setToken(data.token);
            AuthService.setUserName(data.username);
            AuthService.setUserEmail(data.email);
            $mdDialog.hide();
          }
          $scope.lp_invalid = false;
        }).error(function () {
        FullPopupLoader.hidePopup();
      });
    };
    /*****Change language when language selected in login form
     */
    $scope.languageSelectChange = function () {
      LanguageService.setLanguage($scope.current_lang);
    };
  }

  /****
   * Display form when controller start loading.
   */
  $scope.showLoginForm = function () {
    $mdDialog.show({
      controller: DialogController,
      templateUrl: '/app/templates/loginform.tpl.html',
      parent: angular.element(document.body)
    });
  };
  $scope.showLoginForm();


}]);