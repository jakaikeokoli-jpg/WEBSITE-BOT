module.exports = async (interaction, client) => {

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {

        await command.execute(interaction);

    } catch (err) {

        console.error(err);

        if (!interaction.replied && !interaction.deferred) {

            await interaction.reply({

                content: "❌ Command error.",

                ephemeral: true

            });

        }

    }

};