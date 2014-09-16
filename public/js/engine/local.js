define('engine/local', function () {
    console.log('define local');
    return function () {
        this.id = 1;
        return 123;
    }
});