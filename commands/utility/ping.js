const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Shows the bot latency."),

    async execute(interaction) {

        const embed = new EmbedBuilder()
            .setColor("#E58A2B")
            .setTitle("🏓 Pong!")
            .setDescription("The TXRP Website Bot is online and responding.")
            .addFields(
                {
                    name: "Latency",
                    value: `${Date.now() - interaction.createdTimestamp}ms`,
                    inline: true
                },
                {
                    name: "API Ping",
                    value: `${Math.round(interaction.client.ws.ping)}ms`,
                    inline: true
                }
            )
            .setFooter({
                text: "Texas State Roleplay • Website Bot"
            })
            .setTimestamp();

        await interaction.reply({
            embeds: [embed]
        });

    }
};