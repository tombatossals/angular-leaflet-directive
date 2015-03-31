window.ngLeafLetTestGlobals = {}

beforeEach ->

    @digest = (scope, fn) =>
        while ngLeafLetTestGlobals.$timeout.hasPendingTasks()
            ngLeafLetTestGlobals.$timeout.flush()

        fn() if fn?

        unless scope.$$phase
            scope.$digest()
