const cache = new Map();

module.exports = {

    set(userId, data) {
        cache.set(userId, data);
    },

    get(userId) {
        return cache.get(userId);
    },

    delete(userId) {
        cache.delete(userId);
    }

};