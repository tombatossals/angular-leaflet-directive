# gfm.css changelog
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## v1.1.1
* rebuild CSS for distribution (missing from last release) ಥ_ಥ

## v1.1.0
* add `style` field for [css via npm](https://github.com/sethvincent/css-via-npm/) use cases
* add `main` field and blank index.js for [parcelify](https://github.com/rotundasoftware/parcelify/issues/28)

## v1.0.6
* rebuild distribution from source with updated dependencies

## v1.0.5
* fix header bottom border so it acts like a default

## v1.0.4
* add boolean to easily get rid of header bottom borders

## v1.0.3
* add `$gfm-body-color` and `$gfm-link-color` variables
* fix homepage url in package.json
* add defaults info to readme

## v1.0.2
* fix blockquote bottom margin issue

## v1.0.1
* fix variable override bug (use `!default`)

## v1.0.0
* let's call it stable

## v0.1.3
* move `build.js` to `scripts/`
* make a site

## v0.1.2
* remove `files` from `package.json` so that `source/` can be accessed from `node_modules/`

## v0.1.1
* rename `$mdb-font-size` to `$mdb-body-font-size`
* rename `$mdb-font-family` to `$mdb-body-font-family`
* change `$mdb-` variable prefix to `$gfm-` because that makes way more sense

## v0.1.0
* init
