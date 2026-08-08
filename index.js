require("dotenv").config();

const {
    Client,
    GatewayIntentBits
} = require("discord.js");

const express = require("express");
const cors = require("cors");

const loadCommands = require("./handlers/loadCommands");
const interactionEvent = require("./events/interactionCreate");

const staffAPI = require("./api/staff");
const announcementsAPI = require("./api/announcements");

const announcementManager =
    require("./managers/announcementManager");

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

app.use(cors());

app.use(express.json());

// Render provides PORT automatically
const API_PORT = process.env.PORT || 3001;

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
    if (message.author.bot) {
        return;
    }

    // Only watch announcement channel
    if (
        message.channel.id !==
        ANNOUNCEMENT_CHANNEL_ID
    ) {
        return;
    }

    try {

        // ==========================
        // Get Attachments
        // ==========================

        const attachments =
            Array.from(
                message.attachments.values()
            ).map(
                attachment => ({

                    name:
                        attachment.name,

                    url:
                        attachment.url,

                    contentType:
                        attachment.contentType,

                    size:
                        attachment.size

                })
            );

        // ==========================
        // Create Announcement
        // ==========================

        const announcement =
            announcementManager.create({

                id:
                    message.id,

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
                    message.channel.id,

                attachments,

                messageURL:
                    `https://discord.com/channels/` +
                    `${message.guildId}/` +
                    `${message.channel.id}/` +
                    `${message.id}`

            });

        console.log(
            "📢 New TXRP announcement captured"
        );

        console.log(
            `📝 ${announcement.title}`
        );

        console.log(
            `👤 ${announcement.author}`
        );

        console.log(
            `📎 Attachments: ${attachments.length}`
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