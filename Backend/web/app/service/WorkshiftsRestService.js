/**
 * Created by walex on 23.11.16.
 */
app.service('WorkshiftsRestService', ['$resource','AuthService', function ($resource,AuthService) {
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

        return $resource('/v1/workshifts/:id', null,
            { 'get':    {method:'GET',isArray:true,headers: headers},
                'query':  {method:'GET', isArray:true,headers: headers},
                'update': { method:'PUT',headers: headers },
                'save':  {method:'POST', headers: headers}
            });
    };
}
]);