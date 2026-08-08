require("dotenv").config();

const fs = require("fs");
const path = require("path");

const { REST, Routes } = require("discord.js");

const commands = [];

const commandFolders = fs.readdirSync(path.join(__dirname, "commands"));

for (const folder of commandFolders) {

    const commandFiles = fs
        .readdirSync(path.join(__dirname, "commands", folder))
        .filter(file => file.endsWith(".js"));

    for (const file of commandFiles) {

        const command = require(path.join(__dirname, "commands", folder, file));

       if (!command.data) {
    console.log(`⚠ Skipping ${file} (no command data found)`);
    continue;
}

commands.push(command.data.toJSON());
    }

}

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {

    try {

        console.log("🔄 Registering Slash Commands...");

        await rest.put(
            Routes.applicationGuildCommands(
                process.env.CLIENT_ID,
                process.env.SERVER_ID
            ),
            { body: commands }
        );

        console.log("✅ Slash Commands Registered!");

    } catch (error) {

        console.error(error);

    }

})();