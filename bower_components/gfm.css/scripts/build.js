var fs = require('fs')
var sass = require('node-sass')
var CleanCSS = require('clean-css')
var pkg = require('../package.json')
var opts = { encoding: 'utf8' }
var md = require('markdown-it')({
  html: true,
  linkify: true,
  typographer: true
})

sass.render({
  file: './source/gfm.scss',
  success: buildStyle
})

buildSite()

function buildSite () {
  var header = fs.readFileSync('./site/header.html', opts)
  var footer = fs.readFileSync('./site/footer.html', opts)
  var readme = md.render(fs.readFileSync('./README.md', opts))
  var guide = md.render(fs.readFileSync('./style-guide.md', opts))

  fs.writeFile('index.html', header +
  '<strong>readme • <a href="style-guide.html">style guide</a> • <a href="https://github.com/ngoldman/gfm.css">source</a></strong>' +
  readme + footer, function (err) {
      if (err) throw err
      console.log('built index.html')
    })

  fs.writeFile('style-guide.html', header +
  '<strong><a href="./">readme</a> • style guide • <a href="https://github.com/ngoldman/gfm.css">source</a></strong>' +
  guide + footer, function (err) {
      if (err) throw err
      console.log('built style-guide.html')
    })
}

function buildStyle (result) {
  var minified = new CleanCSS().minify(result.css).styles
  var banner = '/* ' + pkg.name + ' v' + pkg.version + ' - ' +
    getDate() + ' - ' + pkg.homepage + ' */\n'

  fs.writeFile('gfm.css', banner + minified, function (err) {
    if (err) throw err
    console.log('built gfm.css')
  })
}

function getDate () {
  var d = new Date()
  var dd = d.getDate()
  var mm = d.getMonth() + 1
  var yyyy = d.getFullYear()

  if (dd < 10) dd = '0' + dd
  if (mm < 10) mm = '0' + mm

  return mm + '/' + dd + '/' + ('' + yyyy).substr(2)
}
