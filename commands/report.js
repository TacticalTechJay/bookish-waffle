const { ksoftapi } = require('../config.json');
module.exports = {
    name: 'report',
    description: 'Report a user and ban them through a global ban list so others know the risks before it may be too late.',
    category: 'moderation',
    guildOnly: true,
    args: true,
    cooldown: 60,
    usage: '<UserPing/UserID> <ImageURL> <Reason>',
    async execute(message, args) {
        const fetch = require('node-fetch');
        const { URLSearchParams } = require('url');
        const target = message.mentions.users.first().id || message.guild.members.get(args[0]).id;
        const proof = args[1];
        args.splice(0, 2);
        const reason = args.join(' ');
        if (!message.member.hasPermission('BAN_MEMBERS', true, true)) return message.channel.send('You are missing permissions to use this command.')
        if (!message.guild.me.hasPermission('BAN_MEMBERS', true, true)) return message.channel.send('I am missing the permission to ban this member. I can not report without ban permissions.')
        if (!target) return message.channel.send('You have forgotten to mention a user and/or provide an ID.');
        if (!proof || !proof.endsWith('.png') && !proof.endsWith('.jpeg')) return message.channel.send('You are missing an image!');
        if (!reason) return message.channel.send('You need to include a reason for your report!');
        if (!message.member.hasPermission('BAN_MEMBERS', true, true)) return message.channel.send('You are missing permissions to use this command.')
        if (!message.guild.me.hasPermission('BAN_MEMBERS', true, true)) return message.channel.send('I am missing the permission to ban this member. I can not report without ban permissions.')
        const params = new URLSearchParams();
        params.append('user', target);
        params.append('mod', message.author.id);
        params.append('reason', encodeURIComponent(reason));
        params.append('proof', proof);
        let res = await fetch('https://api.ksoft.si/bans/add', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${ksoftapi}` },
            body: params
        }).catch(e => { return message.channel.send(e.message); });
        console.log(res);
        message.guild.members.ban(target, reason).then(m => m.send(`You have been banned from ${message.guild.name} and reported for the following reason: ${reason}`)).catch(() => message.channel.send('Something went wrong. Do not worry! I reported the user, you may need to ban the user yourself.'));
        return message.channel.send(`I have successfully banned and reported ${target} for the following reason: ${reason}`);
    }
}
