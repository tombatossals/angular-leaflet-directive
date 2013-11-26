describe('Loading simple-example.html', function() {

    var ptor, driver;
    beforeEach(function() {
        ptor = protractor.getInstance();
        driver = ptor.driver;
        ptor.ignoreSynchronization = true;
    }, 30000);

    it('should load simple-example.html', function() {
        ptor.waitForAngular().then(function() {
            driver.findElement(protractor.By.className('leaflet-control-zoom-in')).click();
            expect(true).toBe(true);
        });
    });
});
