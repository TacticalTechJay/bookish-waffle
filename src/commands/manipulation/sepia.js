const Command = require('../../structures/Command');
const { MessageEmbed, MessageAttachment, Util } = require('discord.js');
const Jimp = require('jimp');

module.exports = class Sepia extends Command {
    constructor(client) {
        super(client, {
            name: 'sepia',
            category: 'imgmanip',
            description: 'Make a users avatar sepia-ified',
            usage: '[User?]'
        });
    }

    async exec(message, args) {
        let member = null;
        if (!args[0]) member = message.member;
        else if (message.embeds.filter(e => e.type == 'image')[0]) {
            const read = await Jimp.read(message.embeds.filter(e => e.type == 'image')[0].url);
            return read.sepia().getBuffer(Jimp.MIME_PNG, (e, b) => {
                if (e) return message.channel.send(':/ I wasn\'t able to process the image...');
                return message.channel.send(
                    new MessageEmbed()
                        .setTitle('Your Nuked Image:')
                        .setColor(this.client.color)
                        .attachFiles(new MessageAttachment(b, 'image.png'))
                        .setImage('attachment://image.png')
                );
            });
        }
        else {
            const members = this.client.util.users.findMember(args[0], message.guild.members.cache, { multiple: true });
            if (members.size === 1) member = members.first();
            else if (!members) {
                try {
                    member = await this.client.users.fetch(args[0]);
                }
                catch (e) {
                    return message.channel.send('No members found');
                }
            }
            else {
                let i = 1;
                message.channel.send(new MessageEmbed()
                    .setColor(this.client.color)
                    .setTitle('Multiple users found!')
                    .setDescription(`Looks like there were **${members.size}** users found when searching for ${Util.escapeMarkdown(args[0])}, pick a number in **1 minute** to get info on them.\n\n${members.map(m => `**${i++}.** ${m.user.tag} (**${m.id}**)`).join('\n')}`));
                const c = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 60000, errors: ['time'] });
                if (members.array()[Number(c.first().content) - 1]) member = members.array()[Number(c.first().content) - 1];
                else return message.channel.send('Bummer, looks like that user doesn\'t exist.');
            }
        }
        if (!member) return message.channel.send('Bummer, looks like that user doesn\'t exist.');
        const read = await Jimp.read(member.user.displayAvatarURL({ format: 'png', size: 2048 }));
        read.sepia().getBuffer(Jimp.MIME_PNG, (e, b) => {
            if (e) return message.channel.send(':/ I wasn\'t able to process the image..');
            return message.channel.send(
                new MessageEmbed()
                    .setTitle('Your Sepia Image:')
                    .setColor(this.client.color)
                    .attachFiles(new MessageAttachment(b, 'image.png'))
                    .setImage('attachment://image.png')
            );
        });

    }
};