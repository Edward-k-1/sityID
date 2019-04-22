app.filter('FilterWorkerNameById', function (GlobalStorage) {
   var workers =  GlobalStorage.getStorage("Workers");
  return function (id) {
    for (var i = 0; i < workers.length; i++) {
      if (workers[i].id==id){
        return workers[i].name;
      }
    }
    return ""
  };
});



app.filter('FilterWorkerNumberById', function (GlobalStorage) {
  var workers =  GlobalStorage.getStorage("Workers");
  return function (id) {
    for (var i = 0; i < workers.length; i++) {
      if (workers[i].id==id){
        return workers[i].basic_number;
      }
    }
    return ""
  };
});
app.filter('FilterStatusSmartCards', function (GlobalStorage,$rootScope) {
  return function (status) {
   switch (status)
   {
     case 0:
     {
       return $rootScope.lang.words["InActive"];
     }
       break;
     case 1:
     {
       return $rootScope.lang.words["Active"];
     }
       break;
   }
    return ""
  };
});

app.filter('FilterStatusSmartHelp', function (GlobalStorage,$rootScope) {
  return function (status) {
    switch (status)
    {
      case 0:
      {
        return $rootScope.lang.words["InActive"];
      }
        break;
      case 1:
      {
        return $rootScope.lang.words["Active"];
      }
        break;
    }
    return ""
  };
});
app.filter('FilterUserNameById', function (GlobalStorage) {
  var users  =  GlobalStorage.getStorage("Users");
  return function (id) {
    for (var i = 0; i < users.length; i++) {
      if (users[i].id == id) {
        return users[i].username;
      }
    }
    return '';
  };
});
app.filter('FilterRoutesNameById', function (GlobalStorage) {
  var routes  =  GlobalStorage.getStorage("Routes");
  return function (id) {
    if (id ==undefined||id == null)
    {
      return "";
    }
    for (var i = 0; i < routes.length; i++) {
      if (routes[i].id == id) {
        return routes[i].name;
      }
    }
    return '';
  };
});
app.filter('FilterParksNameById', function (GlobalStorage) {
  var parks  =  GlobalStorage.getStorage("Parks");
  return function (id) {
    if (id ==undefined||id == null)
    {
      return "";
    }
    for (var i = 0; i < parks.length; i++) {
      if (parks[i].id == id) {
        return parks[i].name;
      }
    }
    return '';
  };
});

app.filter('FilterVehicleModelNameById', function (GlobalStorage) {
  var vehicle_models  =  GlobalStorage.getStorage("VehicleModels");
  return function (id) {
    if (id ==undefined||id == null)    {
      return "";
    }
    for (var i = 0; i < vehicle_models.length; i++) {
      if (vehicle_models[i].id == id) {
        return vehicle_models[i].name;
      }
    }
    return '';
  };
});




