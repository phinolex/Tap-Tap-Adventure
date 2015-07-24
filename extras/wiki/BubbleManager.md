*Source file: [client/js/bubble.js](https://github.com/browserquest/BrowserQuest/blob/master/client/js/bubble.js)*



Class to represent a manager of `Bubble`s (Speech bubbles).  It handles the creation and destroying of speech bubbles.
NOTE: Does not handle positioning

Properties
----------
* `container` -- `[DOMElement | $()]` a DOMElement/jQuery object that serves as a layer for speech bubbles
* `bubbles` -- `[object]` object containing currently-alive `Bubble`s.  Object key is `bubble.id`, value is the bubble itself


Methods
-------
**init(container)**

Assigns `this.container` to `container`, assigns `this.bubbles` to `{}`

**getBubbleById(id)**

Returns `Bubble` object from `this.bubbles` with id of `id`

**create(id, message, time)**

Creates a speech bubble with id and message provided.  The bubble will also begin its 5 second countdown to destroyance.

**update(time)**

Gets called every game tick.  Loops through `this.bubbles` and checks if any have exceeded their 5 second timer.  If so, the bubble is destroyed and removed from `this.bubbles`

**clean()**

Instantly destroys all bubbles and removes them from `this.bubbles`

**destroyBubble(id)**

Destroys bubble with `id` and removes it from `this.bubbles`

**foreachBubble(callback)**

Callback takes one argument, the currently iterated `Bubble`