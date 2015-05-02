
/* global Types */

define(['jquery', 'app', 'entrypoint'], function($, App, EntryPoint) {
    var app, game;

    var initApp = function() {
        $(document).ready(function() {
            app = new App();
            app.center();

            if(Detect.isWindows()) {
                // Workaround for graphical glitches on text
                $('body').addClass('windows');
            }
            
            if(Detect.isOpera()) {
                // Fix for no pointer events
                $('body').addClass('opera');
            }

            if(Detect.isFirefoxAndroid()) {
                // Remove chat placeholder
                $('#chatinput').removeAttr('placeholder');
            }

            $('body').click(function(event) {
                if($('#parchment').hasClass('credits')) {
                    app.toggleScrollContent('credits');
                }

                if($('#parchment').hasClass('legal')) {
                    app.toggleScrollContent('legal');
                }

                if($('#parchment').hasClass('about')) {
                    app.toggleScrollContent('about');
                }
            });

            $('.barbutton').click(function() {
                $(this).toggleClass('active');
            });
            $('#rankingbutton').click(function(event){
              if(app.game && app.ready && app.game.ready){
                app.game.client.sendRanking('get');
                app.hideAllSubwindow();
                app.game.rankingHandler.show();
              }
            });
            $('#questbutton').click(function(event){
              if(app.game && app.ready && app.game.ready){
                app.game.client.sendQuest(0, "show");
                app.hideAllSubwindow();
                app.game.questhandler.show();
              }
            });
            $('#chatbutton').click(function() {
                if($('#chatbutton').hasClass('active')) {
                    app.showChat();
                } else {
                    app.hideChat();
                }
            });
            
            $('#helpbutton').click(function() {
                if($('body').hasClass('about')) {
                    app.closeInGameScroll('about');
                    $('#helpbutton').removeClass('active');
                } else {
                    app.toggleScrollContent('about');
                }
            });


            $('#instructions').click(function() {
                app.hideWindows();
            });

            /* $('#playercount').click(function() {
                app.togglePopulationInfo();
            }); */

            $('#population').click(function() {
                app.togglePopulationInfo();
            });

            $('.clickable').click(function(event) {
                event.stopPropagation();
            });

            $('#toggle-credits').click(function() {
                app.toggleScrollContent('credits');
            });

            $('#toggle-legal').click(function() {
                app.toggleScrollContent('legal');
                if(game.renderer.mobile) {
                    if($('#parchment').hasClass('legal')) {
                        $(this).text('close');
                    } else {
                        $(this).text('Privacy');
                    }
                };
            });

            $('#create-new span').click(function() {
                app.animateParchment('loadcharacter', 'confirmation');
            });

            $('#continue span').click(function() {
                
                app.animateParchment('confirmation', 'createcharacter');
                $('body').removeClass('returning');
                app.clearValidationErrors();
            });

            $('#cancel span').click(function() {
                app.animateParchment('confirmation', 'loadcharacter');
            });

            $('.ribbon').click(function() {
                app.toggleScrollContent('about');
            });

            $('#nameinput').bind("keyup", function() {
                app.toggleButton();
            });
            $('#pwinput').bind("keyup", function() {
                app.toggleButton();
            });
            $('#pwinput2').bind("keyup", function() {
                app.toggleButton();
            });
            $('#emailinput').bind("keyup", function() {
                app.toggleButton();
            });

           

            $('#notifications div').bind(TRANSITIONEND, app.resetMessagesPosition.bind(app));

            $('.close').click(function() {
                app.hideWindows();
            });

            $('.twitter').click(function() {
                var url = $(this).attr('href');

               app.openPopup('twitter', url);
               return false;
            });

            $('.facebook').click(function() {
                var url = $(this).attr('href');

               app.openPopup('facebook', url);
               return false;
            });

            

            $('.play span').click(function(event) {
                app.tryStartingGame();
            });

            document.addEventListener("touchstart", function() {},false);

            $('#resize-check').bind("transitionend", app.resizeUi.bind(app));
            $('#resize-check').bind("webkitTransitionEnd", app.resizeUi.bind(app));
            $('#resize-check').bind("oTransitionEnd", app.resizeUi.bind(app));

            log.info("App initialized.");

            initGame();
        });
    };

    var initGame = function() {
        require(['game'], function(Game) {

            var canvas = document.getElementById("entities"),
                background = document.getElementById("background"),
                foreground = document.getElementById("foreground"),
                textcanvas = document.getElementById("textcanvas"),
                toptextcanvas = document.getElementById("toptextcanvas"),
                input = document.getElementById("chatinput");

            game = new Game(app);
            game.setup('#bubbles', canvas, background, foreground, textcanvas, toptextcanvas, input);
            
            app.setGame(game);

            if(app.isDesktop && app.supportsWorkers) {
                game.loadMap();
            }


            game.onNbPlayersChange(function(worldPlayers, totalPlayers){
                if (worldPlayers === 1) {
                    $('#users').html("" + worldPlayers + " player");
                } else {
                    $('#users').html("" + worldPlayers + " players");
                }
            });
                
                
            game.onGameStart(function() {
                app.initEquipmentIcons();
                var entry = new EntryPoint();
				entry.execute(game);
            });

            game.onDisconnect(function(message) {
                $('#death').find('p').html(message+"<em>Please reload the page.</em>");
                $('#respawn').hide();
            });

            game.onPlayerDeath(function() {
                if($('body').hasClass('credits')) {
                    $('body').removeClass('credits');
                }
                $('body').addClass('death');
            });

            game.onPlayerEquipmentChange(function() {
                app.initEquipmentIcons();
            });

            game.onPlayerInvincible(function() {
                $('#hitpoints').toggleClass('invincible');
            });

            game.onNbPlayersChange(function(worldPlayers, totalPlayers) {
                
                 /* var setTotalPlayersString = function(string) {
                        $("#users").find("span:nth-child(2)").text(string);
                    };

                $("#users").find("span:nth-child(1)").text(totalPlayers);
                if(totalPlayers === 1) {
                    setTotalPlayersString("player");
                } else {
                    setTotalPlayersString("players");
                } */
            });
            
            
            /*$('#questbutton').click(function(event){
                if(app.game && app.ready && app.game.ready){
                    app.game.client.sendQuest(0, "show");
                    app.hideAllSubwindow();
                    app.game.questhandler.show();
                }
            }); */
            game.onNotification(function(message) {
		app.showMessage(message);
            });

            app.initHealthBar();
            app.initManaBar();
            app.initExpBar();
            $('#nameinput').attr('value', '');
            $('#pwinput').attr('value', '');
            $('#pwinput2').attr('value', '');
            $('#emailinput').attr('value', '');
           $('#chatbox').attr('value', '');

            if(game.renderer.mobile || game.renderer.tablet) {
                $('#canvas .clickable').bind('touchstart', function(event) {
                    app.center();
                    app.setMouseCoordinates(event.originalEvent.touches[0]);
                    game.click();
                    app.hideWindows();
                });
            } else {
                $('#canvas .clickable').click(function(event) {
                    app.center();
                    app.setMouseCoordinates(event);
                     if(game && !app.dropDialogPopuped) {
                	    //game.pvpFlag = event.shiftKey;
                	    game.click();
                	}
                   app.hideWindows();
                });
            }

            $('body').unbind('click');
            $('body').click(function(event) {
                var hasClosedParchment = false;

                if($('#parchment').hasClass('credits')) {
                    if(game.started) {
                        app.closeInGameScroll('credits');
                        hasClosedParchment = true;
                    } else {
                        app.toggleScrollContent('credits');
                    }
                }

                if($('#parchment').hasClass('legal')) {
                    if(game.started) {
                        app.closeInGameScroll('legal');
                        hasClosedParchment = true;
                    } else {
                        app.toggleScrollContent('legal');
                    }
                }

                if($('#parchment').hasClass('about')) {
                    if(game.started) {
                        app.closeInGameScroll('about');
                        hasClosedParchment = true;
                    } else {
                        app.toggleScrollContent('about');
                    }
                }

                if(game.started && !game.renderer.mobile && game.player && !hasClosedParchment) {
                    game.click();
                }
            });

            $('#respawn').click(function(event) {
                game.audioManager.playSound("revive");
                game.respawn();
                $('body').removeClass('death');
            });

            $(document).mousemove(function(event) {
                app.setMouseCoordinates(event);
                if(game.started) {
            	   // game.pvpFlag = event.shiftKey;
                  game.movecursor();
                }
            });
             $(document).bind('mousedown', function(event){ 
                if(event.button === 2){
                    return false;
                }
            });
            $(document).bind('mouseup', function(event) { 
                if(event.button === 2) {
                    app.setMouseCoordinates(event);
                    game.rightClick();
                }
            });


            $(document).keyup(function(e) {
                var key = e.which;
                
                if (game.started && !$('#chatbox').hasClass('active'))
                {
                    switch(key) {
                        case Types.Keys.LEFT:
                        case Types.Keys.A:
                        case Types.Keys.KEYPAD_4:
                            game.player.moveLeft = false;
                            game.player.disableKeyboardNpcTalk = false;
                            break;
                        case Types.Keys.RIGHT:
                        case Types.Keys.D:
                        case Types.Keys.KEYPAD_6:
                            game.player.moveRight = false;
                            game.player.disableKeyboardNpcTalk = false;
                            break;
                        case Types.Keys.UP:
                        case Types.Keys.W:
                        case Types.Keys.KEYPAD_8:
                            game.player.moveUp = false;
                            game.player.disableKeyboardNpcTalk = false;
                            break;
                        case Types.Keys.DOWN:
                        case Types.Keys.S:
                        case Types.Keys.KEYPAD_2:
                            game.player.moveDown = false;
                            game.player.disableKeyboardNpcTalk = false;
                            break;
                        default:
                            break;
                    }
                }
            });

            $(document).keydown(function(e) {
                var key = e.which,
                    $chat = $('#chatinput');

                if(key === Types.Keys.ENTER) {
                    if($('#chatbox').hasClass('active')) {
                        app.hideChat();
                    } else {
                        app.showChat();
                    }
                }
                
                if (game.started && !$('#chatbox').hasClass('active')) {
                    pos = {
                        x: game.player.gridX,
                        y: game.player.gridY
                    };
                    switch(key) {
                        case Types.Keys.LEFT:
                        case Types.Keys.A:
                        case Types.Keys.KEYPAD_4:
                            game.player.moveLeft = true;
                            break;
                        case Types.Keys.RIGHT:
                        case Types.Keys.D:
                        case Types.Keys.KEYPAD_6:
                            game.player.moveRight = true;
                            break;
                        case Types.Keys.UP:
                        case Types.Keys.W:
                        case Types.Keys.KEYPAD_8:
                            game.player.moveUp = true;
                            break;
                        case Types.Keys.DOWN:
                        case Types.Keys.S:
                        case Types.Keys.KEYPAD_2:
                            game.player.moveDown = true;
                            break;
                        case Types.Keys.SPACE:
                            game.makePlayerAttackNext();
                            break;
                        case Types.Keys.I:
                            $('#achievementsbutton').click();
                            break;
                        case Types.Keys.H:
                            $('#helpbutton').click();
                            break;
                        case Types.Keys.M:
                            $('#mutebutton').click();
                            break;
                        /* case Types.Keys.P:
                            $('#playercount').click();
                            break; */
                        default:
                            break;
                    }
                }
            });

             $(document).keyup(function(e) {
            	var key = e.which;

                
            });
           $('#chatinput').keydown(function(e) {
                var key = e.which,
                    $chat = $('#chatinput'),
                    placeholder = $(this).attr("placeholder");

             //   if (!(e.shiftKey && e.keyCode === 16) && e.keyCode !== 9) {
            //        if ($(this).val() === placeholder) {
             //           $(this).val('');
            //            $(this).removeAttr('placeholder');
            //            $(this).removeClass('placeholder');
            //        }
            //    }

                if(key === 13) {
                    if($chat.attr('value') !== '') {
                        if(game.player) {
                            game.say($chat.attr('value'));
                        }
                        $chat.attr('value', '');
                        app.hideChat();
                        $('#foreground').focus();
                        return false;
                    } else {
                        app.hideChat();
                        return false;
                    }
                }

                if(key === 27) {
                    app.hideChat();
                    return false;
                }
            });

            $('#chatinput').focus(function(e) {
                var placeholder = $(this).attr("placeholder");

                if(!Detect.isFirefoxAndroid()) {
                    $(this).val(placeholder);
                }

                if ($(this).val() === placeholder) {
                    this.setSelectionRange(0, 0);
                }
            });
            $('#dropAccept').click(function(event) {
                try {
                    var count = parseInt($('#dropCount').val());
                    if(count > 0) {
                        if(count > game.inventoryHandler.inventoryCount[app.inventoryNumber])
                            count = game.inventoryHandler.inventoryCount[app.inventoryNumber];

                        game.client.sendInventory("empty", app.inventoryNumber, count);

                        game.inventoryHandler.inventoryCount[app.inventoryNumber] -= count;
                        if(game.inventoryHandler.inventoryCount[app.inventoryNumber] === 0)
                            game.inventoryHandler.inventory[app.inventoryNumber] = null;
                    }
                } catch(e) {
                }

                setTimeout(function () {
                    app.hideDropDialog();
                }, 100);
            });
            $('#nameinput').focusin(function() {
                $('#name-tooltip').addClass('visible');
            });

            $('#nameinput').focusout(function() {
                $('#name-tooltip').removeClass('visible');
            });

            $('#nameinput').keypress(function(event) {
                $('#name-tooltip').removeClass('visible');
            });

            $('#mutebutton').click(function() {
                game.audioManager.toggle();
            });

            $(document).bind("keydown", function(e) {
                var key = e.which,
                    $chat = $('#chatinput');

                if(key === 13) { // Enter
                    if(game.started) {
                        $chat.focus();
                        return false;
                    } else {
                        if(app.loginFormActive() || app.createNewCharacterFormActive()) {
                            $('input').blur();      // exit keyboard on mobile
                            app.tryStartingGame();
                            return false;           // prevent form submit
                        }
                    }
                }

                if($('#chatinput:focus').size() === 0 && $('#nameinput:focus').size() === 0) {
                    if(key === 27) { // ESC
                        app.hideWindows();
                        _.each(game.player.attackers, function(attacker) {
                            attacker.stop();
                        });
                        return false;
                        //use E and F for arrow keys and E F for WSAD
                    } 
                    if((key === 49 || key === 50) && game.started){ // 1, 2 for now
                        game.keyDown(key);
                        return false;
                   
                    } else if(key === 107 && game.started){ // +
                        game.chathandler.incChatWindow();
                    } else if(key === 109 && game.started){ // -
                        game.chathandler.decChatWindow();
                    }

                    // The following may be uncommented for debugging purposes.
                    //
                     if(key === 32 && game.started) { // Space
                         game.togglePathingGrid();
                         return false;
                     }
                     if(key === 70 && game.started) { // F
                         game.toggleDebugInfo();
                         return false;
                     }
                }
            });

             $('#healthbar').click(function(e) {
                var hb = $('#healthbar'),
                    hp = $('#hitpoints'),
                    hpg = $('#hpguide');

                var hbp = hb.position(),
                    hpp = hp.position();

                if((e.offsetX >= hpp.left) && (e.offsetX < hb.width())) {
                    if(hpg.css('display') === 'none') {
                        hpg.css('display', 'block');

                        setInterval(function () {
                            if(((game.player.hitPoints / game.player.maxHitPoints) <= game.hpGuide) && 
                               (game.healShortCut >= 0) && 
                               Types.isHealingItem(game.player.inventory[game.healShortCut]) &&
                               (game.player.inventoryCount[game.healShortCut] > 0)
                              ) {
                                game.eat(game.healShortCut);
                            }
                        }, 100);
                    }
                    hpg.css('left', e.offsetX + 'px');

                    game.hpGuide = (e.offsetX - hpp.left) / (hb.width()- hpp.left);
                }

                return false;
            });
           if(game.renderer.tablet) {
                $('body').addClass('tablet');
            }
        });
    };

    initApp();
});
