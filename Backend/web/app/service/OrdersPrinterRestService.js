/**
 * Created by walex on 12.12.16.
 */
app.service('OrdersPrinterRestService', ['$resource','AuthService', function ($resource,AuthService) {

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
        return $resource('/v1/print-orders/:id', null,
            { 'get':    {method:'GET',isArray:true,headers: headers},
                'save':   {method:'POST',headers: headers},
                'query':  {method:'GET', isArray:true,headers: headers},
                'remove': {method:'DELETE',headers: headers},
                'delete': {method:'DELETE',headers: headers},
                'update':{ method:'PUT' },
                'batch':{method:'POST',isArray:false,headers: headers,url:"/v1/carriers/package-process"}
            });
    }
}
]);
