module.exports = {
    name: 'unban',
    description: 'Think they served their ban long enough? Well now you can them!',
    category: 'moderation',
    guildOnly: true,
    args: true,
    usage: '<UserID>',
    cooldown: 5,
    async execute(message, args, client) {
        const user = await client.users.fetch(args[0]);
        let reason = args.splice(1).join(' ');
        if (!reason) reason = 'No reason provided';
        if (!message.guild.me.permissions.has('BAN_MEMBERS')) return message.channel.send('I do not have the required permissions to unban someone.');
        if (!message.member.permissions.has('BAN_MEMBERS')) return message.channel.send('You do not have the requirements to unban someone. `MISSING BAN_MEMBES`');
        message.guild.members.unban(user, reason)
            .catch((e) => console.error(e));
        message.channel.send(`I have unbanned ${user.tag} for the following reason: ${reason}`);
    }
}