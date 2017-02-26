/**
 * Created by flavius on 2017-02-24.
 */

define(['jquery'], function($) {
    var PageNavigator = Class.extend({
        init: function() {
            var self = this;

            self.body = $('#characterDialogFramePageNavigator');
            self.previousButton = $('#characterDialogFramePageNavigatorMovePreviousButton');
            self.nextButton = $('#characterDialogFramePageNavigatorMoveNextButton');

            self.changeHandler = null;

            self.previousButton.click(function(event) {
                if (self.index > 1)
                    self.setIndex(self.index - 1);
            });

            self.nextButton.click(function(event) {
                if (self.index < self.count)
                    self.setIndex(self.index + 1);
            });
        },

        getCount: function() {
            return this.count;
        },

        getIndex: function() {
            return this.index;
        },

        getVisible: function() {
            return this.body.css('display') === 'block';
        },

        setCount: function(count) {
            this.count = count;
        },

        setIndex: function(index) {
            var self = this;

            self.index = index;

            self.previousButton.attr('class', self.index > 1 ? 'enabled' : '');
            self.nextButton.attr('class', self.index < self.count ? 'enabled' : '');

            if (self.changeHandler)
                self.changeHandler(self);
        },

        setVisible: function(isVisible) {
            this.body.css('display', value ? 'block' : 'none');
        },

        onChange: function(handler) {
            this.changeHandler = handler;
        }
    });

    return PageNavigator;
});