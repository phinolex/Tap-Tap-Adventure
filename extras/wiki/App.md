*Source file: [client/js/app.js](https://github.com/browserquest/BrowserQuest/blob/master/client/js/app.js)*

Class to represent the game application.  This class mainly deals with managing the various HTML/non-canvas elements throughout BrowserQuest, such as the parchments, buttons, etc.

Properties
----------
* `currentPage` -- The state of the achievement screen, e.g. which page we're looking at.  Initialized as 1.  
* `blinkInterval` -- An interval object to toggle the `blink` class on the Achievements button when the first achievement has been achieved.
* `previousState`
* `isParchmentReady`
* `ready`
* `storage` -- An instance of `Storage`.
* `watchNameInputInterval`
* `$playButton` -- jQuery object of the Play button on the intro screen.
* `$playDiv` -- jQuery object of the div nested within `$playButton`.

Methods
-------
* `init()`
* `setGame(game)`
* `center()`
* `canStartGame()`
* `tryStartingGame(username, starting_callback)`
* `startGame(username, starting_callback)`
* `start(username)`
* `setMouseCoordinates(event)`
* `initHealthBar()`
* `blinkHealthBar()`
* `toggleButton()`
* `hideIntro(hidden_callback)`
* `showChat()`
* `hideChat()`
* `toggleInstructions()`
* `toggleAchievements()`
* `resetPage()`
* `initEquipmentIcons()`
* `hideWindows()`
* `showAchievementsNotification(id, name)`
* `displayUnlockedAchievement(id)`
* `unlockAchievement(id, name)`
* `initAchievementList(achievements)`
* `initUnlockedAchievements(ids)`
* `setAchievementData($el, name, desc)`
* `toggleCredits()`
* `toggleAbout()`
* `closeInGameCredits()`
* `closeInGameAbout()`
* `togglePopulationInfo()`
* `openPopup(type, url)`
* `animateParchment(origin, destination)`
* `animateMessages()`
* `resetMessagesPosition()`
* `showMessage(message)`
* `resetMessageTimer()`
* `resizeUi()`

**setGame(game)**

Takes a reference to a Game object constructed elsewhere.  Sets game-dependent variables.  Sets `ready` to true.

**center()**

Centers the game viewport on screen if the user has scrolled the browser window.

**canStartGame()**

If user is on a desktop machine, this method will return true only if `this.game`, `this.game.map`, and `this.game.map.isLoaded` all evaluate to true.  If the user is not on a desktop, it will return true if `this.game` evaluates to true.

**tryStartingGame(username, starting_callback)**

This method will start the game if the username given is not blank.  If user is on a desktop, this method assumes that `game.loadMap()` has been called already.  If the map has not yet been loaded (through a check on `this.ready` and `this.canStartGame()`), an interval is created to check every 1500ms.  `startGame(username, starting_callback)` is called when conditions are satisfied.

**startGame(username, starting_callback)**

If a `starting_callback` is given, that is executed first.  It then calls `hideIntro()`, and provides a callback to call `game.loadMap` if the user is not using a desktop machine.  The callback finishes with a call to `start(username)`.

**start(username)**

This method assumes `this.setGame(game)` has been called and the map has been loaded.  If `username` evaluates to true, it calls `game.setServerOptions` for the config that has been loaded.  It then calls `this.center()` and then `game.run()` with a callback to call `this.toggleInstructions()` if this is the player's first time.