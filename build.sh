#!/bin/sh
cat dist/index.html | grep -v '<script data-main="javascripts/main" src="components/requirejs/require.js"></script>' > tmp
mv tmp dist/index.html
sed -in-place -e 's/{placeholder}/../g' dist/stylesheets/*.usb-debug.css
#cp -r dist/* ~/wandoujia2/platform/connection_wizard_ui/template/
