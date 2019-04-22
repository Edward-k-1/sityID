app.service('GraphsRestService', ['$resource','AuthService', function ($resource,AuthService) {

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

    return $resource('/v1/graphs/:id', null,
      { 'get':    {method:'GET',isArray:false,headers: headers,params: {id: '@id'}},
        'save':   {method:'POST',headers: headers},
        'query':  {method:'GET', isArray:true,headers: headers},
        'remove': {method:'DELETE'},
        'delete': {method:'DELETE',headers: headers},
        'update':{ method:'PUT' }
      });
  }
}
]);
