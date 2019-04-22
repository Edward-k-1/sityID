app.service('WorkshiftsOrdersRestService', ['$resource','AuthService', function ($resource,AuthService) {
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

    return $resource('/v1/workshifts-orders/:id', null,
      { 'get':    {method:'GET',isArray:true,headers: headers},
        'query':  {method:'GET', isArray:true,headers: headers},
        'update': { method:'PUT',headers: headers },
        'save':  {method:'POST', headers: headers},
        "queryDep":{method:"GET",isArray:true,headers: headers,url:"/v1/workshifts-orders/workshift-dep"},
        "deleteWithdep":{method:"POST",headers: headers,url:"/v1/workshifts-orders/delete-with-dep"}
      });
  };
}
]);
