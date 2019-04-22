app.service('VehicleTypesRestService', ['$resource','AuthService', function ($resource,AuthService) {

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

    return $resource('/v1/vehicle-types', null,
      { 'get':    {method:'GET',isArray:true,headers: headers},
        'query':  {method:'GET', isArray:true,headers: headers}

      });
  }
}
]);
