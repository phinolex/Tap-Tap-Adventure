
define(['jquery'], function() {
  var KkHandler = Class.extend({
    init: function(){
      this.kungLog = $('#kungLog');
    },
    add: function(message, player){
      var self = this;
      var el = $("<p>" + message + "</p>");
      $(el).appendTo(this.kungLog);
      $(this.kungLog).scrollTop(999999);
    },
  });

  return KkHandler;
});
