const fs = require("fs");
const path = require("path");

// ========================================
// Announcements Data File
// ========================================

const dataDirectory = path.join(
    __dirname,
    "../data"
);

const filePath = path.join(
    dataDirectory,
    "announcements.json"
);


// ========================================
// Ensure Data Directory/File Exists
// ========================================

function ensureDataFile() {

    // Create data folder if missing
    if (!fs.existsSync(dataDirectory)) {

        fs.mkdirSync(
            dataDirectory,
            {
                recursive: true
            }
        );

    }


    // Create announcements.json if missing
    if (!fs.existsSync(filePath)) {

        fs.writeFileSync(
            filePath,
            "[]",
            "utf8"
        );

    }

}


// ========================================
// Load Announcements
// ========================================

function load() {

    ensureDataFile();


    try {

        const data = fs.readFileSync(
            filePath,
            "utf8"
        );


        if (!data.trim()) {

            return [];

        }


        const announcements =
            JSON.parse(data);


        return Array.isArray(announcements)
            ? announcements
            : [];


    } catch (error) {

        console.error(
            "❌ Failed to load announcements:",
            error
        );


        return [];

    }

}


// ========================================
// Save Announcements
// ========================================

function save(announcements) {

    ensureDataFile();


    try {

        fs.writeFileSync(

            filePath,

            JSON.stringify(
                announcements,
                null,
                4
            ),

            "utf8"

        );


        return true;


    } catch (error) {

        console.error(
            "❌ Failed to save announcements:",
            error
        );


        return false;

    }

}


// ========================================
// Create Announcement
// ========================================

function create(data) {

    const announcements = load();


    const announcement = {

        id:
            data.id ||
            Date.now().toString(),

        title:
            data.title ||
            "TXRP Announcement",

        content:
            data.content ||
            "",

        author:
            data.author ||
            "TXRP Staff",

        authorId:
            data.authorId ||
            null,

        avatar:
            data.avatar ||
            "",

        date:
            data.date ||
            new Date().toISOString(),

        duration:
            data.duration ||
            null,

        channelId:
            data.channelId ||
            "1506837808348659763"

    };


    // Newest announcement first
    announcements.unshift(
        announcement
    );


    save(announcements);


    console.log(
        `📢 Announcement created: ${announcement.title}`
    );


    return announcement;

}


// ========================================
// Get All Announcements
// ========================================

function getAll() {

    return load();

}


// ========================================
// Get One Announcement
// ========================================

function getById(id) {

    const announcements = load();


    return announcements.find(
        announcement =>
            announcement.id === id
    );

}


// ========================================
// Delete Announcement
// ========================================

function remove(id) {

    const announcements = load();


    const filtered =
        announcements.filter(
            announcement =>
                announcement.id !== id
        );


    save(filtered);


    return true;

}


// ========================================
// Export
// ========================================

module.exports = {

    load,

    save,

    create,

    getAll,

    getById,

    remove

};