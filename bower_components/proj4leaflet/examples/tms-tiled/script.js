var crs = new L.Proj.CRS.TMS(
	    'EPSG:5181',
	    '+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
	    [-30000, -60000, 494288, 464288],
	    { resolutions: [2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25] }
	),
	map = L.map('map', {
		crs: crs,
		continuousWorld: true,
		worldCopyJump: false,
		zoomControl: true
	});

new L.TileLayer('http://i{s}.maps.daum-img.net/map/image/G03/i/1.20/L{z}/{y}/{x}.png', {
	maxZoom: 14,
	minZoom: 0,
	zoomReverse: true,
	subdomains: '0123',
	continuousWorld: true,
	attribution: 'ⓒ 2012 Daum',
	tms: true
}).addTo(map);

map.setView([38.0, 127.0], 0);
