const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

module.exports = class Server {
    constructor(client, port, cb) {
        this.client = client;

        this.app = express();
        this.app.use(cors());
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({
            extended:false
        }));

        this.routes();
        this.app.listen(port, cb);
    }
    routes() {
        this.app.get('/api/commands', (req, res) => {
            const commands = this.client.handler.commands.filter(c=>!c.devOnly).map(c => ({
                name: c.name,
                aliases: c.aliases,
                category: c.category,
                usage: c.usage,
                description: c.description,
            }));
            res.send(commands);
        });
    }
};