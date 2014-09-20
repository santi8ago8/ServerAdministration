require.config({
    baseUrl: 'js/',
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

    ]
});


define('main', [ 'text', 'Terminal', 'engine'], function (text, Terminal,engine) {
    //debugger;
    console.log('engine started', engine);


    return {};

});
