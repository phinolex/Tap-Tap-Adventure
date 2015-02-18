# Tap Tap Adventure

A 2D MMORPG originally labelled as BrowserQuest with many improvements, this ReadMe simply serves as a quick documentation for a new developer. The iOS app can only be developed on Apple Computers, therefore I (Flavius) will handle that side. What most people are forgetting about BrowserQuest is that its original intent was set to offer a HTML 5 cross-platform game, yet people seem to have taken that aspect out of the equation making it available only on the PC with many screwed up interfaces on the mobile device. With that being said, whatever that happens on the PC must happen on the iOS device with the same functionality.

The game is primarily composed of 3 major pieces, the database, the server side and the client. The server is a Node.js process which doesn't require any sort of compilation of JavaScript 'uglifying'. The client however, must be coded in its prime form, compiled using JavaScript 'uglification' then exported to the website. This is all done using r.sh, its exact methods of working must still be expanded upon. The database runs on Redis compared to traditional MySQL, as it is much quicker in terms of processing. Currently, I have been offered many new images from another BrowserQuest extension, totalling to about 300 new sprites to our use, with many more to come. Currently, the game is in need of some serious design updates and bug fixes (nothing major anymore).


Installing Tap Tap Adventure
-----------------------------

Ubuntu
------
If you're on ubuntu, this is easy, simply open terminal and go to the directory of the game and run:
	
	$ sudo apt-get install nodejs-legacy (if on ubuntu 14.04 32Bit)
	$ sudo apt-get install nodejs
	$ sudo apt-get install npm
	$ npm install -d



Windows
-------
Windows is more complex, as it may require you to install Node.js from their main website, this still needs some tutorials.


Mac OS X
---------
Download Node.js from their official website and install, use terminal and go to the directory of the game and run:

	$ npm install -d


-----------------------------------------------------------------------------------------

Documentation is not yet done, this requires a deeper explanation of the game, or use about folder.
