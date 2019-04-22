/**
 * Created by walex on 13.12.16.
 */
app.service('AlertsRestService', ['$resource','AuthService', function ($resource,AuthService) {
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
        return $resource('/v1/alerts/:id', null,
            { 'get':    {method:'GET',isArray:false,headers: headers},
                // 'getExt':    {method:'GET',isArray:false,headers: headers,url:"/v1/card-listener/get-card-ext"},
                'query':  {method:'GET', isArray:true,headers: headers},
                'update': { method:'PUT',headers: headers },
                'delete': { method:'DELETE',headers: headers },
                'save':  {method:'POST', headers: headers}
            });
    };
}
]);