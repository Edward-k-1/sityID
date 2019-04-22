app.service('SmartCardRestService', ['$resource','AuthService', function ($resource,AuthService) {

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
    return $resource('/v1/smart-cards/:id', null,
      { 'get':    {method:'GET',isArray:true,headers: headers},
       'head':    {method:'head',headers: headers},
        'query':  {method:'GET', isArray:true,headers: headers},
        'save':  {method:'POST', headers: headers},
        "delete":{method:"DELETE",headers: headers},
        'update': { method:'PUT',headers: headers }
      });
  }
}
]);
