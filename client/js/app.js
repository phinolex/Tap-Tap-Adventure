
/* global Mob, Types, Item, log, _, TRANSITIONEND, Class */

/*
TODO!!:
    Storage will save some game settings and username/password in browser's local storage
    these are not yet crypted. and thus hacking them is as simple as injecting a js file
    Changing password is not yet supported, but should update password locally when that change.
*/

define(['jquery', 'entity/character/mob/mob', 'entity/item/item', 'data/mobdata', 'utils/localstorage'], function($, Mob, Item, MobData, Storage) {

    var App = Class.extend({
        init: function() {
            this.window = window;
            this.storage = new Storage;
            this.rotation = null;
            this.currentPage = 1;
            this.blinkInterval = null;
            this.isParchmentReady = true;
            this.ready = false;
            this.watchNameInputInterval = setInterval(this.toggleButton.bind(this), 100);
            this.initFormFields();
            this.dropDialogPopuped = false;
            this.auctionsellDialogPopuped = false;
            this.achievementQuery = [];
            this.inventoryNumber = 0;
            this.showChatLog = null;

            this.classNames = ["loadcharacter", "createcharacter"];
            this.frontPage = this.classNames[0];

            try {
                var gameId = "1238691",
                    videoPlacement = 'video',
                    rewardPlacement = 'rewardedVideo',
                    developmentMode = false;
                
                window.unityads.setUp(gameId, videoPlacement, rewardPlacement, developmentMode);

                if (window.store) {
                    store.verbosity = store.INFO;

                    store.register({
                        id: "net.udeva.TTA.removeAds",
                        alias: "Remove Advertisements",
                        type: store.NON_CONSUMABLE
                    });

                    store.ready(function() {
                        log.info("Store has successfully initialized.");
                    });

                    store.refresh();
                }
            } catch (e) {
                log.info("Error encountered whilst initializing Unity Ads: " + e);
            }
        },

        setGame: function(game) {
            var self = this;

            this.game = game;
            this.isMobile = this.game.renderer.mobile;
            this.isTablet = this.game.renderer.tablet;
            this.isDesktop = !(this.isMobile || this.isTablet);
            this.supportsWorkers = !!window.Worker;
            this.ready = true;
            this.rotation = this.window.orientation;

            if (self.storage.data.settings.version != self.game.version) {
                log.info("Parsing client version.");
                self.storage.clear();
                self.storage.data.settings.version = self.game.version;
                self.storage.save();
                log.info("Successfully updated client to version: " + self.storage.data.settings.version);
            }
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
            
            if (this.storage.playedBefore()) {
                var player = this.storage.getPlayer();

                this.$loginnameinput.val(player.username);
                this.$loginpwinput.val(player.password);
            }
        },

        center: function() {
            window.scrollTo(0, 1);
        },

        canStartGame: function() {
            var self = this;

            self.startTimeout = setTimeout(function() {
                self.handleError('unknown');
                return false;
            }, 20000);

            return self.game;
        },

        tryStartingGame: function() {
            if (this.starting)
                return;

            var action = $('#parchment').attr("class"),
                username,
                userpw,
                self = this;

            if (action == this.classNames[0]) {

                username = this.$loginnameinput.val();
                userpw = this.$loginpwinput.val();

                if (!this.validateLoginForm(username, userpw))
                    return;

                this.preStartGame(action, username, userpw);

            } else if (action == this.classNames[1]) {

                username = this.$nameinput.val();
                userpw = this.$pwinput.val();
                var userpw2 = this.$pwinput2.val();
                var email = this.$email.val();
                var pClass = $('#selectClassSwitch2').val();

                if (!this.validateCreateForm(username, userpw, userpw2, email))
                    return;

                this.preStartGame(action, username, userpw, email, '', pClass);
            }
        },

        preStartGame: function (action, username, userpw, email, newpw, pClass) {
            var self = this;
            log.info("Pre Start game.");

            self.setPlayButtonState(false);
            if (!self.ready || !self.canStartGame()) {
                var watchCanStart = setInterval(function() {
                    if(self.canStartGame()) {
                        clearInterval(watchCanStart);
                        clearInterval(self.startTimeout);
                        self.startGame(action, username, userpw, email, newpw, pClass);
                    }
                }, 250);
            } else
                self.startGame(action, username, userpw, email, newpw, pClass);
        },

        handleError: function(reason) {
            var self = this;

            self.setPlayButtonState(true);

            switch(reason) {

                case "timeout":
                    self.addValidationError(null, "Timeout whilst attempting to establish connection to TTA servers.");
                    break;

                case 'invalidlogin':
                    self.addValidationError(null, 'The username or password you entered is incorrect.');
                    break;

                case 'userexists':
                    self.addValidationError(null, 'The username you have entered is not available.');
                    break;

                case 'invalidusername':
                    self.addValidationError(null, 'The username you entered contains invalid characters.');
                    break;

                case 'loggedin':
                    self.addValidationError(null, 'A player with the specified username is already logged in.');
                    break;

                case 'ban':
                    self.addValidationError(null, 'You have been banned.');
                    break;

                case 'full':
                    self.addValidationError(null, "All TTA gameservers are currently full.");
                    break;

                case 'failedattempts':
                    self.addValidationError(null, "You have too many failed attempts at logging in.");
                    break;

                case 'cheating':
                    self.addValidationError(null, "Attempts to cheat the system will not be tolerated.");
                    break;

                case 'errorconnecting':
                    self.addValidationError(null, "Unable to connect to the game server, please try again.");
                    break;

                case 'updated':
                    self.addValidationError(null, "The game has been updated, please restart your client with CTRL + F5!");
                    break;

                case 'unknown':
                    self.addValidationError(null, "An unexpected error has occurred, please refer to the forums!")
                    break;

                default:
                    self.addValidationError(null, 'Failed to launch the game: ' + (result.reason ? result.reason : '(unknown error)'));
                    break;
            }
        },

        startGame: function(action, username, userpw, email, newuserpw, pClass) {
            var self = this;

            if(username && !this.game.started) {
                this.game.loadMap();
                this.game.setServerOptions(username, userpw, email, newuserpw, pClass);

                this.center();
                this.game.run(action, function(result) {
                    if(result.success === true) {
                        self.start();

                        //Save the last succesfully connected user
                        self.storage.setPlayer('username', username);
                        self.storage.setPlayer('password', userpw);
                        self.storage.data.playedBefore = true;
                        self.storage.save();

                    }
                });
            }
        },


        start: function() {
            var self = this,
                $playButton = this.getPlayButton();

            this.hideIntro();
            $('body').addClass('started');

            $playButton.click(function () {
                self.tryStartingGame();
            });
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
            if(this.createNewCharacterFormActive()) {
                log.info("createcharacter");
                return $('#createcharacter');
            }
            else {
                log.info("loadcharacter");
                return $('#loadcharacter');
            }
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

        validateLoginForm: function(username, userpw) {
            this.clearValidationErrors();

            if(!username) {
                this.addValidationError(this.$loginnameinput, 'Please enter a username.');
                return false;
            }

            if(!userpw) {
                this.addValidationError(this.$loginpwinput, 'Please enter a password.');
                return false;
            }
            return true;
        },

        validateCreateForm: function(username, userpw, userpw2, email) {
            this.clearValidationErrors();

            if(!username) {
                this.addValidationError(this.$nameinput, 'Please enter a username.');
                return false;
            }

            if (username.length < 3) {
                this.addValidationError(this.$nameinput, "A minimum of 3 characters is required for a username.");
                return;
            }

            if (userpw.length < 4) {
                this.addValidationError(this.$pwinput, "A minimum of 4 characters is required for a password.");
                return;
            }

            if(!userpw) {
                this.addValidationError(this.$pwinput, 'Please enter a password.');
                return false;
            }

            if(!userpw2) {
                this.addValidationError(this.$pwinput2, 'Please confirm your password by typing it again.');
                return false;
            }

            if(userpw !== userpw2) {
                this.addValidationError(this.$pwinput2, 'The passwords you entered do not match. Please make sure you typed the password correctly.');
                return false;
            }

            if (!email) {
                this.addValidationError(this.$email, "Please enter an email address.");
                return false;
            }

            if(email && !this.validateEmail(email)) {
                this.addValidationError(this.$email, 'The email you entered appears to be invalid. Please enter a valid email address.');
                return false;
            }

            if (username.toLowerCase() == userpw.toLowerCase()) {
                this.addValidationError(this.$nameinput, "Your password cannot be the same as your username.");
                return false;
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
            //var fields = this.loginFormActive() ? this.loginFormFields : this.createNewCharacterFormFields;
            var fields;
            if (this.loginFormActive())
                fields = this.loginFormFields;
            else if (this.createNewCharacterFormActive())
                fields = this.createNewCharacterFormFields;

            if (fields)
            {
                $.each(fields, function(i, field) {
                    if (field.hasClass('field-error'))
                        field.removeClass('field-error');
                });
                $('.validation-error').remove();
            }
        },

        getZoom: function() {
            var zoom = parseFloat($('body').css('zoom'));

            if (this.game.renderer.isFirefox)
            {
                var matrixRegex = /matrix\((-?\d*\.?\d+),\s*0,\s*0,\s*(-?\d*\.?\d+),\s*0,\s*0\)/,
                    matches = $('body').css('-moz-transform').match(matrixRegex);
                zoom = matches[1];
            }
            //log.info("ZOOM="+zoom);
            return zoom;
        },

        setMouseCoordinates: function(event) {
            var gamePos = $('#canvas').offset(),
            //scale = this.game.renderer.getScaleFactor(),
                width = this.game.renderer.getWidth(),
                height = this.game.renderer.getHeight(),
                mouse = this.game.mouse;

            //log.info(event.pageX+","+event.pageY);
            //log.info(~~(gamePos.left)+","+~~(gamePos.top));
            mouse.x = Math.round((event.pageX - gamePos.left) / this.getZoom());
            mouse.y = Math.round((event.pageY - gamePos.top) / this.getZoom());
            //mouse.x = event.pageX - gamePos.left - (this.isMobile ? 0 : 5 * scale);
            //mouse.y = event.pageY - gamePos.top - (this.isMobile ? 0 : 7 * scale);

            //log.info(mouse.x+","+mouse.y);

            if (mouse.x <= 0)
                mouse.x = 0;
            else if (mouse.x >= width)
                mouse.x = width - 1;

            if (mouse.y <= 0)
                mouse.y = 0;
            else if (mouse.y >= height)
                mouse.y = height - 1;

        },

        initTaskHud: function() {
            var self = this;

            if (self.game.player) {
                self.game.onTaskUpdate(function(details, progress, goal, show) {
                    var element = $('#task'),
                        elDetails = $('#task .details'),
                        elProgress = $('#task .progress');

                    if (details && goal != 0) {
                        elDetails.text('Task: ' + details);
                        elProgress.text(progress + ' / ' + goal);
                    }
                    
                    if (show)
                        element.fadeIn('slow');
                    else
                        element.fadeOut('slow');
                });
            }
        },

        initTargetHud: function() {
            var self = this,
                scale = self.game.getScaleFactor(),
                healthWidth = $('#target .health').width() - (12 * scale),
                timeout;

            if (self.game.player) {
                self.game.player.onSetTarget(function(target, name, mouseOver) {
                    var elementType = '#target',
                        sprite = target.sprite,
                        x, y;

                    if (mouseOver)
                        elementType = '#inspector';

                    var element = $(elementType),
                        nameEl = $(elementType + ' .name'),
                        headshot = $(elementType + ' .headshot div'),
                        details = $(elementType + ' .details'),
                        health = $(elementType + ' .health'),
                        isItem = ItemTypes.isItem(target.kind),
                        animation = isItem ? 'idle' : 'idle_down';

                    x = ((sprite.animationData[animation].length - 1) * sprite.width);
                    y = ((sprite.animationData[animation].row) * sprite.height);


                    nameEl.text(target.title ? target.title : name);
                    nameEl.css('text-transform', 'capitalize');

                    if (elementType == '#inspector')
                        details.text(target instanceof Mob ? 'Level - ' + target.level : (target instanceof Item ? target.getInfoMsg() : 'null'));

                    headshot.height(sprite.height);
                    headshot.width(sprite.width);
                    headshot.css({
                        'margin-left': '-' + (sprite.width / 2) + 'px',
                        'margin-top': '-' + (sprite.height / 2) + 'px',
                        'background': 'url("img/1/' + (target instanceof Item ? 'item-' + name : name) + '.png") no-repeat -' + x + 'px -' + y + 'px'
                    });

                    health.css('width', target.healthPoints ? Math.round(target.healthPoints / target.maxHp * 100) : '100%');

                    element.fadeIn('fast');

                    if (mouseOver) {
                        clearTimeout(timeout);

                        timeout = null;

                        timeout = setTimeout(function() {
                            $('#inspector').fadeOut('fast');

                            if (self.game.player)
                                self.game.player.inspecting = null;
                        }, 2000);
                    }
                });

                self.game.onUpdateTarget(function(target) {
                    var health = $('#target .health'),
                        life = $('#target .life'),
                        inspectorHealth = $('#inspector .health');

                    health.css('width', Math.ceil(target.healthPoints / target.maxHp * 100) + '%');

                    life.text(target.healthPoints > 0 ? target.healthPoints + '/' + target.maxHp : 0);
                    life.css('text-transform', 'capitalize');

                    if (self.game.player.inspecting && self.game.player.inspecting.id == target.id)
                        inspectorHealth.css('width', Math.ceil(target.healthPoints / target.maxHp * 100) + '%');
                });

                self.game.player.onRemoveTarget(function(targetId)  {
                    var target = $('#target'),
                        inspector = $('#inspector');

                    target.fadeOut('fast');

                    if (self.game.player.inspecting && self.game.player.inspecting.id === targetId) {
                        inspector.fadeOut('fast');
                        self.game.player.inspecting = null;
                    }
                });
            }
        },
        initManaBar: function() {
            var self = this,
                scale = self.game.getScaleFactor(),
                manaWidth = $('#manabar').width() - (11 * scale);

            if (scale == 1)
                manaWidth = 77;

            self.game.onPlayerManaChange(function(mana, maxMana) {
                var bar = Math.round((manaWidth / maxMana) * (mana > 0 ? mana : 0));

                $('#mana').css('width', bar + 'px');
                $('#manatext').html('<p>' + mana + '/' + maxMana + '</p>');
            });
        },

        initExpBar: function(){
            var maxWidth = $("#expbar").width();

            this.game.onPlayerExpChange(function(level, expInThisLevel, expForLevelUp){

                var rate = expInThisLevel / expForLevelUp;

                $('#exp').css('width', (rate * maxWidth).toFixed(0) + "px");
            });
        },

        initHealthBar: function() {
            var self = this,
                scale = self.game.getScaleFactor(),
                healthWidth = $('#healthbar').width() - (11 * scale);

            if (scale == 1)
                healthWidth = 77;

            self.game.onPlayerHealthChange(function(health, maxHealth) {
                var bar = Math.round((healthWidth / maxHealth) * (health > 0 ? health : 0));

                $('#health').css('width', bar + 'px');
                $('#healthtext').html('<p>' + health + '/' + maxHealth + '</p>');
            });

            self.game.onPlayerHurt(self.blinkHealthBar.bind(self));
        },

        setPoison: function() {
            var self = this,
                player = self.game.player;

            if (player.poisoned) {
                $('#health').css({'background': '-webkit-linear-gradient(top, #33CC33, #33CC33)'});
                $('#health').css({'background': '-moz-linear-gradient(top, #33CC33, #33CC33)'});
            } else {
                $('#health').css({'background': '-webkit-linear-gradient(top, #FF8888, #FF0000)'});
                $('#health').css({'background': '-moz-linear-gradient(top, #FF8888, #FF0000)'});
            }

        },

        blinkHealthBar: function() {
            var self = this;

            if (self.game.player.poisoned)
                return;

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
                this.displayChatLog(false);
            }
        },

        displayChatLog: function(withFading) {
            $('#chatLog').fadeIn('slow');

            clearTimeout(this.showChatLog);

            if (withFading && !($('#chatbox').hasClass('active'))) {
                var duration = 5000;
                this.showChatLog = setTimeout(function() {
                    $('#chatLog').fadeOut('slow');
                }, duration);
            }
        },

        hideChat: function() {
            var self = this;

            if(this.game.started) {
                $('#chatbox').removeClass('active');
                $('#chatinput').blur();
                $('#chatbutton').removeClass('active');
                var duration = 5000;
                this.showChatLog = setTimeout(function() {
                    $('#chatLog').fadeOut('slow');
                    clearTimeout(self.showChatLog);
                }, duration);
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


        showAuctionSellDialog: function(inventoryNumber) {
            if(this.game.started) {
                $('#auctionSellDialog').addClass('active');
                $('#auctionSellCount').focus();
                $('#auctionSellCount').select();

                this.inventoryNumber = inventoryNumber;
                this.auctionsellDialogPopuped = true;
            }
        },
        hideAuctionSellDialog: function() {
            if(this.game.started) {
                $('#auctionSellDialog').removeClass('active');
                $('#auctionSellCount').blur();

                this.auctionsellDialogPopuped = false;
            }
        },

        hideWindows: function() {

            if($('body').hasClass('credits'))
                this.closeInGameScroll('credits');

            if($('body').hasClass('legal'))
                this.closeInGameScroll('legal');

            if($('body').hasClass('about'))
                this.closeInGameScroll('about');

            if($('#achievements').hasClass('active'))
                this.toggleAchievements(true);

            if($('#instructions').hasClass('active'))
                this.toggleInstructions(true);

            if ($('#inappstore.js').hasClass('active'))
                this.toggleInAppStore(true);

            this.game.closeItemInfo();
            this.game.menu.close();

            if ($('#inventoryButton').hasClass('active')) {
                $('#inventoryButton').toggleClass('active');
                this.game.inventoryHandler.toggleAllInventory();
            }

            if ($('#characterButton').hasClass('active')) {
                $('#characterButton').toggleClass('active');
                this.game.characterDialog.hide();
            }
        },

        resetPage: function() {
            var self = this,
                $achievements = $('#achievements');

            if($achievements.hasClass('active')) {
                $achievements.bind(TRANSITIONEND, function() {
                    $achievements.removeClass('page' + self.currentPage).addClass('page1');
                    self.currentPage = 1;
                    $achievements.unbind(TRANSITIONEND);
                });
            }
        },

        toggleInAppStore: function(nonRecursive) {
            if (!nonRecursive)
                this.hideWindows();

            $('#inappstore').toggleClass('active');
        },

        toggleInstructions: function(nonRecursive) {
            if (!nonRecursive)
                this.hideWindows();

            $('#instructions').toggleClass('active');
        },

        toggleAchievements: function(nonRecursive) {
            if (!nonRecursive)
                this.hideWindows();

            this.resetPage();
            $('#achievements').toggleClass('active');
            $('#helpbutton').toggleClass('active');

            if (this.blinkInterval)
                clearInterval(this.blinkInterval);
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

        showAchievementNotification: function(id, name) {
            var $notif = $('#achievement-notification'),
                $name = $notif.find('.name'),
                $button = $('#helpbutton');

            $notif.removeClass().addClass('active achievement' + id);
            $name.text(name);

            this.blinkInterval = setInterval(function() {
                $button.toggleClass('blink');
            }, 500);
        },

        initInAppPurchases: function(storeList) {
            var self = this,
                $lists = $('#storelist'),
                $page = $('#page-tmpl'),
                $item = $('#item-tmpl'),
                $coins = $('#storetext'),
                page = 0,
                count = 0,
                $p = null,
                scale = self.getScale();
            
            _.each(storeList, function(item) {
                count++;

                var $i = $item.clone();

                $i.removeAttr('id');

                $i.addClass('item' + count);
                self.setInAppData($i, item.name, item.description, item.cost);
                $i.css('background-position', '0 ' + scale * (-304) + 'px');
                $i.show();
                

                if((count - 1) % 4 === 0) {
                    page++;
                    $p = $page.clone();
                    $p.attr('id', 'page'+page);
                    $p.show();
                    $lists.append($p);
                }

                $p.append($i);
            });
        },



        setInAppData: function($el, name, description, price) {
            $el.find('.item-name').html(name);
            $el.find('.item-description').html(description);
            $el.find('.item-cost').html(price + " TTA Coins");
        },

        initAchievementList: function(achievements) {
            var self = this,
                $lists = $('#lists'),
                $page = $('#page-tmpl'),
                $achievement = $('#achievement-tmpl'),
                page = 0,
                count = 0,
                $p = null;

            _.each(achievements, function(achievement) {
                count++;

                var $a = $achievement.clone();
                $a.removeAttr('id');
                $a.addClass('achievement' + count);
                self.setAchievementData($a, achievement.name, achievement.found ? achievement.desc : "???????");
                self.achievementQuery.push($a);
                log.info("$a: " + $a);
                $a.find('.twitter').attr('href', '');
                $a.show();
                $a.find('a').click(function() {
                    var url = $(this).attr('href');

                    self.openPopup('twitter', url);
                    return false;
                });

                if((count - 1) % 4 === 0) {
                    page++;
                    $p = $page.clone();
                    $p.attr('id', 'page'+page);
                    $p.show();
                    $lists.append($p);
                }
                $p.append($a);
            });

            $('#total-achievements').text($('#achievements').find('li').length);
        },

        addUnlockedCount: function() {
            var nb = parseInt($('#unlocked-achievements').text());
            $('#unlocked-achievements').text(nb + 1);
        },

        relistAchievement: function(achievement) {
            var self = this,
                achievementId = achievement.id;

            self.setAchievementData(self.achievementQuery[achievementId], achievement.name, achievement.found ? achievement.desc : "");
        },

        unlockAchievement: function(achievementId) {
            var $achievement = $('#achievements li.achievement' + (achievementId + 1));
            $achievement.addClass('unlocked');

        },

        initUnlockedAchievements: function(achievements) {
            var self = this;

            _.each(achievements, function(achievement) {
                if (achievement.completed) {
                    self.unlockAchievement(achievement.id);

                    var nb = parseInt($('#unlocked-achievements').text());
                    $('#unlocked-achievements').text(nb + 1);
                }
            });

        },

        setAchievementData: function($el, name, desc) {
            $el.find('.achievement-name').html(name);
            $el.find('.achievement-description').html(desc);
        },

        closeInGameScroll: function(content) {
            $('body').removeClass(content);
            $('#parchment').removeClass(content);
            if(!this.game.player)
                $('body').addClass('death');

            if(content === 'about')
                $('#helpbutton').removeClass('active');
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
            if (window.focus)
                newwindow.focus();

        },

        animateParchment: function(origin, destination) {
            var self = this,
                $parchment = $('#parchment'),
                duration = 1;

            this.clearValidationErrors();

            if(this.isMobile) {
                $parchment.removeClass(origin).addClass(destination);
            } else {
                if(this.isParchmentReady) {
                    if(this.isTablet)
                        duration = 0;

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

        getScale: function() {
            var scale = this.game.renderer.getScaleFactor();

            if (this.game.renderer.mobile)
                scale = 1;

            return scale;
        },

        resizeUi: function() {
            var self = this;

            //TODO: Optimize this after finishing the tutorial.

            if (self.game) {
                if (self.game.started) {
                    self.game.resize();
                    self.initHealthBar();
                    self.initTargetHud();
                    self.initTaskHud();
                    self.initExpBar();
                    self.game.updateBars();
                } else {
                    var scale = self.game.renderer.getScaleFactor();

                    self.game.renderer.rescale(scale);
                }
            }
        },

        swiftCall: function(message) {
            this.window.webkit.messageHandlers.callbackHandler.postMessage(message);
        }
    });

    return App;
});
