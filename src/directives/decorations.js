angular.module("leaflet-directive").directive("decorations", function($log, leafletHelpers) {
	return {
		restrict: "A", 
		scope: false,
		replace: false,
		require: 'leaflet',

		link: function(scope, element, attrs, controller) {
			var leafletScope = controller.getLeafletScope(),
				isDefined = leafletHelpers.isDefined,
				leafletDecorations = {};

			function createDecoration(options) {
				var decoration = L.polylineDecorator(options.coordinates);
				return decoration;
			}

			function setDecorationOptions(decoration, options) {
				decoration.setPaths(options.coordinates);
				return options.setAnimatedPatterns(decoration);
			}

			controller.getMap().then(function(map) {
				// var watchDecoration = function(leafletDecoration, name) {
				// 	var animationId;
				// 	var deregisterWatch = leafletScope.$watch("decorations." + name, function(decorationData) {
				// 		clearInterval(animationId);
				// 		if (!isDefined(decorationData)) {
				// 			map.removeLayer(leafletDecoration);
				// 			deregisterWatch();
				// 			return;
				// 		}
				// 		animationId = setDecorationOptions(leafletDecoration, decorationData);
				// 	}, true);
				// };

				var animationId;
				leafletScope.$watch("decorations", function(newDecorations) {
					for (var name in leafletDecorations) {
						if (!isDefined(newDecorations) || !isDefined(newDecorations[name])) {
							delete leafletDecorations[name];
						}
						map.removeLayer(leafletDecorations[name]);
					}
					
					for (var newName in newDecorations) {
						var decorationData = newDecorations[newName],
							newDecoration = createDecoration(decorationData);

						if (isDefined(newDecoration)) {
							leafletDecorations[newName] = newDecoration;
							map.addLayer(newDecoration);
						}
						clearInterval(animationId);						
						animationId = setDecorationOptions(newDecoration, decorationData);
					}
				}, true);
			});
		}
	};
});