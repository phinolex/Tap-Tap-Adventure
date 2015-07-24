*Source files: [client/js/home.js](https://github.com/browserquest/BrowserQuest/blob/master/client/js/home.js) and [client/js/main.js](https://github.com/browserquest/BrowserQuest/blob/master/client/js/main.js)*

# From the start

* Upon load of `index.html` in a browser, the app is kicked off by the load of `require-jquery.js` at the bottom of the document.  This script reads the data-main attribute of its `<script>` tag and loads `home.js`.
* `home.js` loads `Class`, `Underscore`, `Stacktrace`, and `Util` modules.  It then requires `main.js`.
* `main.js` loads `JQuery` `App` and `entrypoint`.  It defines the `initApp()` function and runs it.

## initApp() -- main.js

* Creates an instance of `App`.

* Does browser detection, adds identifier classes to `<body>`

* Sets up event handlers on HTML/non-canvas elements (all are click handlers unless otherwise noted).  Most of these are related to the Parchments and various screens contained within:
  * `$('body')` -- If Credits or About screens are present, this is the handler for "click anywhere to close"
  * `$('.barbutton')` -- Refers to buttons along the bottom of the in-game HUD, toggles an "active" class on them
  * `$('#chatbutton')` -- TODO: figure out what it does.  Show/hide chat input?
  * `$('#helpbutton')` -- Toggles About screen
  * `$('#achievementsbutton')` -- Toggles Achievements screen.  This button blinks when you get your first achievement.  If it's blinking, this handler will also disable that
  * `$('#instructions')` -- hides all windows
  * `$('#playercount')` -- Toggles Population Info screen
  * `$('#population')` -- Toggles Population Info screen
  * `$('.clickable')` -- Stops event propagation on anything with this class, so all clicks are handled within application js.  Smart.
  * `$('#toggle-credits')` -- Toggle Credits screen
  * `$('#create-new span')` -- If you have an existing character, clicking this brings up a new screen or something
  * `$('.delete')` -- Deletes anything in the Storage module (which uses localStorage or cookies to store your character info) and takes you to the character creation screen
  * `$('#cancel span')` -- Goes back to Select Character screen if user clicks "Cancel" on Delete Character screen
  * `$('.ribbon')` -- Toggles About screen
  * `$('#nameInput')` -- Keyup event on an `<input>`, checks if `<input>` has a value.  If so, enable the Play button.  If not, disable/keep disabled.
  * `$('#prev')` and `$('#next')` -- Used for scrolling through achievements list
  * `$('#notifications div')` -- Deals with notifications bar on the bottom (e.g. "You have killed a rat.")  
      * TODO: Add this description to the showMessage() documentation.  Wrapper contains 2 vertically-aligned spans, #message1 and #message2.  When app.showMessage(msg) is called, it sets the text of #message2 to msg, adds the class "top" to the wrapper, which triggers a CSS3 transition to slide it up a few pixels.  This provides the effect of the message "sliding up" into the notification br window.  When the transition is complete, this documented binding removes the class "top" (no transition occurs here?) and sets the text of #message2 to #message1.  showMessage() also sets a timeout of 5secs to add the "top" class to the wrapper again, which triggers the message copying (#message2 will now be blank in most cases, so it will make #message1 also blank) and eventually the removal of the "top" class.  Very clever way of showing a seemingly endless stream of messages scrolling up from the bottom.
  * `$('.close')` -- Closes all open screens
  * `$('.twitter')` and `$('.facebook')` -- Opens a new browser window for sharing the game on these social networks

* Checks Storage to see if user has already played.  If so, it shows the player name and picture instead of an input.

* Sets up the Play button click handler.  Runs app.tryStartingGame() when you click it!
  * app.tryStartingGame() calls startGame() calls start()
    * sets some server options. game.username (ie player-selected username) is set here. 
    * calls this.game.run()


* Adds an event listener to "touchstarted" event.  Not sure what the default behavior is, but this kills it.  Maybe to prevent scrolling or something?  TODO: Disable this and see what breaks.

* Sets up resize detection.  When the browser viewport gets resized, #resize-check's height will change based on its definitions in the various screen size media queries.  A near-instantaneous CSS3 transition is defined #resize-check, so these bindings occur when that finishes.  It resizes the in-game UI through Javascript (must not be able to do it with media queries for some reason?)

* Logs a message and kicks off initGame()!



## initGame() -- main.js

* Creates game object, sends reference to app object, sends reference of game objec to app

* Runs game.setup() method, which initializes the BubbleManager, Renderer, and sets the chat input in the game object

* The rest of initGame() mostly deals with setting up callbacks on various in-game events.  These callbacks mostly deal with the HTML/non-canvas elements in the app:

  * `onGameStart()` -- Sets the equipment icons to the appropriate icons for whatever equipment the player has and uses [entrypoint](https://github.com/browserquest/BrowserQuest/blob/master/client/js/entrypoint.js) to apply some log-in procedure depending on url variables.
  * `onDisconnect()` -- This gets called to display a parchment if you lose your WebSocket connection?  I was able to call it by killing the node.js server while in-game.
  * `onPlayerDeath()` -- Removes the credits screen (credits link is always potentially visible, even while game is running.  Link for it exists outside of game viewport), shows Death screen
  * `onPlayerEquipmentChange()` -- Runs app.initEquipmentIcons() to display appropriate new equipment icons
  * `onPlayerInvincible()` -- Gets called when player picks up a Firefox potion. Updates the health bar (#hitpoints) to be orange/invincible-mode
  * `onNbPlayersChange()` -- Gets called when the number (Nb) of connected players changes. Updates the player count divs (the one displayed in the bar, and the popup).  Note: the worldPlayers variable refers to players in your instance
  * `onAchievementUnlock()` -- Calls app.unlockAchievement().  Shows appropriate Achievement popdown, unlocks achievement in Achievements screen
  * `onNotification()` -- Calls app.showMessage(), displays message in notification bar along bottom of UI.

* Runs `app.initHealthBar()`, clears out the values of #nameinput and #chatbox (cleanup if you somehow exit game and get back to character selection screen?)

* Sets up click/touch handling within the #foreground canvas:
  * First it centers the app, in case you've scrolled the browser screen around
  * Calls `app.setMouseCoordinates()` for either the click event or the touch event.  The game handles all touches/clicks through its "mouse" variable.  This call interprets the event and appropriately sets the mouse coordinates to its position within the canvas.
  * Calls game.click() to handle the click/touch and hides all visible windows/parchments.

* Unbinds the click event on body that was defineded earlier.  TODO: Remove potential code duplication.  The click handler setup in `initApp()` is removed, since `initGame()` is called at the end of `initApp()`.  The handler defined here does basically the same thing, with some extra handling if the game has started.  Deals with closing the Credits and About parchments by clicking anywhere on the screen.  Also calls `game.click()` for clicks outside of the canvas on desktop clients.

* Sets up click handler for #respawn (button).  Plays the revive sound, calls `game.restart()`, removes revive parchment.

* Sets up a mousemove handler on the document.  The handler calls `app.setMouseCoordinates()` (outlined above/elsewhere), and also `game.moveCursor()` if the game is running.

* Sets up a keydown handler to toggle the chat input and buffer if Enter key is pressed.

* Sets up a keydown handler on input#chatinput to send your message if Enter key is pressed.  If no text has been entered, pressing Enter will just hide chat input.

* Sets up a keypress handler on input#nameinput to call app.tryStartingGame() if a name is given (e.g. the field is not blank).  TODO: Move this up to initApp() ?

* Sets up click handler on the Mute button to silence in-game audio

* Sets up keydown handlers for various debugging purposes (most of these are commented out):
  * Sets input focus to the chat handler if enter is pressed and the input does not have focus.  TODO: This is buggy.  To replicate: Press enter to open and focus the chat input, click something in the game screen to lose chat input focus, then press enter again.  The input gains focus, but is hidden.
  * `Space` toggles a display of blocking tiles (commented out)
  * `f` toggles debug info (commented out)
  * `Esc` hides all visible windows.  Loops through a player's attackers, calls a `stop()` method on them which appears to do nothing.  TODO: Figure this one out?
  * `a` makes your character do the "hit" animation.  (commented out).  Looks cool, maybe there were plans for a real-time/interactive combat system?

* Adds a class of "tablet" to the body tag if the player is using a tablet.

##Dependency graph
The following graph was generated using [madge](https://npmjs.org/package/madge)
[![client](https://f.cloud.github.com/assets/3218235/123582/0292f9d0-6ecb-11e2-8420-40730abb382b.png)](https://f.cloud.github.com/assets/3218235/123582/0292f9d0-6ecb-11e2-8420-40730abb382b.png)