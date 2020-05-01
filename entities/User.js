module.exports = {
    name: 'User',
    columns: {
        id: {
            primary: true,
            type: 'text',
        },
        queues: {
            type: 'simple-json',
            default: {}
        },
        donator: {
            type: 'boolean',
            default: false
        },
        voted: {
            type: 'boolean',
            default: false
        }
    }
};