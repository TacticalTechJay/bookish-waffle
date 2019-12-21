const Discord = require('discord.js');
module.exports = {
    name: 'botinfo',
    description: 'Info of the bot!',
    category: 'general',
    guildOnly: true,
    args: false,
    testing: false,
    async execute(message, nothing, client) {
        const amount = await client.shard.broadcastEval('this.guilds.size');
        const amount2 = await amount.reduce((prev, val) => prev + val, 0);
        let creator = await client.users.fetch('127888387364487168');
        let BOTID = client.user.id;
        const embed = new Discord.MessageEmbed()
            .setColor(0x0099ff)
            .setTitle(`${client.user.username}!`)
            .setDescription('Hello! This is just some average bot that has the most basic functions like playing music or kicking users. If you wish to invite me, just use `plana invite`(or click below) to add me!')
            .addField('❤ Total Guilds', amount2, true)
            .addField('💎 Shard ID', message.guild.shardID, true)
            .addField('👑 Creator', `${creator.username + '#' + creator.discriminator}`, true)
            .addField('Version', 'v1.0.0', true)
            .addField('📚 Libary', `Discord.js ${Discord.version}`, true)
            .addField('🖥 OS', require('os').type(), true)
            .addField('👍 Vote', `[DBL Upvote](https://top.gg/bot/${BOTID}/vote)`, true)
            .addField('Bot Invite', `[Click here](https://discordapp.com/oauth2/authorize?client_id=${BOTID}&scope=bot&permissions=3353606)`, true)
            .addField('Source Code', '[Click here](https://github.com/TacticalTechJay/bookish-waffle)', true)
            .addField('📞 Support Server', '[It is here!](https://discord.gg/PMbESdB)', true)
            .addField('☁ Hosted by', '[GalaxyGate](https://billing.galaxygate.net/aff.php?aff=59)', true)
            .addField('Donations', '[Ko-fi](https://www.ko-fi.com/earthchandiscord)', true);
        message.channel.send(embed);
    }
};
