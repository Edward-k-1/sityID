app.service('EditedDataStorage',function () {
  var datastorage = {};
  var self = this;
  /**
   * if exist - to fix
   * *****/

  self.createNewStorage  =  function(name) {
    if (datastorage[name] === undefined)
    {
      datastorage[name] = new StorageController();
    }
  };
  self.getStorage = function(name)
  {
    if (datastorage[name] !== undefined)
    {
      return datastorage[name];
    }
    return null;
  }
});
function findInArrayById(array, id)
{
  for (var i =0;i<array.length;i++)
  {
    if (array[i].id === id){
      return array[i];
    }
  }
  return null;
};
function removeFromArrayById(array, id)
{
  for (var i =0;i<array.length;i++)
  {
    if (array[i].id === id){
      array.splice(i,1);
      return;
    }
  }
};

/**
 * Class for storage created edited or deleted data and backup their initial data;
 */
function StorageController()
{
  this.updatedItems = 0;
  this.deletedItems = 0;
  this.createdItems = 0;
  this.createdIndex = 0;

  this._editedData={created:[],deleted:[],updated:[]};
  this._backupData = {deleted:[],updated:[]};
};
StorageController.prototype.getCountEditedItems = function () {
  return this.updatedItems +this.createdItems + this.deletedItems;
};
StorageController.prototype.addToUpdated = function (obj)
{
  var found  = this.findUpdated(obj.id);
  if (found == null){
    this._editedData.updated.push(angular.extend({},obj));
    this.addToBackupUpdated(angular.extend({},obj));
    this.updatedItems++;
    return;
  }
  angular.extend(found,obj);
};
StorageController.prototype.addToCreated = function (obj)
{
  var found  = this.findCreated(obj.id);
  if (found == null){
    this._editedData.created.push(angular.extend({},obj));
    this.createdIndex++;
    return;
  }
  found = angular.copy(obj);
};
StorageController.prototype.addToDeleted= function (obj)
{
  console.log('StorageController.prototype.addToDeleted',obj);
  var row  = this.findUpdated(obj.id);
  console.log('StorageController.prototype.addToDeleted row',row);
  if (row!==null){
    this.addToBackupDeleted(angular.extend({},row)) ;
    this.removeFromBackupUpdated(obj.id);
    this.removeFromUpdated(obj.id);
    this.deletedItems ++;
    console.log('StorageController.prototype.addToDeleted return');
    return;
  }
  this._editedData.deleted.push(angular.extend({},obj));
  this.addToBackupDeleted(angular.extend({},obj));
  this.deletedItems ++;

};
StorageController.prototype.findUpdated = function (id){
  return findInArrayById(this._editedData.updated,id);
};
StorageController.prototype.findDeleted = function (id){
  return findInArrayById(this._editedData.deleted,id);
};
StorageController.prototype.findCreated = function (id){
  for (var i =0;i<this._editedData.created.length;i++)
  {
    if (this._editedData.created[i].created_id === id){
      return this._editedData.created[i];
    }
  }
  return null;
};
StorageController.prototype.removeFromDeleted= function (id){
  removeFromArrayById(this._editedData.deleted,id);
  this.deletedItems--;
};;
StorageController.prototype.removeFromCreated= function (id){
  for (var i =0;i<this._editedData.created.length;i++)
  {
    if (this._editedData.created[i].created_id === id){
      this._editedData.created.splice(i,1);
      return;
    }
  }
  this.createdItems--;
};
StorageController.prototype.removeFromUpdated= function (id){
  removeFromArrayById(this._editedData.updated,id);
  this.updatedItems--;
};


StorageController.prototype.addToBackupDeleted= function (obj){
  this._backupData.deleted.push(angular.extend({},obj));
};;
StorageController.prototype.addToBackupUpdated= function (obj){
  this._backupData.updated.push(angular.extend({},obj));
};
StorageController.prototype.findBackupUpdated = function (id){
  return findInArrayById(this._backupData.updated,id);
};
StorageController.prototype.findBackupDeleted = function (id){
  return findInArrayById(this._backupData.deleted,id);
};

StorageController.prototype.removeFromBackupDeleted = function (id){
  removeFromArrayById(this._backupData.deleted,id);
};

StorageController.prototype.removeFromBackupUpdated = function (id){
  removeFromArrayById(this._backupData.updated,id);
};

StorageController.prototype.flushAllBackupData = function (){
  this._backupData={created:[],deleted:[],updated:[]};

};
StorageController.prototype.flushAllEditedData = function (){
  this._editedData={created:[],deleted:[],updated:[]}
  this.updatedItems = this.createdItems = this.deletedItems = 0;
};

StorageController.prototype.getAllBackupData = function (){
  return this._backupData;
};
StorageController.prototype.getAllEditedData = function (){
  return this._editedData;
};
StorageController.prototype.getAllCreatedData = function (){
  return this._editedData.created;
};
StorageController.prototype.getAllUpdatedData = function (){
  return this._editedData.updated;
};
StorageController.prototype.getAllDeletedData = function (){
  return this._editedData.deleted;
};



















