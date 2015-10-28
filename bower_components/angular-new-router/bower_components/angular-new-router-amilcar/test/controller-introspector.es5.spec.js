describe('$controllerIntrospector', function () {

  var $controllerProvider;

  beforeEach(function() {
    module('ng');
    module('ngNewRouter');
    module(function(_$controllerProvider_) {
      $controllerProvider = _$controllerProvider_;
    });
  });

  it('should call the introspector function whenever a controller is registered', inject(function ($controllerIntrospector) {
    var spy = jasmine.createSpy();
    $controllerIntrospector(spy);
    function Ctrl(){}
    Ctrl.$routeConfig = [{ path: '/', component: 'example' }];
    $controllerProvider.register('SomeController', Ctrl);

    expect(spy).toHaveBeenCalledWith('some', [{ path: '/', component: 'example' }]);
  }));

  it('should call the introspector function whenever a controller is registered with array annotations', inject(function ($controllerIntrospector) {
    var spy = jasmine.createSpy();
    $controllerIntrospector(spy);
    function Ctrl(foo){}
    Ctrl.$routeConfig = [{ path: '/', component: 'example' }];
    $controllerProvider.register('SomeController', ['foo', Ctrl]);

    expect(spy).toHaveBeenCalledWith('some', [{ path: '/', component: 'example' }]);
  }));
});
