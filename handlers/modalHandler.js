const {
    StringSelectMenuBuilder,
    ActionRowBuilder,
    EmbedBuilder
} = require("discord.js");

const cache = require("../utils/cacheManager");

module.exports = async (interaction) => {

    if (interaction.customId !== "announcementModal") return;

    console.log("📢 Announcement modal submitted");

    cache.set(interaction.user.id, {

        title:
            interaction.fields.getTextInputValue("title"),

        description:
            interaction.fields.getTextInputValue("description"),

        image:
            interaction.fields.getTextInputValue("image") || "",

        buttonText:
            interaction.fields.getTextInputValue("buttonText") || "",

        buttonURL:
            interaction.fields.getTextInputValue("buttonURL") || ""

    });

    const durationMenu = new StringSelectMenuBuilder()

        .setCustomId("announcementDuration")

        .setPlaceholder("Choose how long this announcement should stay active")

        .addOptions(

            {
                label: "1 Hour",
                value: "1h"
            },

            {
                label: "6 Hours",
                value: "6h"
            },

            {
                label: "12 Hours",
                value: "12h"
            },

            {
                label: "1 Day",
                value: "1d"
            },

            {
                label: "3 Days",
                value: "3d"
            },

            {
                label: "7 Days",
                value: "7d"
            },

            {
                label: "30 Days",
                value: "30d"
            }

        );

    const row =
        new ActionRowBuilder()
            .addComponents(durationMenu);

    await interaction.reply({

        embeds: [

            new EmbedBuilder()

                .setColor("#E58A2B")

                .setTitle("📅 Choose Duration")

                .setDescription(
                    "Select how long this announcement should stay active."
                )

        ],

        components: [row],

        ephemeral: true

    });

};