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

            var rankedArmors = null;
            var rankedWeapons = null;

            if(this.game.player.kind === Types.Entities.WARRIOR){
                rankedArmors = Types.rankedArmors;
                rankedWeapons = Types.rankedWeapons;
            } else{
                rankedArmors = Types.rankedArcherArmors;
                rankedWeapons = Types.rankedArcherWeapons;
            }

            for(i = 0; i < Math.floor(this.game.player.level / 2); i++) {
                var imageUrl = "../client/img/2/item-" + Types.getKindAsString(rankedArmors[i]) + ".png";
                htmlStr += '<div style="position: absolute; top: ' + y + 'px;';
                htmlStr += 'left: ' + x + 'px; ';
                htmlStr += 'width: 32px; height: 32px; background-image: url(';
                htmlStr += "'" + imageUrl + "');"
                htmlStr += 'background-color: rgba(128, 128, 128, 0.5);';
                htmlStr += 'border: 1px solid #9c9898;"';
                htmlStr += 'title="' + Types.getName(rankedArmors[i], this.game.language) + ': Armor +' + (i+1) + '"></div>';

                if(i === rankedArmors.length-1){
                  break;
                }

                x += 32 + 8;
                if(x > 900 - 32 - 8) {
                    x = 16;
                    y += 32+8;
                }
            }

            x = 16;
            y += 32 + 32;

            for(i = 0; i < Math.floor(this.game.player.level / 2); i++) {
                var imageUrl = "../client/img/2/item-" + Types.getKindAsString(rankedWeapons[i]) + ".png";
                htmlStr += '<div style="position: absolute; top: ' + y + 'px;';
                htmlStr += 'left: ' + x + 'px; ';
                htmlStr += 'width: 32px; height: 32px; background-image: url(';
                htmlStr += "'" + imageUrl + "');"
                htmlStr += 'background-color: rgba(128, 128, 128, 0.5);';
                htmlStr += 'border: 1px solid #9c9898;"';
                htmlStr += 'title="' + Types.getName(rankedWeapons[i], this.game.language) + ': Attack +' + (i+1) + '"></div>';

                if(i === rankedWeapons.length-1){
                    break;
                }

                x += 32 + 8;
                if(x > 900 - 32 - 8) {
                    x = 16;
                    y += 32+8;
                }
            }

            $('#iteminfo').html(htmlStr);
            $('#iteminfo').height(y + 16);

            if(this.button){
                this.button.down();
            }

            this._super();
        },
        hide: function() {
          this._super();

          if(this.button){
            this.button.up();
          }
        }
    });

    return ItemInfoDialog;
});
