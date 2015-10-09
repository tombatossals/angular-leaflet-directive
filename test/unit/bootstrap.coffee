window.ngLeafLetTestGlobals = {}

beforeEach ->

    angular.module('leaflet-directive')
    .config ($provide) ->
        $provide.value('$log', console)
        $provide.decorator '$timeout', ($delegate, $browser) ->
            $delegate.hasPendingTasks = ->
                $browser.deferredFns.length > 0

            $delegate
    .run (leafletLogger) ->
        leafletLogger.currentLevel = leafletLogger.LEVELS.info

    @digest = (scope, fn) ->
        while ngLeafLetTestGlobals.$timeout.hasPendingTasks()
            ngLeafLetTestGlobals.$timeout.flush()

        fn() if fn?
        scope.$digest() unless scope.$$phase
