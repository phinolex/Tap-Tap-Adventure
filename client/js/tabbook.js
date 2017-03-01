define(function() {
    var TabBook = Class.extend({
        init: function(id) {
            var self = this;

            self.id = id;
            self.body = $(id);
            self.pages = [];
            self.index = -1;

            self.openHandler = null;
        },

        getPageCount: function() {
            return this.pages.length;
        },

        getPageIndex: function() {
            return this.index;
        },

        getActivePage: function() {
            return this.index >= 0 ? this.pages[this.index] : null;
        },

        setIndex: function(index) {
            var self = this;

            if (self.index >= 0)
                self.pages[self.index].setVisible(false);

            if (index >= 0 && index < self.pages.length) {
                if (self.openHandler ? self.openHandler(self, index) : true) {
                    self.index = index;
                    self.pages[self.index].setVisible(true);
                }
            } else
                self.index = -1;
        },

        setActivePage: function(activePage) {
            var self = this,
                index = self.pages.indexOf(activePage);

            if (index >= 0)
                self.setIndex(index);
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