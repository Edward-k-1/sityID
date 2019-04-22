app.service('WorkersRestService', ['$resource','AuthService', function ($resource,AuthService) {

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

    return $resource('/v1/workers', null,
      { 'get':    {method:'GET',isArray:false,headers: headers},
        'query':  {method:'GET', isArray:true,headers: headers},
        'queryExcelPreview':  {method:'GET', isArray:true,headers: headers,
          url:"v1/workers/worker-before-csv"},
        'queryExcelExport':  {method:'GET', headers: headers,
          url:"v1/workers/worker-csv" ,    responseType: 'arraybuffer',transformResponse: function (data,headers ) {
            var zip = null;
            if (data) {
              zip = new Blob([data], {
                type: 'application/zip' //or whatever you need, should match the 'accept headers' above
              });
            }

            var result = {
              blob: zip,
              fileName: "filename.csv"
            };
            return {
              response: result
            };
          }
        }
      });
  }
}
]);
