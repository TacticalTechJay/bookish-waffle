const Command = require('../../structures/Command');
const { MessageEmbed, ReactionCollector } = require('discord.js');

module.exports = class Help extends Command {
    constructor(client) {
        super(client, {
            name: 'help',
            aliases: ['h', '?']
        });
    }

    async exec(message, args) {
        const pages = {
            system: new MessageEmbed()
                .setColor('RANDOM')
                .setAuthor(`System Commands`, this.client.user.displayAvatarURL())
                .setDescription(`These are some cool and useful commands, that could help you out 😎\n\n**Commands:**\n${this.client.handler.commands.filter(c => c.category === 'system').map(c => `\`${c.name}\``).join(', ')}`),
            music: new MessageEmbed()
                .setColor('RANDOM')
                .setAuthor(`Music Commands`, this.client.user.displayAvatarURL())
                .setDescription(`Want to vibe 🎵 to some music? These should be the good fit for you!\n\n**Commands:**\n${this.client.handler.commands.filter(c => c.category === 'music').map(c => `\`${c.name}\``).join(', ')}`),
            image: new MessageEmbed()
                .setColor('RANDOM')
                .setAuthor(`Image Commands`, this.client.user.displayAvatarURL())
                .setDescription(`You can enact actions upon other users, or make me do them to you! >:3\n\n**Commands:**\n${this.client.handler.commands.filter(c => c.category === 'image').map(c => `\`${c.name}\``).join(', ')}`),
            imgmanip: new MessageEmbed()
                .setColor('RANDOM')
                .setAuthor(`Image Manipulation Commands`, this.client.user.displayAvatarURL())
                .setDescription(`Manipulate someones avatar, have fun :D\n\n**Commands:**\n${this.client.handler.commands.filter(c => c.category === 'imgmanip').map(c => `\`${c.name}\``).join(', ')}`),
            nsfw: new MessageEmbed()
                .setColor('RANDOM')
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