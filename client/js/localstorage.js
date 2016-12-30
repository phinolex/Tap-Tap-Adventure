define(function() {
    var localStorage = window.localStorage,
        storageName = 'data';

    var Storage = Class.extend({
        init: function() {
            this.restore();
        },

        createData: function() {
            return {
                playedBefore: false,
                player: {
                    username: '',
                    password: ''
                },
                settings: {
                    showPlayerNames: true,
                    frameColour: 'default',
                    musicOn: true,
                    sfxOn: true,
                    isCentered: true,
                    disableAnimatedTiles: false,
                    version: 0
                }
            };
        },

        save: function() {
            localStorage.setItem(storageName, JSON.stringify(this.data));
            return this;
        },

        restore: function() {
            if (!localStorage.data)
                this.data = this.createData();
            else
                this.data = JSON.parse(localStorage.getItem(storageName));
        },

        clear: function() {
            localStorage.removeItem(storageName);
            this.data = this.createData();

            return this;
        },

        playedBefore: function() {
            return this.data.playedBefore;
        },

        setPlayer: function(name, value) {
            if ( this.data.player.hasOwnProperty(name) )
                this.data.player[name] = value;

            this.save();
            return this;
        },

        setOption: function(option, value) {
            if ( this.data.settings.hasOwnProperty(option) )
                data.settings[option] = value;

            this.save();
            return this;
        },

        getPlayer: function() {
            return this.data.player;
        },

        getSettings: function() {
            return this.data.settings;
        }
    });

    return Storage;
});
