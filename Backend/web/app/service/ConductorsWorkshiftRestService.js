app.service('ConductorsWorkshiftRestService', ['$resource','AuthService', function ($resource,AuthService) {

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
    return $resource('/v1/conductors-workshift/:id', null,
      { 'get':    {method:'GET',headers: headers},
       'getByParams':    {method:'GET',isArray:true,headers: headers,url:"v1/conductors-workshift/getbyparams"},
        'query':  {method:'GET', isArray:true,headers: headers},
        "delete":{method:"DELETE",headers: headers},
        'update': { method:'PUT',headers: headers },
        'save':  {method:'POST', headers: headers}


      });
  }
}
]);
