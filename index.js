require("dotenv").config();

const {
    Client,
    GatewayIntentBits
} = require("discord.js");

const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const loadCommands = require("./handlers/loadCommands");
const interactionEvent = require("./events/interactionCreate");

const staffAPI = require("./api/staff");
const announcementsAPI = require("./api/announcements");


// ==========================
// Discord Client
// ==========================

const client = new Client({

    intents: [

        GatewayIntentBits.Guilds,

        GatewayIntentBits.GuildMembers,

        GatewayIntentBits.GuildPresences,

        GatewayIntentBits.GuildMessages,

        GatewayIntentBits.MessageContent

    ]

});


// ==========================
// Express API
// ==========================

const app = express();


// Enable CORS
app.use(cors());


// Allow JSON
app.use(express.json());


// API Port
const API_PORT = process.env.API_PORT || 3001;


// ==========================
// Staff API
// ==========================

app.use(
    "/api/staff",

    (req, res, next) => {

        req.client = client;

        next();

    },

    staffAPI
);


// ==========================
// Announcements API
// ==========================

app.use(
    "/api/announcements",

    (req, res, next) => {

        req.client = client;

        next();

    },

    announcementsAPI
);


// ==========================
// Start Express API
// ==========================

app.listen(API_PORT, () => {

    console.log("==============================");

    console.log(
        `🌐 API running on port ${API_PORT}`
    );

    console.log("==============================");

});


// ==========================
// Load Commands
// ==========================

loadCommands(client);


// ==========================
// Announcement Channel
// ==========================

const ANNOUNCEMENT_CHANNEL_ID =
    "1506837808348659763";


// ==========================
// Discord Message Listener
// ==========================

client.on("messageCreate", async (message) => {

    // Ignore bots
    if (message.author.bot) return;


    // Only listen to announcement channel
    if (
        message.channel.id !==
        ANNOUNCEMENT_CHANNEL_ID
    ) {
        return;
    }


    try {

        const filePath = path.join(
            __dirname,
            "data",
            "announcements.json"
        );


        // Make sure data folder exists
        const dataFolder = path.join(
            __dirname,
            "data"
        );


        if (!fs.existsSync(dataFolder)) {

            fs.mkdirSync(
                dataFolder,
                {
                    recursive: true
                }
            );

        }


        // Create file if it doesn't exist
        if (!fs.existsSync(filePath)) {

            fs.writeFileSync(
                filePath,
                "[]"
            );

        }


        let announcements = [];


        try {

            announcements = JSON.parse(
                fs.readFileSync(
                    filePath,
                    "utf8"
                )
            );

        } catch (error) {

            console.error(
                "⚠️ announcements.json could not be read."
            );

            announcements = [];

        }


        // ==========================
        // Create Announcement
        // ==========================

        const announcement = {

            id: message.id,

            title:
                message.content
                    .split("\n")[0]
                    .substring(0, 100)
                ||
                "TXRP Announcement",

            content:
                message.content,

            author:
                message.author.username,

            authorId:
                message.author.id,

            avatar:
                message.author.displayAvatarURL({
                    extension: "png",
                    size: 256
                }),

            date:
                message.createdAt.toISOString(),

            channelId:
                message.channel.id

        };


        // Add newest announcement first
        announcements.unshift(
            announcement
        );


        // Save announcements
        fs.writeFileSync(

            filePath,

            JSON.stringify(
                announcements,
                null,
                4
            )

        );


        console.log(
            `📢 New TXRP announcement saved: ${message.id}`
        );


    } catch (error) {

        console.error(
            "❌ Failed to save announcement:",
            error
        );

    }

});


// ==========================
// Bot Ready
// ==========================

client.once("clientReady", () => {

    console.log("==============================");

    console.log(
        `✅ Logged in as ${client.user.tag}`
    );

    console.log(
        "🤖 TXRP Website Bot Online"
    );

    console.log(
        `📢 Watching announcement channel: ${ANNOUNCEMENT_CHANNEL_ID}`
    );

    console.log("==============================");

});


// ==========================
// Interaction Handler
// ==========================

client.on(

    interactionEvent.name,

    (...args) =>
        interactionEvent.execute(
            ...args,
            client
        )

);


// ==========================
// Login
// ==========================

client.login(
    process.env.TOKEN
);