const express = require("express");

const router = express.Router();

const announcementManager =
    require("../managers/announcementManager");

// ========================================
// Get Announcements
// ========================================

router.get("/", (req, res) => {

    try {

        const announcements =
            announcementManager.getAll();

        res.json(announcements);

    } catch (error) {

        console.error(
            "❌ Announcement API Error:",
            error
        );

        res.status(500).json({

            error:
                "Unable to load announcements"

        });

    }

});

// ========================================
// Get Single Announcement
// ========================================

router.get("/:id", (req, res) => {

    try {

        const announcement =
            announcementManager.getById(
                req.params.id
            );

        if (!announcement) {

            return res.status(404).json({

                error:
                    "Announcement not found"

            });

        }

        res.json(announcement);

    } catch (error) {

        console.error(
            "❌ Announcement API Error:",
            error
        );

        res.status(500).json({

            error:
                "Unable to load announcement"

        });

    }

});

// ========================================
// Create Announcement
// ========================================

router.post("/", (req, res) => {

    try {

        const {

            id,
            title,
            content,
            author,
            authorId,
            avatar,
            date,
            duration,
            channelId,
            attachments,
            messageURL

        } = req.body;

        if (!title || !content) {

            return res.status(400).json({

                error:
                    "Title and content are required"

            });

        }

        const announcement =
            announcementManager.create({

                id,

                title,

                content,

                author:
                    author ||
                    "TXRP Staff",

                authorId:
                    authorId ||
                    null,

                avatar:
                    avatar ||
                    "",

                date:
                    date ||
                    new Date().toISOString(),

                duration:
                    duration ||
                    null,

                channelId:
                    channelId ||
                    "1506837808348659763",

                attachments:
                    attachments ||
                    [],

                messageURL:
                    messageURL ||
                    ""

            });

        res.status(201).json(
            announcement
        );

    } catch (error) {

        console.error(
            "❌ Failed to create announcement:",
            error
        );

        res.status(500).json({

            error:
                "Unable to create announcement"

        });

    }

});

// ========================================
// Delete Announcement
// ========================================

router.delete("/:id", (req, res) => {

    try {

        const id =
            String(
                req.params.id
            );

        const existing =
            announcementManager.getById(
                id
            );

        if (!existing) {

            return res.status(404).json({

                error:
                    "Announcement not found"

            });

        }

        const deleted =
            announcementManager.remove(
                id
            );

        if (!deleted) {

            return res.status(500).json({

                error:
                    "Unable to delete announcement"

            });

        }

        res.json({

            success: true,

            deletedId: id,

            message:
                "Announcement deleted successfully"

        });

    } catch (error) {

        console.error(
            "❌ Failed to delete announcement:",
            error
        );

        res.status(500).json({

            error:
                "Unable to delete announcement"

        });

    }

});

module.exports = router;