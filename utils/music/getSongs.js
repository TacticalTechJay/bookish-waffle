module.exports = async (string) => {
	const { sys } = require('../../config.json');
	const fetch = require('node-fetch');
	async function get(string, i) {
		const url = new URL(`http://${sys.nodes[1].host}:${sys.nodes[1].port}/loadtracks?identifier=${string}`);
		const res = await fetch(url, {
			headers: { 'Authorization': sys.nodes[1].password }
		}).catch(err => {
			console.error(err);
			return null;
		});
		const res2 = await res.json();
		if (i == 3) throw 'NO_MATCHES';
		if (res2.loadType == 'NO_MATCHES') {
			++i;
			return get(string, i);
		}
		return res2;
	}
    try {
		let i = 0;
		var res2 = await get(string, i);
	} catch(e) {
		console.error(e);
		if (e == 'NO_MATCHES') throw 'NO MATCHES';
		throw e;
	}
	if (!res2) throw 'NO RESPONSE';
	if (!res2.tracks) throw 'NO TRACKS';
	return res2;
};