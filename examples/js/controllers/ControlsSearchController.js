        app.controller("ControlsSearchController", [ "$scope", "leafletData", function($scope, leafletData) {
            var markersData = [
                {"loc":[41.575330,13.102411], "title":"aquamarine"},
                {"loc":[41.575730,13.002411], "title":"black"},
                {"loc":[41.807149,13.162994], "title":"blue"},
                {"loc":[41.507149,13.172994], "title":"chocolate"},
                {"loc":[41.847149,14.132994], "title":"coral"},
                {"loc":[41.219190,13.062145], "title":"cyan"},
                {"loc":[41.344190,13.242145], "title":"darkblue"},
                {"loc":[41.679190,13.122145], "title":"darkred"},
                {"loc":[41.329190,13.192145], "title":"darkgray"},
                {"loc":[41.379290,13.122545], "title":"dodgerblue"},
                {"loc":[41.409190,13.362145], "title":"gray"},
                {"loc":[41.794008,12.583884], "title":"green"},
                {"loc":[41.805008,12.982884], "title":"greenyellow"},
                {"loc":[41.536175,13.273590], "title":"red"},
                {"loc":[41.516175,13.373590], "title":"rosybrown"},
                {"loc":[41.506175,13.173590], "title":"royalblue"},
                {"loc":[41.836175,13.673590], "title":"salmon"},
                {"loc":[41.796175,13.570590], "title":"seagreen"},
                {"loc":[41.436175,13.573590], "title":"seashell"},
                {"loc":[41.336175,13.973590], "title":"silver"},
                {"loc":[41.236175,13.273590], "title":"skyblue"},
                {"loc":[41.546175,13.473590], "title":"yellow"},
                {"loc":[41.239190,13.032145], "title":"white"}
            ];
            angular.extend($scope, {
                center: {
                    lat: 41.575330,
                    lng: 13.102411,
                    zoom: 8
                },
                layers: {
                    baselayers: {
                        mapbox_light: {
                            name: 'Mapbox Light',
                            url: 'http://api.tiles.mapbox.com/v4/{mapid}/{z}/{x}/{y}.png?access_token={apikey}',
                            type: 'xyz',
                            layerOptions: {
                                apikey: 'pk.eyJ1IjoiYnVmYW51dm9scyIsImEiOiJLSURpX0pnIn0.2_9NrLz1U9bpwMQBhVk97Q',
                                mapid: 'bufanuvols.lia22g09'
                            },
                            layerParams: {
                                showOnSelector: false
                            }
                        }
                    },
                    overlays: {
                        search: {
                            name: 'search',
                            type: 'group',
                            visible: true,
                            layerParams: {
                                showOnSelector: false
                            }
                        }
                    }
                },
                controls: {},
                markers: {}
           });
           markersData.filter(function(data) {
               $scope.markers[data.title] = {
                   title: data.title,
                   lat: data.loc[0],
                   lng: data.loc[1],
                   layer: 'search',
                   label: {
                       message: data.title
                   }
               };
           });
           leafletData.getLayers().then(function(baselayers) {
               console.log(baselayers.overlays.search);
               angular.extend($scope.controls, {
                   search: {
                       layer: baselayers.overlays.search
                   }
               });
           });
       }]);