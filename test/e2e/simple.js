describe('Loading simple-example.html', function() {
    it('should load simple-example.html', function() {
        browser.get('/simple-example.html');
        expect(true).toBe(true);
    });
});
