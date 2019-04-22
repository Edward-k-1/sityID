
app.service('GlobalStorage', function($cookies) {

  var self = this;
  var storage = {} ;
  this.isStorageExist = function( name)
  {
    if (name ==undefined)
    {
      console.error("isStorageExist: undefined parameter");
      return false;
    }
    return storage.hasOwnProperty(name);
  }
  this.setStorage= function(name,value)
  {
    if(storage.hasOwnProperty(name))
    {
      for (var prop in storage[name])
      { if (storage[name].hasOwnProperty(prop))
      { delete storage[name][prop]; }
      }
    }
    storage[name] = value;
  }
  this.getStorage = function(name)
  {
    if(!storage.hasOwnProperty(name))
    {
      return null;
    }
    return storage[name];
  }
  this.deleteStorage  = function(name)
  {
    delete storage[name];
  }
  this.getallStorage  = function()
  {
    return  storage;
  }



});