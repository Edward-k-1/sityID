/****
 * Service for displaying full popup loader
 */
app.service('FullPopupLoader', function($compile,$rootScope,$interval) {
  var self = this;
  var childscope ;
  var count =0;

  self.showPopup = function ()
  {
    if(count>0)
    {
      count++;
      return
    }

    childscope = $rootScope.$new();
    var template = '<div class="popup-loader" style="display: none" id="popup-loader"><div class="content-popup-loader">' +
      '<md-progress-circular  md-diameter="96"></md-progress-circular>' +
      '</div></div>';
    angular.element(document).find('body').append($compile(template)(childscope));
    $('#popup-loader').fadeIn(100);
    count++;
  }
  self.hidePopup = function ()
  {
    count--;
    if(count>0)
    {
      return;
    }
    if (count == 0) {
      $('#popup-loader').fadeOut(100, function () {
        childscope.$destroy();
        $('#popup-loader').remove();
      });
      return;
    }
    count = 0;

  }
});
