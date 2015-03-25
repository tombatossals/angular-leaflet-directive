module.exports = function(karma) {
    //see package.json script:unit to run this without stopping as grunt kills it.. no bueno :(
    karma.set(require('./karma-common.conf')(karma,'Chrome', true));
};
