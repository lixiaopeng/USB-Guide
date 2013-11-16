#!/bin/sh
cat dist/index.html | grep -v '<script data-main="javascripts/main" src="components/requirejs/require.js"></script>' > tmp1
cat tmp1 | grep -v 'DD_belatedPNG_0.0.8a-min.js' > tmp2
rm tmp1
mv tmp2 dist/index.html
