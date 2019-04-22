function GridController(RestController, StorageController, $mdDialog) {
  this._restController = RestController;
  this._storageController = StorageController;
  this._hasEdit = false;
  this._hasDelete = false;
  this._hasCreate = false;
  this.gridApi = {};
  this.data = [];
  this.tempIdForNew = 0;
  this.totalItems = 0;
  this.flatEntityAccess = true;
  this.minRowsToShow = 10;
  this.enableSorting = true;
  this.useExternalPagination = true;
  this.rowTemplate = '<div ng-class="{ \'grid-row-edited\':row.entity.__changed, \'grid-row-new\':row.entity.__isNew}"><div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }" ui-grid-cell></div></div>';
  // this.enableVerticalScrollbar = 0
  this.filters  = {};
  this.popup = {
    edit: {templateUrl: ''},
    delete: {templateUrl: ''},
    create: {templateUrl: ''},
    create: {templateUrl: ''}
  };
  this.services = {$mdDialog: $mdDialog};
  this.paginationPageSize = 250;
  this.paginationPageSizes = [250, 500, 1000];

}
GridController.prototype._init = function () {
  for (var i = 0; i < this.columnDefs.length; i++) {
    if (this.columnDefs[i].cellClass === undefined) {
      this.columnDefs[i].cellClass = this.cellStyle;
    }
  }
  var templatebuttondelete = this._hasDelete == true ? '<md-button  class="md-raised md-primary ' +
  'md-small" ng-click="grid.options.deleteGridRow(row.entity)">' +
  'Delete  </md-button>' : "";
  var templatebuttonEdit = this._hasEdit == true ? '<md-button  class="md-raised md-primary md-small"' +
  ' ng-click="grid.options.editGridRow(row.entity)">Edit  </md-button>' : "";
  if (this._hasEdit == true || this._hasDelete == true) {
    var cellEditDelete = {
      name: 'le',
      displayName: 'Edit or delete row',
      enableCellEdit: false,
      cellTemplate: '<div class="cell-edit-button-template">' + templatebuttondelete + templatebuttonEdit + "</div>",
      width: 220
    }
    this.columnDefs.push(cellEditDelete);
  }
};


/**
 * Delete row by id from data array
 * @param id
 */
GridController.prototype.deleteRow = function (id) {
  for (var i = 0; i < this.data.length; i++) {
    if (this.data[i].id === id) {
      this.data.splice(i, 1);
      return;
    }
  }
};
/**
 * Find row by id in data and if exist return
 * @param id
 * @returns {*}
 */
GridController.prototype.findRowById = function (id) {
  for (var i = 0; i < this.data.length; i++) {
    if (this.data[i].id === id) {
      return this.data[i];
    }
  }
  return null;
};

/**
 * Delete row by from data from grid and add backup to storage
 * @param id
 */
GridController.prototype.deleteRowById = function (id) {
  var row = this.findRowById(id);
  if (row !== null) {
    this._storageController.addToDeleted(row);
    this.deleteRow(id);
  }
};

/****
 * Add to storage editted data by id;
 * @param id
 */
GridController.prototype.editRowById = function (id) {
  var row = this.findRowById(id);
  if (row !== null) {
    this._storageController.addToUpdated(row);
  }
};
/***
 * Add to storage edited data by obj
 * @param obj
 */
GridController.prototype.editRowByObj = function (obj) {
  this._storageController.addToUpdated(obj);
};

/****
 * Create new row & added to grid and to storage
 * @param obj
 */
GridController.prototype.createNewRow = function (obj) {
  obj.__isNew = true;
  obj.created_id = this._storageController.createdIndex;
  this._storageController.addToCreated(obj);
  this.data.push(obj);
};

/****
 * Update new row & added to grid and to storage
 * @param obj
 */
GridController.prototype.updateNewRow = function (obj) {
  this._storageController.addToCreated(obj);
};

/**
 * delete created row from grid and storage
 * @param id
 */
GridController.prototype.deleteNewRow = function (id) {
  this._storageController.createdIndex(id);
  this.deleteRow(id);
};

/**
 * restore eited row
 * revert edited data and remove from backup storage
 * @param id
 */
GridController.prototype.restoreUpdated = function (id) {
  var row_backup = this._storageController.findUpdated(id);
  var row_data = this.findRowById(id)
  if (row_backup !== null && row_data !== null) {
    row_data = row_backup;
    var row_backup = this._storageController.removeFromUpdated(id);
  }
};

/***
 * return deleted row to grid and remove from backup
 * @param id
 */
