/**
 * Created by greenTransistor on 07.03.17
 */
const monthNames = ['Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень', 'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'];

 app.controller('CalendarEditController', ['$scope','OrdersRestService','$filter','$mdDialog','$rootScope','row',
    function ($scope,OrdersRestService,$filter,$mdDialog,$rootScope,row, EditedDataStorage) {
        $scope.userData = $rootScope.UserData
        $scope.lang = $rootScope.lang;

        $scope.month = row.entity.month;
        $scope.year = row.entity.year;

        $scope.monthHeader = monthNames[$scope.month - 1] + ' ' + $scope.year;

        /*$scope.obj = {
            month: $scope.month,
            year: $scope.year
        };*/

        $scope.hide = function() {
            $mdDialog.hide();
        };

        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        $scope.answer = function(answer) {
            $mdDialog.hide(answer);
        };

        var month = new Date($scope.year, $scope.month - 1, 1);
        $scope.firstDayOfMonthInWeek = (month.getDay() || 7) - 1;

        $scope.calendarTable = [[], [], [], [], [], []];
        for (var i = 0; i < 6; i++) for (var j = 0; j < 7; j++) {
            $scope.calendarTable[i][j] = {
                value: '',
                type: 0,
                number: 0
            };
        }

        function getDayPosition(dayOfMonth) {
            var dayWithOffset = dayOfMonth + $scope.firstDayOfMonthInWeek - 1;
            return {
                column: (dayWithOffset % 7),
                row: Math.floor(dayWithOffset / 7)
            };
        }

        $scope.changeDayType = function(dayNumber) {
            if (!dayNumber) return;

            console.log('changeDayType', dayNumber);
            var dayPosition = getDayPosition(dayNumber);
            var oldType = $scope.calendarTable[dayPosition.row][dayPosition.column].type;
            if (oldType === 1) {
                $scope.calendarTable[dayPosition.row][dayPosition.column].type = 2;
            } else {
                $scope.calendarTable[dayPosition.row][dayPosition.column].type = 1;
            }

            var resource = OrdersRestService.getCalendarResource();

            if ($scope.data[dayNumber]) {
                resource.delete(
                    {'id': $scope.data[dayNumber].id},
                    saveDayType,
                    function(error) {console.log(error);}
                );
            } else {
                saveDayType();
            }

            function saveDayType() {
                resource.save(
                    {
                        'date': ($scope.year + '-' + $scope.month + '-' + dayNumber),
                        'type': $scope.calendarTable[dayPosition.row][dayPosition.column].type
                    },
                    function(data, response) {
                        console.log(data);
                        $scope.data[dayNumber] = {
                            id: data.id,
                            type: data.type
                        }
                        console.log(data, data.id, JSON.stringify($scope.data[dayNumber]));
                    },
                    function(error) {console.log(error);}
                );
            }
        }

        const SATURDAY = 5;
        const SUNDAY = 6;

        $scope.loadData = function() {
            var resource = OrdersRestService.getCalendarResource();
            resource.query(/*$scope.obj*/null, function(data, response) {
                console.log('Calendar data:', data);
                var dayOfWeek, dayOfMonth, dayType, dayPosition;

                $scope.data = [];

                for (var i = data.length - 1; i >= 0; i--) {
                    parsedDate = data[i].date.split('-');
                    if (parsedDate[0] != $scope.year || (parsedDate[1] | 0) != ($scope.month | 0)) {
                        continue;
                    }
                    var dayNumber = parsedDate[2];
                    $scope.data[dayNumber | 0] = {
                        id: data[i].id,
                        type: data[i].type
                    }
                }

                do {
                    dayOfMonth = month.getDate();
                    dayPosition = getDayPosition(dayOfMonth);
                    dayOfWeek = dayPosition.column;
                    if ($scope.data[dayOfMonth]) {
                        dayType = $scope.data[dayOfMonth].type;
                    } else {
                        dayType = (dayOfWeek === SATURDAY || dayOfWeek === SUNDAY ? 2 : 1);
                    }
                    $scope.calendarTable[dayPosition.row][dayPosition.column] = {
                        value: dayOfMonth,
                        type: dayType,
                        number: dayOfMonth
                    };
                    month.setDate(dayOfMonth + 1);
                } while (month.getDate() !== 1);

                console.log('$scope.data:', $scope.data);
            }, function(error) {console.log(error);});
        }

        $scope.loadData();
    }]);

/*app.controller('CalendarEditController', ['$scope','$http','OrdersRestService','FullPopupLoader','customUnixTimeFilter','$filter','$timeout',
    '$mdDialog','$rootScope','GlobalStorage','row', 'EditedDataStorage',
    function ($scope,$http,OrdersRestService,FullPopupLoader,customUnixTimeFilter,$filter,$timeout,$mdDialog,$rootScope,GlobalStorage,row, EditedDataStorage) {
        $scope.userData = $rootScope.UserData;

        $scope.dayTypes = {
            1: 'Робочий',
            2: 'Вихідний'
        };
    
        $scope.obj = {
            month:row.month,
            year:row.year
        };

        $scope.data = row;
        $scope.lang = $rootScope.lang;

        $scope.date = $filter('date')(new Date(), 'yyyy-MM-dd');

        $scope.hide = function() {
            $mdDialog.hide();
        };

        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        $scope.answer = function(answer) {
            $mdDialog.hide(answer);
        };

        EditedDataStorage.createNewStorage('calendarStorage');

        $scope.gridOptions = new GridController(null, EditedDataStorage.getStorage('calendarStorage'));
        $scope.gridOptions.enableFiltering = false;
        $scope.gridOptions.enableColumnMenus = false;
        $scope.gridOptions.rowHeight = 35;

        $scope.displayOrderDate = new Date();

        $scope.gridOptions.filters.Users = [];

        $scope.gridOptions.columnVirtualizationThreshold = 20;
        $scope.gridOptions.virtualizationThreshold = 200;

        app.filter('dayTypeFilter', function() {
            return function(value) {
                return $scope.dayTypes[value];
            }
        });

        $scope.gridOptions.initColumnDefs = function () {
            $scope.gridOptions.columnDefs = [
                {name:'id',field:'id',langName:'id',category:"column0",displayName:'id',enableCellEdit:false,width:50,pinnedLeft:true,visible:false},
                {name:'date',field:'date',langName:'Date',category:"column0",displayName:'Date',enableCellEdit:false,width:100,pinnedLeft:true,visible:true},
                {name:'type', minWidth: 100, field:'type', langName:'Type', category:"column0", displayName:'Type', enableCellEdit:true, cellFilter:'dayTypeFilter', editableCellTemplate: 'ui-grid/dropdownEditor', editDropdownOptionsArray: [{id: 1, display: 'Робочий'}, {id: 2, display: 'Вихідний'}], editDropdownIdLabel: 'id', editDropdownValueLabel: 'display'}
            ]
        }

        $scope.gridOptions.initColumnDefs();

        $scope.gridOptions.onRegisterApi = function(gridApi){
            $scope.gridApi = gridApi;
            gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
                if (newValue === oldValue) {
                    return;
                }
                var resource = OrdersRestService.getCalendarResource();
                resource.save(rowEntity, function(data, response) {
                    resource.delete(rowEntity);
                }, function(error) {console.log(error);})
            });
        };

        $scope.loadData = function() {
            var resource = OrdersRestService.getCalendarResource();
            resource.query($scope.obj, function(data, response) {
                console.log('11-data-11',data);
                $scope.gridOptions.data = data;
                $scope.gridOptions.updateData();
            }, function(error) {console.log(error);});
        }

        $scope.loadData();

    }]);*/