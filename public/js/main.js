require.config({
    baseUrl: 'js/',
    paths: {
        domReady: "domReady",
        boq: "boq",
        io: 'socket.io',
        text: 'text',
        swig: 'swig.min',
        Terminal:'term'

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

    ]
});

require(['engine'], function (engine) {
    //debugger;
    console.log('engine started',engine);

});
