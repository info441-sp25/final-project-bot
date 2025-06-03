import { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from 'discord.js';
import models from '../../../models.js';

/**
 * Creates a dropdown menu component for selecting a task to update
 * @returns {ActionRowBuilder} A discord ActionRow containing a dropdown menu of tasks in the database
 */
export async function createUpdateTaskDropdown() {
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
    
    const row = new ActionRowBuilder().addComponents(taskNameSelect);
    return row
}

/**
 * Given a task ID, returns a status selection dropdown.
 * @param {string} taskId - The ID of the selected task.
 * @returns {ActionRowBuilder} A Discord ActionRow with status options (in progress/complete).
 */
export function createStatusSelectMenu(taskId) {
    const statusMenu = new StringSelectMenuBuilder()
       .setCustomId(`update_status: ${taskId}`)
       .setPlaceholder('Select new task status')
       .addOptions(
         new StringSelectMenuOptionBuilder()
           .setLabel('In Progress')
           .setValue('in progress'),
         new StringSelectMenuOptionBuilder()
           .setLabel('Complete')
           .setValue('complete')
       );

       const row = new ActionRowBuilder().addComponents(statusMenu);
       return row
}
