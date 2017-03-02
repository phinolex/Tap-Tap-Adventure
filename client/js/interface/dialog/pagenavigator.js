/**
 * Created by flavius on 2017-02-24.
 */

define(['jquery'], function($) {
    var PageNavigator = Class.extend({
        init: function(game, navigatorType) {
            var self = this;

            self.game = game;
            self.navigatorType = navigatorType;
            self.body = $('#' + self.navigatorType + 'PageNavigator');
            self.nextButton = $('#' + self.navigatorType + 'PageNavigatorMoveNextButton');
            self.previousButton = $('#' + self.navigatorType + 'PageNavigatorMovePreviousButton');
            self.changeHandler = null;
            self.scale = self.game.getScaleFactor();

            if (self.isStore()) {
                self.numbers = [];

                for (var i = 0; i < 5; i++)
                    self.numbers.push($('#storeDialogPageNavigatorNumber' + i));
            }

            self.loadCSSData();
        },

        loadCSSData: function() {
            var self = this;

            self.nextButton.click(function(event) {
                if (self.index < self.count)
                    self.setIndex(self.index + 1);
            });

            self.previousButton.click(function(event) {
                if (self.index > 1)
                    self.setIndex(self.index - 1);
            })
        },

        loadStore: function() {
            var self = this;
            
            self.body.css({
                'position': 'absolute',
                'left': '' + (51 * self.scale) + 'px',
                'top': '' + (175 * self.scale) + 'px',
                'width': '' + (138 * self.scale) + 'px',
                'height': '' + (20 * self.scale) + 'px'
            });

            self.nextButton.css({
                'position': 'absolute',
                'left': '' + (79 * self.scale) + 'px',
                'top': '' + self.scale + 'px',
                'width': '' + (8 * self.scale) + 'px',
                'height': '' + (9 * self.scale) + 'px'
            });

            self.previousButton.css({
                'position': 'absolute',
                'left': '0px',
                'top': '' + self.scale + 'px',
                'width': '' + (8 * self.scale) + 'px',
                'height': '' + (9 * self.scale) +'px'
            });

            for (var i = 0; i < self.numbers.length; i++) {
                self.numbers[i].css({
                    'position': 'absolute',
                    'left': '' + ((15 * self.scale) + (i * (self.scale * 12))) + 'px',
                    'top': '0px',
                    'width': (9 * self.scale) + 'px',
                    'height': (10 * self.scale) + 'px'
                });
            }

            self.numbers[2].attr('class', 'storeDialogPageNavigatorNumberS');

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

        isStore: function() {
            return this.navigatorType == 'storeDialog';
        },

        setCount: function(count) {
            var self = this;

            self.count = count;

            log.info('Count: ' + self.count);

            if (self.isStore()) {
                self.modifyRounded(3, count);
                self.modifyModulo(4, count);
            }
        },

        setIndex: function(index) {
            var self = this;

            self.index = index;

            if (self.isStore()) {
                self.modifyRounded(0, index);
                self.modifyModulo(1, index);
            }

            self.previousButton.attr('class', self.index > 1 ? 'enabled' : '');
            self.nextButton.attr('class', self.index < self.count ? 'enabled' : '');

            if (self.changeHandler)
                self.changeHandler(self);
        },

        setVisible: function(isVisible) {
            return this.body.css('display', isVisible ? 'block' : 'none');
        },

        modifyRounded: function(item, index) {
            this.numbers[item].attr('class', 'storeDialogPageNavigatorNumber' + ~~(index / 10))
        },

        modifyModulo: function(item, index) {
            this.numbers[item].attr('class', 'storeDialogPageNavigatorNumber' + (index % 10));
        },

        onChange: function(handler) {
            this.changeHandler = handler;
        }
    });

    return PageNavigator;
});