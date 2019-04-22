app.controller('WorkersExportController', ['$scope', '$http', 'WorkersRestService', 'WorkerViewsRestService',
  "FullPopupLoader", 'ParksRestService', 'UserRestService', 'customUnixTimeFilter', 'AuthService',"GlobalStorage","$filter",
  function ($scope, $http, WorkersRestService, WorkerViewsRestService, FullPopupLoader, ParksRestService, UserRestService,
            customUnixTimeFilter, AuthService,GlobalStorage,$filter) {


  var workersStorage =   GlobalStorage.getStorage("Workers");

    $scope.workersTypes = {selected: []};
    $scope.workersParks = {selected: []};
    $scope.selectFilter ={};
    $scope.gridOptions = new GridController(null, null);
    $scope.gridOptions.useExternalPagination = false;
    $scope.gridOptions.initColumnDefs = function () {
      $scope.gridOptions.columnDefs = [
        {name: 'last_name', displayName: 'Last name', enableCellEdit: false,headerCellClass:"worker-name-cell-template"},
        {name: 'first_name', displayName: 'First  name', enableCellEdit: false,headerCellClass:"worker-name-cell-template"},
        {name: 'middle_name', displayName: 'Middle name', enableCellEdit: false,headerCellClass:"worker-name-cell-template"},
        {name: 'basic_number', displayName: 'basic_number', enableCellEdit: false,headerCellClass:"worker-name-cell-template"},
        {name: 'parks_id', displayName: 'parks_id', enableCellEdit: false ,cellFilter:"ParksMap",headerCellClass:"worker-name-cell-template"},
        {name: 'worker_views_id', displayName: 'wv_name', enableCellEdit: false,cellFilter:"WorkerViewsMap",headerCellClass:"worker-name-cell-template"},
        {name: 'date_added', displayName: 'date_added', enableCellEdit: false,cellFilter:"customUnixDateFromDB",headerCellClass:"worker-name-cell-template"}
      ];
    };

    $scope.gridOptions.initColumnNameDefs = function () {
      var i = 0;
      $scope.gridOptions.columnDefs[i].displayName = $scope.lang.words["Last name"];i++;
      $scope.gridOptions.columnDefs[i].displayName = $scope.lang.words["First name"];i++;
      $scope.gridOptions.columnDefs[i].displayName = $scope.lang.words["Middle name"];i++;
      $scope.gridOptions.columnDefs[i].displayName = $scope.lang.words["basic number"];i++;
      $scope.gridOptions.columnDefs[i].displayName = $scope.lang.words["parks"];i++;
      $scope.gridOptions.columnDefs[i].displayName = $scope.lang.words["workers views"];i++;
      $scope.gridOptions.columnDefs[i].displayName = $scope.lang.words["date added"];i++;
      $scope.gridOptions.updateData();
    };

    $scope.gridOptions.initColumnDefs();
    if ($scope.lang.hasOwnProperty('words')) {
      $scope.gridOptions.initColumnNameDefs();
    }
    $scope.$on('LanguageChanged', function (event, data) {
      $scope.gridOptions.initColumnNameDefs();
    });
    $scope.workersParks.list =  GlobalStorage.getStorage("Parks");
    $scope.workersTypes.list =  GlobalStorage.getStorage("WorkerViews");
    var splised_arr = angular.copy(workersStorage);
    $scope.gridOptions.data = splised_arr;
    $scope.gridOptions.updateData();

    /**
     * Load xml to grid
     */
    $scope.applyFilter = function () {
      var selectedParks = $scope.workersParks.selected;
      var selectedTypes = $scope.workersTypes.selected;
      var resultArray = [];
      var temp_result = [];
      if (selectedParks.length ==0 && selectedTypes.length == 0){
        resultArray = workersStorage;
      }
      else {
        for (var i = 0; i < workersStorage.length; i++) {
          var currentWorker = workersStorage[i];
          if (selectedParks.length == 0) {
            temp_result.push(currentWorker)
          }
          else {
            for (var j = 0; j < selectedParks.length; j++) {
              if (currentWorker.parks_id === undefined ||currentWorker.parks_id === null){
                break;
              }
              if (parseInt(selectedParks[j]) == parseInt(currentWorker.parks_id)) {
                temp_result.push(currentWorker);
                break;
              }
            }
          }
        }
        for (var i = 0; i < temp_result.length; i++) {
          var currentWorker = temp_result[i];
          if (selectedTypes.length == 0) {
            resultArray.push(currentWorker)
          }
          else {
            for (var j = 0; j < selectedTypes.length; j++) {
              if (currentWorker.worker_views_id === undefined ||currentWorker.worker_views_id === null){
                break;
              }
              if (parseInt(selectedTypes[j]) == parseInt(currentWorker.worker_views_id)) {
                resultArray.push(currentWorker);
                break;
              }
            }
          }
        }
      }
      $scope.gridOptions.data = resultArray;
    };


    /**
     * Load xml - excell file to browser
     */

    $scope.exportCsv  = function (){
      var  excellBuiler = new ExcellBuilder();
      var data = $scope.gridOptions.data;
      excellBuiler.addMergedRow("Таблиця працівників",4);
     // excellBuiler.addRow(["Прізвище","Імя","По батькові","Базовий Номер","Тип працівника","Парк","Дата прийнятя"]);
      excellBuiler.addRow(["ПІБ","Базовий Номер","Тип працівника","Парк","Дата прийнятя"]);
      for(var i = 0;i<data.length;i++ ){
        var dataRow = data[i];
        var currentParkName = getParksNameById(dataRow.parks_id);
        var currentWorkersViews = getWorkerViewById(dataRow.worker_views_id);
        var short_firstname = (dataRow.first_name.trim().substring(0,1).toUpperCase())+".";
        var short_middlename = (dataRow.middle_name.trim().substring(0,1).toUpperCase())+".";
        var name = dataRow.last_name + " "+short_firstname+" "+short_middlename;
      //  var row = [dataRow.last_name,dataRow.first_name,dataRow.middle_name,dataRow.basic_number,currentWorkersViews, currentParkName,$filter('date')(dataRow.date_added, "dd-MM-yyyy", "UTC")]
        var row = [name,dataRow.basic_number,currentWorkersViews, currentParkName,$filter('date')(dataRow.date_added, "dd-MM-yyyy", "UTC")];
        excellBuiler.addRow(row);
      }
      var resultXml = excellBuiler.getResult();
      var filename = "workersExport.xml";
      var contentType = "application/vnd.ms-excel";
      var linkElement = document.createElement('a');
      try {
        var blob = new Blob([resultXml], { type: contentType });
        var url = window.URL.createObjectURL(blob);
        linkElement.setAttribute('href', url);
        linkElement.setAttribute("download",filename);
        var clickEvent = new MouseEvent("click", {
          "view": window,
          "bubbles": true,
          "cancelable": false
        });
        linkElement.dispatchEvent(clickEvent);
      } catch (ex) {
        console.log(ex);
      }
    };

    function getWorkerViewById (id) {
      if(id===undefined||id === null){
        return '';
      }
    var workerViews = GlobalStorage.getStorage("WorkerViews");
          for (var j = 0; j<workerViews.length; j++) {
            if (workerViews[j].id == id) {
              return workerViews[j].name;
            }
          }
      return "";
    };
    function getParksNameById (id) {
      if(id===undefined||id === null){
        return '';
      }
      var parks = GlobalStorage.getStorage("Parks");
      for (var j = 0; j<parks.length; j++) {
        if (parks[j].id == id) {
          return parks[j].name;
        }
      }
      return "";
    };
    app.filter('WorkerViewsMap', function () {
      var workerViews = GlobalStorage.getStorage("WorkerViews");
      console.log("workerViews",workerViews);
      return function (id) {
       if (id === undefined||id === null){
          return '';
        }
        for (var i =0;i < workerViews.length;i++) {
          if (workerViews[i].id == id) {
            return workerViews[i].name;
          }
        }
        return '';
      };
    });

    app.filter('ParksMap', function () {
      var parks = GlobalStorage.getStorage("Parks");
      return function (id) {
        if (id === undefined||id === null){
          return '';
        }
        for (var i = 0; i < parks.length; i++) {
          if (parks[i].id == id) {
            return parks[i].name;
          }
        }
        return '';
      }});

    /**
     *
     * Class for build xml for excell.
     */
    function ExcellBuilder()
    {
      "use strict";
      var caption  =
      '<?xml version="1.0" encoding="UTF-8"?>'+"\r\n"+
      '<?mso-application progid="Excel.Sheet"?>'+
      '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"'+
      ' xmlns:o="urn:schemas-microsoft-com:office:office"'+
      ' xmlns:x="urn:schemas-microsoft-com:office:excel"'+
      ' xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"'+
      ' xmlns:html="http://www.w3.org/TR/REC-html40">'+
      '<DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">'+
      '<Author>чсм</Author>'+
      '<LastAuthor>чсм</LastAuthor>'+
      '<Created>2016-12-13T16:24:34Z</Created>'+
      '<Version>11.5606</Version>'+
      '</DocumentProperties>'+
      '<ExcelWorkbook xmlns="urn:schemas-microsoft-com:office:excel">'+
      '<WindowHeight>12270</WindowHeight>'+
      '<WindowWidth>21915</WindowWidth>'+
      '<WindowTopX>120</WindowTopX>'+
      '<WindowTopY>75</WindowTopY>'+
      '<ProtectStructure>False</ProtectStructure>'+
      '<ProtectWindows>False</ProtectWindows>'+
      '</ExcelWorkbook>'+
      '<Styles>'+
      '<Style ss:ID="Default" ss:Name="Normal">'+
      '<Alignment ss:Vertical="Bottom"/>'+
      '<Borders/>'+
      '<Font ss:FontName="Arial Cyr" x:CharSet="204"/>'+
      '<Interior/>'+
      '<NumberFormat/>'+
      '<Protection/>'+
      '</Style>'+
      '<Style ss:ID="s23">'+
      '<Borders>'+
      '<Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="2"/>'+
      '<Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="2"/>'+
      '<Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="2"/>'+
      '<Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="2"/>'+
      '</Borders>'+
      '<Alignment ss:Horizontal="Center" ss:Vertical="Bottom"/>'+
      '</Style>'+
      '</Styles>'+
      ' <Worksheet ss:Name="list">'+
      '<Table ss:ExpandedColumnCount="999" ss:ExpandedRowCount="9999999" x:FullColumns="1"'+
      ' x:FullRows="1">' +
      '<Column ss:Index="1" ss:AutoFitWidth="0" ss:Width="100.25"/>'+
      '<Column ss:Index="2" ss:AutoFitWidth="0" ss:Width="100.25"/>'+
      '<Column ss:Index="3" ss:AutoFitWidth="0" ss:Width="100.25"/>'+
      '<Column ss:Index="4" ss:AutoFitWidth="0" ss:Width="70"/>' +
      '<Column ss:Index="5" ss:AutoFitWidth="0" ss:Width="152.25"/>'+
      '<Column ss:Index="6" ss:AutoFitWidth="0" ss:Width="152.25"/>'+
      '<Column ss:Index="7" ss:AutoFitWidth="0" ss:Width="70"/>'+
      "\r\n";
      var rowsBuilder = '';
      var footer = '</Table>' + '<WorksheetOptions xmlns="urn:schemas-microsoft-com:office:excel">' +
      '<PageSetup>' +
      ' <PageMargins x:Bottom="0.984251969" x:Left="0.78740157499999996"' +
     ' x:Right="0.78740157499999996" x:Top="0.984251969"/>' +
     ' </PageSetup>' +
      '<Selected/>' +
     ' <ProtectObjects>False</ProtectObjects>' +
     ' <ProtectScenarios>False</ProtectScenarios>' +
     ' </WorksheetOptions>' +
     '</Worksheet></Workbook>';
      /**
       * Add row to builder
       */
      this.addRow = function (argument) {
        var row =  '<Row>';
        for (var i = 0; i < argument.length; i++) {
          row+='<Cell ss:StyleID="s23"><Data ss:Type="String">'+argument[i]+'</Data></Cell>'+"\r\n";
        }
        row+="</Row>\r\n";
        rowsBuilder+=row;
      };
      /**
       * Add merged cell in row
       * @param value - value of cell
       * @param count - count of merged cell
       */
      this.addMergedRow = function (value,count) {
        var row =  '<Row>';
          row+='<Cell ss:MergeAcross="'+count+'" ss:StyleID="s23"><Data ss:Type="String">'+value+'</Data></Cell>'+"\r\n";
        row+="</Row>\r\n";
        rowsBuilder+=row;
      };
      /**
       * @returns {string} - return result of Excell builder in string format
       */
      this.getResult = function ()
      {
        return caption + rowsBuilder + footer;
      }
    }

  }]);

