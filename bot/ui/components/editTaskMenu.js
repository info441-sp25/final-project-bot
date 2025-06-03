import { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from 'discord.js';

export function buildEditTaskMenu(tasks) {
  const options = tasks.map(task =>
    new StringSelectMenuOptionBuilder()
      .setLabel(task.taskName || 'Unnamed')
      .setValue(task._id.toString())
  );

  const selectMenu = new StringSelectMenuBuilder()
    .setCustomId('select_task_to_edit')
    .setPlaceholder('Select a task to edit')
    .addOptions(options);

  return new ActionRowBuilder().addComponents(selectMenu);
}