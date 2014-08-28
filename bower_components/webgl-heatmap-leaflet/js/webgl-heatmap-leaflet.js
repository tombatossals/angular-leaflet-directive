/*
 * Creative Commons Copyright 2013 Ursudio <info@ursudio.com>
 * http://www.ursudio.com/
 * Please attribute Ursudio in any production associated with this javascript plugin.
 */

L.TileLayer.WebGLHeatMap = L.Class.extend({

    options: {
        size: 30000, // in meters
        opacity: 1,
	gradientTexture: false,
	alphaRange: 1
    },
    
    initialize: function (options) {
        this.data = [];
        L.Util.setOptions(this, options);
    },

    onAdd: function (map) {
        this.map = map;
	var mapsize = map.getSize();
	var options = this.options;
	
	var c = document.createElement("canvas");
	c.id = 'webgl-leaflet-' + L.Util.stamp(this);
        c.width = mapsize.x;
        c.height = mapsize.y;
        c.style.opacity = options.opacity;
        c.style.position = 'absolute';
		
	map.getPanes().overlayPane.appendChild(c);
        
        this.WebGLHeatMap = createWebGLHeatmap({ 
		canvas: c, 
		gradientTexture: options.gradientTexture, 
		alphaRange: [0, options.alphaRange]
	});

        this.canvas = c;
        
	map.on("move", this._plot, this);

	/* hide layer on zoom, because it doesn't animate zoom */
	map.on("zoomstart", this._hide, this);
	map.on("zoomend", this._show, this);
		
        this._plot();
    },
    
    onRemove: function (map) {
       	map.getPanes().overlayPane.removeChild(this.canvas);
       	map.off("move", this._plot, this);
	map.off("zoomstart", this._hide, this);
	map.off("zoomend", this._show, this);
    },
	
    _hide : function () {
	this.canvas.style.display = 'none';
    },

    _show : function () {
	this.canvas.style.display = 'block';
    },
	
    _clear: function () {
	var heatmap = this.WebGLHeatMap;
	heatmap.clear();
	heatmap.display();
    },
	
    _resizeRequest : undefined,
	
    _plot: function () {
	this.active = true;
	var map = this.map;
	if (this._resizeRequest !== map._resizeRequest) {
    	    this.resize();
            this._resizeRequest = map._resizeRequest;
	}
	var heatmap = this.WebGLHeatMap;
	heatmap.clear();
	L.DomUtil.setPosition(this.canvas, map.latLngToLayerPoint(map.getBounds().getNorthWest()));
        var dataLen = this.data.length;
	if (dataLen) {
            for (var i = 0; i < dataLen; i++) {
		var dataVal = this.data[i],
		latlng = new L.LatLng(dataVal[0], dataVal[1]),
		point = map.latLngToContainerPoint(latlng);
                heatmap.addPoint(
                        Math.floor(point.x),
                        Math.floor(point.y),
                        this._scale(latlng),
			dataVal[2]);
            }
            heatmap.update();
            heatmap.display();
        }
    },
	
    _scale: function (latlng) {
	// necessary to maintain accurately sized circles
	// to change scale to miles (for example), you will need to convert 40075017 (equatorial circumference of the Earth in metres) to miles
        var lngRadius = (this.options.size / 40075017) * 360 / Math.cos(L.LatLng.DEG_TO_RAD * latlng.lat);
	var latlng2 = new L.LatLng(latlng.lat, latlng.lng - lngRadius);
	var point = this.map.latLngToLayerPoint(latlng);
	var point2 = this.map.latLngToLayerPoint(latlng2);
        
	return Math.max(Math.round(point.x - point2.x), 1);
    },
	
    resize: function () {
	//helpful for maps that change sizes
	var mapsize = this.map.getSize();
	this.canvas.width = mapsize.x;
	this.canvas.height = mapsize.y;

	this.WebGLHeatMap.adjustSize();
    },

    addDataPoint: function (lat, lon, value) {
        this.data.push( [ lat, lon, value / 100 ] );
    },
	
    setData: function (dataset) {
	// format: [[lat, lon, intensity],...]
	this.data = dataset;
    },
	
    clearData: function () {
	this.data = [];
    },
	
    update: function () {
	this._plot();
    }
});

L.TileLayer.webglheatmap = function (options) {
    return new L.TileLayer.WebGLHeatMap(options);
};
