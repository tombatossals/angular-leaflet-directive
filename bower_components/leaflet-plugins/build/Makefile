JS := $(wildcard ../layer/*/*.js ../layer/*.js ../control/*js)
#JS += control/Scale.js control/Distance.js
#JS += control/Permalink.js $(wildcard control/Permalink.*.js)
JS := $(shell python ./deps.py $(JS))

#JS_EXTRA := $(JS) $(wildcard layer/*.js)
all: compiled.yui.js compiled.closure.js

compile: $(patsubst %,compiled/%,$(JS))

closure/%: ../%
	mkdir -p $(dir $@)
	java -jar /tmp/closure.jar --compilation_level ADVANCED_OPTIMIZATIONS --charset UTF-8 --js $< --js_output_file $@.tmp
	mv $@.tmp $@

yui/%: ../%
	mkdir -p $(dir $@)
	yui-compressor --charset UTF-8 -o $@.tmp $<
	mv $@.tmp $@

compiled.yui.js: $(patsubst ../%,yui/%,$(JS))
compiled.closure.js: $(patsubst ../%,closure/%,$(JS))

compiled.%.js:
	for f in $^; do cat $$f >> $@.tmp; echo >> $@.tmp; done
	mv $@.tmp $@

.PHONY: all compile
