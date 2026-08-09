const {
    SlashCommandBuilder,
    StringSelectMenuBuilder,
    ActionRowBuilder,
    EmbedBuilder
} = require("discord.js");

const announcementManager =
    require("../../managers/announcementManager");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("deleteannouncement")
        .setDescription(
            "Delete an announcement from the TXRP website"
        ),

    async execute(interaction) {

        const announcements =
            announcementManager.getAll();

        if (!announcements.length) {

            return interaction.reply({

                ephemeral: true,

                embeds: [

                    new EmbedBuilder()

                        .setColor("Red")

                        .setTitle(
                            "❌ No Announcements"
                        )

                        .setDescription(
                            "There are currently no announcements on the website."
                        )

                ]

            });

        }

        // Discord select menus allow a maximum of 25 options.
        const visibleAnnouncements =
            announcements.slice(0, 25);

        const options =
            visibleAnnouncements.map(
                (announcement) => ({

                    label:
                        (
                            announcement.title ||
                            "TXRP Announcement"
                        ).substring(0, 100),

                    description:
                        (
                            announcement.author ||
                            "TXRP Staff"
                        ).substring(0, 100),

                    value:
                        String(announcement.id)

                })
            );

        const menu =
            new StringSelectMenuBuilder()

                .setCustomId(
                    "deleteAnnouncementSelect"
                )

                .setPlaceholder(
                    "Select an announcement to delete"
                )

                .addOptions(options);

        const row =
            new ActionRowBuilder()
                .addComponents(menu);

        const embed =
            new EmbedBuilder()

                .setColor("#E58A2B")

                .setTitle(
                    "🗑️ Delete Announcement"
                )

                .setDescription(
                    "Select the announcement you want to remove from the TXRP website."
                )

                .setFooter({

                    text:
                        `${announcements.length} announcement(s)`

                });

        return interaction.reply({

            ephemeral: true,

            embeds: [embed],

            components: [row]

        });

    }

};