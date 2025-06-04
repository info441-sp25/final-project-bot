// Import required modules
import { Client, GatewayIntentBits } from 'discord.js';
import { createTaskModal, processTaskModal, createUserSelect } from './ui/modals/taskModal.js';
import { createUpdateTaskDropdown, createStatusSelectMenu } from './ui/components/taskUpdateMenu.js';
import { buildUpcomingDropdown } from './ui/components/upcomingTaskMenu.js';
import { buildEditTaskModal } from './ui/modals/editTaskModal.js';
import { buildRemindModal } from './ui/modals/reminderModal.js';
import dotenv from 'dotenv';
import models from '../models.js';
import cron from 'node-cron';
import { buildDeleteTaskMenu, buildConfirmDeleteButton } from './ui/components/deleteTaskUI.js';
import { formatTaskList } from './ui/components/taskListFormatter.js';
import { buildReminderFrequencyMenu } from './ui/components/reminderFrequencyMenu.js';
import { buildReminderTaskMenu } from './ui/components/reminderTaskMenu.js';
import { processReminders } from './services/reminderService.js';
import * as taskService from './services/taskService.js';
import { buildEditTaskMenu } from './ui/components/editTaskMenu.js';


dotenv.config();

// Create a new Discord client with message intent
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
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
  if (message.content.toLowerCase() === 'pmbot help') {
    // pm bot functions here
    message.reply(`
Here is a list of commands you can use:
- **/task create** - Create and assign a new task
- **/task update** - Update a task's status
- **/task all** - View all tasks by status
- **/task delete** - Remove a task
- **/task remind** - Set task reminders
- **/task edit** - Change task details
- **/task upcoming** - View active tasks
`);
  }

});

