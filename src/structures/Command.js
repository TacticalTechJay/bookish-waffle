class Command {
    constructor(client, options = {
        name: null,
        aliases: [],
        description: null,
        usage: null,
        category: 'system',
        devOnly: false
    }) {
        this.client = client;
        this.name = options.name || null;
        this.aliases = options.aliases || [];
        this.description = options.description || null;
        this.usage = options.usage ? `${this.name} ${options.usage}` : this.name;
        this.category = options.category || 'system';
        this.devOnly = options.devOnly;
    }
}

module.exports = Command;