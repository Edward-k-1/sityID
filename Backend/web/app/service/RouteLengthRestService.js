app.service('RouteLengthRestService', ['$resource','AuthService', function ($resource,AuthService) {

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

    return $resource('/v1/routes-length', null,
      { 'get':    {method:'GET',isArray:true,headers: headers},
        'query':  {method:'GET', isArray:true,headers: headers},
        'queryExt':  {method:'GET', isArray:true,headers: headers,url:'/v1/routes-length/query-ext'},
      });
  }
}
]);
