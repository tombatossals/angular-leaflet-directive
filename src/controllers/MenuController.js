app.controller("MenuController", [ '$scope', function($scope) {
    $scope.menuItems = [
        {
            key: 'simple-map',
            url: '#!/examples/simple-map',
            description: 'Simple Map'
        },
        {
            key: 'center',
            url: '#!/examples/center',
            description: 'Center'
        },
        {
            key: 'custom-parameters',
            url: '#!/examples/custom-parameters',
            description: 'Custom Parameters'
        },
        {
            key: 'events',
            url: '#!/examples/events',
            description: 'Events'
        },
        {
            key: 'main-marker',
            url: '#!/examples/main-marker',
            description: 'Main Marker'
        },
        {
            key: 'dragging-markers',
            url: '#!/examples/dragging-markers',
            description: 'Dragging Markers'
        },
        {
            key: 'path',
            url: '#!/examples/path',
            description: 'Path'
        },
        {
            key: 'geojson',
            url: '#!/examples/geojson',
            description: 'GeoJSON'
        },
        {
            key: 'legend',
            url: '#!/examples/legend',
            description: 'Legend'
        },
        {
            key: 'customized-markers',
            url: '#!/examples/customized-markers',
            description: 'Customized markers'
        },
        {
            key: 'google-maps',
            url: '#!/examples/google-maps',
            description: 'Google Maps'
        },
    ];
}]);
