describe 'leafletGeoJsonHelpers', ->

  beforeEach ->
      module('leaflet-directive')
      inject (_$compile_, _$rootScope_, _leafletGeoJsonHelpers_) ->
          @$compile = _$compile_
          @$rootScope = _$rootScope_
          @subject = _leafletGeoJsonHelpers_

  describe 'should validate coordinates correctly', ->
    it 'basic', ->
        expect(@subject.validateCoords()).toEqual(false)
        expect(@subject.validateCoords([1, 2])).toEqual(true)
        expect(@subject.validateCoords([])).toEqual(false)

    describe 'Point', ->
        it 'type:Point', ->
            expect(@subject.validateCoords({type: 'Point', coordinates: [1, 2]})).toEqual true
            expect(@subject.validateCoords({type: 'Point', coordinates: []})).toEqual false

    describe '{lat: _ lng: _}', ->
        it 'type:foo, no lat lng', ->
            expect(@subject.validateCoords({type: 'foo', coordinates: []})).toEqual false
        it 'type:foo, w lat lng', ->
            expect(@subject.validateCoords( type: 'foo', lat: 45, lng:150 )).toEqual true
        it 'type:foo, w lat', ->
            expect(@subject.validateCoords( type: 'foo', lat: 45 )).toEqual false
        it 'type:foo, w lng', ->
            expect(@subject.validateCoords( type: 'foo', lng:150 )).toEqual false

    describe 'isArray', ->
        it 'type:foo, no lat lng', ->
            expect(@subject.validateCoords([])).toEqual false
        it 'type:foo, w lat lng', ->
            expect(@subject.validateCoords( [150, 45])).toEqual true
        it 'type:foo, w lat', ->
            expect(@subject.validateCoords( [null,45] )).toEqual false
        it 'type:foo, w lng', ->
            expect(@subject.validateCoords( [150, null] )).toEqual false

    describe 'Numeric Checks', ->
        it 'type:Point', ->
            expect(@subject.validateCoords({type: 'Point', coordinates: ['1', 2]})).toEqual false
            expect(@subject.validateCoords({type: 'Point', coordinates: []})).toEqual false

        it 'type:foo, w lat lng', ->
            expect(@subject.validateCoords( type: 'foo', lat: 45, lng:'150' )).toEqual false
        it 'type:foo, w lat', ->
            expect(@subject.validateCoords( type: 'foo', lat: '45', lng: 150 )).toEqual false
        it 'type:foo, w lng', ->
            expect(@subject.validateCoords( type: 'foo', lng:'150' )).toEqual false

        describe 'isArray', ->
            it 'type:foo, w lat lng', ->
                expect(@subject.validateCoords( ['150', 45])).toEqual false
            it 'type:foo, w lat', ->
                expect(@subject.validateCoords( [150,'45'] )).toEqual false
            it 'type:foo, w lng', ->
                expect(@subject.validateCoords( ['150', null] )).toEqual false
