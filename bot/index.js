// Import required modules
import { ActionRowBuilder, Client, GatewayIntentBits, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from 'discord.js';
import { createTaskModal, processTaskModal } from './taskModal.js';
import dotenv from 'dotenv';

dotenv.config();

// post task data gathered from modal
async function postTask(currUsername, taskName, taskDescription) {
  try {
    await fetch(`http://localhost:3000/tasks/create`, {
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

// update task status
async function updateTask(taskId, taskStatus) {
  try {
    await fetch('http://localhost:3000/tasks/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        taskId: taskId,
        status: taskStatus
      })
    })
  } catch (err) {
    console.log('error ' + err)
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

      const subcommand = interaction.options.getSubcommand();

      if (subcommand === 'create') {
        // create new modal using the function from taskModal.js
        let modal = createTaskModal();
        await interaction.showModal(modal);
      }

      if (subcommand === 'update') {
        const taskId = interaction.options.getString('task_id');

        // create a drop down menu for users to select new status
        const statusSelect = new StringSelectMenuBuilder()
          .setCustomId(`update_status:${taskId}`)
          .setPlaceholder('Select new task status')
          .addOptions(
            new StringSelectMenuOptionBuilder()
              .setLabel('In Progress')
              .setValue('in progress'),
            new StringSelectMenuOptionBuilder()
              .setLabel('Complete')
              .setValue('complete')
          );

          const actionRow = new ActionRowBuilder().addComponents(statusSelect);
          
          await interaction.reply({
            content: `Update status for task ${taskId}`,
            components: [actionRow]
          })
      }
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

  if(interaction.isStringSelectMenu()) {
    const taskId = interaction.customId.split(':')[1];
    const selectedStatus = interaction.values[0];

    console.log(`Task ${taskId} updated to ${selectedStatus}`);

    await updateTask(taskId, selectedStatus);

    await interaction.reply(`Task ${taskId} status is ${selectedStatus}`)

  }
})

// Log in to Discord using token from .env
client.login(process.env.DISCORD_TOKEN);
