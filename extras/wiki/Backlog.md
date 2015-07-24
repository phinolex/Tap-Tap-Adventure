The Backlog is a collection of functionality to be implemented in the future.

## Admin REPL

The Admin REPL is what you see when you start the server. After booting up, the server prompts the administrator for commands. This allows the administrator to perform such tasks as

* broadcasting a message to all players,
* sending a message to a single player, as the server,
* enacting bans and pardons,
* and changing game settings without having to restart.

This is a server-only feature.

## Browser Support

* Test with all of the major browsers, then summarise results on the front README.md page.
* Find out if there's a workaround for the weird audio problems in Chromium (and Chrome?).
  * From a very quick look with Chromium, the browser hangs seem to occur on some ogg files.
  * Might be best to put this into an Issue instead of here.

## Documentation

* Finish documenting the client and server javascript files.
* Add good documentation for the Server bootstrap process.

## General UI Changes

* Remove the area transition effect, so the player is generally centered onscreen when they move.
* Addition of inventory screen, item handling inside it, and some way to access the inventory screen.
* Addition of character information screen (level, attributes, etc).  We'll need to figure out attributes for this.

## Maps

This feature revolves around enhancing map-related functionality, such as:

* adding a BrowserQuest Maps site/page where users can upload and download maps, rate them and comment on them, etc
* adding a random map generator (or multiple generators) to create unique maps of all shapes and sizes
* adding the ability to link maps via pathways, portals or just walking off the edge of one map into another
* adding the ability for the server to serve different maps to different users
* adding some kind of fast transportation system for large maps
* adding in-game "map editing" gameplay features such as:
  * farming (plant seeds, watch them grow, harvest, trade, etc)
  * assigning land to players (via admin, purchase with in-game currency, trade, etc)
  * building houses and other structures such as:
    * Movie Theaters (shows a video from YouTube, Hulu, etc)
    * Player owned and operated shops
    * Hospitals
  * reforming terrain with digging, placing dirt/stone, irrigation, etc

## Optimisation

* Get build.sh working again, so the client side javascript is streamlined.

## Website

The idea here is to...create a website for BrowserQuest :) Even browserquest.github.com would work for now.