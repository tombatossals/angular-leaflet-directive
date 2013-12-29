app.controller("LayersSimpleController", [ '$scope', function($scope) {

    angular.extend($scope, {
        taipei: {
            lat: 25.0391667,
            lng: 121.525,
            zoom: 6
        },
        layers: {
            baselayers: {
                osm: {
                    name: 'OpenStreetMap',
                    url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                    type: 'xyz'
                },
                cloudmade2: {
                    name: 'Cloudmade Tourist',
                    type: 'xyz',
                    url: 'http://{s}.tile.cloudmade.com/{key}/{styleId}/256/{z}/{x}/{y}.png',
                    layerParams: {
                        key: '007b9471b4c74da4a6ec7ff43552b16f',
                        styleId: 7
                    }
                }
            }
        },
        defaults: {
            scrollWheelZoom: false
        }
    });
} ]);
