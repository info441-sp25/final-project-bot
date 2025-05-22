import  { REST, Routes } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

const botID = "1371957408317968637" // Your bot ID
const serverID = "1371958765997396008"
const botToken = process.env.DISCORD_TOKEN;

const rest = new REST({version: '10'}).setToken(botToken);

const commands = [
    {
        name: 'task',
        description: 'manage your tasks',
        options: [
            {
                name: 'create',
                description: 'create a task to assign!',
                type: 1
            },
            {
                name: 'update',
                description: 'update the status of a task',
                type: 1
            }
        ]
    }
];

(async () => {
    try { 
        await rest.put (
            Routes.applicationGuildCommands(botID, serverID),
            { body: commands }
        )
        console.log("commands registered")
    } catch (err) {
        console.log(err)
    }
})();