
app.filter('customUnixTime', function ($filter) {
  return function (input) {
    if(!input) {return '';}
    return $filter('date')(input*1000, "dd-MM-yyyy HH:mm:ss", "UTC");
  };
});
app.filter('customUnixTimeOnly', function ($filter) {
  return function (input) {
    if(!input) {return '';}
    return $filter('date')(input*1000, "HH:mm:ss", "UTC");
  };
});
app.filter('TimeBySec', function () {
  return function (input) {
    if(!input) {return '';}
    var date  = new Date();
    date.setTime((input - 2*60*60)*1000);
    return datef('HH:mm', date);
  };
});
app.filter('customUnixDate', function ($filter) {
  return function (input) {
    if(!input) {return '';}
    return $filter('date')(input*1000, "dd-MM-yyyy", "UTC");
  };
});

app.filter('customUnixDateFromDB', function ($filter) {
  return function (input) {
    if(!input) {return '';}
    return $filter('date')(input, "dd-MM-yyyy", "UTC");
  };
});