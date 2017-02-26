define(function() {
    var TabBook = Class.extend({
        init: function(id) {
            var self = this;

            self.id = id;
            self.body = $(id);
            self.pages = [];
            self.pageIndex = -1;

            self.openHandler = null;
        },

        getPageCount: function() {
            return this.pages.length;
        },

        getPageIndex: function() {
            return this.pageIndex;
        },

        getActivePage: function() {
            return this.pageIndex >= 0 ? this.pages[this.pageIndex] : null;
        },

        setPageIndex: function(pageIndex) {
            var self = this;

            if (self.pageIndex >= 0)
                self.pages[self.pageIndex].setVisible(false);

            if (pageIndex >= 0 && pageIndex < self.pages.length) {
                if (self.openHandler ? self.openHandler(self, pageIndex) : true) {
                    self.pageIndex = pageIndex;
                    self.pages[self.pageIndex].setVisible(true);
                }
            } else
                self.pageIndex = -1;
        },

        setActivePage: function(activePage) {
            var self = this,
                index = self.pages.indexOf(activePage);

            if (index >= 0)
                self.setPageIndex(index);
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