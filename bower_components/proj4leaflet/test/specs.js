describe('L.Proj.Projection', function() {
	it('can create an instance from a SRS code and proj4 def', function() {
		new L.Proj.Projection(
			'EPSG:2400',
			'+lon_0=15.808277777799999 +lat_0=0.0 +k=1.0 +x_0=1500000.0 ' +
			'+y_0=0.0 +proj=tmerc +ellps=bessel +units=m ' +
			'+towgs84=414.1,41.3,603.1,-0.855,2.141,-7.023,0 +no_defs');
	});
});

describe('L.Proj.CRS', function() {
	it('can create an instance from a SRS code and proj4 def', function() {
		var crs = new L.Proj.CRS(
			'EPSG:2400',
			'+lon_0=15.808277777799999 +lat_0=0.0 +k=1.0 +x_0=1500000.0 ' +
			'+y_0=0.0 +proj=tmerc +ellps=bessel +units=m ' +
			'+towgs84=414.1,41.3,603.1,-0.855,2.141,-7.023,0 +no_defs');

		expect(crs.code).toBe('EPSG:2400');
	});

	it('can project a coordinate to a point in the defined SRS', function() {
		var crs = new L.Proj.CRS(
			'EPSG:2400',
			'+lon_0=15.808277777799999 +lat_0=0.0 +k=1.0 +x_0=1500000.0 ' +
			'+y_0=0.0 +proj=tmerc +ellps=bessel +units=m ' +
			'+towgs84=414.1,41.3,603.1,-0.855,2.141,-7.023,0 +no_defs');

		var pp = crs.project(new L.LatLng(55.723337, 14.194313));
		expect(pp.x).toBeCloseTo(1398776, 0)
		expect(pp.y).toBeCloseTo(6178304, 0);
	});

	it('has a default transformation that is [1, 0, -1, 0]', function() {
		var crs = new L.Proj.CRS('EPSG:4326', '', {
			resolutions: [1]
		});
		var ll = new L.LatLng(1, 1),
			pp = crs.latLngToPoint(ll, 0),
			up = crs.pointToLatLng(pp, 0);

		expect(pp.x).toBe(ll.lng);
		expect(pp.y).toBe(-ll.lat);
		expect(up.lat).toBe(ll.lng);
		expect(up.lng).toBe(ll.lat);
	});

	it('uses provided zoom level scales', function() {
		var crs = new L.Proj.CRS('EPSG:4326', '', {
			scales: [1, 2, 3]
		});
		var ll = new L.LatLng(1, 1);

		for (var i = 0; i < 3; i++) {
			var pp = crs.latLngToPoint(ll, i),
				up = crs.pointToLatLng(pp, i),
				s = i + 1;

			expect(pp.x).toBeCloseTo(ll.lng * s, 6);
			expect(pp.y).toBeCloseTo(-ll.lat * s, 6);
			expect(up.lat).toBeCloseTo(ll.lng, 6);
			expect(up.lng).toBeCloseTo(ll.lat, 6);
		}
	});

	it('uses provided zoom level resolutions', function() {
		var crs = new L.Proj.CRS('EPSG:4326', '', {
			resolutions: [1, 0.5, 1 / 3]
		});
		var ll = new L.LatLng(1, 1);

		for (var i = 0; i < 3; i++) {
			var pp = crs.latLngToPoint(ll, i),
				up = crs.pointToLatLng(pp, i),
				s = i + 1;

			expect(pp.x).toBeCloseTo(ll.lng * s, 6);
			expect(pp.y).toBeCloseTo(-ll.lat * s, 6);
			expect(up.lat).toBeCloseTo(ll.lng, 6);
			expect(up.lng).toBeCloseTo(ll.lat, 6);
		}
	});

	it('uses provided origin', function() {
		var crs = new L.Proj.CRS('EPSG:4326', '', {
			resolutions: [1],
			origin: [10, 10]
		});

		var ll = new L.LatLng(12, 12),
			pp = crs.latLngToPoint(ll, 0),
			up = crs.pointToLatLng(pp, 0);

		expect(pp.x).toBeCloseTo(ll.lng - 10, 6);
		expect(pp.y).toBeCloseTo(-ll.lat + 10, 6);
		expect(up.lat).toBeCloseTo(ll.lng, 6);
		expect(up.lng).toBeCloseTo(ll.lat, 6);
	});

	it('accepts custom transformation', function() {
		var crs = new L.Proj.CRS('EPSG:4326', '', {
			resolutions: [1],
			transformation: new L.Transformation(3, 0, 1, -5)
		});

		var ll = new L.LatLng(10, 10),
			pp = crs.latLngToPoint(ll, 0),
			up = crs.pointToLatLng(pp, 0);

		expect(pp.x).toBe(ll.lng * 3);
		expect(pp.y).toBe(ll.lat - 5);
		expect(up.lat).toBe(ll.lng);
		expect(up.lng).toBe(ll.lat);
	})
});

