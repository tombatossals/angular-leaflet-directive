angular.module("leaflet-directive").factory('leafletPathsHelpers', function ($rootScope, leafletLogger, leafletHelpers) {
    var isDefined = leafletHelpers.isDefined,
        isArray = leafletHelpers.isArray,
        isNumber = leafletHelpers.isNumber,
        isValidPoint = leafletHelpers.isValidPoint,
        $log = leafletLogger;
        
    var availableOptions = [
        // Path options
        'stroke', 'weight', 'color', 'opacity',
        'fill', 'fillColor', 'fillOpacity',
        'dashArray', 'lineCap', 'lineJoin', 'clickable',
        'pointerEvents', 'className',

        // Polyline options
        'smoothFactor', 'noClip'
    ];
    function _convertToLeafletLatLngs(latlngs) {
        return latlngs.filter(function(latlng) {
            return isValidPoint(latlng);
        }).map(function (latlng) {
            return _convertToLeafletLatLng(latlng);
        });
    }

    function _convertToLeafletLatLng(latlng) {
        if (isArray(latlng)) {
            return new L.LatLng(latlng[0], latlng[1]);
        } else {
            return new L.LatLng(latlng.lat, latlng.lng);
        }
    }

    function _convertToLeafletMultiLatLngs(paths) {
        return paths.map(function(latlngs) {
            return _convertToLeafletLatLngs(latlngs);
        });
    }

    function _getOptions(path, defaults) {
        var options = {};
        for (var i = 0; i < availableOptions.length; i++) {
            var optionName = availableOptions[i];

            if (isDefined(path[optionName])) {
                options[optionName] = path[optionName];
            } else if (isDefined(defaults.path[optionName])) {
                options[optionName] = defaults.path[optionName];
            }
        }

        return options;
    }

    var _updatePathOptions = function (path, data) {
        var updatedStyle = {};
        for (var i = 0; i < availableOptions.length; i++) {
            var optionName = availableOptions[i];
            if (isDefined(data[optionName])) {
                updatedStyle[optionName] = data[optionName];
            }
        }
        path.setStyle(data);
    };

    var _isValidPolyline = function(latlngs) {
        if (!isArray(latlngs)) {
            return false;
        }
        for (var i = 0; i < latlngs.length; i++) {
            var point = latlngs[i];
            if (!isValidPoint(point)) {
                return false;
            }
        }
        return true;
    };

    var pathTypes = {
        polyline: {
            isValid: function(pathData) {
                var latlngs = pathData.latlngs;
                return _isValidPolyline(latlngs);
            },
            createPath: function(options) {
                return new L.Polyline([], options);
            },
            setPath: function(path, data) {
                path.setLatLngs(_convertToLeafletLatLngs(data.latlngs));
                _updatePathOptions(path, data);
                return;
            }
        },
        multiPolyline: {
            isValid: function(pathData) {
                var latlngs = pathData.latlngs;
                if (!isArray(latlngs)) {
                    return false;
                }

                for (var i in latlngs) {
                    var polyline = latlngs[i];
                    if (!_isValidPolyline(polyline)) {
                        return false;
                    }
                }

                return true;
            },
            createPath: function(options) {
                return new L.multiPolyline([[[0,0],[1,1]]], options);
            },
            setPath: function(path, data) {
                path.setLatLngs(_convertToLeafletMultiLatLngs(data.latlngs));
                _updatePathOptions(path, data);
                return;
            }
        } ,
        polygon: {
            isValid: function(pathData) {
                var latlngs = pathData.latlngs;
                return _isValidPolyline(latlngs);
            },
            createPath: function(options) {
                return new L.Polygon([], options);
            },
            setPath: function(path, data) {
                path.setLatLngs(_convertToLeafletLatLngs(data.latlngs));
                _updatePathOptions(path, data);
                return;
            }
        },
        multiPolygon: {
            isValid: function(pathData) {
                var latlngs = pathData.latlngs;

                if (!isArray(latlngs)) {
                    return false;
                }

                for (var i in latlngs) {
                    var polyline = latlngs[i];
                    if (!_isValidPolyline(polyline)) {
                        return false;
                    }
                }

                return true;
            },
            createPath: function(options) {
                return new L.MultiPolygon([[[0,0],[1,1],[0,1]]], options);
            },
            setPath: function(path, data) {
                path.setLatLngs(_convertToLeafletMultiLatLngs(data.latlngs));
                _updatePathOptions(path, data);
                return;
            }
        },
        rectangle: {
            isValid: function(pathData) {
                var latlngs = pathData.latlngs;

                if (!isArray(latlngs) || latlngs.length !== 2) {
                    return false;
                }

                for (var i in latlngs) {
                    var point = latlngs[i];
                    if (!isValidPoint(point)) {
                        return false;
                    }
                }

                return true;
            },
            createPath: function(options) {
                return new L.Rectangle([[0,0],[1,1]], options);
            },
            setPath: function(path, data) {
                path.setBounds(new L.LatLngBounds(_convertToLeafletLatLngs(data.latlngs)));
                _updatePathOptions(path, data);
            }
        },
        circle: {
            isValid: function(pathData) {
                var point= pathData.latlngs;
                return isValidPoint(point) && isNumber(pathData.radius);
            },
            createPath: function(options) {
                return new L.Circle([0,0], 1, options);
            },
            setPath: function(path, data) {
                path.setLatLng(_convertToLeafletLatLng(data.latlngs));
                if (isDefined(data.radius)) {
                    path.setRadius(data.radius);
                }
                _updatePathOptions(path, data);
            }
        },
        circleMarker: {
            isValid: function(pathData) {
                var point= pathData.latlngs;
                return isValidPoint(point) && isNumber(pathData.radius);
            },
            createPath: function(options) {
                return new L.CircleMarker([0,0], options);
            },
            setPath: function(path, data) {
                path.setLatLng(_convertToLeafletLatLng(data.latlngs));
                if (isDefined(data.radius)) {
                    path.setRadius(data.radius);
                }
                _updatePathOptions(path, data);
            }
        }
    };

    var _getPathData = function(path) {
        var pathData = {};
        if (path.latlngs) {
            pathData.latlngs = path.latlngs;
        }

        if (path.radius) {
            pathData.radius = path.radius;
        }

        return pathData;
    };

    return {
        setPathOptions: function(leafletPath, pathType, data) {
            if(!isDefined(pathType)) {
                pathType = "polyline";
            }
            pathTypes[pathType].setPath(leafletPath, data);
        },
        createPath: function(name, path, defaults) {
            if(!isDefined(path.type)) {
                path.type = "polyline";
            }
            var options = _getOptions(path, defaults);
            var pathData = _getPathData(path);

            if (!pathTypes[path.type].isValid(pathData)) {
                $log.error("[AngularJS - Leaflet] Invalid data passed to the " + path.type + " path");
                return;
            }

            return pathTypes[path.type].createPath(options);
        }
    };
});
