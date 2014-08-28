/*
 Copyright (c) 2012, Smartrak, David Leaver
 Leaflet.utfgrid is an open-source JavaScript library that provides utfgrid interaction on leaflet powered maps.
 https://github.com/danzel/Leaflet.utfgrid
*/
(function (window, undefined) {

L.Util.ajax = function (url, cb) {
	// the following is from JavaScript: The Definitive Guide
	// and https://developer.mozilla.org/en-US/docs/DOM/XMLHttpRequest/Using_XMLHttpRequest_in_IE6
	if (window.XMLHttpRequest === undefined) {
		window.XMLHttpRequest = function () {
			/*global ActiveXObject:true */
			try {
				return new ActiveXObject("Microsoft.XMLHTTP");
			}
			catch  (e) {
				throw new Error("XMLHttpRequest is not supported");
			}
		};
	}
	var response, request = new XMLHttpRequest();
	request.open("GET", url);
	request.onreadystatechange = function () {
		/*jshint evil: true */
		if (request.readyState === 4 && request.status === 200) {
			if (window.JSON) {
				response = JSON.parse(request.responseText);
			} else {
				response = eval("(" + request.responseText + ")");
			}
			cb(response);
		}
	};
	request.send();
};
L.UtfGrid = L.Class.extend({
	includes: L.Mixin.Events,
	options: {
		subdomains: 'abc',

		minZoom: 0,
		maxZoom: 18,
		tileSize: 256,

		resolution: 4,

		useJsonP: true,
		pointerCursor: true
	},

	//The thing the mouse is currently on
	_mouseOn: null,

	initialize: function (url, options) {
		L.Util.setOptions(this, options);

		this._url = url;
		this._cache = {};

		//Find a unique id in window we can use for our callbacks
		//Required for jsonP
		var i = 0;
		while (window['lu' + i]) {
			i++;
		}
		this._windowKey = 'lu' + i;
		window[this._windowKey] = {};

		var subdomains = this.options.subdomains;
		if (typeof this.options.subdomains === 'string') {
			this.options.subdomains = subdomains.split('');
		}
	},

	onAdd: function (map) {
		this._map = map;
		this._container = this._map._container;

		this._update();

		var zoom = this._map.getZoom();

		if (zoom > this.options.maxZoom || zoom < this.options.minZoom) {
			return;
		}

		map.on('click', this._click, this);
		map.on('mousemove', this._move, this);
		map.on('moveend', this._update, this);
	},

	onRemove: function () {
		var map = this._map;
		map.off('click', this._click, this);
		map.off('mousemove', this._move, this);
		map.off('moveend', this._update, this);
		if (this.options.pointerCursor) {
			this._container.style.cursor = '';
		}
	},

	_click: function (e) {
		this.fire('click', this._objectForEvent(e));
	},
	_move: function (e) {
		var on = this._objectForEvent(e);

		if (on.data !== this._mouseOn) {
			if (this._mouseOn) {
				this.fire('mouseout', { latlng: e.latlng, data: this._mouseOn });
				if (this.options.pointerCursor) {
					this._container.style.cursor = '';
				}
			}
			if (on.data) {
				this.fire('mouseover', on);
				if (this.options.pointerCursor) {
					this._container.style.cursor = 'pointer';
				}
			}

			this._mouseOn = on.data;
		} else if (on.data) {
			this.fire('mousemove', on);
		}
	},

	_objectForEvent: function (e) {
		var map = this._map,
		    point = map.project(e.latlng),
		    tileSize = this.options.tileSize,
		    resolution = this.options.resolution,
		    x = Math.floor(point.x / tileSize),
		    y = Math.floor(point.y / tileSize),
		    gridX = Math.floor((point.x - (x * tileSize)) / resolution),
		    gridY = Math.floor((point.y - (y * tileSize)) / resolution),
			max = map.options.crs.scale(map.getZoom()) / tileSize;

		x = (x + max) % max;
		y = (y + max) % max;

		var data = this._cache[map.getZoom() + '_' + x + '_' + y];
		if (!data) {
			return { latlng: e.latlng, data: null };
		}

		var idx = this._utfDecode(data.grid[gridY].charCodeAt(gridX)),
		    key = data.keys[idx],
		    result = data.data[key];

		if (!data.data.hasOwnProperty(key)) {
			result = null;
		}

		return { latlng: e.latlng, data: result};
	},

	//Load up all required json grid files
	//TODO: Load from center etc
	_update: function () {

		var bounds = this._map.getPixelBounds(),
		    zoom = this._map.getZoom(),
		    tileSize = this.options.tileSize;

		if (zoom > this.options.maxZoom || zoom < this.options.minZoom) {
			return;
		}

		var nwTilePoint = new L.Point(
				Math.floor(bounds.min.x / tileSize),
				Math.floor(bounds.min.y / tileSize)),
			seTilePoint = new L.Point(
				Math.floor(bounds.max.x / tileSize),
				Math.floor(bounds.max.y / tileSize)),
				max = this._map.options.crs.scale(zoom) / tileSize;

		//Load all required ones
		for (var x = nwTilePoint.x; x <= seTilePoint.x; x++) {
			for (var y = nwTilePoint.y; y <= seTilePoint.y; y++) {

				var xw = (x + max) % max, yw = (y + max) % max;
				var key = zoom + '_' + xw + '_' + yw;

				if (!this._cache.hasOwnProperty(key)) {
					this._cache[key] = null;

					if (this.options.useJsonP) {
						this._loadTileP(zoom, xw, yw);
					} else {
						this._loadTile(zoom, xw, yw);
					}
				}
			}
		}
	},

	_loadTileP: function (zoom, x, y) {
		var head = document.getElementsByTagName('head')[0],
		    key = zoom + '_' + x + '_' + y,
		    functionName = 'lu_' + key,
		    wk = this._windowKey,
		    self = this;

		var url = L.Util.template(this._url, L.Util.extend({
			s: L.TileLayer.prototype._getSubdomain.call(this, { x: x, y: y }),
			z: zoom,
			x: x,
			y: y,
			cb: wk + '.' + functionName
		}, this.options));

		var script = document.createElement('script');
		script.setAttribute("type", "text/javascript");
		script.setAttribute("src", url);

		window[wk][functionName] = function (data) {
			self._cache[key] = data;
			delete window[wk][functionName];
			head.removeChild(script);
		};

		head.appendChild(script);
	},

	_loadTile: function (zoom, x, y) {
		var url = L.Util.template(this._url, L.Util.extend({
			s: L.TileLayer.prototype._getSubdomain.call(this, { x: x, y: y }),
			z: zoom,
			x: x,
			y: y
		}, this.options));

		var key = zoom + '_' + x + '_' + y;
		var self = this;
		L.Util.ajax(url, function (data) {
			self._cache[key] = data;
		});
	},

	_utfDecode: function (c) {
		if (c >= 93) {
			c--;
		}
		if (c >= 35) {
			c--;
		}
		return c - 32;
	}
});

L.utfGrid = function (url, options) {
	return new L.UtfGrid(url, options);
};




}(this));