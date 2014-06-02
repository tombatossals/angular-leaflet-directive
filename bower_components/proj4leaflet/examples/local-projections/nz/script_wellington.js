var crs = new L.Proj.CRS('EPSG:2193',
	'+proj=tmerc +lat_0=0 +lon_0=173 +k=0.9996 +x_0=1600000 +y_0=10000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
	{
		origin: [-5099531.19635, 57089446.18],
		resolutions: [
			66.1459656252646,
			33.0729828126323,
			16.933367200067735,
			8.466683600033868,
			4.233341800016934,
			2.116670900008467,
			1.0583354500042335,
			0.5291677250021167,
			0.26458386250105836,
			0.13229193125052918,
			0.06614596562526459
		]
	});

var	map = new L.Map('map', {
	crs: crs,
	continuousWorld: true,
	worldCopyJump: false
});

/*
Wellington City Council's GIS web services are available under the following terms and conditions:
http://wellington.govt.nz/about-wellington/maps/gis-data-terms-and-conditions

Aerial Imagery: Creative Commons Attribution 3.0 New Zealand Licence, http://creativecommons.org/licenses/by/3.0/nz/
Additional services listed at http://wellington.govt.nz/~/media/maps/gis/ogc-services-list.pdf
*/

var tileUrl = 'http://gis.wcc.govt.nz/arcgis/rest/services/Basemap/Aerial_Photo/MapServer/tile/{z}/{y}/{x}',
	attrib = 'Wellington City Council &copy; 2012',
	tilelayer = new L.TileLayer(tileUrl, {
		maxZoom: 10,
		minZoom: 0,
		continuousWorld: true,
		attribution: attrib,
		tileSize: 512
	});

map.addLayer(tilelayer);
map.setView([-41.288889, 174.777222], 5);
