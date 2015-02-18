define(function() {
  var TabBook = Class.extend({
    init: function(id) {
      this.id = id;
      this.body = $(id);
      this.pages = [];
      this.pageIndex = -1;

      this.openHandler = null;
    },

    getPageCount: function() {
      return this.pages.length;
    },
    getPageIndex: function() {
      return this.pageIndex;
    },
    setPageIndex: function(value) {
      if(this.pageIndex >= 0) {
        this.pages[this.pageIndex].setVisible(false);
      }
      if((value >= 0) && (value < this.pages.length)) {
        var done = this.openHandler ? this.openHandler(this, value) : true;
        if(done) {
          this.pageIndex = value;
          this.pages[this.pageIndex].setVisible(true);
        }
      } else {
        this.pageIndex = -1;
      }
    },
    getActivePage: function() {
      return this.pageIndex >= 0 ? this.pages[this.pageIndex] : null;
    },
    setActivePage: function(value) {
      var index = this.pages.indexOf(value);
      if(index >= 0) {
        this.setPageIndex(index);
      }
    },

    add: function(page) {
      page.setParent(this);
      this.pages.push(page);
    },

    onOpen: function(handler) {
      this.openHandler = handler;
    }
  });

  return TabBook;
});
