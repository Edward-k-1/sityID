app.service('UserRestService', ['$rootScope','$resource','AuthService', function ($rootScope,$resource,AuthService) {

  var autorization = 'Bearer ' + AuthService.getToken();
  var headers = {'Authorization': autorization};

  var userData = {};
  this.updateToken = function()
  {
    autorization = 'Bearer ' + AuthService.getToken();
    headers = {'Authorization': autorization};
  }

    this.getUserData = function() {
        return userData;
    };

    function constructObject(arg) {
        var a = arg.split('/');
        var output = {};
        for(var i = 0; i < a.length; i++){
            var r = a[i].split(':');
            Object.defineProperty(output, r[0], {
                value: r[1],
                enumerable: true,
                configurable: true,
                writable: false
            });
        }
        return output;
    }

    this.getDbUserData = function() {
        var usrName = AuthService.getUserName();
        var resource = this.getResource();
        resource.query({'name': usrName}, function (data, response) {
            userData.id = data[0].id;
            userData.pid = data[0].park_id;
            userData.access_level = constructObject(data[0].access_level);
            userData.options = constructObject(data[0].options);
            userData.role = data[0].role;
            $rootScope.UserData = userData;
          AuthService.setUserPark(userData.pid);

        }, function(error) {console.log(error);});
    };


  this.getResource = function()
  {
    this.updateToken();

    return $resource('/v1/users', null,
      { 'get':    {method:'GET',isArray:true,headers: headers},
        'save':   {method:'POST',headers: headers},
        'query':  {method:'GET', isArray:true,headers: headers},
        'remove': {method:'DELETE'},
        'delete': {method:'DELETE'},
        'update':{ method:'PUT' },
        'batch':{method:'POST'}
      });
  }
    this.getDbUserData();
}
]);
