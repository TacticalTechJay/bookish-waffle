module.exports = async (guild, channel, client) => {
    return client.queue.set(guild, {
		songs: [],
		looping: 'none',
		pb: true,
		channel: channel,
		locked: false
	});
};