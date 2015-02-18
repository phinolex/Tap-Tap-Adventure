
define(['area'], function(Area) {

    var AudioManager = Class.extend({
        init: function(game) {
            var self = this;

            this.enabled = true;
            this.extension = Detect.canPlayMP3() ? "mp3" : "ogg";
            this.sounds = {};
            this.game = game;
            this.currentMusic = null;
            this.areas = [];
            this.musicNames = ["village", "lavaland", "dungeon", "underthesea1", "underthesea2", "veloma"];
            this.soundNames = ["loot", "hit1", "hit2", "hurt", "heal", "chat", "revive", "death", "firefox", "achievement", "kill1", "kill2", "noloot", "teleport", "chest", "npc", "npc-end"];

            var loadSoundFiles = function() {
                if(!self.game.renderer.mobile) { // disable music on mobile devices
                    log.info("Loading music files...");
                    // Load the village music first, as players always start here
                    self.loadMusic(self.musicNames.shift(), function() {
                        // Then, load all the other music files
                        _.each(self.musicNames, function(name) {
                            self.loadMusic(name);
                        });
                    });
                }
            };

            var loadMusicFiles = function() {
                var counter = _.size(self.soundNames);
                log.info("Loading sound files...");
                _.each(self.soundNames, function(name) { self.loadSound(name, function() {
                        counter -= 1;
                        if(counter === 0) {
                            if(!Detect.isSafari()) { // Disable music on Safari - See bug 738008
                                loadMusicFiles();
                            }
                        }
                    });
                });
            };

            if(!(Detect.isSafari() && Detect.isWindows())) {
                loadSoundFiles();
            } else {
                this.enabled = true; // Disable audio on Safari Windows
            }
        },

        toggle: function() {
            if(this.enabled) {
                this.enabled = false;
            
                if(this.currentMusic) {
                    this.resetMusic(this.currentMusic);
                }
            } else {
                this.enabled = true;
            
                if(this.currentMusic) {
                    this.currentMusic = null;
                }
                this.updateMusic();
            }
        },

        load: function (basePath, name, loaded_callback, channels) {
            var path = basePath + name + "." + this.extension;
            var self = this;
            try {
                var url = path;
                if (Globals.isAndroid) {
                    url = "file:///android_asset/www/" + path;
                }
                LowLatencyAudio.preloadAudio(name, url, channels, function() {
                    log.debug(path + " is ready to play.");
                    if(loaded_callback) {
                        loaded_callback();
                    }
                }, function() {
                    if(loaded_callback) {
                        loaded_callback();
                    }
                });
                
                
            } catch (e) {
            }
        },

        loadSound: function(name, handleLoaded) {
            this.load("audio/sounds/", name, handleLoaded, 4);
        },

        loadMusic: function(name, handleLoaded) {
            this.load("audio/music/", name, handleLoaded, 1);
        },

        getSound: function(name) {
            if(!this.sounds[name]) {
                return null;
            }
            var sound = _.detect(this.sounds[name], function(sound) {
                return sound.ended || sound.paused;
            });
            if(sound && sound.ended) {
                sound.currentTime = 0;
            } else {
                sound = this.sounds[name][0];
            }
            return sound;
        },

        playSound: function(name) {
            LowLatencyAudio.play(name, function() {}, function() {});
        },

        addArea: function(x, y, width, height, musicName) {
var area = new Area(x, y, width, height);
            area.musicName = musicName;
            this.areas.push(area);
        },

        getSurroundingMusic: function(entity) {
            var music = null,
                area = _.detect(this.areas, function(area) {
                    return area.contains(entity);
                });
        
            if(area) {
                music = { name: area.musicName };
            }
            return music;
        },

        updateMusic: function() {
            if(this.enabled) {
                var music = this.getSurroundingMusic(this.game.player);
        
                if(music) {
                    if(!this.isCurrentMusic(music)) {
                    	if (this.currentMusic ) {
                            LowLatencyAudio.stop(this.currentMusic.name, function() {}, function() {});
                    		this.currentMusic = null;
                    	}
                        this.playMusic(music);
                    }
                } else {
                	if(this.currentMusic) {
                		LowLatencyAudio.stop(this.currentMusic.name, function() {}, function() {});
                		this.currentMusic = null;
                	}
                }
            }
        },

         isCurrentMusic: function(music) {
            return this.currentMusic && (music.name === this.currentMusic.name);
        },
    
        playMusic: function(music) {
            LowLatencyAudio.loop(music.name, function() {}, function() {});
            this.currentMusic = music;
        },
    
        resetMusic: function(music) {
            if(music) {
            	LowLatencyAudio.stop(music.name, function() {}, function() {});

            }
        },

        fadeOutMusic: function(music, ended_callback) {
            var self = this;
            if(music && !music.sound.fadingOut) {
                this.clearFadeIn(music);
                music.sound.fadingOut = setInterval(function() {
                    var step = 0.02,
                        volume = music.sound.volume - step;

                    if(self.enabled && volume >= step) {
                        music.sound.volume = volume;
                    } else {
                        music.sound.volume = 0;
                        self.clearFadeOut(music);
                        ended_callback(music);
                    }
                }, 50);
            }
        },

        fadeInMusic: function(music) {
            var self = this;
            if(music && !music.sound.fadingIn) {
                this.clearFadeOut(music);
                music.sound.fadingIn = setInterval(function() {
                    var step = 0.01,
                        volume = music.sound.volume + step;

                    if(self.enabled && volume < 1 - step) {
                        music.sound.volume = volume;
                    } else {
                        music.sound.volume = 1;
                        self.clearFadeIn(music);
                    }
                }, 30);
            }
        },

        clearFadeOut: function(music) {
            if(music.sound.fadingOut) {
                clearInterval(music.sound.fadingOut);
                music.sound.fadingOut = null;
            }
        },

        clearFadeIn: function(music) {
            if(music.sound.fadingIn) {
                clearInterval(music.sound.fadingIn);
                music.sound.fadingIn = null;
            }
        },

        fadeOutCurrentMusic : function() {
            var self = this;
            if(this.currentMusic) {
                this.fadeOutMusic(this.currentMusic, function(music) {
                    self.resetMusic(music);
                });
                this.currentMusic = null;
            }
        }
    });

    return AudioManager;
});
