# See the README for installation instructions.
UGLIFY = node_modules/.bin/uglifyjs

all: \
	$(shell npm install && mkdir -p dist) \
	dist/leaflet.fullscreen.css \
	dist/Leaflet.fullscreen.js \
	dist/Leaflet.fullscreen.min.js \
	dist/fullscreen.png

clean:
	rm -f dist/*

dist/fullscreen.png: src/fullscreen.png
	cp src/fullscreen.png dist/fullscreen.png
	cp src/fullscreen@2x.png dist/fullscreen@2x.png

dist/leaflet.fullscreen.css: src/leaflet.fullscreen.css
	cp src/leaflet.fullscreen.css dist/leaflet.fullscreen.css

dist/Leaflet.fullscreen.js: src/Leaflet.fullscreen.js
	cp src/Leaflet.fullscreen.js dist/Leaflet.fullscreen.js

dist/Leaflet.fullscreen.min.js: dist/Leaflet.fullscreen.js
	$(UGLIFY) dist/Leaflet.fullscreen.js > dist/Leaflet.fullscreen.min.js

.PHONY: clean
