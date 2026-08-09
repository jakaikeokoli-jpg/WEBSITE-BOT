const {
    EmbedBuilder
} = require("discord.js");

const cache =
    require("../utils/cacheManager");

const announcementManager =
    require("../managers/announcementManager");

module.exports = async (interaction) => {

    // ========================================
    // Announcement Duration
    // ========================================

    if (
        interaction.customId ===
        "announcementDuration"
    ) {

        const duration =
            interaction.values[0];

        const announcement =
            cache.get(
                interaction.user.id
            );

        if (!announcement) {

            return interaction.update({

                embeds: [

                    new EmbedBuilder()

                        .setColor("Red")

                        .setTitle("❌ Error")

                        .setDescription(
                            "Announcement expired.\nRun **/announcement** again."
                        )

                ],

                components: []

            });

        }

        const created =
            announcementManager.create({

                id:
                    announcement.id,

                title:
                    announcement.title,

                content:
                    announcement.content,

                author:
                    interaction.user.username,

                authorId:
                    interaction.user.id,

                avatar:
                    interaction.user.displayAvatarURL({
                        extension: "png",
                        size: 256
                    }),

                date:
                    new Date().toISOString(),

                duration:
                    duration,

                channelId:
                    "1506837808348659763"

            });

        cache.delete(
            interaction.user.id
        );

        return interaction.update({

            embeds: [

                new EmbedBuilder()

                    .setColor("#2ecc71")

                    .setTitle(
                        "✅ Draft Saved"
                    )

                    .setDescription(
                        "Your announcement has been saved as a **Draft**.\n\nUse **/showin** to publish it to the TXRP website."
                    )

                    .addFields(

                        {
                            name: "📰 Title",
                            value:
                                created.title ||
                                "TXRP Announcement"
                        },

                        {
                            name: "📌 Status",
                            value: "🟡 Draft",
                            inline: true
                        },

                        {
                            name: "⏳ Duration",
                            value:
                                duration ||
                                "Not specified",
                            inline: true
                        }

                    )

            ],

            components: []

        });

    }


    // ========================================
    // Publish Announcement
    // ========================================

    if (
        interaction.customId ===
        "publishAnnouncement"
    ) {

        const id =
            String(
                interaction.values[0]
            );

        const announcements =
            announcementManager.getAll();

        const announcement =
            announcements.find(
                a =>
                    String(a.id) === id
            );

        if (!announcement) {

            return interaction.update({

                embeds: [

                    new EmbedBuilder()

                        .setColor("Red")

                        .setTitle(
                            "❌ Not Found"
                        )

                        .setDescription(
                            "Announcement could not be found."
                        )

                ],

                components: []

            });

        }

        announcement.published =
            true;

        announcement.publishedBy =
            interaction.user.tag;

        announcement.publishedAt =
            new Date().toISOString();

        announcementManager.save(
            announcements
        );

        return interaction.update({

            embeds: [

                new EmbedBuilder()

                    .setColor("#57F287")

                    .setTitle(
                        "🚀 Announcement Published"
                    )

                    .setDescription(
                        `**${announcement.title}** is now live on the website.`
                    )

            ],

            components: []

        });

    }


    // ========================================
    // Delete Announcement
    // ========================================

    if (
        interaction.customId ===
        "deleteAnnouncementSelect"
    ) {

        const id =
            String(
                interaction.values[0]
            );

        console.log(
            `🗑️ Delete requested for announcement ID: ${id}`
        );

        const announcement =
            announcementManager.getById(id);

        if (!announcement) {

            return interaction.update({

                embeds: [

                    new EmbedBuilder()

                        .setColor("Red")

                        .setTitle(
                            "❌ Announcement Not Found"
                        )

                        .setDescription(
                            "That announcement could not be found in the bot's database."
                        )

                ],

                components: []

            });

        }

        const deleted =
            announcementManager.remove(id);

        if (!deleted) {

            return interaction.update({

                embeds: [

                    new EmbedBuilder()

                        .setColor("Red")

                        .setTitle(
                            "❌ Delete Failed"
                        )

                        .setDescription(
                            "The announcement was found, but the bot could not save the deletion."
                        )

                ],

                components: []

            });

        }

        return interaction.update({

            embeds: [

                new EmbedBuilder()

                    .setColor("#ED4245")

                    .setTitle(
                        "🗑️ Announcement Deleted"
                    )

                    .setDescription(
                        `**${announcement.title}** has been removed from the TXRP website.`
                    )

                    .addFields({

                        name: "Deleted By",

                        value:
                            interaction.user.tag

                    })

            ],

            components: []

        });

    }

};