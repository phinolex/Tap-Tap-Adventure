define(['character'], function(Character) {

    var NpcTalk = {
        "guard": [
            "Hello there",
            "We don't need to see your identification",
            "You are not the player we're looking for",
            "Move along, move along..."
        ],

        "king": [{
			"text": [//default
				"Holy sweet potato cover rolls!!",
                                "The princess has gone missing and I have no",
                                "information whatsoever, please help!",
                                "if you find her, you must come back to me!"
                                     
			]},
			{"condition": function(game){return (game.achievements['SAVE_PRINCESS'].completed);},
			 "text": [
				"Thank you for your help adventurer",
                                "now get outta ma castel brah."
			]}

			
		],

        "villagegirl": [{
			"text": [//default
				"HELP ME!!",
                                "There are rats everywhere, please!",
                                "kill at least 10, I know they'll come back",
                                "but please!"
                                     
			]},
			{"condition": function(game){return (game.achievements['KILL_RAT'].completed);},
			 "text": [
				"I mean, rats will always be here",
                                "but thank you for your help adventurer."
			]}

			
		],


        "villager": [{
			"text": [//default
				"Hello adventurer, it seems you seek",
                                "a quest for yourself. Go out in the",
                                "wild and get some leather armour",
                                "come back and here and it's yours to keep."
			]},
			{"condition": function(game){return (game.achievements['BRING_LEATHERARMOR'].completed);},
			 "text": [
				"Psst.",
                                "Want me to tell you a secret?",
                                "Sometimes when I'm home alone I fill up my bathtub",
                                "with tomato juice and hop in it and pretend I'm a",
                                "juicy meatball."
			]}

			
		],


        "agent": [{
			"text": [//default
                                "Hello there!",
                                "I am a special agent sent from",
                                "the future to acquire a cake from the past",
                                "as we have forgotten what food is really like.",
                                "Nonetheless, would you kindly bring a cake to me?",
                                "I would highly appreciate it. :O"
                                
                                     
			]},
			{"condition": function(game){return (game.achievements['FIND_CAKE'].completed);},
			 "text": [
				"I don't even know what the world would be like",
                                "without your assistance brave warrior", 
                                "now I must go."
			]}

			
		],

        "rick": [
            "We're no strangers to love",
            "You know the rules and so do I",
            "A full commitment's what I'm thinking of",
            "You wouldn't get this from any other guy",
            "I just wanna tell you how I'm feeling",
            "Gotta make you understand",
            "Never gonna give you up",
            "Never gonna let you down",
            "Never gonna run around and desert you",
            "Never gonna make you cry",
            "Never gonna say goodbye",
            "Never gonna tell a lie and hurt you"
        ],

        "scientist": [{
			"text": [//default
				"Greetings.",
				"I am the inventor of these two potions.",
				"The red one will replenish your health points...",
				"The orange one will turn you into a firefox and make you invincible...",
				"But it only lasts for a short while.",
				"So make good use of it!",
				"Now if you'll excuse me, I need to get back to my experiments..."
			]},
			{"condition": function(game){return (game.player.invincible);},
			 "text": [
				"Did you not listen to what I said?!!",
				"the famous fire-potion only lasts a few seconds",
				"You shouldn't be wasting them talking to me…"
			]},
			{"condition": function(game){return ((game.player.getSpriteName() === "firefox")
											&& !(game.player.invincible));},
			 "text": [
				"Ha ha ha, *name*",
				"All that glitters is not gold…",
				"-sigh-",
				"Did you really think you could abuse me with your disguise?",
				"I conceived that f…, that potion.",
				"Better not use your outfit as a deterrent,",
				"The goons you'll meet will attack you whatever you look like."
			]}
			
		],

        "nyan": [
            "nyan nyan nyan nyan nyan",
            "nyan nyan nyan nyan nyan nyan nyan",
            "nyan nyan nyan nyan nyan nyan",
            "nyan nyan nyan nyan nyan nyan nyan nyan"
        ],

        "beachnpc": [
            "lorem ipsum dolor sit amet",
            "consectetur adipisicing elit, sed do eiusmod tempor"
        ],

        "forestnpc": [
            "lorem ipsum dolor sit amet",
            "consectetur adipisicing elit, sed do eiusmod tempor"
        ],

        "desertnpc": [{
            "text": ["I must teach you some of the basics",
                     "firstly, if you haven't done so, go find an axe and",
                    "come back to me when you do so."]},
          
			{"condition": function(game){return (game.achievements['BRING_AXE'].completed);},
			 "text": [
				"Hello there!",
            "Surely you may be wondering why you cannot go any further",
            "or what this area really is, in fact, why I am even here.",
            "I am here to let the players know that the game is still in development",
            "thus the area blocked due to its unfinished parts, however, I have",
            "heard that it will soon be done in a month or so, you should come then",
            "and who knows, maybe you'll have even more things to do."
			]}

			
		],
       

        "lavanpc": [
            "I warn you adventurer, I do not know what lies beyond those",
            "creatures ahead, but I'm sure it's something exquisite",
            "sadly, my path ends here, goodluck."
            
        ],

        "priest": [{
			"text": [//default
				"Hello dear adventurer, I may need your",
                                "assistance with a matter of some sort.",
                                "You see, there has been a skeleton infestation",
                                "so I need your help, go slay a few for me"
                                     
			]},
			{"condition": function(game){return (game.achievements['KILL_SKELETON'].completed);},
			 "text": [
				"Thank you for helping me, make sure you sign",
                                "up on the forum "
			]}

			
		],

        "sorcerer": [
            "Ah... I had foreseen you would come to see me.",
            "Well? How do you like my new staff?",
            "Pretty cool, eh?",
            "Where did I get it, you ask?",
            "I understand. It's easy to get envious.",
            "I actually crafted it myself, using my mad wizard skills.",
            "But let me tell you one thing...",
            "There are lots of items in this game.",
            "Some more powerful than others.",
            "In order to find them, exploration is key.",
            "Good luck."
        ],

        "octocat": [
            "Welcome to Tap Tap Adventure",
            "a great adventure lies ahead, now go, find your quest!"
        ],

        "coder": [
            "Oh hello, how are you doing on this day?",
		"Ah yes, I see, you may be wondering who I am",
		"well, you see, I am one of the few people maintaining",
		"the game, and making sure everything runs perfectly.",
		"Now off you go, I must get back to work!"
	
        ],


        "othernpc": [
            "lorem ipsum",
            "lorem ipsum"
        ]
    };

    var Npc = Character.extend({
        init: function(id, kind) {
            this._super(id, kind, 1);
            this.itemKind = Types.getKindAsString(this.kind);
            if(typeof NpcTalk[this.itemKind][0] === 'string'){
				this.discourse = -1;
				this.talkCount = NpcTalk[this.itemKind].length;
			}
			else{
				this.discourse = 0;
				this.talkCount = NpcTalk[this.itemKind][this.discourse]["text"].length;
			}
            this.talkIndex = 0;
        },
        
        selectTalk: function(game){
			var change = false;
			if(this.discourse !== -1){
				var found = false;
				for(var i = 1; !found && i<NpcTalk[this.itemKind].length; i++){
					if(NpcTalk[this.itemKind][i]["condition"](game)){
						if(this.discourse !== i){
							change = true;
							this.discourse = i;
							this.talkCount = NpcTalk[this.itemKind][this.discourse]["text"].length;
						}
						found = true;
					}
				}
				if(!found){
					if(this.discourse !== 0){
						change = true;
						this.discourse = 0;
						this.talkCount = NpcTalk[this.itemKind][this.discourse]["text"].length;
					}
				}
			}
			return change;
		},

        talk: function(game) {
            var msg = "";

            if(this.selectTalk(game) || (this.talkIndex > this.talkCount) ){
                this.talkIndex = 0;
            }
            if(this.talkIndex < this.talkCount) {
				if(this.discourse === -1){
					msg = NpcTalk[this.itemKind][this.talkIndex];
				}
				else{
					msg = NpcTalk[this.itemKind][this.discourse]["text"][this.talkIndex];
				}
            }
            this.talkIndex += 1;

            return msg.replace('*name*', game.player.name);
        }
    });

    return Npc;
});
