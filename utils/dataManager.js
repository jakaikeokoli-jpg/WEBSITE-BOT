const fs = require("fs");
const path = require("path");

// Root data folder
const DATA_FOLDER = path.join(__dirname, "../../data");

function getFile(fileName) {
    return path.join(DATA_FOLDER, fileName);
}

function read(fileName) {
    const file = getFile(fileName);

    if (!fs.existsSync(file)) {
        fs.writeFileSync(file, "[]");
    }

    try {
        const content = fs.readFileSync(file, "utf8");

        if (!content.trim()) return [];

        return JSON.parse(content);

    } catch (err) {

        console.log(`⚠ Resetting ${fileName}`);

        fs.writeFileSync(file, "[]");

        return [];

    }
}

function write(fileName, data) {

    fs.writeFileSync(

        getFile(fileName),

        JSON.stringify(data, null, 4)

    );

}

module.exports = {

    readAnnouncements() {
        return read("announcements.json");
    },

    saveAnnouncements(data) {
        write("announcements.json", data);
    },

    readEvents() {
        return read("events.json");
    },

    saveEvents(data) {
        write("events.json", data);
    },

    readDepartments() {
        return read("departments.json");
    },

    saveDepartments(data) {
        write("departments.json", data);
    },

    readDirective() {
        return read("directive.json");
    },

    saveDirective(data) {
        write("directive.json", data);
    },

    readFAQ() {
        return read("faq.json");
    },

    saveFAQ(data) {
        write("faq.json", data);
    }

};