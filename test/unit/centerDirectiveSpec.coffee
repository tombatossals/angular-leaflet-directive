describe 'Directive: leaflet center', ->
    scope = center = leafletData = $location = $timeout = $compile = $rootScope = undefined

    beforeEach ->
        module('leaflet-directive')
        inject (_$compile_, _$rootScope_, _$timeout_, _$location_, _leafletData_) ->
            $compile = _$compile_
            $rootScope = _$rootScope_
            $timeout = _$timeout_
            window.ngLeafLetTestGlobals.$timeout = $timeout
            $location = _$location_
            leafletData = _leafletData_
            center =
                lat: 0.96658
                lng: 2.02
                zoom: 4
            scope = $rootScope.$new()
            scope.center = center

    afterEach inject ($rootScope) ->
        $rootScope.$apply() unless $rootScope.$$phase

    for key, directiveName of ['center', 'lf-center']
        describe directiveName, ->
            describe 'sets leaflet from scope', ->
                it 'should have default {[0, 0], 1} parameters on the map if not correctly defined', ->
                    scope.center = {}
                    element = angular.element("<leaflet #{directiveName}='center'></leaflet>")
                    element = $compile(element)(scope)
                    scope.$digest()
                    leafletData.getMap().then (map) ->
                        expect(map.getZoom()).toEqual 1
                        expect(map.getCenter().lat).toEqual 0
                        expect(map.getCenter().lng).toEqual 0

                it 'should update the map center if the initial center scope properties are set', ->
                    element = angular.element("<leaflet #{directiveName}='center'></leaflet>")
                    element = $compile(element)(scope)
                    scope.$digest()
                    leafletData.getMap().then (map) ->
                        expect(map.getZoom()).toEqual center.zoom
                        expect(map.getCenter().lat).toBeCloseTo 0.96658, 4
                        expect(map.getCenter().lng).toBeCloseTo 2.02, 4

                it 'should update the map center if the scope center properties changes', ->
                    element = angular.element("<leaflet #{directiveName}='center'></leaflet>")
                    element = $compile(element)(scope)
                    map = undefined
                    leafletData.getMap().then (leafletMap) ->
                        map = leafletMap

                    scope.$apply()
                    expect(map.getCenter().lat).toBeCloseTo 0.96658, 4
                    expect(map.getCenter().lng).toBeCloseTo 2.02, 4
                    expect(map.getZoom()).toEqual 4
                    center.lat = 2.02999
                    center.lng = 4.04
                    center.zoom = 8
                    scope.$digest()
                    expect(map.getCenter().lat).toBeCloseTo 2.02999, 4
                    expect(map.getCenter().lng).toBeCloseTo 4.04, 4
                    expect(map.getZoom()).toEqual 8

                describe 'Using url-hash functionality', ->
                    it 'should update the center of the map if changes the url', ->
                        element = angular.element("<leaflet #{directiveName}='center' url-hash-center='yes'></leaflet>")
                        element = $compile(element)(scope)
                        map = undefined

                        leafletData.getMap().then (leafletMap) ->
                            map = leafletMap

                        centerParams = c: '30.1' + ':' + '-9.2' + ':' + '4'
                        $location.search centerParams
                        scope.$digest()
                        expect(map.getCenter().lat).toBeCloseTo 30.1, 4
                        expect(map.getCenter().lng).toBeCloseTo -9.2, 4
                        expect(map.getZoom()).toEqual 4

            describe 'sets scope from leaflet', ->
                it 'should update the url hash if changes the center', ->
                    element = angular.element("<leaflet #{directiveName}='center' url-hash-center='yes'></leaflet>")
                    element = $compile(element)(scope)
                    scope.center =
                        lat: 9.52478
                        lng: -1.8
                        zoom: 8
                    centerUrlHash = undefined
                    scope.$on 'centerUrlHash', (event, u) ->
                        centerUrlHash = u
                    scope.$digest()
                    expect(centerUrlHash).toBe '9.5248:-1.8000:8'


                it 'should update the scope.center if leaflet map is moved', (done) ->
                    element = angular.element("<leaflet #{directiveName}='center'></leaflet>")
                    element = $compile(element)(scope)

                    @digest scope, ->
                        leafletData.getMap()
                        .then (map) ->
                            expect(map.getZoom()).toEqual center.zoom
                            expect(map.getCenter().lat).toBeCloseTo 0.96658, 4
                            expect(map.getCenter().lng).toBeCloseTo 2.02, 4
                            map.setView L.latLng(50.5, 30.5)

                    @digest scope, ->
                        leafletData.getMap()
                        .then (map) ->
                            expect(scope.center.lat).toBe 50.5
                            expect(scope.center.lng).toBe 30.5
                            map.setView L.latLng(51.5, 31.5)

                    @digest scope, ->
                        leafletData.getMap()
                        .then (map) ->
                            expect(scope.center.lat).toBe 51.5
                            expect(scope.center.lng).toBe 31.5
                            done()
