// Import required modules
import { ActionRowBuilder, Client, GatewayIntentBits, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from 'discord.js';
import { createTaskModal, processTaskModal } from './taskModal.js';
import dotenv from 'dotenv';
import models from '../models.js'
import fetch from 'node-fetch';

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
    console.log('error: posting tasks ' + err)
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
        // get all tasks from db
        const tasks = await models.Task.find()
        
        // map through tasks to set the dropdown options 
        const options = tasks.map(task => 
          new StringSelectMenuOptionBuilder()
            .setLabel(task.taskName) //users will see the task names from mongoDB
            .setValue(task._id.toString()) // will set the value as the task id from mongoDB
            )

        // create a drop down menu for users to select task name
        const taskNameSelect = new StringSelectMenuBuilder()
          .setCustomId('select_task_to_update')
          .setPlaceholder('Select a task to update')
          .addOptions(options)
        
        const taskNameRow = new ActionRowBuilder().addComponents(taskNameSelect);

        await interaction.reply({
          content: 'Please select a task to update: ',
          components: [taskNameRow],
          ephemeral: true
        })
      }

      if (subcommand === 'all') {
        console.log("fetching all tasks")

        // get all tasks from db
        const tasks = await models.Task.find()
    
        if(!tasks) {
          await interaction.reply(`No tasks yet`);
          return
        }

        const incompleteTask = tasks.filter(t => t.status === 'incomplete');
        const inprogressTask = tasks.filter(t => t.status === 'in progress');
        const completedTask = tasks.filter(t => t.status == 'complete');
        
    
        const formatTasks = (taskList) =>
          taskList.map(t =>
            `- ${t.taskName}${t.taskDescription ? ` — ${t.taskDescription}` : ''}`
          ).join('\n');
    
        const replyMessage = [
          `**All Tasks:**`,
          `**Incomplete Tasks:**\n${formatTasks(incompleteTask) || '- none'}`,
          `**In-Progress Tasks:**\n${formatTasks(inprogressTask) || '- none'}`,
          `**Completed Tasks:**\n${formatTasks(completedTask) || '- none'}`,

        ].join('\n\n');

        await interaction.reply({ 
          content: replyMessage, 
          ephemeral: false 
        });
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
    if(interaction.customId === 'select_task_to_update') {
      const selectedTaskId = interaction.values[0];

       // create a drop down menu for users to select new status
       const statusSelect = new StringSelectMenuBuilder()
       .setCustomId(`update_status:${selectedTaskId}`)
       .setPlaceholder('Select new task status')
       .addOptions(
         new StringSelectMenuOptionBuilder()
           .setLabel('In Progress')
           .setValue('in progress'),
         new StringSelectMenuOptionBuilder()
           .setLabel('Complete')
           .setValue('complete')
       );

       const statusRow = new ActionRowBuilder().addComponents(statusSelect);
       
       await interaction.update({
         content: 'Now select the new status for the task:',
         components: [statusRow],
         ephemeral: true
       })
    }

    if(interaction.customId.startsWith('update_status:')) {
      const taskId = interaction.customId.split(':')[1];
      const selectedStatus = interaction.values[0];

      console.log(`Task ${taskId} updated to ${selectedStatus}`);

      await updateTask(taskId, selectedStatus);

      await interaction.reply({
        content: `Task updated! Task ID: ${taskId} New Status: ${selectedStatus}`,
        ephemeral: true
      })
    }
  }
})

// Log in to Discord using token from .env
client.login(process.env.DISCORD_TOKEN);