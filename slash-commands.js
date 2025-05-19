const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const botID = "" // Your bot ID
const serverID = "" // Your server ID
const botToken = process.env.DISCORD_TOKEN;

const rest = new REST().setToken(botToken);

const slashRegister = async () => {
    try {
        const commands = [
            new SlashCommandBuilder()
                .setName('task')
                .setDescription('Create a new task')
                .toJSON(),
        ];
        await rest.put(
            Routes.applicationGuildCommands(botID),
            { body: commands },
        );
    } catch (err) {
        console.error(err);
    }
}

slashRegister();
