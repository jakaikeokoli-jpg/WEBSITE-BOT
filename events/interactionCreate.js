const commandHandler = require("../handlers/commandHandler");
const modalHandler = require("../handlers/modalHandler");
const menuHandler = require("../handlers/menuHandler");

console.log("Interaction handler loaded");

module.exports = {
    name: "interactionCreate",

    async execute(interaction, client) {

        console.log(
            "Interaction received:",
            interaction.type,
            interaction.customId || interaction.commandName
        );

        try {

            // Slash Commands
            if (interaction.isChatInputCommand()) {
                return commandHandler(interaction, client);
            }

            // Modals
            if (interaction.isModalSubmit()) {
                return modalHandler(interaction, client);
            }

            // Dropdown Menus
            if (interaction.isStringSelectMenu()) {
                return menuHandler(interaction, client);
            }

        } catch (err) {

            console.error("Interaction Error:", err);

            if (!interaction.replied && !interaction.deferred) {

                await interaction.reply({
                    content: "❌ Something went wrong.",
                    ephemeral: true
                });

            }

        }

    }

};