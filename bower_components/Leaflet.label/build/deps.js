var deps = {
	Core: {
		src: [
			'Leaflet.label.js'
		],
		desc: 'The core of the plugin. Currently only includes the version.'
	},

	Label: {
		src: [
			'Label.js',
			'BaseMarkerMethods.js',
			'Marker.Label.js',
			'CircleMarker.Label.js',
			'Path.Label.js',
			'Map.Label.js',
			'FeatureGroup.Label.js'
		],
		desc: 'Leaflet.label plugin files.',
		deps: ['Core']
	}
};

if (typeof exports !== 'undefined') {
	exports.deps = deps;
}