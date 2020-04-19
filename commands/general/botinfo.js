const Discord = require('discord.js');
const { stable, beta } = require('../../config.json');
module.exports = {
		name: 'botinfo',
		description: 'Info of the bot!',
		guildOnly: true,
		args: false,
		testing: false,
		aliases: ['bi'],
		async execute(message, nothing, client) {
            const os = require('os')
            const amount = await client.shard.broadcastEval('this.guilds.cache.size');
            const amount2 = await amount.reduce((prev, val) => prev + val, 0);
            const creator = await client.users.fetch('127888387364487168');
            const BOTID = client.user.id;
            const embed = new Discord.MessageEmbed()
                .setColor(0x0099ff)
                .setTitle(`${client.user.username}!`)
                .setDescription(`Hello! This is just some average bot that has the most basic functions like playing music or kicking users. If you wish to invite me, just use \`${client.prefix}invite\` (or click below) to add me!`)
                .addField('❤ Total Guilds', amount2, true)
                .addField('💎 Shard ID', message.guild.shardID, true)
                .addField('👑 Creator', `${creator.username + '#' + creator.discriminator}`, true)
                .addField('🖥 Version', parseInt(process.env.MODE) ? stable.version : beta.version, true)
                .addField('📚 Libary', `Discord.js ${Discord.version}`, true)
            if (os.platform() == 'win32') {
                const data = await si.osInfo();
                embed.addField('🖥 OS', `${data.distro}`, true);
                embed.setThumbnail('https://cdn.discordapp.com/attachments/491024501971222538/491024518761021460/Windows-Logo.png');
            }
            if (os.platform() == 'linux') {
                embed.addField('🖥 OS', 'Linux', true);
                embed.setThumbnail('https://cdn.discordapp.com/attachments/491024501971222538/491024720733536277/LINUX-LOGO.png');
            }
            if (os.platform() == 'darwin') {
                embed.addField('🖥 OS', `${osName(os.platform(), os.release())}`, true);
                embed.setThumbnail('https://cdn.discordapp.com/attachments/491024501971222538/491024928028491779/2000px-OS_X_El_Capitan_logo.png');
            }
            if (os.platform() == null || undefined) {
                embed.addField('🖥 OS', 'Unknown', true);
            }
            embed.addField('👍 Vote', `[DBL Upvote](https://top.gg/bot/${BOTID}/vote)`, true)
                .addField('🤖 Bot Invite', `[Click here](https://discordapp.com/oauth2/authorize?client_id=${BOTID}&scope=bot&permissions=3353606)`, true)
                .addField('🖥 Source Code', '[Click here](https://github.com/TacticalTechJay/bookish-waffle)', true)
                .addField('📞 Support Server', '[It is here!](https://discord.gg/PMbESdB)', true)
                .addField('☁ Hosted by', '[GalaxyGate](https://lunasrv.com/host)', true)
                .addField('💵 Donations', '[Ko-fi](https://www.ko-fi.com/earthchandiscord) | [Patreon](https://www.patreon.com/earthchandiscord)', true);
            message.channel.send(embed);
		}
};
