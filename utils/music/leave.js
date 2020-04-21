module.exports = async (message, client) => {
    client.queue.delete(message.guild.id);
	message.channel.send('It appears as though there are no tracks playing. :thinking:');
	console.log(`A player has despawned in ${message.guild.name} (${message.guild.id})`);
	return await client.manager.leave(message.guild.id);
}