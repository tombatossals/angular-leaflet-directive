angular.module("leaflet-directive").service('leafletData', function (leafletLogger, $q, leafletHelpers) {
    var getDefer = leafletHelpers.getDefer,
        getUnresolvedDefer = leafletHelpers.getUnresolvedDefer,
        setResolvedDefer = leafletHelpers.setResolvedDefer;
        // $log = leafletLogger;

    var _private = {};
    var self = this;

    var upperFirst = function (string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    var _privateItems = [
        'map',
        'tiles',
        'layers',
        'paths',
        'markers',
        'geoJSON',
        'UTFGrid', //odd ball on naming convention keeping to not break
        'decorations',
        'directiveControls'];

    //init
    _privateItems.forEach(function(itemName){
        _private[itemName] = {};
    });

    this.unresolveMap = function (scopeId) {
        var id = leafletHelpers.obtainEffectiveMapId(_private.map, scopeId);
        _privateItems.forEach(function (itemName) {
            _private[itemName][id] = undefined;
        });
    };

    //int repetitive stuff (get and sets)
    _privateItems.forEach(function (itemName) {
        var name = upperFirst(itemName);
        self['set' + name] = function (lObject, scopeId) {
            var defer = getUnresolvedDefer(_private[itemName], scopeId);
            defer.resolve(lObject);
            setResolvedDefer(_private[itemName], scopeId);
        };

        self['get' + name] = function (scopeId) {
            var defer = getDefer(_private[itemName], scopeId);
            return defer.promise;
        };
    });
});
