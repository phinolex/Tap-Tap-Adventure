
/* global Mob, Types, Item, log, _, TRANSITIONEND, Class */

define(['jquery', 'mob', 'item'], function($, Mob, Item) {

    var App = Class.extend({
        init: function() {
            this.currentPage = 1;
            this.blinkInterval = null;
            this.isParchmentReady = true;
            this.ready = false;
            this.watchNameInputInterval = setInterval(this.toggleButton.bind(this), 100);
            this.initFormFields();
            this.dropDialogPopuped = false;
            this.frontPage = 'loadcharacter';
            this.inventoryNumber = 0;
        },

        setGame: function(game) {
            this.game = game;
            this.isMobile = this.game.renderer.mobile;
            this.isTablet = this.game.renderer.tablet;
            this.isDesktop = !(this.isMobile || this.isTablet);
            this.supportsWorkers = !!window.Worker;
            this.ready = true;
        },

        initFormFields: function() {
            var self = this;

            // Play button
            this.$play = $('.play');
            this.getPlayButton = function() { return this.getActiveForm().find('.play span'); };
            this.setPlayButtonState(true);

            // Login form fields
            this.$loginnameinput = $('#loginnameinput');
            this.$loginpwinput = $('#loginpwinput');
            this.loginFormFields = [this.$loginnameinput, this.$loginpwinput];

            // Create new character form fields
            this.$nameinput = $('#nameinput');
            this.$pwinput = $('#pwinput');
            this.$pwinput2 = $('#pwinput2');
            this.$email = $('#emailinput');
            this.createNewCharacterFormFields = [this.$nameinput, this.$pwinput, this.$pwinput2, this.$email];

            // Functions to return the proper username / password fields to use, depending on which form
            // (login or create new character) is currently active.
            this.getUsernameField = function() { return this.createNewCharacterFormActive() ? this.$nameinput : this.$loginnameinput; };
            this.getPasswordField = function() { return this.createNewCharacterFormActive() ? this.$pwinput : this.$loginpwinput; };
        },

        center: function() {
            window.scrollTo(0, 1);
        },

        canStartGame: function() {
            if(this.isDesktop) {
                return (this.game && this.game.map && this.game.map.isLoaded);
            } else {
                return this.game;
            }
        },

        tryStartingGame: function() {
            if(this.starting) return;        // Already loading

            var self = this;
            var action = this.createNewCharacterFormActive() ? 'create' : 'login';
            var username = this.getUsernameField().attr('value');
            var userpw = this.getPasswordField().attr('value');
            var email = '';
            var userpw2;

            if(action === 'create') {
                email = this.$email.attr('value');
                userpw2 = this.$pwinput2.attr('value');
            }

            if(!this.validateFormFields(username, userpw, userpw2, email)) return;
            
            this.setPlayButtonState(false);

            if(!this.ready || !this.canStartGame()) {
                var watchCanStart = setInterval(function() {
                    log.debug("waiting...");
                    if(self.canStartGame()) {
                        clearInterval(watchCanStart);
                        self.startGame(action, username, userpw, email);
                    }
                }, 100);
            } else {
                this.startGame(action, username, userpw, email);
            }
        },

        startGame: function(action, username, userpw, email) {
            var self = this;
            
            if(username && !this.game.started) {
                var optionsSet = false,
                    config = this.config;
                this.useAPI = config.local ? config.useLocalAPI : config.useAPI;
                //>>includeStart("devHost", pragmas.devHost);
                if(config.local) {
                    log.debug("Starting game with local dev config.");
                    this.game.setServerOptions(config.local.host, config.local.port, username, userpw, email);
                } else {
                    log.debug("Starting game with default dev config.");
                    this.game.setServerOptions(config.dev.host, config.dev.port, username, userpw, email);
                }
                optionsSet = true;
                //>>includeEnd("devHost");

                //>>includeStart("prodHost", pragmas.prodHost);
                if(!optionsSet) {
                    log.debug("Starting game with build config.");
                    this.game.setServerOptions(config.build.host, config.build.port, username, userpw, email);
                }
                //>>includeEnd("prodHost");

                if(!self.isDesktop) {
                    // On mobile and tablet we load the map after the player has clicked
                    // on the login/create button instead of loading it in a web worker.
                    // See initGame in main.js.
                    self.game.loadMap();
                }

                this.center();
                this.game.run(action, function(result) {
                    if(result.success === true) {
                        
                        self.start();
                    } else {
                        
                        self.setPlayButtonState(true);
                        /*
                       
                        case 'timeout':
                        default:
                            if (self.fail_callback)
                                self.fail_callback(reply.status);
                        break;
                        */
                        switch(result.reason) {
                            
                            case "timeout":
                                self.addValidationError(self.getUsernameField(), "Timeout whilst attempting to establish connection to TTA servers.");
                            break;
                            
                            case 'invalidlogin':
                                // Login information was not correct (either username or password)
                                self.addValidationError(null, 'The username or password you entered is incorrect.');
                                self.getUsernameField().focus();
                            break;
                            
                            case 'userexists':
                                // Attempted to create a new user, but the username was taken
                                self.addValidationError(self.getUsernameField(), 'The username you entered is not available.');
                            break;
                            
                            case 'invalidusername':
                                // The username contains characters that are not allowed (rejected by the sanitizer)
                                self.addValidationError(self.getUsernameField(), 'The username you entered contains invalid characters.');
                            break;
                            
                            case 'loggedin':
                                // Attempted to log in with the same user multiple times simultaneously
                                self.addValidationError(self.getUsernameField(), 'A player with the specified username is already logged in.');
                            break;
                            
                            case 'ban':
                                self.addValidationError(null, 'You have been banned.');
                            break;
                            
                            case 'full':
                                self.addValidationError(null, "All TTA gameservers are currently full.")
                            break;
                            
                            default:
                                self.addValidationError(null, 'Failed to launch the game: ' + (result.reason ? result.reason : '(reason unknown)'));
                            break;
                        }
                    }
                });
            }
        },

        start: function() {
            this.hideIntro();
            $('body').addClass('started'); //ASKY Doesn't use this, look furhter into whether this is necessary or not.
            //if(this.firstTimePlaying) {
                //this.toggleInstructions();
            //}
        },
        
        setPlayButtonState: function(enabled) {
            var self = this;
            var $playButton = this.getPlayButton();

            if(enabled) {
                this.starting = false;
                this.$play.removeClass('loading');
                $playButton.click(function () { self.tryStartingGame(); });
                if(this.playButtonRestoreText) {
                    $playButton.text(this.playButtonRestoreText);
                }
            } else {
                // Loading state
                this.starting = true;
                this.$play.addClass('loading');
                $playButton.unbind('click');
                this.playButtonRestoreText = $playButton.text();
                $playButton.text('Loading...');
            }
            
            
            $('#boardbutton').click(function(event){
              if(self.game && self.ready){
                self.game.chathandler.hide();
                self.game.boardhandler.show();
              }
            });
            $('#gamebutton').click(function(event){
              if(self.game && self.ready){
                self.game.chathandler.show();
                self.game.boardhandler.hide();
              }
            });
            
        },

        getActiveForm: function() { 
            if(this.loginFormActive()) return $('#loadcharacter');
            else if(this.createNewCharacterFormActive()) return $('#createcharacter');
            else return null;
        },

        loginFormActive: function() {
            return $('#parchment').hasClass("loadcharacter");
        },

        createNewCharacterFormActive: function() {
            return $('#parchment').hasClass("createcharacter");
        },

        /**
         * Performs some basic validation on the login / create new character forms (required fields are filled
         * out, passwords match, email looks valid). Assumes either the login or the create new character form
         * is currently active.
         */
        validateFormFields: function(username, userpw, userpw2, email) {
            this.clearValidationErrors();

            if(!username) {
                this.addValidationError(this.getUsernameField(), 'Please enter a username.');
                return false;
            }

            if(!userpw) {
                this.addValidationError(this.getPasswordField(), 'Please enter a password.');
                return false;
            }

            if(this.createNewCharacterFormActive()) {     // In Create New Character form (rather than login form)
                if(!userpw2) {
                    this.addValidationError(this.$pwinput2, 'Please confirm your password by typing it again.');
                    return false;
                }

                if(userpw !== userpw2) {
                    this.addValidationError(this.$pwinput2, 'The passwords you entered do not match. Please make sure you typed the password correctly.');
                    return false;
                }

                // Email field is not required, but if it's filled out, then it should look like a valid email.
                if(email && !this.validateEmail(email)) {
                    this.addValidationError(this.$email, 'The email you entered appears to be invalid. Please enter a valid email (or leave the email blank).');
                    return false;
                }
            }

            return true;
        },

        validateEmail: function(email) {
            // Regex borrowed from http://stackoverflow.com/a/46181/393005
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        },

        addValidationError: function(field, errorText) {
            $('<span/>', {
                'class': 'validation-error blink',
                text: errorText
            }).appendTo('.validation-summary');

            if(field) {
                field.addClass('field-error').select();
                field.bind('keypress', function (event) {
                    field.removeClass('field-error');
                    $('.validation-error').remove();
                    $(this).unbind(event);
                });
            }
        },

        clearValidationErrors: function() {
            var fields = this.loginFormActive() ? this.loginFormFields : this.createNewCharacterFormFields;
            $.each(fields, function(i, field) {
                field.removeClass('field-error');
            });
            $('.validation-error').remove();
        },

        setMouseCoordinates: function(event) {
            var gamePos = $('#container').offset(),
                scale = this.game.renderer.getScaleFactor(),
                width = this.game.renderer.getWidth(),
                height = this.game.renderer.getHeight(),
                mouse = this.game.mouse;

            mouse.x = event.pageX - gamePos.left - (this.isMobile ? 0 : 5 * scale);
            mouse.y = event.pageY - gamePos.top - (this.isMobile ? 0 : 7 * scale);

            if(mouse.x <= 0) {
                mouse.x = 0;
            } else if(mouse.x >= width) {
                mouse.x = width - 1;
            }

            if(mouse.y <= 0) {
                mouse.y = 0;
            } else if(mouse.y >= height) {
                mouse.y = height - 1;
            }
        },
        //Init the hud that makes it show what creature you are mousing over and attacking
        initTargetHud: function(){
            var self = this;
            var scale = self.game.renderer.getScaleFactor(),
                healthMaxWidth = $("#target .health").width() - (12 * scale),
                timeout;

            this.game.player.onSetTarget(function(target, name, mouseover){
                var el = '#target';
                if(mouseover) el = '#inspector';
                var sprite = target.sprite;
                var x, y;
                if (!self.game.renderer.isFirefox) {
                    if (Types.isItem(target.kind)) {
                        x = ((sprite.animationData['idle'].length - 1) * sprite.width),
                            y = ((sprite.animationData['idle'].row) * sprite.height);
                    } else if (Types.isMob(target.kind)) {
                        x = ((sprite.animationData['idle_down'].length - 1) * sprite.width),
                            y = ((sprite.animationData['idle_down'].row) * sprite.height);
                    } else {
                        return;
                    }
                }
                $(el+' .name').text(name);
                $(el+' .name').css('text-transform', 'capitalize');

                if(el === '#inspector'){
                    $(el + ' .details').text((target instanceof Mob ? "Level - " + Types.getMobLevel(Types.getKindFromString(name)) : (target instanceof Item ? target.getInfoMsg(): "1")));
                }
                $(el+' .headshot div').height(sprite.height).width(sprite.width);
                $(el+' .headshot div').css('margin-left', -sprite.width/2).css('margin-top', -sprite.height/2);
                $(el+' .headshot div').css('background', 'url(img/1/'+(target instanceof Item ? 'item-'+name : name)+'.png) no-repeat -'+x+'px -'+y+'px');

                if(target.healthPoints){
                    $(el+" .health").css('width', Math.round(target.healthPoints/target.maxHp*100)+'%');
                } else{
                    $(el+" .health").css('width', '100%');
                }

                $(el).fadeIn('fast');
                if(mouseover){
                    clearTimeout(timeout);
                    timeout = null;
                    timeout = setTimeout(function(){
                        $('#inspector').fadeOut('fast');
                        self.game.player.inspecting = null;
                    }, 2000);
                }
            });

            this.game.onUpdateTarget(function(target){
                $("#target .health").css('width', Math.round(target.healthPoints/target.maxHp*100) + "%");
                if(self.game.player.inspecting && self.game.player.inspecting.id === target.id){
                    $("#inspector .health").css('width', Math.round(target.healthPoints/target.maxHp*100) + "%");
                }
            });

            this.game.player.onRemoveTarget(function(targetId){
                $('#target').fadeOut('fast');
                if(self.game.player.inspecting && self.game.player.inspecting.id === targetId){
                    $('#inspector').fadeOut('fast');
                    self.game.player.inspecting = null;
                }
            });
        },
        initManaBar: function() {
            var maxWidth = $("#manabar").width() - (11 * scale);
            if (this.game.renderer) {
                if (this.game.renderer.mobile) {
                    var scale = 1;
                } else {
                    var scale = this.game.renderer.getScaleFactor();
                }
            } else {
                var scale = 2;
            }


            if (scale == 1) {
                maxWidth = 77;
            }
            this.game.onPlayerManaChange(function(mana, maxMana) {
                var barWidth = Math.round((maxWidth / maxMana) * (mana > 0 ? mana : 0));
                $('#mana').css('width', barWidth + "px");
                $('#manatext').html("<p>MP: " + mana + "/" + maxMana + "</p>");
            }); 
        },
          
        initExpBar: function(){
            var maxWidth = $("#expbar").width();

            this.game.onPlayerExpChange(function(expInThisLevel, expForLevelUp){
                var rate = expInThisLevel/expForLevelUp;
                    if(rate > 1){
                        rate = 1;
                    } else if(rate < 0){
                        rate = 0;
                    }
                $('#exp').css('width', (rate*maxWidth).toFixed(0) + "px");
                $('#expbar').attr("title", "Exp: " + (rate*100).toFixed(3) + "%");
            });
        },

        initHealthBar: function() {

            if (this.game.renderer) {
                if (this.game.renderer.mobile) {
                    var scale = 1;
                } else {
                    var scale = this.game.renderer.getScaleFactor();
                }
            } else {
                var scale = 2;
            }

            var healthMaxWidth = $("#healthbar").width() - (11 * scale);
            if (scale == 1) {
                healthMaxWidth = 77;
            }

            this.game.onPlayerHealthChange(function(hp, maxHp) {
                var barWidth = Math.round((healthMaxWidth / maxHp) * (hp > 0 ? hp : 0));
                $("#health").css('width', barWidth + "px");
                $('#healthtext').html("<p>HP: " + hp + "/" + maxHp + "</p>");
            });

            this.game.onPlayerHurt(this.blinkHealthBar.bind(this));
        },


        blinkHealthBar: function() {
            var $hitpoints = $('#health');

            $hitpoints.addClass('white');
            setTimeout(function() {
                $hitpoints.removeClass('white');
            }, 500);
        },

        toggleButton: function() {
            var name = $('#parchment input').val(),
                $play = $('#createcharacter .play');

            if(name && name.length > 0) {
                $play.removeClass('disabled');
                $('#character').removeClass('disabled');
            } else {
                $play.addClass('disabled');
                $('#character').addClass('disabled');
            }
        },

        hideIntro: function() {
            clearInterval(this.watchNameInputInterval);
            $('body').removeClass('intro');
            setTimeout(function() {
                $('body').addClass('game');
            }, 500);
        },

        showChat: function() {
            if(this.game.started) {
                $('#chatbox').addClass('active');
                $('#chatinput').focus();
                $('#chatbutton').addClass('active');
            }
        },

        hideChat: function() {
            if(this.game.started) {
                $('#chatbox').removeClass('active');
                $('#chatinput').blur();
                $('#chatbutton').removeClass('active');
            }
        },

        
        showDropDialog: function(inventoryNumber) {
          if(this.game.started) {
            $('#dropDialog').addClass('active');
            $('#dropCount').focus();
            $('#dropCount').select();

            this.inventoryNumber = inventoryNumber;
            this.dropDialogPopuped = true;
          }
        },
        hideDropDialog: function() {
          if(this.game.started) {
            $('#dropDialog').removeClass('active');
            $('#dropCount').blur();

            this.dropDialogPopuped = false;
          }
        },
        

        hideWindows: function() {
            
            if($('body').hasClass('credits')) {
                this.closeInGameScroll('credits');
            }
            if($('body').hasClass('legal')) {
                this.closeInGameScroll('legal');
            }
            if($('body').hasClass('about')) {
                this.closeInGameScroll('about');
            }
            this.game.closeItemInfo();
        },
        

        toggleScrollContent: function(content) {
            var currentState = $('#parchment').attr('class');

            if(this.game.started) {
                $('#parchment').removeClass().addClass(content);

                $('body').removeClass('credits legal about').toggleClass(content);

                if(!this.game.player) {
                    $('body').toggleClass('death');
                }

                if(content !== 'about') {
                    $('#helpbutton').removeClass('active');
                }
            } else {
                if(currentState !== 'animate') {
                    if(currentState === content) {
                        this.animateParchment(currentState, this.frontPage);
                    } else {
                        this.animateParchment(currentState, content);
                    }
                }
            }
        },

        closeInGameScroll: function(content) {
            $('body').removeClass(content);
            $('#parchment').removeClass(content);
            if(!this.game.player) {
                $('body').addClass('death');
            }
            if(content === 'about') {
                $('#helpbutton').removeClass('active');
            }
        },

        togglePopulationInfo: function() {
            $('#population').toggleClass('visible');
        },

        openPopup: function(type, url) {
            var h = $(window).height(),
                w = $(window).width(),
                popupHeight,
                popupWidth,
                top,
                left;

            switch(type) {
                case 'twitter':
                    popupHeight = 450;
                    popupWidth = 550;
                    break;
                case 'facebook':
                    popupHeight = 400;
                    popupWidth = 580;
                    break;
            }

            top = (h / 2) - (popupHeight / 2);
            left = (w / 2) - (popupWidth / 2);

            newwindow = window.open(url,'name','height=' + popupHeight + ',width=' + popupWidth + ',top=' + top + ',left=' + left);
            if (window.focus) {newwindow.focus();}
        },

        animateParchment: function(origin, destination) {
            var self = this,
                $parchment = $('#parchment'),
                duration = 1;

            if(this.isMobile) {
                $parchment.removeClass(origin).addClass(destination);
            } else {
                if(this.isParchmentReady) {
                    if(this.isTablet) {
                        duration = 0;
                    }
                    this.isParchmentReady = !this.isParchmentReady;

                    $parchment.toggleClass('animate');
                    $parchment.removeClass(origin);

                    setTimeout(function() {
                        $('#parchment').toggleClass('animate');
                        $parchment.addClass(destination);
                    }, duration * 1000);

                    setTimeout(function() {
                        self.isParchmentReady = !self.isParchmentReady;
                    }, duration * 1000);
                }
            }
        },

        animateMessages: function() {
            var $messages = $('#notifications div');

            $messages.addClass('top');
        },

        resetMessagesPosition: function() {
            var message = $('#message2').text();

            $('#notifications div').removeClass('top');
            $('#message2').text('');
            $('#message1').text(message);
        },

        showMessage: function(message) {
            var $wrapper = $('#notifications div'),
                $message = $('#notifications #message2');

            this.animateMessages();
            $message.text(message);
            if(this.messageTimer) {
                this.resetMessageTimer();
            }

            this.messageTimer = setTimeout(function() {
                    $wrapper.addClass('top');
            }, 5000);
        },

        resetMessageTimer: function() {
            clearTimeout(this.messageTimer);
        },

        resizeUi: function() {
            if(this.game) {
                if(this.game.started) {
                    this.game.resize();
                    this.initHealthBar();
                    this.initTargetHud();
                    this.initExpBar();
                    this.game.updateBars();
                } else {
                    var newScale = this.game.renderer.getScaleFactor();
                    this.game.renderer.rescale(newScale);
                }
            }
        }
    });

    return App;
});
