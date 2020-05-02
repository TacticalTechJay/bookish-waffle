module.exports = async (body) => {
    const fetch = require('node-fetch');
    const res = await fetch('https://bin.lunasrv.com/documents', {
        method: 'POST',
        body: body,
        headers: { 'Content-Type': 'text/plain' }
    });
    const { key } = await res.json();
    return key;
};