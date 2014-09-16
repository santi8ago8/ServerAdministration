({
    appDir: ".",
    baseUrl: ".",
    dir: "deploy",
    modules: [
        {name: 'main'}
    ],
    paths: {
        boq: "boq",
        io: 'socket.io',
        swig: 'swig.min'
    },
    packages: [
        {
            name: 'engine',
            location: 'engine',
            main: 'engine'
        }
    ],
    optimize: "uglify2",
    removeCombined: true

})