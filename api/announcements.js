const express = require("express");

const router = express.Router();

const fs = require("fs");
const path = require("path");

const CHANNEL_ID = "1506837808348659763";

const filePath = path.join(
    __dirname,
    "../data/announcements.json"
);


// ==========================
// Get Announcements
// ==========================

router.get("/", (req, res) => {

    if (!fs.existsSync(filePath)) {
        return res.json([]);
    }

    try {

        const announcements = JSON.parse(
            fs.readFileSync(filePath, "utf8")
        );

        res.json(announcements);

    } catch (error) {

        console.error(
            "Announcement API Error:",
            error
        );

        res.status(500).json({
            error: "Unable to load announcements"
        });

    }

});


// ==========================
// Publish Announcement
// ==========================

router.post("/", (req, res) => {

    const {
        title,
        content,
        author,
        date
    } = req.body;


    if (!title || !content) {

        return res.status(400).json({
            error: "Title and content are required"
        });

    }


    let announcements = [];


    if (fs.existsSync(filePath)) {

        try {

            announcements = JSON.parse(
                fs.readFileSync(filePath, "utf8")
            );

        } catch {

            announcements = [];

        }

    }


    const announcement = {

        id: Date.now().toString(),

        title,

        content,

        author:
            author || "TXRP Staff",

        date:
            date ||
            new Date().toISOString(),

        channelId: CHANNEL_ID

    };


    announcements.unshift(
        announcement
    );


    fs.writeFileSync(
        filePath,
        JSON.stringify(
            announcements,
            null,
            4
        )
    );


    res.status(201).json(
        announcement
    );

});


module.exports = router;