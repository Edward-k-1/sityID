app.service('WorkersGraphsRestService', ['$resource','AuthService', function ($resource,AuthService) {

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

    return $resource('/v1/workers-graphs', null,
      { 'get':    {method:'GET',isArray:true,headers: headers},
        'query':  {method:'GET', isArray:true,headers: headers},
        'getWorkerCalendar':  {method:'GET', isArray:true,headers: headers,url:"/v1/workers-graphs/get-worker-graphs"},
        'getWorkersCalendar':  {method:'POST', isArray:false,headers: headers,url:"/v1/workers-graphs/get-workers-graphs"},
        'saveWorkerDay':  {method:'POST', isArray:false,headers: headers,url:"/v1/workers-graphs/save-worker-day"},
        'getFreeWorkers':  {method:'POST', isArray:true,headers: headers,url:"/v1/workers-graphs/free-workers"},
        'fillWorkerMonthGraphs':  {method:'POST', isArray:false, headers: headers,url:"/v1/workers-graphs/fill-worker-month-grapth"}


      });
  }
}
]);
