app.directive('mlSelect', function () {
  return {
    templateUrl: "/app/templates/directive/ml-select.tpl.html",
    restrict: "E",
    replace: true,
    scope: {
      selected: "=",
      field: "@",
      options: "=",
      label: "=",
      placeholderInput: "=",
      buttonText: '='

    },
    link: function ($scope, element, attrs, ctrl, transclude) {
      if ($scope.options == undefined) {
        console.error("Options is undefined");
        return;
      }
      $scope.limitItems = 10;
      $scope.addedLimit = 30;
      $scope.filterList = [];
      $scope.selected;
      $scope.hasField = $scope.field !== undefined;
      $scope.select = {filter: "", selected: $scope.selected};

      function getCurrentItem(options, current) {
        var currentItem = [];
        if (current === undefined || current === null) {
          return currentItem
        }

        for (var i = 0; i < options.length; i++) {
          var item = options[i];
          if (current === item.id) {
            currentItem.push(item);
            return currentItem;
          }
        }
      }

      if ($scope.hasOwnProperty("selected")) {
        $scope.filterList = getCurrentItem($scope.options, $scope.selected);
      }
      function filterItemsWithTextFilter(options, count, txtFilter, field) {
        var result = [];
        var textFilter = txtFilter !== undefined ? txtFilter.toLowerCase() : "";
        var currentCount = 0;
        for (var i = 0; i < options.length; i++) {
          var currentText = options[i][field].toLowerCase();
          if (currentText.match(textFilter)) {
            currentCount++;
            result.push(options[i]);
          }
          if (currentCount == count) {
            break;
          }
        }
        return result;
      }


      function filterItems(options, count) {
        var result = [];
        var currentCount = 0;
        for (var i = 0; i < options.length; i++) {
          currentCount++;
          result.push(options[i]);
          if (currentCount == count) {
            break;
          }
        }
        return result;
      }

      $scope.onMdOnClose = function () {
        $scope.selected = $scope.select.selected;
        $scope.filterList = getCurrentItem($scope.options, $scope.selected);
        $scope.select.filter = "";
      };

      $scope.onMdOnOpen = function () {
        startFiltering();
      };
      $scope.loadMoreItems = function () {
        $scope.limitItems += $scope.addedLimit;
        if ($scope.hasField) {
          $scope.filterList = filterItemsWithTextFilter
          ($scope.options, $scope.limitItems, $scope.select.filter, $scope.field);
        }
        else {
          $scope.filterList = filterItems($scope.options, $scope.limitItems);
        }
      }

      $scope.changeInputFilterItems = function () {
        startFiltering();
      };

      var listenerSelectedChange = function (newValue, oldValue, scope) {
        if (newValue === oldValue) {
          return;
        }
        $scope.filterList = getCurrentItem($scope.options, $scope.selected);
        $scope.select.selected = $scope.selected;
      };
      $scope.$watch('selected', listenerSelectedChange);

      function startFiltering() {
        $scope.limitItems = 10;
        if ($scope.hasField) {
          $scope.filterList = filterItemsWithTextFilter
          ($scope.options, $scope.limitItems, $scope.select.filter, $scope.field);
        }
        else {
          $scope.filterList = filterItems($scope.options, $scope.limitItems);
        }
      }
    }
  }
});