    module.exports = {
        loaders: {
            loadCommands: require('./loaders/loadCommand.js'),
            loadEvents: require('./loaders/loadEvent.js')
        },
        music: {
            askWhich: require('./music/askWhich.js'),
            createQueue: require('./music/createQueue.js'),
            getSong: require('./music/getSong.js'),
            getSongs: require('./music/getSongs.js'),
            join: require('./music/join.js'),
            leave: require('./music/leave.js'),
            play: require('./music/play.js')
        },
        database: {
            user: require('./database/user.js')
        },
        orm: require('./initializeORM.js')
    };