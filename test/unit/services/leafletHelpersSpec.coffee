describe 'leafletHelpers', ->
    beforeEach ->
        module('leaflet-directive')
        inject (_$compile_, _$rootScope_, _leafletData_, _leafletHelpers_) ->
            @$compile = _$compile_
            @$rootScope = _$rootScope_
            @leafletData = _leafletData_
            @subject = _leafletHelpers_

    describe 'isTruthy', ->
        beforeEach ->
            @subject = @subject.isTruthy

        describe 'is true', ->
            it "'true'", ->
                expect(@subject("true")).toBeTruthy()
            it "true", ->
                expect(@subject(true)).toBeTruthy()

        describe 'is false', ->
            it "'false'", ->
                expect(@subject("false")).toBeFalsy()
            it "false", ->
                expect(@subject(false)).toBeFalsy()
            it "undefined", ->
                expect(@subject(undefined)).toBeFalsy()

    describe 'defaultTo', ->
        beforeEach ->
            @subject = @subject.defaultTo

        it 'keeps value', ->
            it 'false', ->
                expect(@subject(false, true)).toBeTruthy()

            it 'string', ->
                expect(@subject('hi', 'nope')).toBe('hi')

            it '{}', ->
                expect(@subject({}, null)).toBe({})

        describe 'gets default', ->
            it 'undefined', ->
                expect(@subject(undefined, '')).toBe('')
            it 'null', ->
                expect(@subject(null, '')).toBe('')

    describe 'Object Helpers', ->
        it 'should correctly fetch object values using dot-notation', ->
          object = { foo: { sea: 'hawks' }}
          expect(@subject.getObjectValue(object, 'foo.sea')).toEqual('hawks')
          expect(@subject.getObjectValue(object, 'foo.sea.birds')).toEqual(undefined)
          expect(@subject.getObjectValue(object, 'boo.hoo')).toEqual(undefined)
