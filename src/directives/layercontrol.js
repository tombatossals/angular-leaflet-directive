angular.module("leaflet-directive").directive('layercontrol', function ($log, leafletHelpers) {
  return {
    restrict: "E",
    scope: {
    },
    replace: true,
    transclude: false,
    require: '^leaflet',
    controller: function ($scope) {
      $log.debug('[Angular Directive - Layers] layers', $scope);
      angular.extend($scope, {
        icons: {
          uncheck: 'fa fa-check-square-o',
          check: 'fa fa-square-o',
          radio: 'fa fa-circle-o',
          unradio: 'fa fa-dot-circle-o',
          up: 'fa fa-angle-up',
          down: 'fa fa-angle-down'
        },
        mainClick: function(e) {
          e.stopPropagation();
        }
      });
    },
    template:
      '<div class="angular-leaflet-control-layers" ng-click="mainClick($event)" ng-dblclick="mainClick($event)">' +
        '<div ng-repeat="(type, lys) in layers" class="lf-{{type}}">' +
          '<div ng-repeat="(key, layer) in lys">' +
            '<div class="lf-row" ng-switch="type">' +
              '<label class="lf-icon-bl" ng-switch-when="baselayers">' +
                '<i ng-class="layer.icon"></i>' +
                '<input class="leaflet-control-layers-selector" type="radio" ng-checked="layer.visible" name="lf-bl" ' +
                  'ng-show="false" /> ' +
                '{{layer.name}}' +
              '</label>' +
              '<label class="lf-icon-ol" ng-switch-when="overlays">' +
                '<i ng-class="layer.icon"></i>' +
                '<input class="lf-control-layers-selector" type="checkbox" ng-checked="layer.visible" ng-show="false" /> ' +
                '{{layer.name}} ' +
                '<i ng-class="icons.up"></i> ' +
                '<i ng-class="icons.down"></i>' +
              '</label>'+
              '<div></div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>',
    link: function(scope, element, attrs, controller) {
      var isDefined = leafletHelpers.isDefined,
        leafletScope = controller.getLeafletScope(),
        layers = leafletScope.layers;

      controller.getMap().then(function(/*map*/) {
        // Do we have a baselayers property?
        if (!isDefined(layers) || !isDefined(layers.baselayers) || Object.keys(layers.baselayers).length === 0) {
          // No baselayers property
          $log.error('[AngularJS - Leaflet] At least one baselayer has to be defined');
          return;
        }

        var key;
        for(key in layers.baselayers) {
          layers.baselayers[key].icon = scope.icons[(layers.baselayers[key].visible? 'unradio':'radio')];
        }

        for(key in layers.overlays) {
          layers.overlays[key].icon = scope.icons[(layers.overlays[key].visible? 'uncheck':'check')];
        }
      });
      scope.layers = layers;
    }
  };
});
