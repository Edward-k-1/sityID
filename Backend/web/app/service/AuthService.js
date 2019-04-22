
app.service('AuthService', function($cookies) {

  var self = this;
  var authToken ;
  var isAuth = false;
  var userName = null;
  var userEmail = null;
  var userPark = 0;
  // var role = null;
  // var id = null;
  function init() {
    // var role = $cookies.get('role');
    // var id = $cookies.get('uid');
    var tokenCookie = $cookies.get('tokenAccess');
    var username = $cookies.get('username');
    var email = $cookies.get('email');
    var park = $cookies.get('park');
    if(tokenCookie!==undefined&&username!==undefined&&email!==undefined&&park!==undefined)
    {
      self.setToken(tokenCookie);
      self.setUserName(username);
      self.setUserEmail(email);
      self.setUserPark(park);
    }
  }
  this.setToken = function (token) {
    authToken = token;
    isAuth = true;
    $cookies.put('tokenAccess',token);
  }
  this.setUserName = function (username) {
    userName  = username;
    $cookies.put('username',username);
  }
  this.getUserName = function () {
    return userName;
  }
  this.setUserEmail = function (useremail) {
    userEmail  = useremail;
    $cookies.put('email',useremail);
  }
  this.getUserEmail = function () {
    return userEmail;
  }

  this.setUserPark = function (userpark) {
    userPark  = userpark;
    $cookies.put('park',userPark);
  }
  this.getUserPark = function () {
    return userPark;
  }

  // this.setUserRole = function (role1) {
  //   role  = role1;
  //   $cookies.put('role',role);
  // }
  // this.getUserRole = function () {
  //   return role;
  // }
  // this.setUserId = function (uid) {
  //   id  = uid;
  //   $cookies.put('uid',id);
  // }
  // this.getUserId = function () {
  //   return id;
  // }

  this.getToken = function () {
   return authToken;
  }
  this.isAuthenticated = function () {
   return isAuth;
  }
  this.logout = function () {
    authToken = null;
    isAuth = false;
    userName = null;
    userEmail = null;
     $cookies.remove('tokenAccess');
     $cookies.remove('username');
    $cookies.remove('email');
    // $cookies.remove('uid');
    // $cookies.remove('role');
  }
init();
});