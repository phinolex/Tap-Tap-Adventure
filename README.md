# Tap Tap Adventure

[![Dependency Status](https://gemnasium.com/badges/github.com/Tach-Yon/Tap-Tap-Adventure.svg)](https://gemnasium.com/github.com/Tach-Yon/Tap-Tap-Adventure)

A massively multiplayer online experience based on Little Workshop's 2012 experimental HTML5 game - BrowserQuest. Initially, making use of WebSockets, the game has been revamped with more modern approaches such as Socket.io to ensure maximum networking performance in the comfort of your browser.

Since BrowserQuest, we have improved tons of things, rewriting the backend nearly entirely at this point, updates such as:

* Centered Camera Rendering & Side-Scroller mode
* Over a thousand new sprites (items, mobs, areas, etc.)
* API Registration and Login w/ Anti-Bruteforce protection
* Skills and Abilities
* Inventory System
* Changes towards the UI
* Questing Handler (gives quests malleability)
* Minigame Handler (anyone can create minigames)
* Party System -> (To be transformed into guilds)
* Levelling sytem
* Proper arrangement of internal server files
* Complete refactoring of major files
* Improvements to the packet system
* Tons of exploits fixed due to accessible client files
* Banking, Enchanting, Shop, Crafting Systems
* Projectiles
* Archery Class
* Tutorial

Though those changes give the game a greater purpose, there is much to be done, the following are examples:

* Improve the rendering to offer maximum performance on all devices
* Create a storyline for the game to follow -- In Progress
* Add various activities (cutting wood, making fire, fishing, etc.)
* Get a interface for Quests
* Re-arrange the map to fit in more content
* Trading System amongst players
* Create a form of economy through the shops (player sells, player buys)
* Ranking system to players (promoting PVP)
* Add multiple world support (easy and not important right now)
* Inventory interface needs to be updated
* Redo the combat system

The intent behind Tap Tap Adventure is to provide a cross-platform experience to everyone, being able to continue your progress at any time while utilizing minimal amounts of data, RAM and CPU. At the same time, we would like to invite everyone to contribute towards the development of the game. All updates posted on GitHub will be voted by other players and included in the game, or adversely, refused.


## Running the Repo

To run your own TTA server, you must `clone` the repository. You will need the latest version of NodeJS for optimal performance.

Step 1: Install Dependencies

`$ sudo npm install -d`

Step 2: Install Redis Server - https://redis.io

Step 3: Install Http-Server

`$ sudo npm install -g http-server`

Step 3.5 (Optional): Install `nodemon`

If you're planning on developing TTA, `nodemon` is a neat tool that automatically restarts the server upon detecting a change.

`$ sudo npm install -g nodemon`

Step 4: Run redis, the server and the client

You will need a separate terminal window for each of the following (ensure you are in the server directory):

`$ redis-server`

`$ node server/js/main` or if you're using nodemon `$ nodemon server/js/main.js`

`$ http-server`

Done! You can connect to the game using http://127.0.0.1:8080/client


## Copyright

Because TTA is released under the MPL 2.0 license, everyone must provide the updated source code in one way or another if they choose to start their own version of the game. Images, music and any other form of arts that do not go under this license are exempt from this.

If you are to provide new sprites to this repository, you must have proper permissions from the author or be under CC-BY-SA 3.0. In both instances, you must provide proof of this in your pull requests, and any other information regarding copyright.
