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
  -o -name "home.js" \) \
  -delete

echo "Removing sprites directory"
rm -rf "$BUILDDIR/sprites"

echo "Removing config directory"
rm -rf "$BUILDDIR/config"

echo "Build complete"
