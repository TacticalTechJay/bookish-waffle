module.exports = {
    name: 'User',
    columns: {
        id: {
            primary: true,
            type: 'text',
        },
        donator: {
            type: 'boolean',
            default: false
        },
        queues: {
            type: 'simple-json',
            default: {}
        }
    }
};