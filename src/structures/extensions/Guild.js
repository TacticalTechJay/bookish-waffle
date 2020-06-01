module.exports = Class =>
    class extends Class {
        constructor(client, data) {
            super(client, data);
        }
        get player() {
            return this.client.manager.players.get(this.id);
        }
        async settings() {
            return await this.client.util.guild(this.id);
        }
    };