// handle slash commands
client.on('interactionCreate', async (interaction) => {
  if (interaction.isCommand() && interaction.commandName === 'task') {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'edit') {
      const tasks = await models.Task.find();
      if (!tasks.length) {
        await interaction.reply('No tasks found.');
        return;
      }

      const row = buildEditTaskMenu(tasks);
      await interaction.reply({ components: [row] });
    }
  }

  if (interaction.isStringSelectMenu() && interaction.customId === 'select_task_to_edit') {
    const taskId = interaction.values[0];
    const taskToEdit = await models.Task.findById(taskId);
    if (!taskToEdit) {
      await interaction.reply('Task not found.');
      return;
    }
    // refactor here
    const editModal = buildEditTaskModal(taskId, taskToEdit);
    await interaction.showModal(editModal);
  }

  if (interaction.isModalSubmit() && interaction.customId.startsWith('edit_task_modal:')) {
    const taskId = interaction.customId.split(':')[1];
    const taskName = interaction.fields.getTextInputValue('taskName');
    const description = interaction.fields.getTextInputValue('description');
    const due_date = interaction.fields.getTextInputValue('due_date');
    const assignedUser = interaction.fields.getTextInputValue('assignedUser');

    try {
      // refactered
      const result = await taskService.editTask(taskId, taskName, description, due_date, assignedUser);
      if (result.status === 'success') {
        await interaction.reply(
          `**Task edited successfully!** Here are the new task details:\n**Name:** ${taskName}\n**Description:** ${description}\n**Due Date:** ${due_date}\n**Assigned User:** ${assignedUser}`
        );
      } else {
        await interaction.reply('Error editing task.');
      }
    } catch (err) {
      console.log('Error editing task:', err);
      await interaction.reply('Failed to edit task.');
    }
  }

  if (interaction.isCommand()) {

    if (interaction.commandName === 'task') {
      console.log("task called")

      const subcommand = interaction.options.getSubcommand();

      if (subcommand === 'create') {
        try {

          let userRow = createUserSelect()
          await interaction.reply({
            content: 'Please select a user to assign this task to: ',
            components: [userRow],
            ephemeral: true
          })
        } catch (err) {
          console.log("error: " + err)
        }

      }

      if (subcommand === 'update') {
        try {
          const taskNameRow = await createUpdateTaskDropdown()

          await interaction.reply({
            content: 'Please select a task to update: ',
            components: [taskNameRow],
            ephemeral: true
          })
        } catch (error) {
          console.log("error: ", error)
        }
      }

      if (subcommand === 'all') {
        console.log("fetching all tasks");

        try {
          const result = await taskService.getAllTasks();

          if (result.status === 'error' || !result.tasks || !result.tasks.length) {
            await interaction.reply('No tasks yet or error fetching tasks.');
            return;
          }

          const replyMessage = formatTaskList(result.tasks);
          await interaction.reply({
            content: replyMessage,
            ephemeral: false
          });
        } catch (error) {
          console.log('Error in /task all command:', error);
          await interaction.reply('Failed to get all the tasks. Please try again.');
        }
      }

      if (subcommand === 'delete') {
        const tasks = await models.Task.find();
        if (tasks.length === 0) {
          await interaction.reply('No tasks to delete.');
          return;
        }

        // refactor delete
        const selectRow = buildDeleteTaskMenu(tasks);
        await interaction.reply({
          content: 'Choose a task to delete from the dropdown below:',
          components: [selectRow],
          ephemeral: false
        });
      }

      // reminder stuff
      if (subcommand === 'remind') {

        const tasks = await models.Task.find();
        if (!tasks.length) {
          await interaction.reply('No tasks found to set a reminder for.');
          return;
        }

        const taskRow = buildReminderTaskMenu(tasks);

        await interaction.reply({
          content: 'Pick the task you want to set a reminder for:',
          components: [taskRow],
          ephemeral: true
        });
      }

      // Upcoming tasks
      if (subcommand === 'upcoming') {
        const dropdown = buildUpcomingDropdown();
        await interaction.reply({
          content: 'Do you want to view your active tasks or all active tasks?',
          components: [dropdown],
        });
      }
    }
  }

  if (interaction.isUserSelectMenu() && interaction.customId == 'user_select') {
    // create new modal using the function from taskModal.js
    console.log(interaction.values)
    const member = interaction.guild.members.cache.get(interaction.values[0]);
    const username = member ? member.user.username : 'Unknown User';
    console.log(username)
    let modal = createTaskModal(username);
    await interaction.showModal(modal);
  }

  if (interaction.isModalSubmit()) {
    console.log("modal submitted")
    if (interaction.customId === 'task_modal') {
      console.log("processing modal info")
      const { taskName, description, assignedUser, dueDate } = processTaskModal(interaction);

      // lightweight for now, we can add userID if needed
      const currUsername = interaction.user.username;

      // post task data to the server using the service
      // refactored
      try {
        const result = await taskService.createTask(currUsername, taskName, description, assignedUser, dueDate); 
        if (result.status === 'success') {
          await interaction.reply(`Task **${taskName}** created successfully! \n Assigned to **@${assignedUser}** \n Due on **${dueDate}**`);
        } else {
          await interaction.reply('Failed to create task')
        }
      } catch (err) {
        console.log('failed to create task: ' + err)
        await interaction.reply('Failed to create task')
      }
    }
  }

  if (interaction.isStringSelectMenu()) {
    if (interaction.customId === 'select_task_to_update') {
      try {
        const selectedTaskId = interaction.values[0];
        const statusRow = createStatusSelectMenu(selectedTaskId);

        await interaction.update({
          content: 'Now select the new status for the task:',
          components: [statusRow],
        })
      } catch (error) {
        console.log("error: " + error)
      }
    }

    if (interaction.customId.startsWith('update_status:')) {
      const rawId = interaction.customId.split(':')[1];
      const taskId = rawId.trim();
      const selectedStatus = interaction.values[0];

      try {
        // refactored
        await taskService.updateTaskStatus(taskId, selectedStatus);
        const updatedTask = await models.Task.findById(taskId);
        if (!updatedTask) {
          await interaction.reply({
            content: 'Task not found or invalid ID.',
          });
          return;
        }
        const taskName = updatedTask.taskName || 'Unnamed';
        await interaction.reply({
          content: `Task updated! Task Name: **${taskName}** — New Status: **${selectedStatus}**`,
        });
      } catch (error) {
        console.log('Error updating task:', error);
        await interaction.reply({
          content: 'Error updating task.'
        });
      }
    }

    if (interaction.customId === 'select_task_to_delete') {
      const selectedTaskId = interaction.values[0];
      const selectedTask = await models.Task.findById(selectedTaskId);
      const taskName = selectedTask?.taskName || 'Unnamed';

      // refactor delete buttons
      const buttonRow = buildConfirmDeleteButton(selectedTaskId, taskName);

      await interaction.update({
        content: `Selected: **${taskName}**\nClick the button below to delete this task.`,
        components: [buttonRow],
        ephemeral: false
      });
    }

    if (interaction.customId === 'select_task_for_reminder') {
      const selectedTaskId = interaction.values[0];
      const selectedTask = await models.Task.findById(selectedTaskId);
      if (!selectedTask) {
        await interaction.update({ content: 'Task not found.', components: [] });
        return;
      }

      const freqRow = buildReminderFrequencyMenu(selectedTaskId);

      await interaction.update({
        content: `Selected: **${selectedTask.taskName}**.\nNow choose a reminder frequency:`,
        components: [freqRow],
        ephemeral: true
      });
    }

    if (interaction.customId.startsWith('select_frequency:')) {
      const taskId = interaction.customId.split(':')[1];
      const frequency = interaction.values[0];
      // refactor here 
      const timeModal = buildRemindModal(taskId, frequency);
      await interaction.showModal(timeModal);
    }
  }

  if (interaction.isButton() && interaction.customId.startsWith('confirm_delete:')) {
    const taskId = interaction.customId.split(':')[1];
    const taskToDelete = await models.Task.findById(taskId);
    const taskName = taskToDelete?.taskName || 'Unnamed';

    // refactored
    await taskService.deleteTask(taskId);

    await interaction.update({
      content: `Task with Name: **${taskName}** and ID: **${taskId}** has been deleted.`,
      components: [],
      ephemeral: false
    });
  }

  if (interaction.isModalSubmit() && interaction.customId.startsWith('time_modal:')) {
    const [, taskId, frequency] = interaction.customId.split(':');
    const reminderTime = interaction.fields.getTextInputValue('reminder_time') || '';

    try {
      // refactored
      await taskService.setTaskReminder(taskId, frequency, reminderTime);
      const updatedTask = await models.Task.findById(taskId);
      const taskName = updatedTask?.taskName || 'Unnamed';

      await interaction.reply({
        content: `Reminder set for task: **${taskName}** for the time: **${reminderTime}**`,
        //  with frequency: **${frequency}**. (this is if we want to implement frequenct)
        ephemeral: false
      });
    } catch (err) {
      console.log('Error setting reminder:', err);
      await interaction.reply({
        content: 'Failed to set reminder time.',
        ephemeral: true
      });
    }
  }

  // dropdown for upcoming
  if (interaction.isStringSelectMenu()) {
    if (interaction.customId === 'upcoming_task_scope') {
      const scope = interaction.values[0];
      const username = interaction.user.username;

      let result;
      if (scope === 'team') {
        result = await taskService.getActiveTasks();
      } else {
        result = await taskService.getMyActiveTasks(username);
      }

      if (result.status === 'error' || !result.tasks.length) {
        await interaction.update({ content: 'No active tasks found.', components: [] });
        return;
      }

      const replyMessage = result.tasks.map(t => `- ${t.taskName}${t.taskDescription ? ` — ${t.taskDescription}` : ''}`).join('\n');

      await interaction.update({
        content: `**Active Tasks:**\n${replyMessage}`,
        components: []
      });
    }
  }
})

// this is a cron which run scheduled script that runs automaticallt at a specific time blah blah blah
// https://www.npmjs.com/package/node-cron
cron.schedule('* * * * *', async () => {
  console.log('Running reminder check...');
  await processReminders(client);
});

// Log in to Discord using token from .env
client.login(process.env.DISCORD_TOKEN);