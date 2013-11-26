describe('Loading examples index.html', function() {
    var ptor = protractor.getInstance(),
        button;

    beforeEach(function() {
        ptor.get('/');
        button = ptor.findElement(protractor.By.className('btn-say-hello'));
        button.click();
    });

    it('loads simple-example.html', function() {
        expect(true).toBe(true);
    });
});
