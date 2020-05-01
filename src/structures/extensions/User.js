module.exports = Class =>
    class extends Class {
        constructor(client, data) {
            super(client, data);
        }
        async settings() {
            return await this.client.util.guild(this.id);
        }
    };