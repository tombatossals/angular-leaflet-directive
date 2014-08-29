angular.module("leaflet-directive").directive('layercontrol', function ($log, leafletData, leafletHelpers) {
  return {
    restrict: "E",
    scope: {
    },
    replace: true,
    transclude: false,
    require: '^leaflet',
    controller: function ($scope, $element) {
      $log.debug('[Angular Directive - Layers] layers', $scope, $element);
      var safeApply = leafletHelpers.safeApply,
        isDefined = leafletHelpers.isDefined;
      angular.extend($scope, {
        baselayer: '',
        icons: {
          uncheck: 'fa fa-check-square-o',
          check: 'fa fa-square-o',
          radio: 'fa fa-dot-circle-o',
          unradio: 'fa fa-circle-o',
          up: 'fa fa-angle-up',
          down: 'fa fa-angle-down',
          open: 'fa fa-angle-double-down',
          close: 'fa fa-angle-double-up'
        },
        mainClick: function(e) {
          e.stopPropagation();
        },
        changeBaseLayer: function(key, e) {
          leafletHelpers.safeApply($scope, function(scp) {
            scp.baselayer = key;
            leafletData.getMap().then(function(map) {
              leafletData.getLayers().then(function(leafletLayers) {
                if(map.hasLayer(leafletLayers.baselayers[key])) {
                  return;
                }
                for(var i in scp.layers.baselayers) {
                  scp.layers.baselayers[i].icon = scp.icons.unradio;
                  if(map.hasLayer(leafletLayers.baselayers[i])) {
                    map.removeLayer(leafletLayers.baselayers[i]);
                  }
                }
                map.addLayer(leafletLayers.baselayers[key]);
                scp.layers.baselayers[key].icon = $scope.icons.radio;
              });
            });
          });
          e.preventDefault();
        },
        moveLayer: function(ly, newIndex, e) {
            var delta = Object.keys($scope.layers.baselayers).length;
            if(newIndex >= (1+delta) && newIndex <= ($scope.overlaysArray.length+delta)) {
                var oldLy;
                for(var key in $scope.layers.overlays) {
                    if($scope.layers.overlays[key].index === newIndex) {
                        oldLy = $scope.layers.overlays[key];
                        break;
                    }
                }
                if(oldLy) {
                    safeApply($scope, function() {
                        oldLy.index = ly.index;
                        ly.index = newIndex;
                    });
                }
            }
            e.stopPropagation();
            e.preventDefault();
        },
        initIndex: function(layer, idx) {
            var delta = Object.keys($scope.layers.baselayers).length;
            layer.index = isDefined(layer.index)? layer.index:idx+delta+1;
        }
      });
    },
    template:
      '<div class="angular-leaflet-control-layers" ng-click="mainClick($event)" ng-dblclick="mainClick($event)">' +
        '<div class="lf-baselayers">' +
            '<div class="lf-row" ng-repeat="(key, layer) in layers.baselayers">' +
                '<label class="lf-icon-bl" ng-click="changeBaseLayer(key, $event)">' +
                    '<i class="lf-icon" ng-class="layer.icon"></i>' +
                    '<input class="leaflet-control-layers-selector" type="radio" name="lf-radio" ' +
                        'ng-show="false" ng-checked="baselayer === key" ng-value="key" /> ' +
                    '{{layer.name}}' +
                '</label>' +
            '</div>' +
        '</div>' +
        '<div class="lf-overlays">' +
            '<div class="lf-row" ng-repeat="layer in overlaysArray | orderBy:\'index\'" ng-init="initIndex(layer, $index)">' +
                '<label class="lf-icon-ol">' +
                    '<i ng-class="layer.icon"></i>' +
                    '<input class="lf-control-layers-selector" type="checkbox" ng-show="false" ng-model="layer.visible"/> ' +
                    '{{layer.name}} ' +
                    '<div class="lf-icons">' +
                        '<i class="lf-icon lf-up" ng-class="icons.up" ng-click="moveLayer(layer, layer.index - 1, $event)"></i> ' +
                        '<i class="lf-icon lf-down" ng-class="icons.down" ng-click="moveLayer(layer, layer.index + 1, $event)"></i> ' +
                        '<i class="lf-icon lf-open" ng-class="icons.open"></i>' +
                    '</div>' +
                '</label>'+
                '<div class="lf-opacity">' +
                    '<input type="text" class="lf-opacity-control" name="lf-opacity-control" data-key="{{layer.index}}" />' +
                '</div>' +
            '</div>' +
        '</div>' +
      '</div>',
    link: function(scope, element, attrs, controller) {
        var isDefined = leafletHelpers.isDefined,
        leafletScope = controller.getLeafletScope(),
        layers = leafletScope.layers;

        scope.layers = layers;
        controller.getMap().then(function(map) {
            // Do we have a baselayers property?
            if (!isDefined(layers) || !isDefined(layers.baselayers) || Object.keys(layers.baselayers).length === 0) {
                // No baselayers property
                $log.error('[AngularJS - Leaflet] At least one baselayer has to be defined');
                return;
            }

            leafletScope.$watch('layers.baselayers', function(newBaseLayers) {
                leafletData.getLayers().then(function(leafletLayers) {
                    var key;
                    for(key in newBaseLayers) {
                      if(map.hasLayer(leafletLayers.baselayers[key])) {
                        newBaseLayers[key].icon = scope.icons.radio;
                      } else {
                        newBaseLayers[key].icon = scope.icons.unradio;
                      }
                    }
                });
            });

            leafletScope.$watch('layers.overlays', function(newOverlayLayers) {
                var overlaysArray = [];
                leafletData.getLayers().then(function(leafletLayers) {
                    for(var key in newOverlayLayers) {
                        newOverlayLayers[key].icon = scope.icons[(newOverlayLayers[key].visible? 'uncheck':'check')];
                        overlaysArray.push(newOverlayLayers[key]);
                        if(isDefined(newOverlayLayers[key].index) && leafletLayers.overlays[key].setZIndex) {
                            leafletLayers.overlays[key].setZIndex(newOverlayLayers[key].index);
                        }
                    }
                });

                var unreg = scope.$watch(function() {
                    if(element.children().size() > 1) {
                        return element.find('.lf-opacity').size() === Object.keys(layers.overlays).length;
                    }
                }, function(el) {
                    if(el === true) {
                        if(isDefined(element.find('.lf-opacity-control').ionRangeSlider)) {
                            element.find('.lf-opacity-control').each(function(idx, inp) {
                                var delta =  Object.keys(layers.baselayers).length,
                                    lyAux;
                                for(var key in scope.overlaysArray) {
                                    if(scope.overlaysArray[key].index === idx+delta+1) {
                                        lyAux = scope.overlaysArray[key];
                                    }
                                }

                                var input = angular.element(inp),
                                    op = isDefined(lyAux) && isDefined(lyAux.layerOptions)?
                                        lyAux.layerOptions.opacity:undefined;
                                input.ionRangeSlider({
                                    min: 0,
                                    from: isDefined(op)? Math.ceil(op*100):100,
                                    step: 1,
                                    max: 100,
                                    prettify: false,
                                    hasGrid: false,
                                    hideMinMax: true,
                                    onChange: function(val) {
                                        leafletData.getLayers().then(function(leafletLayers) {
                                            var key = val.input.data().key;
                                            var ly, layer;
                                            for(var k in layers.overlays) {
                                                if(layers.overlays[k].index === key) {
                                                    ly = leafletLayers.overlays[k];
                                                    layer = layers.overlays[k];
                                                    break;
                                                }
                                            }
                                            if(map.hasLayer(ly)) {
                                                layer.layerOptions = isDefined(layer.layerOptions)? layer.layerOptions:{};
                                                layer.layerOptions.opacity = val.input.val()/100;
                                                if(ly.setOpacity) {
                                                    ly.setOpacity(val.input.val()/100);
                                                }
                                                if(ly.getLayers && ly.eachLayer) {
                                                    ly.eachLayer(function(lay) {
                                                        if(lay.setOpacity) {
                                                            lay.setOpacity(val.input.val()/100);
                                                        }
                                                    });
                                                }
                                            }
                                        });
                                    }
                                });
                            });
                        } else {
                            $log.warn('[AngularJS - Leaflet] Ion Slide Range Plugin is not loaded');
                        }
                        unreg();
                    }
                });

                scope.overlaysArray = overlaysArray;
            }, true);
        });
    }
  };
});
