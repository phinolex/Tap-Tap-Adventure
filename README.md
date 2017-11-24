# Tap Tap Adventure

Tap Tap Adventure (TTA) is a massively multi-player online open-source project based on Little Workshop's 2012 demonstration for HTML5 WebSockets - BrowserQuest (BQ).

The entirety of the source has been rewritten from the ground up, this includes rendering, networking, sprite parsing, map loading, etc. The code remains true to its coding conventions and follows it thoroughly. Although, compared to its predecessor, the code is far more comprehensive and adaptable, it is, as all other repositories on this website, a work in progress. If your capabilities include following onset conventions, you are welcome to contribute!

The Plan:

- TTA is expected to remain completely open-source, allowing its community to collaborate and aid in the perfection of the game.
- The players will be able to vote on what content gets added into the game, while the coders will aid in the creation and perfection of those features
- There will be no advertisements or microtransactions in-game. There will be random merchendise in the future.
- Anyone is free to create their own derivative of TTA, with no strings attached. We will even provide toplists.
- Compatibility is, and will continue to be our number one priority.
- Cryptocurrency and direct donations will be a way for players to contribute to the game.

Currently, TTA is available on the three major platforms: iOS, Android & PC. Though compatibility is questionable on older devices, there are still features implemented to ensure maximum performance is achieved.
If you are interested in researching previous versions of the rewritten source, be sure to check out [Kaetram](https://github.com/udeva/Kaetram)

### So what exactly is new in this version?

Let us start out with this small list:

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
- Quest System: The system for quests and achievements has been laid out already, all that must be done now is finish the interface (CSS mainly) and add new quests.
- Plugin System: Expands upon the controllers and combat and allows direct control over individual items.
- Crypto: Allows the player to choose whether or not they would like to contribute, in the event they do, they will be rewarded EXP. This is not to say that AFK'ing will be allowed.


Still, there are a couple things that have to be done:

- Implementation of Quests and Achievements
- Add Guilds, Abilities, and Trading
- Minor tweaks to perfect the interface


## Running Tap Tap Adventure

Running the server is as easy as 1, 2, 3. Mostly. I'm not kidding.

First, you must `clone` the repository. There's really no way around it, you kinda need the source to run it, y'know?

###### Step 1 - Install the dependencies

`sudo npm install -d`

- Install MySQL
- Create Schema
- Create TTA user and grant permissions on Schema
- Run tools/database.sql


Copy `config.json-dist` and save as `config.json`

Udpdate mysqlUser and mysqlPassword


###### Step 2 - Run the server

`node server/js/main.js`

###### Step 3 - Connect to the server

`http://127.0.0.1:1800`

### For Developers

If you are planning on aiding with development, I highly suggest installing `nodemon` as a npm dependency, it automatically restarts the server and saves you the hassle.
