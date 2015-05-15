module.exports =
    '/*!\n' +
    '*  <%= pkg.name %> <%= pkgFunction().version %> <%= grunt.template.today(\"yyyy-mm-dd\") %>\n' +
    '*  <%= pkg.description %>\n' +
    '*  <%= pkg.repository.type %>: <%= pkg.repository.url %>\n' +
    '*/\n'
