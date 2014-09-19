({
    appDir: ".",
    baseUrl: ".",
    dir: "deploy",
    modules: [
        {name: 'main'}
    ],
    paths: {
        domReady: "domReady",
        boq: "boq",
        "boq.dom": "boq.dom",
        io: 'socket.io',
        text: 'text',
        swig: 'swig.min',
        Terminal: 'term'
    },
    shim: {
        Terminal: {
            exports: 'Terminal'
        }
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