module.exports = async (message, client) => {
    await client.manager.join({
		guild: message.guild.id,
		channel: message.member.voice.channel.id,
		node: client.lavalink.id
	});
	await client.manager.players.get(message.guild.id).volume(50);
	console.log(`A player has spawned in ${message.guild.name} (${message.guild.id})`);

};