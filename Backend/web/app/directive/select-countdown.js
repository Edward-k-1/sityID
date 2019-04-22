app.directive('selectCountdown', function ($interval) {
  return {
    templateUrl: "/app/templates/directive/select-countdown.tpl.html",
    restrict: "E",
    replace: true,
    scope: {
      timerCallback: '&',
      lang: '='
    },
    link: function (scope, element, attrs, ctrl, transclude) {
      var selectUpdater = null;
      var currentInterval = 0;
      scope.selectTime = 0;
      var currentOptions =  null;

      /***
       *
       * @param value - second
       * @returns {string} - formatted time string
       */
      function formateTextSelect(value) {
        var returnedString = '';
        if (Math.floor(value / 60) > 0) {
          returnedString += Math.floor(value / 60) + ' ' + scope.lang.words['minute'] + ' ';
        }
        returnedString += (value % 60) + ' ' + scope.lang.words['second'];
        return returnedString;
      }

      function createSelectOption(scope) {
        var options = [
          {value: 0, text: scope.lang.words['Not Updating']},
          {value: 5, text: "5 " + scope.lang.words['second']},
          {value: 10, text: "10 " + scope.lang.words['second']},
          {value: 30, text: "30 " + scope.lang.words['second']},
          {value: 60, text: "1 " + scope.lang.words['minute']},
          {value: 120, text: "2 " + scope.lang.words['minute']}
        ];
        return options;
      }

      /** copy of data for manipulate */
      scope.onMdOnOpen = function () {
        if (selectUpdater !== null) {
          $interval.cancel(selectUpdater);
        }
        scope.selectOptions = createSelectOption(scope);
      };
      scope.changeTime = function () {

        for (var i = 0; i < scope.selectOptions.length; i++) {
          if (scope.selectOptions[i].value === scope.selectTime) {
            currentOptions = scope.selectOptions[i];
            break;
          }
        }
        currentInterval = scope.selectTime;
        if (scope.selectTime == 0) {
          selectUpdater = null;
          return;
        }
        selectUpdater = $interval(function () {
          currentInterval--;
          currentOptions.text = formateTextSelect(currentInterval);
          if (currentInterval === 0) {
            currentInterval = scope.selectTime;
            if (typeof scope.timerCallback === "function") {
              scope.timerCallback();
            }
            currentOptions.text = ' ' + scope.lang.words['Updating'];
          }
        }, 1000);
      }
      scope.$on('$destroy', function () {
        if (selectUpdater !== null) {
          $interval.cancel(selectUpdater);
        }
      });
    },
  }
});