/**
 * Created by walex on 13.03.17.
 */
app.service('SettingsRestService', ['$resource','AuthService', function ($resource,AuthService) {

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

        return $resource('/v1/user-settings/:id', null,
            { 'get':    {method:'GET',isArray:false,headers: headers},
                'save':   {method:'POST',headers: headers},
                'query':  {method:'GET', isArray:true,headers: headers},
                'remove': {method:'DELETE',headers: headers},
                'delete': {method:'DELETE',headers: headers},
                'update':{ method:'PUT',headers: headers}
            });
    }
}
]);
