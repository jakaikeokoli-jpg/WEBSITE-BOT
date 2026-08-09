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

    if (!fs.existsSync(dataDirectory)) {

        fs.mkdirSync(
            dataDirectory,
            {
                recursive: true
            }
        );

    }

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

        const data =
            fs.readFileSync(
                filePath,
                "utf8"
            );

        if (!data.trim()) {

            return [];

        }

        const announcements =
            JSON.parse(data);

        return Array.isArray(
            announcements
        )
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

    const announcements =
        load();

    // Prevent duplicate Discord messages
    if (data.id) {

        const existing =
            announcements.find(
                announcement =>
                    String(announcement.id) ===
                    String(data.id)
            );

        if (existing) {

            return existing;

        }

    }

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
            "1506837808348659763",

        attachments:
            data.attachments ||
            [],

        messageURL:
            data.messageURL ||
            "",

        published:
            data.published ||
            false,

        publishedBy:
            data.publishedBy ||
            null,

        publishedAt:
            data.publishedAt ||
            null

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

    const announcements =
        load();

    return announcements.find(
        announcement =>
            String(announcement.id) ===
            String(id)
    );

}

// ========================================
// Delete Announcement
// ========================================

function remove(id) {

    const announcements =
        load();

    const normalizedId =
        String(id);

    const existing =
        announcements.find(
            announcement =>
                String(announcement.id) ===
                normalizedId
        );

    if (!existing) {

        console.log(
            `❌ Announcement ${normalizedId} was not found.`
        );

        console.log(
            "Available IDs:",
            announcements.map(
                announcement =>
                    String(announcement.id)
            )
        );

        return false;

    }

    const filtered =
        announcements.filter(
            announcement =>
                String(announcement.id) !==
                normalizedId
        );

    const saved =
        save(filtered);

    if (!saved) {

        console.error(
            "❌ Failed to save announcements after deletion."
        );

        return false;

    }

    console.log(
        `🗑️ Deleted announcement: ${existing.title}`
    );

    console.log(
        `📊 Remaining announcements: ${filtered.length}`
    );

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