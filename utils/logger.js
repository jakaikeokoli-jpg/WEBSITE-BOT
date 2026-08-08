const fs = require("fs");
const path = require("path");

const logFile = path.join(
    __dirname,
    "../../data/audit.log"
);

module.exports = {

    log(message) {

        const line =
            `[${new Date().toLocaleString()}] ${message}\n`;

        fs.appendFileSync(logFile, line);

    }

};