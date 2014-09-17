require.config({
    baseUrl: 'js/',
    paths: {
        domReady: "domReady",
        boq: "boq",
        io: 'socket.io',
        text: 'text',
        swig: 'swig.min',
        term: 'term'

    },
    packages: [
        {
            name: 'engine',
            location: 'engine',
            main: 'engine'
        }

    ]
});

console.log('loading engine');
require(['engine'], function (engine) {
    //debugger;
    console.log('engine started');
    require(['text!/html/main.html'], function (text) {
        console.log(text);
    });
});