GridController.prototype.restoreDeleted = function (id) {
  var row_backup = this._storageController.findDeleted(id);
  if (row_backup !== null) {
    console.error("GridController.prototype.restoreDeleted : row_empty");
  }

  if ($scope.gridOptions.data[0].id > id) {
    this.data.splice(0, 0, row_backup);
    this._storageController.removeFromDeleted(id);
    return;
  }
  if (this.data[this.data.length - 1].id < id) {
    this.data.splice(this.data.length, 0, row_backup);
    this._storageController.removeFromDeleted(id);
    return;
  }
  for (var i = 0; i < this.data.length - 1; i++) {
    if ((id < this.data[i + 1].id ) && (id > this.data[i].id)) {
      this.data.splice(ii + 1, 0, $row_backup);
      $scope.editedData.backup.splice(i, 1);
      this._storageController.removeFromDeleted(id);
      return;
    }
  }
};

GridController.prototype.cellStyle = function (grid, row, col, rowRenderIndex, colRenderIndex) {
  if (row.entity.hasOwnProperty('__new')) {
    return 'new-item';
  }
  if (row.entity.hasOwnProperty('__dataChenched')) {
    if (row.entity.__dataChenched[col.field] == true) {
      return 'grid-cell-edited';
    }
  }
};

GridController.prototype.onRegisterApi = function (gridApi) {
  this.gridApi = gridApi;
  var gridApi = gridApi;
  var self = this;
  gridApi.edit.on.afterCellEdit(null/*$scope*/, function (rowEntity, colDef, newValue, oldValue) {
    /**
     * Validate cell edited value and if data is not valid show popup
     * Function validate in colDef:validator
     * ***/
    if (colDef.hasOwnProperty('validator')) {
      if (!colDef.validator(newValue)) {
        rowEntity[colDef.name] = oldValue;
        self.services.$mdDialog.show(
          self.services.$mdDialog.alert()
            .parent(angular.element(document.querySelector('body')))
            .clickOutsideToClose(true)
            .title('Увага')
            .textContent('Не коректно введені дані')
            .ariaLabel('')
            .ok('ок')
        );
        return;
      }
    }
    if (newValue != oldValue) {
      if (rowEntity.hasOwnProperty('__isNew')) {
        self._storageController.updateNewRow(rowEntity);
        return;
      }
      if (!rowEntity.hasOwnProperty('__dataChenched')) {
        rowEntity.__dataChenched = [];
        rowEntity.__changed = true;
      }
      rowEntity.__dataChenched[colDef.name] = true;
      gridApi.core.notifyDataChange('all');
      self._storageController.addToUpdated(rowEntity);
    }
  });
  if (this.useExternalPagination == true) {
    gridApi.pagination.on.paginationChanged(null, function (newPage, pageSize) {
      self.loadData({'per-page': pageSize, page: newPage}, self);
    });
  }
};

GridController.prototype.editGridRow = function (entity) {
};

/***
 * Handler for button delete in cell
 * @param entity
 */
GridController.prototype.deleteGridRow = function (entity) {
  var self = this;
  var confirm = this.services.$mdDialog.confirm()
    .title(self.lang.words['Would you like to delete row?'])
    .textContent(self.lang.words['You really want delete row with id'] + ' ' + entity.id)
    .ariaLabel('')
    .ok(self.lang.words['Delete'])
    .cancel(self.lang.words['Cancel']);
  this.services.$mdDialog.show(confirm).then(function () {
    self.deleteRowById(entity.id);
  }, function () {
  });
};


GridController.prototype.showSavePopup = function () {
};

GridController.prototype.loadDataProcesing = function () {
  this.processingDataAfterLoad();
  this.gridApi.core.notifyDataChange('all');
};

GridController.prototype.processingDataAfterLoad = function () {
  for (var i = 0; i < this.data.length; i++) {
    var item = this._storageController.findDeleted(this.data[i].id);
    if (item !== null) {
      console.log("delete item", item);
      this.data.splice(i, 1);
      i--;
      continue;
    }
    item = this._storageController.findUpdated(this.data[i].id);
    if (item !== null) {
      console.log('item', item);
      angular.extend(this.data[i], item);
    }
  }
  var newRow = this._storageController.getAllCreatedData().slice();
  for (var i = 0; i < newRow.length; i++) {
    this.data.push(newRow[i]);
  }
};

GridController.prototype.updateData = function () {
  if (this.gridApi.hasOwnProperty("core")) {
    this.gridApi.core.notifyDataChange('all');
  }
};

GridController.prototype.saveDataToServer = function () {
  var updated = this._storageController.getAllUpdatedData();
  var created = this._storageController.getAllCreatedData();
  var deleted = this._storageController.getAllDeletedData();
  var data = {create: created, update: updated, delete: deleted};
  var resource = this._restController.getResource();
  var self = this;
  resource.batch(data, function (data, response) {
    self._storageController.flushAllEditedData();
    self._storageController.flushAllBackupData();
    self.loadData({'per-page': self.paginationPageSize, page: self.paginationCurrentPage},self);
  }, function (error) {
  });
};

GridController.prototype.reloadCurrentData = function () {
  this.loadData({'per-page': this.paginationPageSize,page:this.paginationCurrentPage},this);

}



