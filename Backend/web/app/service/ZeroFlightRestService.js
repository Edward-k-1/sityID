app.service('ZeroFlightRestService', ['$resource','AuthService', function ($resource,AuthService) {

  var autorization = 'Bearer ' + AuthService.getToken();
  var headers = {'Authorization': autorization};
  this.updateToken = function()
  {
    autorization = 'Bearer ' + AuthService.getToken();
    headers = {'Authorization': autorization};
  }

  this.getResource = function()
  {
    this.updateToken();

    return $resource('/v1/zero-flight', null,
      { 'get':    {method:'GET',isArray:true,headers: headers},
        'query':  {method:'GET', isArray:true,headers: headers},
      });
  }
}
]);
