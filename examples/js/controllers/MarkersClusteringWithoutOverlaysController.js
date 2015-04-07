        app.controller('MarkersClusteringWithoutOverlaysController', [ '$scope', function($scope) {
            angular.extend($scope, {
                london: {
                    lat: 51.505,
                    lng: -0.09,
                    zoom: 8
                },
                markers: {
                    stoke: {
                        group: 'london',
                        lat: 51.5615,
                        lng: -0.0731,
                        label: {
                            message: "Stoke",
                            options: {
                                noHide: true
                            }
                        }
                    },
                    dalston: {
                        group: 'london',
                        lat: 51.545,
                        lng: -0.070,
                        label: {
                            message: "Dalston",
                            options: {
                                noHide: true
                            }
                        }
                    },
                    wandsworth: {
                        group: 'london',
                        lat: 51.4644,
                        lng:-0.1924,
                        label: {
                            message: "Wandsworth",
                            options: {
                                noHide: true
                            }
                        }
                    },
                    battersea: {
                        group: 'london',
                        lat: 51.4638,
                        lng: -0.1677,
                        label: {
                            message: "Battersea",
                            options: {
                                noHide: true
                            }
                        }
                    }
                },
            });
        } ]);