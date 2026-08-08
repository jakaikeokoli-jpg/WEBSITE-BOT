const {
    EmbedBuilder
} = require("discord.js");

const cache = require("../utils/cacheManager");
const announcementManager =
    require("../managers/announcementManager");

module.exports = async (interaction) => {

    // ==========================
    // Announcement Duration
    // ==========================

    if (interaction.customId === "announcementDuration") {

        const duration = interaction.values[0];

        const announcement =
            cache.get(interaction.user.id);

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
            announcementManager.create(

                interaction.user,

                announcement,

                duration

            );

        cache.delete(interaction.user.id);

        return interaction.update({

            embeds: [

                new EmbedBuilder()

                    .setColor("#2ecc71")

                    .setTitle("✅ Draft Saved")

                    .setDescription(
    "Your announcement has been saved as a **Draft**.\n\nUse **/showin** to publish it to the TXRP website."
)
                    

                    .addFields(

                        {
                            name: "📰 Title",
                            value: created.title
                        },

                        {
                            name: "📌 Status",
                            value: "🟡 Draft",
                            inline: true
                        },

                        {
                            name: "⏳ Duration",
                            value: duration,
                            inline: true
                        }

                    )

            ],

            components: []

        });

    }

    // ==========================
    // Publish Announcement
    // ==========================

    if (interaction.customId === "publishAnnouncement") {

        const id = Number(interaction.values[0]);

        const announcements =
            announcementManager.getAll();

        const announcement =
            announcements.find(a => a.id === id);

        if (!announcement) {

            return interaction.update({

                embeds: [

                    new EmbedBuilder()

                        .setColor("Red")

                        .setTitle("❌ Not Found")

                        .setDescription(
                            "Announcement could not be found."
                        )

                ],

                components: []

            });

        }

        announcement.published = true;

        announcement.publishedBy =
            interaction.user.tag;

        announcement.publishedAt =
            new Date().toISOString();

        announcementManager.saveAll(announcements);

        return interaction.update({

            embeds: [

                new EmbedBuilder()

                    .setColor("#57F287")

                    .setTitle("🚀 Announcement Published")

                    .setDescription(
                        `**${announcement.title}** is now live on the website.`
                    )

            ],

            components: []

        });

    }

};