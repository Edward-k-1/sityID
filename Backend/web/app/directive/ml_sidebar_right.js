app.directive('mlSidebarRight', function () {
  return {
    restrict: "E",
    template: '<div class="ml-sidebar-right""></div>',
    replace: true,
    transclude: true,
    link: function (scope, element, attrs, ctrl, transclude) {
      transclude(function (clone) {
        element.append(clone);
      });
    },
  }
});

app.directive("mlSidebarContentRight", function () {
  return {
    restrict: "E",
    template: '<div class="ml-content-right"  ></div>',
    replace: true,
    transclude: true,
    link: function (scope, element, attrs, ctrl, transclude) {
      transclude(function (clone) {
        element.append(clone);
      });
    },
  }
});
app.directive("mlSidebarPanelRight", function () {
  return {
    restrict: "E",
    template: '<div class="ml-panel-right " style="flex-basis:{{current_size}}px;"' +
    '  ng-class="getClassTransion()" >' +
    '<div class="panel-content"  ng-transclude></div>' +
    '<div class="panel-slider" ng-mouseup ="panelMouseDisable($event)" ng-mouseleave ="panelMouseDisable($event)"' +
    ' ng-mousedown="panelMouseDown($event)" ng-mousemove="panelMouseMove($event)" ng-class="getClassCollapsed()" >' +
    '<div class="ml-panel-button"  ng-mousedown="stopPropagationB($event)">' +
    '<button ng-click="trigerPanel()" >' +
    '</button>' +
    '</div></div>' +
    '</div>',
    replace: true,
    transclude: true,
    scope: {
      size: '@',
    },

    link: function (scope, element, attrs, ctrl) {
      scope.current_size = parseInt(scope.size);
      scope.current_size_backup = parseInt(scope.size);
      scope.mouseflag = false;
      scope.is_colapsed = false;
      scope.panelMouseMove = function (event) {
        if (scope.mouseflag == false || scope.is_colapsed == true) {
          return;
        }
        var tmp_size = scope.current_size - event.originalEvent.movementX;
        if (tmp_size > 300 && event.originalEvent.movementX < 0) {
          return
        }
        if (tmp_size < 100 && event.originalEvent.movementX > 0) {
          return
        }
        scope.current_size = tmp_size;
      };
      scope.panelMouseDown = function (event) {
        scope.mouseflag = true;
      };
      scope.panelMouseDisable = function (event) {
        scope.mouseflag = false;
      }
      scope.trigerPanel = function () {
        scope.is_colapsed = !scope.is_colapsed;
        if (scope.is_colapsed == true) {
          scope.current_size_backup = scope.current_size;
          scope.current_size = 0;
        }
        else {
          scope.current_size = scope.current_size_backup;
        }
      };
      scope.getClassTransion = function () {
        return scope.mouseflag ? '' : 'class-transition';
      };
      scope.getClassCollapsed = function () {
        return scope.is_colapsed ? ' panel-collapsed' : ' ';
      };
      scope.stopPropagationB = function (e) {
        e.stopPropagation();
      }
    },
  }
});