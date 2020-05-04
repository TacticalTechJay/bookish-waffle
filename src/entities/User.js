module.exports = {
    name: 'User',
    columns: {
        id: {
            primary: true,
            type: 'text'
        },
        queues: {
            type: 'simple-json',
            default: {}
        },
        premium: {
            type: 'simple-json',
            default: {
                donator: false,
                voter: false
            }
        }
    }
};
