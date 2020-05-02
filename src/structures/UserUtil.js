const config = require('../../config.json');
const { MessageEmbed } = require('discord.js');

class UserUtil {
    constructor(client) {
        this.client = client;
    }
    findMember(ms, mb, op = { multiple: false }) {
        function find(b, m) {
            if (b === m.id) return true;
            if (b.match(/<@!?(\d{17,19})>/) && m.id === b.match(/<@!?(\d{17,19})>/)[1]) return true;
            const text = b.toLowerCase();
            const display = m.displayName.toLowerCase();
            const user = m.user.username.toLowerCase();
            const dis = m.user.discriminator.toLowerCase();
            return display.includes(text)
                || user.includes(text)
                || ((user.includes(text.split('#')[0])
                    || display.includes(text.split('#')[0]))
                    && dis.includes(text.split('#')[1]));
        }
        return !op.multiple ? mb.get(ms) || mb.filter(m => find(ms, m)).first() : mb.filter(m => find(ms, m));
    }
}

module.exports = UserUtil;