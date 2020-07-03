const config = require('../../config.json');
const { createConnection, EntitySchema } = require('typeorm');
const Music = require('./Music');
const UserUtil = require('./UserUtil');

class Util {
    constructor(client) {
        this.client = client;
        this.music = new Music(this.client);
        this.users = new UserUtil(this.client);
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
        this.client.logger.info('initialized database');
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
        const flags = {};
        let value;

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
    async uploadToHastebin(body, options = { url: 'https://bin.lunasrv.com' }) {
        const res = await require('node-fetch')(`${options.url}/documents`, {
            body,
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain'
            }
        });
        const json = await res.json();
        return {
            key: json.key,
            url: `${options.url}/${json.key}`
        };
    }
    userFlagsToEmoji(h) {
        const e = {
            DISCORD_EMPLOYEE: '<:discord_employee:705940105604366346>',
            DISCORD_PARTNER: '<:discord_partner:705940105562423406>',
            HYPESQUAD_EVENTS: '<:discord_hypesquad:705940105306570842>',
            BUGHUNTER_LEVEL_1: '<:discord_bug_hunter:705940105344581652>',
            HOUSE_BRAVERY: '<:discord_bravery:705940105164095518>',
            HOUSE_BRILLIANCE: '<:discord_brilliance:705940104858042450>',
            HOUSE_BALANCE: '<:discord_balance:705940105222815816>',
            EARLY_SUPPORTER: '<:discord_early_supporter:705940105142992948>',
            TEAM_USER: '',
            SYSTEM: '<:discord_system:705940105273016456>',
            BUGHUNTER_LEVEL_2: '<:discord_bug_hunter_2:705940105285599312>',
            VERIFIED_BOT: '<:discord_verified_bot:705940105612886037>',
            VERIFIED_DEVELOPER: '<:discord_verified_developer:705940105575268453>'
        };
        const em = []; for (const k of h) em.push(e[k]);
        return em;
    }
    findNode(id) {
        return config.lavalinkNodes.find(c => c.id === id);
    }
}

module.exports = Util;