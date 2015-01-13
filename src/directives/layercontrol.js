angular.module("leaflet-directive").directive('opacityControl', function($log, leafletData, leafletHelpers) {
    return {
        scope: false,
        restrict: 'A',
        require: '^layercontrol',
        transclude: false,
        replace: false,
        link: function(scope, element) {
            var isDefined = leafletHelpers.isDefined,
                op;

            scope.$watch(function() {
                return scope.layerProperties[scope.layer.name];
            }, function(layerProperties) {
                if(!isDefined(layerProperties)) {
                    return;
                }

                op = layerProperties.opacity;

                if(isDefined(element.ionRangeSlider)) {
                    var input = '<input type="text" class="lf-opacity-control" data-key="' + scope.layer.index + '" value="' + op + '"/>';
                    input = angular.element(input).appendTo(element);

                    input.ionRangeSlider({
                        min: 0,
                        step: 1,
                        max: 100,
                        prettify: false,
                        hasGrid: false,
                        hideMinMax: false
                    });
                    scope.$watch(function() {
                        return scope.layerProperties[scope.layer.name].opacityControl;
                    }, function() {
                        if(scope.layer.visible && layerProperties.opacityControl) {
                            element.show();
                            input.ionRangeSlider('update', {
                                from: op,
                                onChange: function(val) {
                                    leafletData.getMap().then(function(map) {
                                        leafletData.getLayers().then(function(leafletLayers) {
                                            var key = val.input.data().key;
                                            var ly;
                                            for(var k in scope.layers.overlays) {
                                                if(scope.layers.overlays[k].index === key) {
                                                    ly = leafletLayers.overlays[k];
                                                    break;
                                                }
                                            }
                                            if(map.hasLayer(ly)) {
                                                layerProperties.opacity = val.input.val();
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
                                    });
                                }
                            });
                        } else {
                            element.hide();
                        }
                    });
                } else {
                    $log.warn('[AngularJS - Leaflet] Ion Slide Range Plugin is not loaded');
                }
            });
        }
    };
}).directive('layercontrol', function ($filter, $log, leafletData, leafletHelpers) {
  return {
    restrict: "E",
    scope: {
        setIcons: '='
    },
    replace: true,
    transclude: false,
    require: '^leaflet',
    controller: function ($scope, $element, $sce) {
      $log.debug('[Angular Directive - Layers] layers', $scope, $element);
      var safeApply = leafletHelpers.safeApply,
        isDefined = leafletHelpers.isDefined;
      angular.extend($scope, {
        baselayer: '',
        layerProperties: {},
        icons: {
          uncheck: 'fa fa-square-o',
          check: 'fa fa-check-square-o',
          radio: 'fa fa-dot-circle-o',
          unradio: 'fa fa-circle-o',
          up: 'fa fa-angle-up',
          down: 'fa fa-angle-down',
          open: 'fa fa-angle-double-down',
          close: 'fa fa-angle-double-up',
          toggleLegend: 'fa fa-pencil-square-o'
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
        },
        toggleOpacity: function(e, layer) {
            if(layer.visible) {
                var el = angular.element(e.currentTarget);
                el.toggleClass($scope.icons.close + ' ' + $scope.icons.open);
                el = el.parents('.lf-row').find('.lf-opacity');
                //el.toggle();
                $scope.layerProperties[layer.name].opacityControl = !$scope.layerProperties[layer.name].opacityControl;
            }
            e.stopPropagation();
            e.preventDefault();
        },
        toggleLegend: function(layer) {
            $scope.layerProperties[layer.name].showLegend = !$scope.layerProperties[layer.name].showLegend;
        },
        showLegend: function(layer) {
            return layer.legend && $scope.layerProperties[layer.name].showLegend;
        },
        unsafeHTML: function(html) {
          return $sce.trustAsHtml(html);
        }
      });

      var div = $element.get(0);
      if (!L.Browser.touch) {
          L.DomEvent.disableClickPropagation(div);
          L.DomEvent.on(div, 'mousewheel', L.DomEvent.stopPropagation);
      } else {
          L.DomEvent.on(div, 'click', L.DomEvent.stopPropagation);
      }
    },
    template:
      '<div class="angular-leaflet-control-layers" ng-show="overlaysArray.length">' +
        '<div class="lf-baselayers">' +
            '<div class="lf-row" ng-repeat="(key, layer) in layers.baselayers">' +
                '<label class="lf-icon-bl" ng-click="changeBaseLayer(key, $event)">' +
                    '<input class="leaflet-control-layers-selector" type="radio" name="lf-radio" ' +
                        'ng-show="false" ng-checked="baselayer === key" ng-value="key" /> ' +
                    '<i class="lf-icon lf-icon-radio" ng-class="layer.icon"></i>' +
                    '<div class="lf-text">{{layer.name}}</div>' +
                '</label>' +
            '</div>' +
        '</div>' +
        '<div class="lf-overlays">' +
            '<div class="lf-container">' +
                '<div class="lf-row" ng-repeat="layer in overlaysArray | orderBy:\'index\':order" ng-init="initIndex(layer, $index)">' +
                    '<label class="lf-icon-ol">' +
                        '<input class="lf-control-layers-selector" type="checkbox" ng-show="false" ng-model="layer.visible"/> ' +
                        '<i class="lf-icon lf-icon-check" ng-class="layer.icon"></i>' +
                        '<div class="lf-text">{{layer.name}}</div>' +
                    '</label>'+
                    '<div class="lf-icons">' +
                        '<i class="lf-icon lf-up" ng-class="icons.up" ng-click="moveLayer(layer, layer.index - orderNumber, $event)"></i> ' +
                        '<i class="lf-icon lf-down" ng-class="icons.down" ng-click="moveLayer(layer, layer.index + orderNumber, $event)"></i> ' +
                        '<i class="lf-icon lf-toggle-legend" ng-class="icons.toggleLegend" ng-if="layer.legend" ng-click="toggleLegend(layer)"></i> ' +
                        '<i class="lf-icon lf-open" ng-class="layer.opacityControl? icons.close:icons.open" ng-click="toggleOpacity($event, layer)"></i>' +
                    '</div>' +
                    '<div class="lf-legend" ng-if="showLegend(layer)" ng-bind-html="unsafeHTML(layer.legend)"></div>' +
                    '<div class="lf-opacity" opacity-control>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>' +
      '</div>',
    link: function(scope, element, attrs, controller) {
        var isDefined = leafletHelpers.isDefined,
        leafletScope = controller.getLeafletScope(),
        layers = leafletScope.layers;

        // Setting layer stack order.
        attrs.order = (isDefined(attrs.order) && (attrs.order === 'normal' || attrs.order === 'reverse'))? attrs.order:'normal';
        scope.order = attrs.order === 'normal';
        scope.orderNumber = attrs.order === 'normal'? -1:1;

        scope.layers = layers;
        controller.getMap().then(function(map) {

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
                        newOverlayLayers[key].icon = scope.icons[(newOverlayLayers[key].visible? 'check':'uncheck')];
                        overlaysArray.push(newOverlayLayers[key]);
                        if(!isDefined(scope.layerProperties[newOverlayLayers[key].name])) {
                            scope.layerProperties[newOverlayLayers[key].name] = {
                                opacity: isDefined(newOverlayLayers[key].layerOptions.opacity)? newOverlayLayers[key].layerOptions.opacity*100:100,
                                opacityControl: false,
                                showLegend: true
                            };
                        }
                        if(isDefined(newOverlayLayers[key].index) && leafletLayers.overlays[key].setZIndex) {
                            leafletLayers.overlays[key].setZIndex(newOverlayLayers[key].index);
                        }
                    }
                });
                scope.overlaysArray = overlaysArray;
            }, true);
        });

        scope.$watch('setIcons', function(newIcons) {
            angular.extend(scope.icons, newIcons);
        });
    }
  };
});
