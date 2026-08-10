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

const API_PORT =
    process.env.PORT || 3001;


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

    // ==========================
    // Only watch announcement channel
    // ==========================

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
            ).map(attachment => ({

                name:
                    attachment.name || "",

                url:
                    attachment.url,

                contentType:
                    attachment.contentType || "",

                size:
                    attachment.size || 0

            }));


        // ==========================
        // Get Embeds
        // ==========================

        const embeds =
            message.embeds.map(embed => ({

                title:
                    embed.title || "",

                description:
                    embed.description || "",

                url:
                    embed.url || "",

                color:
                    embed.color || null,

                image:
                    embed.image?.url || "",

                thumbnail:
                    embed.thumbnail?.url || "",

                footer:
                    embed.footer?.text || "",

                author:
                    embed.author?.name || ""

            }));


        // ==========================
        // Determine Title
        // ==========================

        let title =
            message.content
                ?.split("\n")[0]
                ?.substring(0, 100);


        // If no message content,
        // use the first embed title

        if (
            !title &&
            embeds.length > 0
        ) {

            title =
                embeds[0].title ||
                embeds[0].author ||
                "TXRP Announcement";

        }


        if (!title) {

            title =
                "TXRP Announcement";

        }


        // ==========================
        // Determine Content
        // ==========================

        let content =
            message.content || "";


        // If there's no normal message
        // content, use embed description

        if (
            !content &&
            embeds.length > 0
        ) {

            content =
                embeds
                    .map(embed => {

                        let text = "";

                        if (embed.title) {

                            text +=
                                `**${embed.title}**\n`;

                        }

                        if (embed.description) {

                            text +=
                                embed.description;

                        }

                        return text;

                    })
                    .filter(Boolean)
                    .join("\n\n");

        }


        // ==========================
        // Message URL
        // ==========================

        const messageURL =
            `https://discord.com/channels/` +
            `${message.guildId}/` +
            `${message.channel.id}/` +
            `${message.id}`;


        // ==========================
        // Create Announcement
        // ==========================

        const announcement =
            announcementManager.create({

                id:
                    message.id,

                title,

                content:
                    content ||
                    "No announcement content.",

                author:
                    message.author
                        ?.username ||
                    "TXRP Staff",

                authorId:
                    message.author
                        ?.id ||
                    null,

                avatar:
                    message.author
                        ?.displayAvatarURL({

                            extension: "png",

                            size: 256

                        }) || "",

                date:
                    message.createdAt
                        .toISOString(),

                channelId:
                    message.channel.id,

                attachments,

                embeds,

                messageURL

            });


        // ==========================
        // Console Logging
        // ==========================

        console.log(
            "=================================="
        );

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

        console.log(
            `🧩 Embeds: ${embeds.length}`
        );

        console.log(
            `🔗 ${messageURL}`
        );

        console.log(
            "=================================="
        );


    } catch (error) {

        console.error(
            "❌ Failed to capture announcement:",
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

// ==========================
// Login
// ==========================

console.log(
    "🔑 TOKEN exists:",
    !!process.env.TOKEN
);

client.login(process.env.TOKEN)
    .then(() => {
        console.log("🔐 Discord login request accepted");
    })
    .catch((error) => {
        console.error("❌ Discord login failed:");
        console.error(error);
    });