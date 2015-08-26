describe 'leafletIterators', ->

  beforeEach ->
      module('leaflet-directive')
      inject (_$compile_, _$rootScope_, _leafletData_, _leafletIterators_) ->
          @$compile = _$compile_
          @$rootScope = _$rootScope_
          @leafletData = _leafletData_
          @subject = _leafletIterators_

  it 'exists', ->
      expect(@subject).toBeDefined()

  describe 'forEach/each', ->
      it 'prototypes should not be called', ->
        class Dummy
          prop1: 'prop1'
          prop2: 'prop2'
        d = new Dummy()
        d.prop3 = 'prop3'

        vals = []
        @subject.each d, (val) ->
          vals.push val

        expect(vals.length).toBe 1
        expect(vals[0]).toBe d.prop3
