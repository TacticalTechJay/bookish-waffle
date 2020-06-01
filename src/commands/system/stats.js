const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const { version } = require('../../../package.json');
module.exports = class Stats extends Command {
    constructor(client) {
        super(client, {
            name: 'stats',
            aliases: ['s', 'botinfo', 'bi'],
            description: 'Get out my stats, it\'s pretty cool'
        });
    }

    async exec(message) {
        const guild = await this.client.util.guild(message.guild.id);
        return message.channel.send(
            new MessageEmbed()
                .setTitle(this.client.user.username)
                .setColor(this.client.color)
                .setDescription(`Hello! This is just some average bot that has the most basic functions like playing music and anime. If you wish to invite me, just use \`${guild.prefix}invite\` (or click below) to add me!`)
                .setThumbnail(this.client.user.displayAvatarURL({ size: 2048 }))
                .addField('⚒️ System', `
**Guilds:** ${this.client.guilds.cache.size}
**Users:** ${this.client.users.cache.size}
**Version:** ${version}
**Memory:** \`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}/${(require('os').totalmem() / 1024 / 1024).toFixed(2)} MB\`
**Platform:** ${require('os').platform().toProperCase()} (${require('os').release().toProperCase()})
**Uptime:** ${require('ms')(this.client.uptime)}
**Music Players:** ${this.client.manager.players.size}
`, true).addField('Useful Links', `
📲 [Want Support?](https://discord.gg/PMbESdB)
☁ [Hosted by Contabo](https://contabo.org)
💵 [Donate via KoFi](https://www.ko-fi.com/WorldChan) 
💵 [Join Patreon](https://www.patreon.com/WorldChan)
🖥️ [Source Code](https://github.com/TacticalTechJay/bookish-waffle)
✅ [Invite Bot](https://discordapp.com/oauth2/authorize?client_id=${this.client.user.id}&scope=bot&permissions=3435782)
`, true)
        );
    }
};