*Source file: [client/js/game.js](https://github.com/browserquest/BrowserQuest/blob/master/client/js/game.js)*

Each achievement consists of an object defined in `initAchievements()` in `client/js/game.js`:
* `id` -- `(number)`
* `name` -- `(string)`Name of the achievement
* `desc` -- `(string)`Description of the achievement
* `isCompleted` -- `(function)`A function that returns a boolean of the achievement being achieved yet or not
* `hidden` -- `(boolean)`Whether or not the achievement shows up in the Achievements book before completion.

Achievement names
-----------------
* A_TRUE_WARRIOR
* INTO_THE_WILD
* ANGRY_RATS
* SMALL_TALK
* FAT_LOOT
* UNDERGROUND
* AT_WORLDS_END
* COWARD
* TOMB_RAIDER
* SKULL_COLLECTOR
* NINJA_LOOT
* NO_MANS_LAND
* HUNTER
* STILL_ALIVE
* MEATSHIELD
* HOT_SPOT
* HERO
* FOXY
* FOR_SCIENCE
* RICKROLLD

Achievements are unlocked via the `tryUnlockingAchievement(name)` method in `Game`.  If `this.achievements[name].isCompleted()` returns `true`, and the achievement has not already been unlocked, `this.unlock_callback(id, name, desc)` is called and the achievement sound is played.

Edit achievements
-----------------

Achievements are currently hardcoded in the js [client/js/game.js](https://github.com/browserquest/BrowserQuest/blob/master/client/js/game.js).

Area achievements are defined at line ~874 in game.js.

>                     if((self.player.gridX <= 85 && self.player.gridY <= 179 && self.player.gridY > 178) || (self.player.gridX <= 85 && self.player.gridY <= 266 && self.player.gridY > 265)) {
                        self.tryUnlockingAchievement("INTO_THE_WILD");
                    }


