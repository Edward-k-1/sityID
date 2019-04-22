app.service('VehiclesRestService', ['$resource','AuthService', function ($resource,AuthService) {

  var autorization = 'Bearer ' + AuthService.getToken();
  var headers = {'Authorization': autorization};
  this.updateToken = function()
  {
    autorization = 'Bearer ' + AuthService.getToken();
    headers = {'Authorization': autorization};
  };
  this.getResource = function()
  {
    this.updateToken();
    return $resource('/v1/vehicles', null,
      { 'get':    {method:'GET',isArray:false,headers: headers},
        'query':  {method:'GET', isArray:true,headers: headers}
      });
  }
}
]);
