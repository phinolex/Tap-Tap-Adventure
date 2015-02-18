define(function() {
  var TabButton = Class.extend({
    init: function(id, page) {
      this.id = id;
      this.body = $(id);
      this.page = page;

      this.visibleChangeHandler = null;

      this.body.click(function(event) {
        page.active();
      });
    },

    getVisible: function() {
      return this.body.attr('class') === 'active';
    },
    setVisible: function(value) {
      if(value) {
        this.body.addClass('active');
      } else {
        this.body.removeClass('active');
      }
    }
  });

  var TabPage = Class.extend({
    init: function(id, buttonId) {
      this.id = id;
      this.body = $(id);
      this.button = buttonId ? new TabButton(buttonId, this) : null;
      this.parent = null;

      this.activeHandler = null;
    },

    getParent: function() {
      return this.parent;
    },
    setParent: function(value) {
      this.parent = value;
    },
    getVisible: function() {
      return this.body.css('display') === 'block';
    },
    setVisible: function(value) {
      if(this.button) {
        this.button.setVisible(value);
      }
      this.body.css('display', value ? 'block' : 'none');

      if(this.visibleChangeHandler) {
        this.visibleChangeHandler(self, value);
      }
    },

    active: function() {
      if(this.parent) {
        this.parent.setActivePage(this);
      }
    },

    onVisibleChange: function(handler) {
      this.visibleChangeHandler = handler;
    }
  });

  return TabPage;
});
