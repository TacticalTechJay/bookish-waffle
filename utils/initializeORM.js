const { createConnection, EntitySchema } = require('typeorm');
const config = require('../config.json');
module.exports = async (client) => {
    const connection = await createConnection({
        type: 'postgres',
        host: Number(process.env.MODE) ? config.stable.postgres.host : config.beta.postgres.host,
        username: Number(process.env.MODE) ? config.stable.postgres.user : config.beta.postgres.user,
        password: Number(process.env.MODE) ? config.stable.postgres.password : config.beta.postgres.password,
        database: Number(process.env.MODE) ? config.stable.postgres.database : config.beta.postgres.database,
        synchronize: true,
        entities: [
            new EntitySchema(require('../entities/User.js')),
            new EntitySchema(require('../entities/Guild.js'))
        ]
    });
    client.orm = {
        connection,
        repos: {
          user: connection.getRepository('User'),
          guild: connection.getRepository('Guild')
        }
    };
  };