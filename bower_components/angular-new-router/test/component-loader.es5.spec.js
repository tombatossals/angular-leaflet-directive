describe('$componentLoader', function () {

  beforeEach(module('ngNewRouter'));

  it('should convert a component name to a controller name', inject(function ($componentLoader) {
    expect($componentLoader.controllerName('foo')).toBe('FooController');
  }));

  it('should convert a controller name to a component name', inject(function ($componentLoader) {
    expect($componentLoader.component('FooController')).toBe('foo');
  }));

  it('should convert a component name to a template URL', inject(function ($componentLoader) {
    expect($componentLoader.template('foo')).toBe('./components/foo/foo.html');
  }));
});
