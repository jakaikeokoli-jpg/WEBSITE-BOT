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
        .setName("showin")
        .setDescription("Publish a website announcement"),

    async execute(interaction) {

        // Tell Discord we're working
        await interaction.deferReply({
            ephemeral: true
        });

        const announcements =
            announcementManager
                .getAll()
                .filter(a => !a.published);

        if (!announcements.length) {

            return interaction.editReply({

                embeds: [

                    new EmbedBuilder()
                        .setColor("Red")
                        .setTitle("❌ No Drafts")
                        .setDescription(
                            "There are currently no draft announcements."
                        )

                ]

            });

        }

        const menu = new StringSelectMenuBuilder()

            .setCustomId("publishAnnouncement")

            .setPlaceholder("Select a draft announcement")

            .addOptions(

                announcements.map(a => ({

                    label: a.title.substring(0, 100),

                    description:
                        `Created by ${a.createdBy}`,

                    value: String(a.id)

                }))

            );

        const row =
            new ActionRowBuilder()
                .addComponents(menu);

        const embed =
            new EmbedBuilder()

                .setColor("#E58A2B")

                .setTitle("📢 Publish Announcement")

                .setDescription(
                    "Select which draft announcement you want to publish."
                )

                .setFooter({
                    text: `Drafts: ${announcements.length}`
                });

        await interaction.editReply({

            embeds: [embed],

            components: [row]

        });

    }

};