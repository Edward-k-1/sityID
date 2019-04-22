app.service('WorkshiftCompleteRestService', ['$resource','AuthService', function ($resource,AuthService) {

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

    return $resource('/v1/workshift-complete', null,
      { 'get':    {method:'GET',isArray:true,headers: headers},
        'save':   {method:'POST',headers: headers},
        'query':  {method:'GET', isArray:true,headers: headers,url:"/v1/workshift-complete/get-ext"},
        'getExt': {method:'GET', isArray:true,headers: headers},
        'remove': {method:'DELETE'},
        'delete': {method:'DELETE'},
        'update':{ method:'PUT' },
        'generateCompeteWorkshift':{method:'POST',headers: headers,url:"/v1/workshift-complete/generate-complete-workshift"}


      });
  }
}
]);
