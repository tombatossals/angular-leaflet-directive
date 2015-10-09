'use strict';

/*jshint -W117 */
/*jshint globalstrict: true*/
/* jasmine specs for directives go here */

describe('Directive: leaflet', function() {
    var $compile = null, $rootScope = null, leafletData = null, leafletHelpers = null, leafletLogger = null;

    beforeEach(module('leaflet-directive'));
    beforeEach(inject(function(_$compile_, _$rootScope_, _leafletData_, _leafletHelpers_, _leafletLogger_){
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        leafletData = _leafletData_;
        leafletHelpers = _leafletHelpers_;
        leafletLogger = _leafletLogger_;
    }));


    afterEach(inject(function($rootScope) {
        $rootScope.$apply();
    }));

    ['', '1'].forEach(function(mapId){
      it( mapId + ' should broadcast events from the rootscope when triggered leaflet events',function(){
          var element = mapId? angular.element('<leaflet id="' + mapId + '" events="events"></leaflet>') :angular.element('<leaflet events="events"></leaflet>');
          element = $compile(element)($rootScope);
          var scope = element.scope();
          var check = {};
          var mapEvents = [
              'click',
              //'dblclick',
              'mousedown',
              'mouseup',
              'mouseover',
              'mouseout',
              'mousemove',
              'contextmenu',
              'focus',
              'blur',
              'preclick',
              'load',
              'unload',
              'viewreset',
              'movestart',
              'move',
              //'moveend',
              'dragstart',
              'drag',
              'dragend',
              'zoomstart',
              'zoomend',
              'zoomlevelschange',
              'resize',
              'autopanstart',
              //'layeradd',
              //'layerremove',
              'baselayerchange',
              'overlayadd',
              'overlayremove',
              'locationfound',
              'locationerror',
              'popupopen',
              'popupclose'
          ];

          function setEventTrue(origEventName, eventName) {
              leafletLogger.debug(eventName + ' called.');
              check[origEventName] = true;
          }

          if(mapId)
            mapId = mapId + '.';

          leafletData.getMap().then(function(map) {
              mapEvents.forEach(function(origEventName){
                  var eventName = 'leafletDirectiveMap.' + mapId + origEventName;
                  // leafletLogger.log(eventName); // Inspect
                  scope.$on(eventName, function(){
                     setEventTrue(origEventName, eventName);
                   });
                  map.fireEvent([origEventName]);
                  expect(check[origEventName]).toEqual(true);
                  check[origEventName] = undefined;
              });
          });

        });
    });

    it('invalid MAPID should NOT broadcast events from the rootscope when triggered leaflet events',function(){
        var element = angular.element('<leaflet events="events"></leaflet>');
        element = $compile(element)($rootScope);
        var scope = element.scope();
        var check = {};
        var mapEvents = [
            'click',
            //'dblclick',
            'mousedown',
            'mouseup',
            'mouseover',
            'mouseout',
            'mousemove',
            'contextmenu',
            'focus',
            'blur',
            'preclick',
            'load',
            'unload',
            'viewreset',
            'movestart',
            'move',
            //'moveend',
            'dragstart',
            'drag',
            'dragend',
            'zoomstart',
            'zoomend',
            'zoomlevelschange',
            'resize',
            'autopanstart',
            //'layeradd',
            //'layerremove',
            'baselayerchange',
            'overlayadd',
            'overlayremove',
            'locationfound',
            'locationerror',
            'popupopen',
            'popupclose'
        ];

        function setEventTrue(origEventName, eventName) {
            leafletLogger.info(eventName + ' called.');
            check[origEventName] = true;
        }

        leafletData.getMap().then(function(map) {
            mapEvents.forEach(function(origEventName){
                var eventName = 'leafletDirectiveMap.2.' + origEventName;
                // leafletLogger.log(eventName); // Inspect
                scope.$on(eventName, function(){
                   setEventTrue(origEventName, eventName);
                 });
                map.fireEvent([origEventName]);
                expect(check[origEventName]).not.toEqual(true);
            });
        });

      });

    xit('should NOT broadcast map events from the rootscope if the event-broadcast option is not an object',function() {
        //TODO: pending until problems resolved, see issue #137 in
        // https://github.com/tombatossals/angular-leaflet-directive
        /*var $scope = $rootScope.$new();
        $scope.events = 3;
        $scope.fired = false;
        $scope.$on("leafletDirectiveMap.click", function(event, args){
            $scope.fired = true;
        });
        var element = angular.element('<leaflet event-broadcast="events"></leaflet>');
        element = $compile(element)($scope);
        var map = element.scope().leaflet.map;
        map.fire("click");
        $scope.$digest();
        expect($scope.fired).toBe(false);*/
        expect(true).toBe(true);
    });

    xit('should broadcast map events (backward compatibility) from the rootscope if the event-broadcast does not have a map attribute',function() {
        //TODO: pending until problems resolved, see issue #137 in
        // https://github.com/tombatossals/angular-leaflet-directive
        var $scope = $rootScope.$new();
        $scope.events = {
            marker: {
                enable: ['click'],
                logic: 'broadcast'
            }
        };
        expect(true).toBe(true);
    });

    xit('should NOT broadcast map events from the rootscope if the event-broadcast map attribute is not an object',function() {
        //TODO: pending until problems resolved, see issue #137 in
        // https://github.com/tombatossals/angular-leaflet-directive
        var $scope = $rootScope.$new();
        $scope.events = {
            map: 3
        };
        expect(true).toBe(true);
    });

    xit('should broadcast map events from the rootscope if the event-broadcast map attribute does not have logic defined',function() {
        //TODO: pending until problems resolved, see issue #137 in
        // https://github.com/tombatossals/angular-leaflet-directive
        var $scope = $rootScope.$new();
        $scope.events = {
            map: {
                enable: ['click']
            }
        };
        expect(true).toBe(true);
    });

    xit('should NOT broadcast map events from the rootscope if the event-broadcast map attribute has logic defined but is not "emit" or "broadcast"',function() {
        //TODO: pending until problems resolved, see issue #137 in
        // https://github.com/tombatossals/angular-leaflet-directive
        var $scope = $rootScope.$new();
        $scope.events = {
            map: {
                enable: ['click'],
                logic: "boolean"
            }
        };
        expect(true).toBe(true);
    });

    xit('should emit map events from the rootscope if the event-broadcast map attribute has logic defined "emit"',function() {
        //TODO: pending until problems resolved, see issue #137 in
        // https://github.com/tombatossals/angular-leaflet-directive
        var $scope = $rootScope.$new();
        $scope.events = {
            map: {
                enable: ['click'],
                logic: "emit"
            }
        };
        expect(true).toBe(true);
    });

    xit('should broadcast map events from the rootscope if the event-broadcast map attribute has logic defined as "broadcast"',function() {
        //TODO: pending until problems resolved, see issue #137 in
        // https://github.com/tombatossals/angular-leaflet-directive
        var $scope = $rootScope.$new();
        $scope.events = {
            map: {
                enable: ['click'],
                logic: "broadcast"
            }
        };
        expect(true).toBe(true);
    });

    xit('should NOT broadcast map events from the rootscope if the event-broadcast map attribute has enabled and disabled defined',function() {
        //TODO: pending until problems resolved, see issue #137 in
        // https://github.com/tombatossals/angular-leaflet-directive
        var $scope = $rootScope.$new();
        $scope.events = {
            map: {
                enable: ['click'],
                disable: ['zoomend'],
                logic: "broadcast"
            }
        };
        expect(true).toBe(true);
    });

    xit('should NOT broadcast map events from the rootscope if the event-broadcast map attribute does not have enabled and disabled defined',function() {
        //TODO: pending until problems resolved, see issue #137 in
        // https://github.com/tombatossals/angular-leaflet-directive
        var $scope = $rootScope.$new();
        $scope.events = {
            map: {
                logic: "broadcast"
            }
        };
        expect(true).toBe(true);
    });

    xit('should NOT broadcast some map events from the rootscope if the event-broadcast map attribute disables them',function() {
        //TODO: pending until problems resolved, see issue #137 in
        // https://github.com/tombatossals/angular-leaflet-directive
        var $scope = $rootScope.$new();
        $scope.events = {
            map: {
                disable: ['click'],
                logic: "broadcast"
            }
        };
        expect(true).toBe(true);
    });

    xit('should NOT emit some map events from the rootscope if the event-broadcast map attribute disables them',function() {
        //TODO: pending until problems resolved, see issue #137 in
        // https://github.com/tombatossals/angular-leaflet-directive
        var $scope = $rootScope.$new();
        $scope.events = {
            map: {
                disable: ['click'],
                logic: "emit"
            }
        };
        expect(true).toBe(true);
    });

    xit('should broadcast some map events from the rootscope if the event-broadcast map attribute enables them',function() {
        //TODO: pending until problems resolved, see issue #137 in
        // https://github.com/tombatossals/angular-leaflet-directive
        var $scope = $rootScope.$new();
        $scope.events = {
            map: {
                enable: ['click'],
                logic: "broadcast"
            }
        };
        expect(true).toBe(true);
    });

    xit('should emit some map events from the rootscope if the event-broadcast map attribute enables them',function() {
        //TODO: pending until problems resolved, see issue #137 in
        // https://github.com/tombatossals/angular-leaflet-directive
        var $scope = $rootScope.$new();
        $scope.events = {
            map: {
                enable: ['click'],
                logic: "emit"
            }
        };
        expect(true).toBe(true);
    });

    xit('should NOT broadcast some map events from the rootscope if the event-broadcast map attribute disables them although there is an invalid event name',function() {
        //TODO: pending until problems resolved, see issue #137 in
        // https://github.com/tombatossals/angular-leaflet-directive
        var $scope = $rootScope.$new();
        $scope.events = {
            map: {
                disable: ['click', 'foo'],
                logic: "broadcast"
            }
        };
        expect(true).toBe(true);
    });

    xit('should NOT emit some map events from the rootscope if the event-broadcast map attribute disables them although there is an invalid event name',function() {
        //TODO: pending until problems resolved, see issue #137 in
        // https://github.com/tombatossals/angular-leaflet-directive
        var $scope = $rootScope.$new();
        $scope.events = {
            map: {
                disable: ['click', 'foo'],
                logic: "emit"
            }
        };
        expect(true).toBe(true);
    });

    xit('should broadcast some map events from the rootscope if the event-broadcast map attribute enables them although there is an invalid event name',function() {
        //TODO: pending until problems resolved, see issue #137 in
        // https://github.com/tombatossals/angular-leaflet-directive
        var $scope = $rootScope.$new();
        $scope.events = {
            map: {
                enable: ['click', 'foo'],
                logic: "broadcast"
            }
        };
        expect(true).toBe(true);
    });

    xit('should emit some map events from the rootscope if the event-broadcast map attribute enables them although there is an invalid event name',function() {
        //TODO: pending until problems resolved, see issue #137 in
        // https://github.com/tombatossals/angular-leaflet-directive
        var $scope = $rootScope.$new();
        $scope.events = {
            map: {
                enable: ['click', 'foo'],
                logic: "emit"
            }
        };
        expect(true).toBe(true);
    });

    xit('should broadcast marker events (backward compatibility) from the rootscope if the event-broadcast does not have a marker attribute',function() {
        //TODO: pending until problems resolved, see issue #137 in
        // https://github.com/tombatossals/angular-leaflet-directive
        var $scope = $rootScope.$new();
        $scope.events = {
            map: {
                enable: ['click'],
                logic: 'broadcast'
            }
        };
        expect(true).toBe(true);
    });

    xit('should NOT broadcast marker events from the rootscope if the event-broadcast marker attribute is not an object',function() {
        //TODO: pending until problems resolved, see issue #137 in
        // https://github.com/tombatossals/angular-leaflet-directive
        var $scope = $rootScope.$new();
        $scope.events = {
            marker: 3
        };
        expect(true).toBe(true);
    });

    xit('should broadcast marker events from the rootscope if the event-broadcast marker attribute does not have logic defined',function() {
        //TODO: pending until problems resolved, see issue #137 in
        // https://github.com/tombatossals/angular-leaflet-directive
        var $scope = $rootScope.$new();
        $scope.events = {
            marker: {
                enable: ['click']
            }
        };
        expect(true).toBe(true);
    });

    xit('should NOT broadcast marker events from the rootscope if the event-broadcast marker attribute has logic defined but is not "emit" or "broadcast"',function() {
        //TODO: pending until problems resolved, see issue #137 in
        // https://github.com/tombatossals/angular-leaflet-directive
        var $scope = $rootScope.$new();
        $scope.events = {
            marker: {
                enable: ['click'],
                logic: "boolean"
            }
        };
        expect(true).toBe(true);
    });

    xit('should emit marker events from the rootscope if the event-broadcast marker attribute has logic defined "emit"',function() {
        //TODO: pending until problems resolved, see issue #137 in
        // https://github.com/tombatossals/angular-leaflet-directive
        var $scope = $rootScope.$new();
        $scope.events = {
            marker: {
                enable: ['click'],
                logic: "emit"
            }
        };
        expect(true).toBe(true);
    });

    xit('should broadcast marker events from the rootscope if the event-broadcast marker attribute has logic defined as "broadcast"',function() {
        //TODO: pending until problems resolved, see issue #137 in
        // https://github.com/tombatossals/angular-leaflet-directive
        var $scope = $rootScope.$new();
        $scope.events = {
            marker: {
                enable: ['click'],
                logic: "broadcast"
            }
        };
        expect(true).toBe(true);
    });

    xit('should NOT broadcast marker events from the rootscope if the event-broadcast marker attribute has enabled and disabled defined',function() {
        //TODO: pending until problems resolved, see issue #137 in
        // https://github.com/tombatossals/angular-leaflet-directive
        var $scope = $rootScope.$new();
        $scope.events = {
            marker: {
                enable: ['click'],
                disable: ['zoomend'],
                logic: "broadcast"
            }
        };
        expect(true).toBe(true);
    });

    xit('should NOT broadcast marker events from the rootscope if the event-broadcast marker attribute does not have enabled and disabled defined',function() {
        //TODO: pending until problems resolved, see issue #137 in
        // https://github.com/tombatossals/angular-leaflet-directive
        var $scope = $rootScope.$new();
        $scope.events = {
            marker: {
                logic: "broadcast"
            }
        };
        expect(true).toBe(true);
    });

    xit('should NOT broadcast some marker events from the rootscope if the event-broadcast marker attribute disables them',function() {
        //TODO: pending until problems resolved, see issue #137 in
        // https://github.com/tombatossals/angular-leaflet-directive
        var $scope = $rootScope.$new();
        $scope.events = {
            marker: {
                disable: ['click'],
                logic: "broadcast"
            }
        };
        expect(true).toBe(true);
    });

    xit('should NOT emit some marker events from the rootscope if the event-broadcast marker attribute disables them',function() {
        //TODO: pending until problems resolved, see issue #137 in
        // https://github.com/tombatossals/angular-leaflet-directive
        var $scope = $rootScope.$new();
        $scope.events = {
            marker: {
                disable: ['click'],
                logic: "emit"
            }
        };
        expect(true).toBe(true);
    });

    xit('should broadcast some marker events from the rootscope if the event-broadcast marker attribute enables them',function() {
        //TODO: pending until problems resolved, see issue #137 in
        // https://github.com/tombatossals/angular-leaflet-directive
        var $scope = $rootScope.$new();
        $scope.events = {
            marker: {
                enable: ['click'],
                logic: "broadcast"
            }
        };
        expect(true).toBe(true);
    });

    xit('should emit some marker events from the rootscope if the event-broadcast marker attribute enables them',function() {
        //TODO: pending until problems resolved, see issue #137 in
        // https://github.com/tombatossals/angular-leaflet-directive
        var $scope = $rootScope.$new();
        $scope.events = {
            marker: {
                enable: ['click'],
                logic: "emit"
            }
        };
        expect(true).toBe(true);
    });

    xit('should NOT broadcast some marker events from the rootscope if the event-broadcast marker attribute disables them although there is an invalid event name',function() {
        //TODO: pending until problems resolved, see issue #137 in
        // https://github.com/tombatossals/angular-leaflet-directive
        var $scope = $rootScope.$new();
        $scope.events = {
            marker: {
                disable: ['click', 'foo'],
                logic: "broadcast"
            }
        };
        expect(true).toBe(true);
    });

    xit('should NOT emit some marker events from the rootscope if the event-broadcast marker attribute disables them although there is an invalid event name',function() {
        //TODO: pending until problems resolved, see issue #137 in
        // https://github.com/tombatossals/angular-leaflet-directive
        var $scope = $rootScope.$new();
        $scope.events = {
            marker: {
                disable: ['click', 'foo'],
                logic: "emit"
            }
        };
        expect(true).toBe(true);
    });

    xit('should broadcast some marker events from the rootscope if the event-broadcast marker attribute enables them although there is an invalid event name',function() {
        //TODO: pending until problems resolved, see issue #137 in
        // https://github.com/tombatossals/angular-leaflet-directive
        var $scope = $rootScope.$new();
        $scope.events = {
            marker: {
                enable: ['click', 'foo'],
                logic: "broadcast"
            }
        };
        expect(true).toBe(true);
    });

    xit('should emit some marker events from the rootscope if the event-broadcast marker attribute enables them although there is an invalid event name',function() {
        //TODO: pending until problems resolved, see issue #137 in
        // https://github.com/tombatossals/angular-leaflet-directive
        var $scope = $rootScope.$new();
        $scope.events = {
            marker: {
                enable: ['click', 'foo'],
                logic: "emit"
            }
        };
        expect(true).toBe(true);
    });

    //
    // ***************************************************************************
    //

    xit('should broadcast path events (backward compatibility) from the rootscope if the event-broadcast does not have a path attribute',function() {
        //TODO: pending until problems resolved, see issue #137 in
        // https://github.com/tombatossals/angular-leaflet-directive
        var $scope = $rootScope.$new();
        $scope.events = {
            map: {
                enable: ['click'],
                logic: 'broadcast'
            }
        };
        expect(true).toBe(true);
    });

    xit('should NOT broadcast path events from the rootscope if the event-broadcast path attribute is not an object',function() {
        //TODO: pending until problems resolved, see issue #137 in
        // https://github.com/tombatossals/angular-leaflet-directive
        var $scope = $rootScope.$new();
        $scope.events = {
            path: 3
        };
        expect(true).toBe(true);
    });

    xit('should broadcast path events from the rootscope if the event-broadcast path attribute does not have logic defined',function() {
        //TODO: pending until problems resolved, see issue #137 in
        // https://github.com/tombatossals/angular-leaflet-directive
        var $scope = $rootScope.$new();
        $scope.events = {
            path: {
                enable: ['click']
            }
        };
        expect(true).toBe(true);
    });

    xit('should NOT broadcast path events from the rootscope if the event-broadcast path attribute has logic defined but is not "emit" or "broadcast"',function() {
        //TODO: pending until problems resolved, see issue #137 in
        // https://github.com/tombatossals/angular-leaflet-directive
        var $scope = $rootScope.$new();
        $scope.events = {
            path: {
                enable: ['click'],
                logic: "boolean"
            }
        };
        expect(true).toBe(true);
    });

    xit('should emit path events from the rootscope if the event-broadcast path attribute has logic defined "emit"',function() {
        //TODO: pending until problems resolved, see issue #137 in
        // https://github.com/tombatossals/angular-leaflet-directive
        var $scope = $rootScope.$new();
        $scope.events = {
            path: {
                enable: ['click'],
                logic: "emit"
            }
        };
        expect(true).toBe(true);
    });

    xit('should broadcast path events from the rootscope if the event-broadcast path attribute has logic defined as "broadcast"',function() {
        //TODO: pending until problems resolved, see issue #137 in
        // https://github.com/tombatossals/angular-leaflet-directive
        var $scope = $rootScope.$new();
        $scope.events = {
            path: {
                enable: ['click'],
                logic: "broadcast"
            }
        };
        expect(true).toBe(true);
    });

    xit('should NOT broadcast path events from the rootscope if the event-broadcast path attribute has enabled and disabled defined',function() {
        //TODO: pending until problems resolved, see issue #137 in
        // https://github.com/tombatossals/angular-leaflet-directive
        var $scope = $rootScope.$new();
        $scope.events = {
            path: {
                enable: ['click'],
                disable: ['zoomend'],
                logic: "broadcast"
            }
        };
        expect(true).toBe(true);
    });

    xit('should NOT broadcast path events from the rootscope if the event-broadcast path attribute does not have enabled and disabled defined',function() {
        //TODO: pending until problems resolved, see issue #137 in
        // https://github.com/tombatossals/angular-leaflet-directive
        var $scope = $rootScope.$new();
        $scope.events = {
            path: {
                logic: "broadcast"
            }
        };
        expect(true).toBe(true);
    });

    xit('should NOT broadcast some path events from the rootscope if the event-broadcast path attribute disables them',function() {
        //TODO: pending until problems resolved, see issue #137 in
        // https://github.com/tombatossals/angular-leaflet-directive
        var $scope = $rootScope.$new();
        $scope.events = {
            path: {
                disable: ['click'],
                logic: "broadcast"
            }
        };
        expect(true).toBe(true);
    });

    xit('should NOT emit some path events from the rootscope if the event-broadcast path attribute disables them',function() {
        //TODO: pending until problems resolved, see issue #137 in
        // https://github.com/tombatossals/angular-leaflet-directive
        var $scope = $rootScope.$new();
        $scope.events = {
            path: {
                disable: ['click'],
                logic: "emit"
            }
        };
        expect(true).toBe(true);
    });

    xit('should broadcast some path events from the rootscope if the event-broadcast path attribute enables them',function() {
        //TODO: pending until problems resolved, see issue #137 in
        // https://github.com/tombatossals/angular-leaflet-directive
        var $scope = $rootScope.$new();
        $scope.events = {
            path: {
                enable: ['click'],
                logic: "broadcast"
            }
        };
        expect(true).toBe(true);
    });

    xit('should emit some path events from the rootscope if the event-broadcast path attribute enables them',function() {
        //TODO: pending until problems resolved, see issue #137 in
        // https://github.com/tombatossals/angular-leaflet-directive
        var $scope = $rootScope.$new();
        $scope.events = {
            path: {
                enable: ['click'],
                logic: "emit"
            }
        };
        expect(true).toBe(true);
    });

    xit('should NOT broadcast some path events from the rootscope if the event-broadcast path attribute disables them although there is an invalid event name',function() {
        //TODO: pending until problems resolved, see issue #137 in
        // https://github.com/tombatossals/angular-leaflet-directive
        var $scope = $rootScope.$new();
        $scope.events = {
            path: {
                disable: ['click', 'foo'],
                logic: "broadcast"
            }
        };
        expect(true).toBe(true);
    });

    xit('should NOT emit some path events from the rootscope if the event-broadcast path attribute disables them although there is an invalid event name',function() {
        //TODO: pending until problems resolved, see issue #137 in
        // https://github.com/tombatossals/angular-leaflet-directive
        var $scope = $rootScope.$new();
        $scope.events = {
            path: {
                disable: ['click', 'foo'],
                logic: "emit"
            }
        };
        expect(true).toBe(true);
    });

    xit('should broadcast some path events from the rootscope if the event-broadcast path attribute enables them although there is an invalid event name',function() {
        //TODO: pending until problems resolved, see issue #137 in
        // https://github.com/tombatossals/angular-leaflet-directive
        var $scope = $rootScope.$new();
        $scope.events = {
            path: {
                enable: ['click', 'foo'],
                logic: "broadcast"
            }
        };
        expect(true).toBe(true);
    });

    xit('should emit some path events from the rootscope if the event-broadcast path attribute enables them although there is an invalid event name',function() {
        //TODO: pending until problems resolved, see issue #137 in
        // https://github.com/tombatossals/angular-leaflet-directive
        var $scope = $rootScope.$new();
        $scope.events = {
            marker: {
                enable: ['click', 'foo'],
                logic: "emit"
            }
        };
        expect(true).toBe(true);
    });

    //
    // ***************************************************************************
    //

    xit('should broadcast label events',function() {
        spyOn($rootScope, '$broadcast');
        spyOn(leafletHelpers.LabelPlugin, 'isLoaded').and.returnValue(true);
        L.Label = L.Class.extend({
            includes: L.Mixin.Events,
        });

        L.BaseMarkerMethods = {
            bindLabel: function (content, options) {
                this.label = new L.Label(options, this);
                return this;
            }
        };

        L.Marker.include(L.BaseMarkerMethods);

        var marker = {
            lat: 0.966,
            lng: 2.02,
            message: 'this is paris',
            label: {
                message: 'test',
                options: {
                    clickable: true
                }
            }
        };

        angular.extend($rootScope, {
            markers: {
                marker: marker
            }
        });

        var element = angular.element('<leaflet testing="testing" markers="markers"></leaflet>');
        $compile(element)($rootScope);
        $rootScope.$digest();
        leafletData.getMarkers().then(function(leafletMarkers){
            leafletMarkers.marker.label.fireEvent('mouseover');
        });

        $rootScope.$digest();

        expect($rootScope.$broadcast.calls.mostRecent().args[0]).toEqual('leafletDirectiveLabel.mouseover');
    });
});
