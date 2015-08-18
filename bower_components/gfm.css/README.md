# gfm.css

[![](https://img.shields.io/npm/v/gfm.css.svg?style=flat-square)](https://www.npmjs.com/package/gfm.css)
[![](https://img.shields.io/travis/ngoldman/gfm.css.svg?style=flat-square)](https://travis-ci.org/ngoldman/gfm.css)

Styles for [github flavored markdown](https://help.github.com/articles/github-flavored-markdown/).

## Usage

```
npm install gfm.css
```

*..do whatever you're into, then..*

```html
<html>
...
<link rel="stylesheet" href="path/to/gfm.css">
...
<article class="markdown-body">
  <h1>rendered markdown content</h1>
  <p>wow</p>
</article>
...
</html>
```

All styles are scoped to `.markdown-body`, as on github.

### Sass

You can also use this as a [Sass](http://sass-lang.com/) library.

```scss
@import '../node_modules/gfm.css/source/gfm.scss'
```

#### Bonus

You can take `gfm.scss` as a base set of styles and go bananas with your own style flavor. Note that you need to set any variables you want to override *before* the import statement. Here are all the defaults that can be overridden:

```scss
$gfm-body-font-size:      16px !default;
$gfm-code-font-size:      12px !default;
$gfm-body-color:          #333;
$gfm-link-color:          #4183c4;
$gfm-body-font-family:    'Helvetica Neue',
                          Helvetica,
                          'Segoe UI',
                          Arial,
                          freesans,
                          sans-serif !default;
$gfm-code-font-family:    Consolas,
                          'Liberation Mono',
                          Menlo,
                          Courier,
                          monospace !default;
$gfm-input-font-family:   Helvetica,
                          Arial,
                          freesans,
                          clean,
                          sans-serif,
                          'Segoe UI Emoji',
                          'Segoe UI Symbol' !default;
$gfm-header-font-family:  $gfm-body-font-family !default;
$gfm-header-border:       'true' !default;
```

### Extra

Github's octicon anchors (for header links) and syntax highlighting styles are not included in the default build, but they're available in `source/` as `gfm-octicon-anchors.scss` and `gfm-syntax.scss` respectively if you need them.

## Development

### Install

Install dependencies with `npm install`.

### Develop

Edit `scss` source files in `source/`.

### Build

Build `gfm.css` from `source/` by running `npm run build`.

## Contributing

`gfm.css` is an **OPEN Open Source Project**. This means that:

> Individuals making significant and valuable contributions are given commit-access to the project to contribute as they see fit. This project is more like an open wiki than a standard guarded open source project.

See the [CONTRIBUTING.md](CONTRIBUTING.md) file for more details.

## License

[ISC](LICENSE.md)

### Credit

The source is a cleaned and modified version of [github-markdown-css](https://github.com/sindresorhus/github-markdown-css) which was scraped by [sindresorhus](https://github.com/sindresorhus). Original credit for the style itself is of course due to github.
