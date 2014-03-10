app.controller("MenuController", [ '$scope', '$location', function($scope, $location) {

    $scope.menuItems = [
        {
            key: 'simple-map',
            description: 'Simple Map'
        },
        {
            key: 'center',
            description: 'Center'
        },
        {
            key: 'center-url-hash',
            description: 'Center Url Hash'
        },
        {
            key: 'custom-parameters',
            description: 'Custom Parameters'
        },
        {
            key: 'bounds',
            description: 'Bounds'
        },
        {
            key: 'maxbounds',
            description: 'Max Bounds'
        },
        {
            key: 'tiles',
            description: 'Tiles'
        },
        {
            key: 'tiles-zoom-changer',
            description: 'Tiles Zoom Changer'
        },
        {
            key: 'layers-simple',
            description: 'Layers Simple'
        },
        {
            key: 'overlays-simple',
            description: 'Overlays Simple'
        },
        {
            key: 'imageoverlay',
            description: 'Image Overlay'
        },
        {
            key: 'google-maps',
            description: 'Google Maps'
        },
        {
            key: 'marker',
            description: 'Marker'
        },
        {
            key: 'dragging-markers',
            description: 'Dragging Markers'
        },
        {
            key: 'path',
            description: 'Path'
        },
        {
            key: 'geojson',
            description: 'GeoJSON'
        },
        {
            key: 'legend',
            description: 'Legend'
        },
        {
            key: 'customized-markers',
            description: 'Customized markers'
        },
        {
            key: 'events',
            description: 'Events'
        },
    ];
}]);
