*Source file: [client/js/bubble.js](https://github.com/browserquest/BrowserQuest/blob/master/client/js/bubble.js)*

Class to represent a speech bubble.

Properties
----------
* `id` --- `[number]` value to represent bubble (mainly used by BubbleManager)
* `element` --- `[DOMElement]` speech bubble element
* `timer` --- `[Timer]` object to destroy speech bubble after 5 seconds.

Methods
-------
**init(id, element, time)**

Assigns `this.id`, `this.element`, and `this.timer` is created as a 5 second timer, starting at `time`.

**isOver(time)**

Returns `true` if `this.timer` has run out, false otherwise.

**destroy()**

Removes `this.element` from the DOM.

**reset(time)**

Resets bubble timer to begin 5 second destroy-countdown from `time`.