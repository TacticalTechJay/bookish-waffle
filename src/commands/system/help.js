const Command = require('../../structures/Command');
const { MessageEmbed, ReactionCollector } = require('discord.js');

module.exports = class Help extends Command {
    constructor(client) {
        super(client, {
            name: 'help',
            aliases: ['h', '?'],
            description: `Get a list of commands that I offer!`,
            usage: '[Command?]'
        });
    }

    async exec(message, args) {
        if (args[0]) {
            const cmd = this.client.handler.commands.get(args[0]) || this.client.handler.commands.get(this.client.handler.aliases.get(args[0]));
            if (!cmd || cmd.devOnly) return message.channel.send(`I don't have that command :|`);
            return message.channel.send(
                new MessageEmbed()
                    .setColor(this.client.color)
                    .setAuthor(`${cmd.name}`, this.client.user.displayAvatarURL())
                    .setDescription(cmd.description)
                    .addField(`Aliases`, cmd.aliases.join(', '), true)
                    .addField(`Usage`, `\`${cmd.usage}\``, true)
            )
        }
        const pages = {
            system: new MessageEmbed()
                .setColor(this.client.color)
                .setAuthor(`System Commands`, this.client.user.displayAvatarURL())
                .setDescription(`These are some cool and useful commands, that could help you out 😎\n\n**Commands:**\n${this.client.handler.commands.filter(c => c.category === 'system').map(c => `\`${c.name}\``).join(', ')}`),
            music: new MessageEmbed()
                .setColor(this.client.color)
                .setAuthor(`Music Commands`, this.client.user.displayAvatarURL())
                .setDescription(`Want to vibe 🎵 to some music? These should be the good fit for you!\n\n**Commands:**\n${this.client.handler.commands.filter(c => c.category === 'music').map(c => `\`${c.name}\``).join(', ')}`),
            image: new MessageEmbed()
                .setColor(this.client.color)
                .setAuthor(`Image Commands`, this.client.user.displayAvatarURL())
                .setDescription(`You can enact actions upon other users, or make me do them to you! >:3\n\n**Commands:**\n${this.client.handler.commands.filter(c => c.category === 'image').map(c => `\`${c.name}\``).join(', ')}`),
            imgmanip: new MessageEmbed()
                .setColor(this.client.color)
                .setAuthor(`Image Manipulation Commands`, this.client.user.displayAvatarURL())
                .setDescription(`Manipulate someones avatar, have fun :D\n\n**Commands:**\n${this.client.handler.commands.filter(c => c.category === 'imgmanip').map(c => `\`${c.name}\``).join(', ')}`),
            nsfw: new MessageEmbed()
                .setColor(this.client.color)
                .setAuthor(`NSFW Commands`, this.client.user.displayAvatarURL())
                .setDescription(`It's lewd, thats all I can say.\n\n**Commands:**\n${this.client.handler.commands.filter(c => c.category === 'nsfw').map(c => `\`${c.name}\``).join(', ')}`)
        }
        const msg = await message.channel.send(
            new MessageEmbed()
                .setColor(this.client.color)
                .setAuthor('Help', this.client.user.displayAvatarURL())
                .setDescription(`**React** with the emojis below to get info on that topic.
🏘️ -  **Return here**
⚒️ - **System**
🎵 - **Music**
📱 - **Image**
🔧 - **Image Manipulation**${message.channel.nsfw ? `\n🔞 - **NSFW**` : ''}
❌ - **Stop and delete this help menu**
`)
        )
        await msg.react('🏘️');
        await msg.react('⚒️');
        await msg.react('🎵');
        await msg.react('📷');
        await msg.react('🔧');
        await msg.react('❌');
        if (message.channel.nsfw) await msg.react('🔞');
        const collector = msg.createReactionCollector((r, u) => u.id === message.author.id, {
            time: 60000 * 5
        });

        collector.on('collect', reaction => {
            const name = reaction.emoji.name;
            if (name === '❌') {
                msg.delete();
                return collector.stop();
            }
            if (name === '🏘️') msg.edit(
                new MessageEmbed()
                    .setColor(this.client.color)
                    .setAuthor('Help', this.client.user.displayAvatarURL())
                    .setDescription(`**React** with the emojis below to get info on that topic.
🏘️ -  **Return here**
⚒️ - **System**
🎵 - **Music**
📷 - **Image**
🔧 - **Image Manipulation**${message.channel.nsfw ? `\n🔞 - **NSFW**` : ''}
❌ - **Stop and delete this help menu**
`)
            )
            const e = {
                '⚒️': 'system',
                '🎵': 'music',
                '📷': 'image',
                '🔧': 'imgmanip',
                '🔞': 'nsfw'
            }
            if (!e[name]) return;
            const embed = pages[e[name]];
            msg.edit(embed);
        })
    }
}