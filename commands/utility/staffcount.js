const {
    SlashCommandBuilder,
    EmbedBuilder,
    PresenceUpdateStatus
} = require("discord.js");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("staffcount")
        .setDescription("Shows the current TXRP staff statistics."),

    async execute(interaction) {

        const STAFF_ROLE_ID = "1523132609146785845";

        const role = interaction.guild.roles.cache.get(STAFF_ROLE_ID);

        if (!role) {
            return interaction.reply({
                content: "❌ Staff role not found.",
                ephemeral: true
            });
        }

        const totalStaff = role.members.size;

        const onlineStaff = role.members.filter(member =>
            member.presence &&
            member.presence.status !== PresenceUpdateStatus.Offline
        ).size;

        const embed = new EmbedBuilder()
            .setColor("#E58A2B")
            .setTitle("👮 TXRP Staff Statistics")
            .addFields(
                {
                    name: "👥 Total Staff",
                    value: `${totalStaff}`,
                    inline: true
                },
                {
                    name: "🟢 Staff Online",
                    value: `${onlineStaff}`,
                    inline: true
                }
            )
            .setFooter({
                text: "TXRP Website Bot"
            })
            .setTimestamp();

        await interaction.reply({
            embeds: [embed]
        });

    }

};