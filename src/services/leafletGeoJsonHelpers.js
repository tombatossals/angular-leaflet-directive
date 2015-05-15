angular.module("leaflet-directive")
.service('leafletGeoJsonHelpers', function (leafletHelpers, leafletIterators) {
    var lHlp = leafletHelpers,
    lIt = leafletIterators;
    var Point = function(lat,lng){
        this.lat = lat;
        this.lng = lng;
        return this;
    };

    var _getLat = function(value) {
        if (Array.isArray(value) && value.length === 2) {
            return value[1];
        } else if (lHlp.isDefined(value.type) && value.type === 'Point') {
            return +value.coordinates[1];
        } else {
            return +value.lat;
        }
    };

    var _getLng = function(value) {
        if (Array.isArray(value) && value.length === 2) {
            return value[0];
        } else if (lHlp.isDefined(value.type) && value.type === 'Point') {
            return +value.coordinates[0];
        } else {
            return +value.lng;
        }
    };

    var _validateCoords = function(coords) {
        if (lHlp.isUndefined(coords)) {
            return false;
        }
        if (lHlp.isArray(coords)) {
            if (coords.length === 2 && lHlp.isNumber(coords[0]) && lHlp.isNumber(coords[1])) {
                return true;
            }
        } else if (lHlp.isDefined(coords.type)) {
            if (
                coords.type === 'Point' && lHlp.isArray(coords.coordinates) &&
                coords.coordinates.length === 2  &&
                lHlp.isNumber(coords.coordinates[0]) &&
                lHlp.isNumber(coords.coordinates[1])) {
                    return true;
                }
            }

            var ret = lIt.all(['lat', 'lng'], function(pos){
                return lHlp.isDefined(coords[pos]) && lHlp.isNumber(coords[pos]);
            });
            return ret;
        };

        var _getCoords = function(value) {
            if (!value || !_validateCoords(value)) {
                return;
            }
            var p =  null;
            if (Array.isArray(value) && value.length === 2) {
                p = new Point(value[1], value[0]);
            } else if (lHlp.isDefined(value.type) && value.type === 'Point') {
                p = new Point(value.coordinates[1], value.coordinates[0]);
            } else {
                return value;
            }
            //note angular.merge is avail in angular 1.4.X we might want to fill it here
            return angular.extend(value, p);//tap on lat, lng if it doesnt exist
        };


        return {
            getLat: _getLat,
            getLng: _getLng,
            validateCoords: _validateCoords,
            getCoords: _getCoords
        };
    });
