/**
* Defines several classes of symbol factories,
* to be used with L.PolylineDecorator
*/

L.Symbol = L.Symbol || {};

/**
* A simple dash symbol, drawn as a Polyline.
* Can also be used for dots, if 'pixelSize' option is given the 0 value.
*/
L.Symbol.Dash = L.Class.extend({
    isZoomDependant: true,
    
    options: {
        pixelSize: 10,
        pathOptions: { }
    },
    
    initialize: function (options) {
        L.Util.setOptions(this, options);
        this.options.pathOptions.clickable = false;
    },

    buildSymbol: function(dirPoint, latLngs, map, index, total) {
        var opts = this.options;
        
        // for a dot, nothing more to compute
        if(opts.pixelSize <= 1) {
            return new L.Polyline([dirPoint.latLng, dirPoint.latLng], opts.pathOptions);
        }
        
        var midPoint = map.project(dirPoint.latLng);
        var angle = (-(dirPoint.heading - 90)) * L.LatLng.DEG_TO_RAD;
        var a = new L.Point(
                midPoint.x + opts.pixelSize * Math.cos(angle + Math.PI) / 2,
                midPoint.y + opts.pixelSize * Math.sin(angle) / 2
            );
        // compute second point by central symmetry to avoid unecessary cos/sin
        var b = midPoint.add(midPoint.subtract(a));
        return new L.Polyline([map.unproject(a), map.unproject(b)], opts.pathOptions);
    }
});

L.Symbol.dash = function (options) {
    return new L.Symbol.Dash(options);
};

L.Symbol.ArrowHead = L.Class.extend({
    isZoomDependant: true,
    
    options: {
        polygon: true,
        pixelSize: 10,
        headAngle: 60,
        pathOptions: {
            stroke: false,
            weight: 2
        }
    },
    
    initialize: function (options) {
        L.Util.setOptions(this, options);
        this.options.pathOptions.clickable = false;
    },

    buildSymbol: function(dirPoint, latLngs, map, index, total) {
        var opts = this.options;
        var path;
        if(opts.polygon) {
            path = new L.Polygon(this._buildArrowPath(dirPoint, map), opts.pathOptions);
        } else {
            path = new L.Polyline(this._buildArrowPath(dirPoint, map), opts.pathOptions);
        }
        return path;
    },
    
    _buildArrowPath: function (dirPoint, map) {
        var tipPoint = map.project(dirPoint.latLng);
        var direction = (-(dirPoint.heading - 90)) * L.LatLng.DEG_TO_RAD;
        var radianArrowAngle = this.options.headAngle / 2 * L.LatLng.DEG_TO_RAD; 
        
        var headAngle1 = direction + radianArrowAngle,
            headAngle2 = direction - radianArrowAngle;
        var arrowHead1 = new L.Point(
                tipPoint.x - this.options.pixelSize * Math.cos(headAngle1),
                tipPoint.y + this.options.pixelSize * Math.sin(headAngle1)),
            arrowHead2 = new L.Point(
                tipPoint.x - this.options.pixelSize * Math.cos(headAngle2),
                tipPoint.y + this.options.pixelSize * Math.sin(headAngle2));

        return [
            map.unproject(arrowHead1),
            dirPoint.latLng,
            map.unproject(arrowHead2)
        ];
    }
});

L.Symbol.arrowHead = function (options) {
    return new L.Symbol.ArrowHead(options);
};

L.Symbol.Marker = L.Class.extend({
    isZoomDependant: false,

    options: {
        markerOptions: { },
        rotate: false
    },
    
    initialize: function (options) {
        L.Util.setOptions(this, options);
        this.options.markerOptions.clickable = false;
        this.options.markerOptions.draggable = false;
        this.isZoomDependant = (L.Browser.ie && this.options.rotate);
    },

    buildSymbol: function(directionPoint, latLngs, map, index, total) {
        if(!this.options.rotate) {
            return new L.Marker(directionPoint.latLng, this.options.markerOptions);
        }
        else {
            this.options.markerOptions.angle = directionPoint.heading;
            return new L.RotatedMarker(directionPoint.latLng, this.options.markerOptions);
        }
    }
});

L.Symbol.marker = function (options) {
    return new L.Symbol.Marker(options);
};


