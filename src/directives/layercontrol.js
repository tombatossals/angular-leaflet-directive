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
        }
      });
    },
    template:
      '<div class="angular-leaflet-control-layers" ng-click="mainClick($event)" ng-dblclick="mainClick($event)">' +
        '<div ng-repeat="(type, lys) in layers" class="lf-{{type}}">' +
          '<div ng-repeat="(key, layer) in lys">' +
            '<div class="lf-row" ng-switch="type">' +
              '<label class="lf-icon-bl" ng-switch-when="baselayers" ng-click="changeBaseLayer(key, $event)">' +
                '<i class="lf-icon" ng-class="layer.icon"></i>' +
                '<input class="leaflet-control-layers-selector" type="radio" name="lf-radio" ' +
                  'ng-show="false" ng-checked="baselayer === key" ng-value="key" /> ' +
                '{{layer.name}}' +
              '</label>' +
              '<label class="lf-icon-ol" ng-switch-when="overlays">' +
                '<i ng-class="layer.icon"></i>' +
                '<input class="lf-control-layers-selector" type="checkbox" ng-show="false"  ng-model="layer.visible"/> ' +
                '{{layer.name}} ' +
                '<div class="lf-icons">' +
                  '<i class="lf-icon lf-up" ng-class="icons.up"></i> ' +
                  '<i class="lf-icon lf-down" ng-class="icons.down"></i> ' +
                  '<i class="lf-icon lf-open" ng-class="icons.open"></i>' +
                '</div>' +
              '</label>'+
              '<div class="lf-opacity" ng-switch-when="overlays">' +
                '<input type="text" class="lf-opacity-control" name="lf-opacity-control" data-key={{key}} ' +
                  'ng-value="layer.layerOptions.opacity === undefined? 100:layer.layerOptions.opacity*100" />' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>',
    link: function(scope, element, attrs, controller) {
      $log.debug('Scope:', scope);
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

        var unreg = scope.$watch(function() {
          if(element.children().size() > 1) {
            return element.find('.lf-opacity').size() === Object.keys(layers.overlays).length;
          }
        }, function(el) {
          if(el === true) {
            if(isDefined(element.find('.lf-opacity-control').ionRangeSlider)) {
              element.find('.lf-opacity-control').ionRangeSlider({
                min: 0,
                max: 100,
                prettify: false,
                hasGrid: false,
                hideMinMax: true,
                onChange: function(val) {
                  leafletData.getLayers().then(function(leafletLayers) {
                    var key = val.input.data().key;
                    var ly = leafletLayers.overlays[key];
                    if(map.hasLayer(ly) && ly.setOpacity) {
                      layers.overlays[key].layerOptions.opacity = val.input.val()/100;
                      ly.setOpacity(val.input.val()/100);
                    }
                  });
                }
              });
            } else {
              $log.warn('[AngularJS - Leaflet] Ion Slide Range Plugin is not loaded');
            }
            unreg();
          }
        });
      });

      leafletScope.$watch('layers.overlays', function(newOverlayLayers) {
        for(var key in newOverlayLayers) {
          newOverlayLayers[key].icon = scope.icons[(newOverlayLayers[key].visible? 'uncheck':'check')];
        }
      }, true);
    }
  };
});
