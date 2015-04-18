describe 'leafletData', ->
    $q = geojsonData = mainLayers = leafletHelpers = leafletData = $rootScope = $compile = undefined

    beforeEach ->
        module('leaflet-directive')
        inject (_$compile_, _$rootScope_, _$timeout_, _leafletData_, _leafletHelpers_, _$q_) ->
            $q = _$q_
            $compile = _$compile_
            $rootScope = _$rootScope_
            leafletData = _leafletData_
            $timeout = _$timeout_
            window.ngLeafLetTestGlobals.$timeout = $timeout

    describe 'no mapId', ->
        beforeEach ->
            @knownMarkers = [1,2,3]
            @knownGeoJSON = ['1','2','3']

            @setPromise = $q.all [leafletData.setMarkers(@knownMarkers),
                leafletData.setGeoJSON(@knownGeoJSON)
            ]

        it 'has unique data', (done)->
            _geoJSON = null
            _markers = null
            _allGet = null
            console.log $q
            @digest $rootScope, =>
                @setPromise.then ->
                    _allGet = $q.all [
                        leafletData.getMarkers().then (lObjs) ->
                            _markers = lObjs
                        ,
                        leafletData.getGeoJSON().then (lObjs) ->
                            _geoJSON = lObjs
                    ]

            @digest $rootScope, =>
                _allGet.then =>
                    expect(@knownMarkers).toBe(_markers)
                    expect(@knownGeoJSON).toBe(_geoJSON)
                    expect(_geoJSON != _markers).toBeTruthy()
                    done()


        it "modifying localScope modifies leafletData's version", (done) ->
            _geoJSON = null
            _markers = null
            _allGet = null
            #this proves you do not need to call set[Whatever] multiple times.
            @knownMarkers.push 4
            @knownGeoJSON.push "4"
            console.log $q
            @digest $rootScope, =>
                @setPromise.then ->
                    _allGet = $q.all [
                        leafletData.getMarkers().then (lObjs) ->
                            _markers = lObjs
                        ,
                        leafletData.getGeoJSON().then (lObjs) ->
                            _geoJSON = lObjs
                    ]

            @digest $rootScope, =>
                _allGet.then =>
                    expect(@knownMarkers).toBe(_markers)
                    expect(@knownGeoJSON).toBe(_geoJSON)
                    expect(_geoJSON != _markers).toBeTruthy()
                    done()
