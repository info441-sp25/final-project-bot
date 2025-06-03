import { ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from 'discord.js';

export function buildDeleteTaskMenu(tasks) {
  const options = tasks.map((task) =>
    new StringSelectMenuOptionBuilder()
      .setLabel(task.taskName || 'Unnamed')
      .setValue(task._id.toString())
  );

  const taskSelectMenu = new StringSelectMenuBuilder()
    .setCustomId('select_task_to_delete')
    .setPlaceholder('Select a task to delete')
    .addOptions(options);

  return new ActionRowBuilder().addComponents(taskSelectMenu);
}

export function buildConfirmDeleteButton(selectedTaskId, taskName) {
  const deleteButton = new ButtonBuilder()
    .setCustomId(`confirm_delete:${selectedTaskId}`)
    .setLabel(`Delete Task: ${taskName}`)
    .setStyle(ButtonStyle.Danger);

  return new ActionRowBuilder().addComponents(deleteButton);
}