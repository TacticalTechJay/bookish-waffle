module.exports = Class =>
    class extends Class {
        constructor(client, data) {
            super(client, data);
        }
        async data() {
            return await this.client.util.user(this.id);
        }
    };