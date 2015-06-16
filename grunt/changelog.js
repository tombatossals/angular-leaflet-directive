'use strict';
var _ = require('lodash'),
    _pkg = require('../package.json'),
    last = _.last(_pkg.version.split('.')),
    next = Number(last) + 1;

// note this will fail on new minor or major releases.. oh well manually fix it
// for now as this is mainly for changelog
_pkg.nextVersion = _pkg.version.replace(last, String(next));

module.exports = function (grunt, options) {
    return {
        options:{
            version: _pkg.nextVersion
        }
    };
};
