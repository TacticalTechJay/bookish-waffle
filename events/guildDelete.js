module.exports = {
    name: 'guildDelete',
    async exec (guild, client) {
        if (!guild.available) return;
        const embed = new (require('discord.js').MessageEmbed)()
            .setTitle('Guild removed.')
            .addField('Guild Name', guild.name)
            .addField('Guild ID', guild.id)
            .addField('Guild Owner', guild.owner.user.username)
            .addField('Guild Members (Excluding bots)', guild.members.cache.filter(m => !m.user.bot).size)
            .setColor('RED');
        return client.channels.cache.get('661669168009052200').send(embed);
    }
}