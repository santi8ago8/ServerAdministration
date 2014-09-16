require.config({
    baseUrl: 'js/',
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

    ]
});

console.log('loading engine');
require(['engine'], function (engine) {
    //debugger;
    console.log('engine started');
});
