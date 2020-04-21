module.exports = async (guild, channel, client) => {
    client.queue.set(guild, {
		songs: [],
		looping: 'none',
		pb: true,
		channel: channel
	});
}