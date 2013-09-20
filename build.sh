#!/bin/sh
grunt build
cat dist/index.html | grep -v '<script data-main="javascripts/main" src="components/requirejs/require.js"></script>' > tmp
mv tmp dist/index.html
