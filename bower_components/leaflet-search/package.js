Package.describe({
	name: "stefcud:leaflet-search",
	version: "1.8.3",
	summary: "Leaflet Control Search",
	git: "https://github.com/stefanocudini/leaflet-search.git"
});

Package.on_use(function (api, where) {
	api.addFiles('dist/leaflet-search.min.js', 'client');
	api.addFiles('dist/leaflet-search.min.css', 'client');
	api.addFiles('images/search-icon.png', 'client');	
	api.addFiles('images/loader.gif', 'client');
	//TODO server-side searching...	
});
