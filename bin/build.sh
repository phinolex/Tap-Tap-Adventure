#!/usr/bin/env bash

# Script to generate an optimized client build of Tap Tap

TOPLEVELDIR="`dirname $0`/.."
BUILDDIR="$TOPLEVELDIR/client-build"
PROJECTDIR="$TOPLEVELDIR/client/js"
DESTDIR="/var/www/html/tta"

echo "Deleting previous build directory"
rm -rf "$BUILDDIR"

echo "Building client with RequireJS"
node "$TOPLEVELDIR/bin/r.js" -o "$PROJECTDIR/build.js"

echo "Removing unnecessary js files from the build directory"
find "$BUILDDIR/js" -type f \
  -not \( -name "game.js" \
  -o -name "home.js" \
  -o -name "button2.js" \
  -o -name "dialog.js" \
  -o -name "entity.js" \
  -o -name "item.js" \
  -o -name "iteminfodialog.js" \
  -o -name "bubble.js" \
  -o -name "mob.js" \
  -o -name "mobs.js" \
  -o -name "mobdata.js" \  
  -o -name "character.js" \
  -o -name "tabbook.js" \
  -o -name "tabpage.js" \
  -o -name "transition.js" \
  -o -name "timer.js" \
  -o -name "animation.js" \
  -o -name "log.js" \
  -o -name "require-jquery.js" \
  -o -name "modernizr.js" \
  -o -name "css3-mediaqueries.js" \
  -o -name "mapworker.js" \
  -o -name "detect.js" \
  -o -name "underscore.min.js" \
  -o -name "text.js" \) \
  -delete

echo "Removing sprites directory"
rm -rf "$BUILDDIR/sprites"

echo "Removing config directory"
rm -rf "$BUILDDIR/config"

echo "Moving build.txt to current dir"
mv "$BUILDDIR/build.txt" "$TOPLEVELDIR"

echo "Copying shared to build"
cp -r "../shared" "$BUILDDIR"


echo "Build complete"
