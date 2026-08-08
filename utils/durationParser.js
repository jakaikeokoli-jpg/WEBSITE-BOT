module.exports = function (duration) {

    const now = Date.now();

    switch (duration) {

        case "1h":
            return now + 3600000;

        case "6h":
            return now + 21600000;

        case "12h":
            return now + 43200000;

        case "1d":
            return now + 86400000;

        case "3d":
            return now + 259200000;

        case "7d":
            return now + 604800000;

        case "30d":
            return now + 2592000000;

        default:
            return now;

    }

};