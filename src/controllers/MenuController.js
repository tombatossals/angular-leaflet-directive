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
            key: 'custom-parameters',
            description: 'Custom Parameters'
        },
        {
            key: 'bounds',
            description: 'Bounds'
        },
        {
            key: 'events',
            description: 'Events'
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
            key: 'google-maps',
            description: 'Google Maps'
        },
    ];
}]);
