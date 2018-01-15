![WTF?! Adventure](https://github.com/design1online/WTF-Adventure/blob/master/client/img/wtfadventure.png?raw=true "WTF?! Adventure")

WTF?! Adventure is a massively multi-player online open-source project based on Little Workshop's 2012 demonstration for HTML5 WebSockets - BrowserQuest (BQ) and a subsequent fork called Tap Tap Adventure. 
WTF?! Adventure is completely open-source, allowing its community to collaborate and aid in the perfection of the game. Anyone is free to create their own derivative of WTF?! Adventure, with no strings attached.

Currently it is available on the three major platforms: iOS, Android & PC. Though compatibility is questionable on older devices, there are still features implemented to ensure maximum performance is achieved.
If you are interested in researching previous versions of the rewritten source, be sure to check out [Kaetram](https://github.com/udeva/Kaetram)

### Things added from the Tap Tap Adventure fork

- Rendering: Has been completely redone to only draw frames whenever necessary. This in turns boosts the performance on browsers such as Safari & Firefox.
- Networking & Packets: Previously, everything regarding networking was crammed into a singular class, now it has all been laid out properly with every class pertaining necessary functions.
- Dependencies: All dependencies have been brought up to date, and are constantly updated.
- Client Rework: The stress put on the client previously was unbelievable, the client not only had to receive packet data, it was responsible for parsing music, achievements, quests, item data, and many other nonsense. This has all been moved to the server side, the client received information about whatever it needs from the server, removing upwards of 20MB of unnecessary data.
- Source Structure: Since everything has been rewritten from scratch, the code itself is located in designated files following a logical structure, as opposed to random scattered code throughout the source. As an extra, the convention remains unanimous throughout the source, ensuring maximum readability is achieved all throughout. Many functions have been rewritten, and most classes incorporate the Object-Oriented Programming (OOP) paradigm. Ensuring the same thing isn't unnecessarily written a bunch of times.
- Database Loading: The new version uses MySQL as opposed to Redis. This is because MySQL is far more reliable. With this, the source is able to generate its own database structure regardless of the chosen MySQL server. Everything is stored in its according type and retrieved upon logging in.
- Data Parser: Located in server/js/util/ the parser loads all data regarding NPCs, Mobs, Items and so on right when the server starts. It is then able to use it throughout the source statically.
- Map Loading: The client-sided map has been brought down to the bare minimum, it is only responsible for its fair share of collisions (checked both client and server sided) and determining tiles and what gets drawn where. While the server-side map loading ensures the location of objects, NPCs, areas and so on. The client receives information depending on the actions taken by the player (i.e. a player walks into a new zone and must receive new music)
- Combat System: Completely rewritten and much more controlled, the combat system accounts for both single, multi, ranged or melee combat. It can easily be expanded to include special mobs (e.g. bosses). It is all done in the server-side, greatly reducing the chance of any exploit.
- Controllers: Both the client and the server side contain a folder named `controllers`. The name is pretty self explanatory, this controls important functions of the game.
- Quest System: The quest controller encompasses both achievements and quests, both have been created in a plugin format and allow for manipulation of server events. Achievements are far more simplistic in nature, consisting of minor tasks and small rewards.
- Plugin System: Expands upon the controllers and combat and allows direct control over individual items.

## Things we've added, removed or modified

- Removed crypto
- Removed weird AdvoCut font
- Updated graphics
- Updated movement cursors
- Bug fixes

## ToDo List

- Documenting codebase and adding Document.js
- Better tutorial
- Advertisements
- Private Messages
- Passive Companions
- Active Companions


## Running WTF?! Adventure

Running the server is fairly straightforward, for the most part. If you encounter any issues, make sure you use the alternative solution.

First, you must `clone` the repository. There's really no way around it, you kinda need the source to run it, y'know? You have two options:

1) Click the GitHub Clone or Download button
2) [Clone a copy of our c9.io workspace](https://ide.c9.io/design1online/taptapgame)


###### Step 1 - Install the dependencies

In the command line run: `sudo npm install`


###### Step 2 - Installing the utilities

Convert the configuration for local usage, go in both `server` folder and `client/data` folder and rename `config.json-dist` to `config.json`.

*If you're using c9.io:*
If you're using c9.io you must use port number 808, localhost as 127.0.0.1 and set the ssl flag to true.

*If you're not using c9.io:*
You can either choose to install MySQL for full distribution, or simply enable `offlineMode` in the server configuration.

If you choose to use MySQL, install `mysql-server` for the operating system you're using, and update the configuration to contain your details.


###### Step 2 - Run the server

*If you're using c9.io:*
1) Make sure MySQL is running entering this in the command line: `npm run mysql-start`
2) Now start the node server by entering: `npm start`

*If you're not using c9.io:*
Make sure MySQL is running and then start WTF adventure by entering this in the command line run: `npm start`

###### Step 3 - Connect to the server

*If you're using c9.io:*
https://{project}-{username}.c9users.io:8081/

Replace `{project}` with the name of your clone from WTF Adventure and `{username}` with your c9.io username.

*If you're not using c9.io:*
http://127.0.0.1:8081/

###### Trouble Shooting

Usually you get errors if you forgot to install the server dependancies before you try to run WTF Adventure. In that
case you can install them by typing `sudo npm install` and then trying to run WTF Adventure again.

In most cases, the server was programmed to automatically generate the MySQL data in the database given, in the event this does not occur, there are two solutions you can attempt:

1) Grant the MySQL user FULL permissions
2) Run or query the `.sql` file in the `tools` folder.

### For Developers

If you install `nodemon` as a npm dependency, it will automatically restarts the server and saves you the hassle
of having to do it yourself.
