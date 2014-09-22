/**
 * Created by santi8ago8 on 20/09/14.
 */



module.exports = {

    port: 3000,

    //created when no commands
    firstCommands: [
        {command: 'echo Welcome to server admin!'}
    ],

    //created when no user
    firstUser: {
        name: 'foo',
        password: 'bar',
        tokens: []
    },
    //mongo config
    mongo: {
        host: 'localhost',
        port: 27017,
        db: 'ServerAdministration',
        collCommands: 'commands',
        collUsers: 'users'
    }
};