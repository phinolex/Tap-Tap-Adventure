/* global Types */

define(['dialog'], function(Dialog) {
    ItemInfoDialog = Dialog.extend({
        init: function(game) {
            this._super(game, '#iteminfo');
            
        },
        show: function() {
            var htmlStr = '';
            var i = 0;
            var x = 16;
            var y = 16;
            
            for(var i = 0; i < this.game.dialogs.length; i++) {
                if((this.game.dialogs[i] != this) && this.game.dialogs[i].visible){
                    this.game.dialogs[i].hide();
                }
            }
            if (this.game.renderer) {
                if (this.game.renderer.mobile) {
                    this.scale = 1;
                } else {
                    this.scale = this.game.renderer.getScaleFactor();
                }
            } else {
                this.scale = 2;
            }
            var rankedArmors = null;
            var rankedWeapons = null;

            if(this.game.player.kind === Types.Entities.WARRIOR){
                rankedArmors = Types.rankedArmors;
                rankedWeapons = Types.rankedWeapons;
            } else{
                rankedArmors = Types.rankedArcherArmors;
                rankedWeapons = Types.rankedArcherWeapons;
            }

            switch (this.scale) {

                case 1:

                    for (i = 0; i < Math.floor(this.game.player.level / 2); i++)  {
                        var imageUrl = "img/" + this.scale + "/item-" + Types.getKindAsString(rankedArmors[i]) + ".png";
                        htmlStr += '<div style="position: absolute; top: ' + y + 'px;';
                        htmlStr += 'left: ' + x + 'px; ';
                        htmlStr += 'width: 16px; height: 16px; background-image: url(';
                        htmlStr += "'" + imageUrl + "');"
                        htmlStr += 'background-color: rgba(128, 128, 128, 0.5);';
                        htmlStr += 'border: 1px solid #9c9898;"';
                        htmlStr += 'title="' + Types.getName(rankedArmors[i]) + ': Armor +' + (i + 1) + '"></div>';

                        if (i === rankedArmors.length - 1) {
                            break;
                        }

                        x += 16 + 4;
                        if (x > 450 - 16 - 4) {
                            x = 8;
                            y += 16 + 4;
                        }
                    }
                    x = 16;
                    y += 16 + 16;

                    for (i = 0; i < Math.floor(this.game.player.level / 2); i++) {
                        var imageUrl = "img/" + this.scale + "/item-" + Types.getKindAsString(rankedWeapons[i]) + ".png";
                        htmlStr += '<div style="position: absolute; top: ' + y + 'px;';
                        htmlStr += 'left: ' + x + 'px; ';
                        htmlStr += 'width: 16px; height: 16px; background-image: url(';
                        htmlStr += "'" + imageUrl + "');"
                        htmlStr += 'background-color: rgba(128, 128, 128, 0.5);';
                        htmlStr += 'border: 1px solid #9c9898;"';
                        htmlStr += 'title="' + Types.getName(rankedWeapons[i]) + ': Attack +' + (i + 1) + '"></div>';

                        if (i === rankedWeapons.length - 1) {
                            break;
                        }

                        x += 16 + 4;
                        if (x > 450 - 16 - 4) {
                            x = 16;
                            y += 16 + 4;
                        }
                    }

                    $('#iteminfo').html(htmlStr);
                    $('#iteminfo').height(y + 8);


                    break;

                case 2:

                    for (i = 0; i < Math.floor(this.game.player.level / 2); i++)  {
                        var imageUrl = "img/" + this.scale + "/item-" + Types.getKindAsString(rankedArmors[i]) + ".png";
                        htmlStr += '<div style="position: absolute; top: ' + y + 'px;';
                        htmlStr += 'left: ' + x + 'px; ';
                        htmlStr += 'width: 32px; height: 32px; background-image: url(';
                        htmlStr += "'" + imageUrl + "');"
                        htmlStr += 'background-color: rgba(128, 128, 128, 0.5);';
                        htmlStr += 'border: 1px solid #9c9898;"';
                        htmlStr += 'title="' + Types.getName(rankedArmors[i]) + ': Armor +' + (i + 1) + '"></div>';

                        if (i === rankedArmors.length - 1) {
                            break;
                        }

                        x += 32 + 8;
                        if (x > 900 - 32 - 8) {
                            x = 16;
                            y += 32 + 8;
                        }
                    }
                    x = 16;
                    y += 32 + 32;

                    for (i = 0; i < Math.floor(this.game.player.level / 2); i++) {
                        var imageUrl = "img/" + this.scale + "/item-" + Types.getKindAsString(rankedWeapons[i]) + ".png";
                        htmlStr += '<div style="position: absolute; top: ' + y + 'px;';
                        htmlStr += 'left: ' + x + 'px; ';
                        htmlStr += 'width: 32px; height: 32px; background-image: url(';
                        htmlStr += "'" + imageUrl + "');"
                        htmlStr += 'background-color: rgba(128, 128, 128, 0.5);';
                        htmlStr += 'border: 1px solid #9c9898;"';
                        htmlStr += 'title="' + Types.getName(rankedWeapons[i]) + ': Attack +' + (i + 1) + '"></div>';

                        if (i === rankedWeapons.length - 1) {
                            break;
                        }

                        x += 32 + 8;
                        if (x > 900 - 32 - 8) {
                            x = 16;
                            y += 32 + 8;
                        }
                    }

                    $('#iteminfo').html(htmlStr);
                    $('#iteminfo').height(y + 16);
                    break;

                case 3:

                    for (i = 0; i < Math.floor(this.game.player.level / 2); i++)  {
                        var imageUrl = "img/" + this.scale + "/item-" + Types.getKindAsString(rankedArmors[i]) + ".png";
                        htmlStr += '<div style="position: absolute; top: ' + y + 'px;';
                        htmlStr += 'left: ' + x + 'px; ';
                        htmlStr += 'width: 48px; height: 48px; background-image: url(';
                        htmlStr += "'" + imageUrl + "');"
                        htmlStr += 'background-color: rgba(128, 128, 128, 0.5);';
                        htmlStr += 'border: 1px solid #9c9898;"';
                        htmlStr += 'title="' + Types.getName(rankedArmors[i]) + ': Armor +' + (i + 1) + '"></div>';

                        if (i === rankedArmors.length - 1) {
                            break;
                        }

                        x += 48 + 12;
                        if (x > 1350 - 48 - 12) {
                            x = 24;
                            y += 48 + 12;
                        }
                    }
                    x = 24;
                    y += 48 + 48;

                    for (i = 0; i < Math.floor(this.game.player.level / 2); i++) {
                        var imageUrl = "img/" + this.scale + "/item-" + Types.getKindAsString(rankedWeapons[i]) + ".png";
                        htmlStr += '<div style="position: absolute; top: ' + y + 'px;';
                        htmlStr += 'left: ' + x + 'px; ';
                        htmlStr += 'width: 48px; height: 48px; background-image: url(';
                        htmlStr += "'" + imageUrl + "');"
                        htmlStr += 'background-color: rgba(128, 128, 128, 0.5);';
                        htmlStr += 'border: 1px solid #9c9898;"';
                        htmlStr += 'title="' + Types.getName(rankedWeapons[i]) + ': Attack +' + (i + 1) + '"></div>';

                        if (i === rankedWeapons.length - 1) {
                            break;
                        }

                        x += 48 + 12;
                        if (x > 1350 - 48 - 12) {
                            x = 24;
                            y += 48 + 12;
                        }
                    }

                    $('#iteminfo').html(htmlStr);
                    $('#iteminfo').height(y + 24);

                    break;

            }
            if(this.button) {

                this.button.down();
            }

            this._super();
        },
        hide: function() {
            this._super();

            if(this.button) {

                this.button.up();
            }
        }
    });

    return ItemInfoDialog;
});
