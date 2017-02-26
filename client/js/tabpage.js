define(function() {

    var TabPage = Class.extend({
        init: function(id, buttonId) {
            var self = this;

            self.id = id;
            self.body = $(id);
            self.button = buttonId ? new TabButton(buttonId, this) : null;
            self.parent = null;

            self.activeHandler = null;
        },

        getParent: function() {
            return this.parent;
        },

        getVisible: function() {
            return this.body.css('display') === 'block';
        },

        setParent: function(parent) {
            this.parent = parent;
        },

        setVisible: function(isVisible) {
            var self = this;

            if (self.button)
                self.button.setVisible(isVisible);

            self.body.css('display', isVisible ? 'block' : 'none');

            if (self.visibleChangeHandler)
                self.visibleChangeHandler(self, isVisible);
        },

        active: function() {
            var self = this;

            if (self.parent)
                self.parent.setActivePage(self);
        },

        onVisibleChange: function(handler) {
            this.visibleChangeHandler = handler;
        }
    });

    var TabButton = Class.extend({
        init: function(id, page) {
            var self = this;

            self.id = id;
            self.body = $(id);
            self.page = page;

            self.visibleChangeHandler = null;

            self.body.click(function(event) {
                page.active();
            });
        },

        getVisible: function() {
            return this.body.attr('class') === 'active';
        },

        setVisible: function(isVisible) {
            var self = this;

            if (isVisible)
                self.body.addClass('active');
            else
                self.body.removeClass('active');
        }
    });


    return TabPage;
});
