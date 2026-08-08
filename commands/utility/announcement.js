const {
    SlashCommandBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("announcement")
        .setDescription("Create a new website announcement."),

    async execute(interaction) {

        const modal = new ModalBuilder()
            .setCustomId("announcementModal")
            .setTitle("Create Announcement");

        const title = new TextInputBuilder()
            .setCustomId("title")
            .setLabel("Announcement Title")
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setMaxLength(100);

        const description = new TextInputBuilder()
            .setCustomId("description")
            .setLabel("Description")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true)
            .setMaxLength(1000);

        const image = new TextInputBuilder()
            .setCustomId("image")
            .setLabel("Image URL (Optional)")
            .setStyle(TextInputStyle.Short)
            .setRequired(false)
            .setPlaceholder("Leave blank to use the default image");

        const buttonText = new TextInputBuilder()
            .setCustomId("buttonText")
            .setLabel("Button Text (Optional)")
            .setStyle(TextInputStyle.Short)
            .setRequired(false)
            .setPlaceholder("Example: Read More");

        const buttonURL = new TextInputBuilder()
            .setCustomId("buttonURL")
            .setLabel("Button URL (Optional)")
            .setStyle(TextInputStyle.Short)
            .setRequired(false)
            .setPlaceholder("https://example.com");

        modal.addComponents(
            new ActionRowBuilder().addComponents(title),
            new ActionRowBuilder().addComponents(description),
            new ActionRowBuilder().addComponents(image),
            new ActionRowBuilder().addComponents(buttonText),
            new ActionRowBuilder().addComponents(buttonURL)
        );

        await interaction.showModal(modal);

    }
};