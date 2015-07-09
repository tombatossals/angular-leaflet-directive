angular.module("leaflet-directive").factory('nominatimService', function ($q, $http, leafletHelpers, leafletMapDefaults) {
    var isDefined = leafletHelpers.isDefined;

    return {
        query: function(address, mapId) {
            var defaults = leafletMapDefaults.getDefaults(mapId);
            var url = defaults.nominatim.server;
            var df = $q.defer();

            $http.get(url, { params: { format: 'json', limit: 1, q: address } }).success(function(data) {
                if (data.length > 0 && isDefined(data[0].boundingbox)) {
                    df.resolve(data[0]);
                } else {
                    df.reject('[Nominatim] Invalid address');
                }
            });

            return df.promise;
        }
    };
});
