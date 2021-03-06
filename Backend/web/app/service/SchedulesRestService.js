/**
 * Created by walex on 16.12.16.
 */
app.service('SchedulesRestService', ['$resource','AuthService', function ($resource,AuthService) {

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

        return $resource('/v1/schedules/:id', null,
            { 'get':    {method:'GET',isArray:false,headers: headers},
                'save':   {method:'POST',headers: headers},
                'query':  {method:'GET', isArray:true,headers: headers},
                'remove': {method:'DELETE'},
                'delete': {method:'DELETE'},
                'update':{ method:'PUT' }
            });
    }
}
]);