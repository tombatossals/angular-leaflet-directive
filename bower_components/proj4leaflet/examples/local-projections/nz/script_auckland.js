var crs = new L.Proj.CRS('EPSG:2193',
	'+proj=tmerc +lat_0=0 +lon_0=173 +k=0.9996 +x_0=1600000 +y_0=10000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
	{
		origin: [1565000, 6150000],
		resolutions: [
			264.583862501058,
			201.083735500804,
			132.291931250529,
			66.1459656252646,
			26.4583862501058,
			13.2291931250529,
			6.61459656252646,
			3.96875793751588,
			2.11667090000847,
			1.32291931250529,
			0.661459656252646,
			0.264583862501058,
			0.132291931250529
		]
	});

var	map = new L.Map('map', {
	crs: crs,
	continuousWorld: true,
	worldCopyJump: false
});

var tileUrl = 'http://maps.aucklandcouncil.govt.nz/ArcGIS/rest/services/Aerials/MapServer/tile/{z}/{y}/{x}',
	attrib = 'Auckland City Council &copy; 2012',
	tilelayer = new L.TileLayer(tileUrl, {
		maxZoom: 12,
		minZoom: 0,
		continuousWorld: true,
		attribution: attrib,
	});

map.addLayer(tilelayer);
map.setView([-36.852931, 174.762057], 10);
