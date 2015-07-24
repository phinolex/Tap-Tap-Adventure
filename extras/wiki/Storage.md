*Source file: [client/js/storage.js](https://github.com/browserquest/BrowserQuest/blob/master/client/js/storage.js)*

Class to handle local storage on the client side.

Properties
----------
* `data` -- `[object]`An object containing all locally stored data.  Keys on `data` include:
  * `hasAlreadyPlayed` -- `[boolean]`A boolean set to true or false depending on if this is the user's first time playing
  * `player` -- `[object]`An object representing the player with the following keys:
      * `name` -- `[string]`The username given by the user
      * `weapon` -- `[string]`Name of the weapon the user is currently using
      * `armor` -- `[string]`Name of the armor the user is currently using
      * `image` -- `[string]`Name of the image to use as the character's sprite on screen
  * `achievements` -- `[object]`An object containing information about the player's achievements
      * `unlocked` -- `[array]`An array of unlocked achievement IDs
      * `ratCount` -- `[number]`An accumulator of the number of rats the player has killed
      * `skeletonCount` -- `[number]`An accumulator of the number of skeletons the player has killed
      * `totalKills` -- `[number]`An accumulator of the total kills of the player
      * `totalDmg` -- `[number]`An accumulator of the total damage the player has taken
      * `totalRevives` -- `[number]`An accumulator of the number of times the player has revived

Methods
-------
* `init()`
* `resetData()`
* `hasLocalStorage()`
* `save()`
* `clear()`
* `hasAlreadyPlayed()`
* `initPlayer(name)`
* `setPlayerName(name)`
* `setPlayerImage(img)`
* `setPlayerArmor(armor)`
* `setPlayerWeapon(weapon)`
* `savePlayer(img, armor, weapon)`
* `hasUnlockedAchievement(id)`
* `unlockAchievement(id)`
* `getAchievementCount()`
* `getRatCount()`
* `incrementRatCount()`
* `getSkeletonCount()`
* `incrementSkeletonCount()`
* `getTotalDamageTaken()`
* `addDamage(damage)`
* `getTotalKills()`
* `incrementTotalKills()`
* `getTotalRevives()`
* `incrementRevives()`

**init()**

If the user's browser supports HTML5 localStorage, it attempts to load any saved data into `data`.  Otherwise, `data` gets set by a call to `resetData()`.

**resetData()**

Sets `hasPlayedAlready` to false, sets all fields in `data.player` to empty strings, sets all accumulators in `data.achievements` to 0 and an empty array for `data.achievements.unlocked`.

**hasLocalStorage()**

Returns `true` if user's browser supports HTML5 local storage.  Inquires through `Modernizr.localstorage`.

**save()**

If `this.hasLocalStorage()`, the current value of `data` will be stored in local storage.

**clear()**

If `this.hasLocalStorage()`, it will be set to `""` and `resetData()` is called.

**hasAlreadyPlayed()**

Returns `hasAlreadyPlayed` data property.

**hasUnlockedAchievement(id)**

Returns true if `id` is in `data.achievements.unlocked` array.

**unlockAchievement(id)**

If `this.hasUnlockedAchievement(id)` returns false, push `id` to `this.data.achievements.unlocked`.