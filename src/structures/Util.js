const config = require('../../config.json');
const { createConnection, EntitySchema } = require('typeorm');
const { Music } = require('./Music');

class Util {
    constructor(client) {
        this.client = client;
        this.music = new Music(this.client);
    }
    async initPG() {
        const connection = await createConnection({
            type: 'postgres',
            host: config.database.postgres.host,
            username: config.database.postgres.user,
            password: config.database.postgres.password,
            database: process.env.DEVELOPMENT ? config.database.postgres.database.dev : config.database.postgres.database.prod,
            synchronize: true,
            entities: [
                new EntitySchema(require('../entities/User.js')),
                new EntitySchema(require('../entities/Guild.js'))
            ]
        });
        this.client.orm = {
            connection,
            repos: {
                user: connection.getRepository('User'),
                guild: connection.getRepository('Guild')
            }
        };
    }
    async user(id) {
        const user = await this.client.orm.repos.user.findOne({ id });
        if (!user) return await this.client.orm.repos.user.save({ id });
        return user;
    }
    async guild(id) {
        const guild = await this.client.orm.repos.guild.findOne({ id });
        if (!guild) return await this.client.orm.repos.guild.save({ id });
        return guild;
    }
    parseFlags(str) {
        const flags = {}; let
            value;

        const withQuotes = /--(\w{2,})=("(\\"|[^"])*"|'(\\'|[^'])*')/gi;
        while ((value = withQuotes.exec(str))) {
            flags[value[1]] = value[2]
                .replace(/\\["']/g, (i) => i.slice(1))
                .slice(1, -1);
        }
        str = str.replace(withQuotes, '');

        const withoutQuotes = /--(\w{2,})(?:=(\S+))?/gi;
        while ((value = withoutQuotes.exec(str))) flags[value[1]] = value[2] || true;
        str = str.replace(withoutQuotes, '');

        const shortReg = /-([a-z]+)/gi;
        while ((value = shortReg.exec(str))) for (value of value[1]) flags[value] = true;
        str = str.replace(shortReg, '');

        return { flags, content: str };
    }
    duration(ms, opts = { days: false }) {
        let str = '';
        if (ms >= 86400000 && opts.days) (str += `${ms / 86400000 | 0}`.padStart(2, '0') + ':') && (ms -= (ms / 86400000 | 0) * 86400000);
        if (str || ms >= 3600000) (str += `${ms / 3600000 | 0}`.padStart(2, '0') + ':') && (ms -= (ms / 3600000 | 0) * 3600000);
        (str += `${ms / 60000 | 0}`.padStart(2, '0') + ':') && (ms -= (ms / 60000 | 0) * 60000);
        str += `${ms / 1000 | 0}`.padStart(2, '0');
        return str;
    }
}

module.exports = { Util };