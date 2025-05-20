// Import required modules
import { Client, GatewayIntentBits } from 'discord.js';
import { createTaskModal, processTaskModal } from './taskModal.js';
import dotenv from 'dotenv';

dotenv.config();

// post task data gathered from modal
async function postTask(currUsername, taskName, taskDescription) {
  try {
    await fetch(`http://localhost:3000/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: currUsername,
        taskName: taskName,
        taskDescription: taskDescription,
      })
    })
  } catch (err) {
    console.log('error: ' + err)
  }
}

// Create a new Discord client with message intent
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent]
});

// Bot is ready
client.once('ready', () => {
  console.log(`🤖 Logged in as ${client.user.tag}`);
});

// Listen and respond to messages
client.on('messageCreate', message => {

  // Ignore messages from bots
  if (message.author.bot) return;

  // Respond to a specific message
  if (message.content.toLowerCase() === 'hello') {
    message.reply('Hi there! 👋 I am your friendly bot.');
  }

});

// handle slash commands
client.on('interactionCreate', async (interaction) => {
  if (interaction.isCommand()) {
    if (interaction.commandName === 'task') {
      console.log("task called")
      // create new modal using the function from taskModal.js
      const modal = createTaskModal();
      await interaction.showModal(modal);
    }
  }

  if (interaction.isModalSubmit()) {
    console.log("modal submitted")
    if (interaction.customId === 'task_modal') {
      console.log("processing modal info")
      const { taskName, description } = processTaskModal(interaction);

      // lightweight for now, we can add userID if needed
      const currUsername = interaction.user.username;

      // post task data to the server
      await postTask(currUsername, taskName, description);

      // Respond to the user
      await interaction.reply(`Task "${taskName}" created successfully!`);
    }
  }
})

// Log in to Discord using token from .env
client.login(process.env.DISCORD_TOKEN);