describe('L.Proj.CRS.TMS', function() {
	it('can create an instance from a SRS code and proj4 def', function() {
		var crs = new L.Proj.CRS.TMS(
			'EPSG:2400',
			'+lon_0=15.808277777799999 +lat_0=0.0 +k=1.0 +x_0=1500000.0 ' +
			'+y_0=0.0 +proj=tmerc +ellps=bessel +units=m ' +
			'+towgs84=414.1,41.3,603.1,-0.855,2.141,-7.023,0 +no_defs',
			[50,50,100,100], {
				resolutions: [1],
			});

		expect(crs.code).toBe('EPSG:2400');
	});

	it('transformation to be set from projected bounds', function() {
		var crs = new L.Proj.CRS.TMS(
			'EPSG:2400',
			'+lon_0=15.808277777799999 +lat_0=0.0 +k=1.0 +x_0=1500000.0 ' +
			'+y_0=0.0 +proj=tmerc +ellps=bessel +units=m ' +
			'+towgs84=414.1,41.3,603.1,-0.855,2.141,-7.023,0 +no_defs',
			[50,50,100,100], {
				resolutions: [1],
			}),
			t = crs.transformation;

		expect(t._a).toBe(1);
		expect(t._b).toBe(-50);
		expect(t._c).toBe(-1);
		expect(t._d).toBe(100)
	});

	it('can adjust bounds to align with tilegrid', function() {
		var resolutions = [6386.233628906251, 3193.1168144531257, 1596.5584072265628, 798.2792036132814, 399.1396018066407, 199.56980090332036, 99.78490045166018, 49.89245022583009],
			crs = new L.Proj.CRS.TMS('EPSG:900913',
				'+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs',
				[-851225.043, 6422198.546, 196550.197, 9691000.164],
				{
					resolutions: resolutions
				}
			),
			tileLayer = new L.Proj.TileLayer.TMS('http://test/{z}/{x}/{y}.png', crs),
			crs = tileLayer.crs,
			t = crs.transformation,
			upperLeft = new L.Point(-851225.043, 9691950.164),
			lowerLeft = new L.Point(-851225.043, 6422198.546),
			tp;

		for (i = 0; i < resolutions.length; i++) {
			// Mock a very stupid map
			tileLayer._map = {getZoom: function() { return i; }};

			tp = t.transform(upperLeft, crs.scale(i));
			expect(tp.x).toBeCloseTo(0, 6);
			expect(tp.y).toBeCloseTo(0, 6);

			tp = t.transform(lowerLeft, crs.scale(i));
			// Convert to a tile point
			tp.x = Math.round(tp.x / 256);
			// -1 since Leaflet uses tile's upper edge as reference
			tp.y = Math.round(tp.y / 256) - 1;
			expect(tileLayer.getTileUrl(tp)).toBe('http://test/' + i + '/0/0.png');
		}
	})
});

describe('legacy API', function() {
	it('can create a CRS from L.Proj function', function() {
		var crs = L.CRS.proj4js(
			'EPSG:2400',
			'+lon_0=15.808277777799999 +lat_0=0.0 +k=1.0 +x_0=1500000.0 ' +
			'+y_0=0.0 +proj=tmerc +ellps=bessel +units=m ' +
			'+towgs84=414.1,41.3,603.1,-0.855,2.141,-7.023,0 +no_defs');
		var pp = crs.project(new L.LatLng(55.723337, 14.194313));
		expect(pp.x).toBeCloseTo(1398776, 0)
		expect(pp.y).toBeCloseTo(6178304, 0);
		expect(crs.code).toBe('EPSG:2400');
	});
});
