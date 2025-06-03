import { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from 'discord.js';

export function buildReminderTaskMenu(tasks) {
  const options = tasks.map(task =>
    new StringSelectMenuOptionBuilder()
      .setLabel(task.taskName || 'Unnamed')
      .setValue(task._id.toString())
  );

  const taskSelectMenu = new StringSelectMenuBuilder()
    .setCustomId('select_task_for_reminder')
    .setPlaceholder('Select a task to set a reminder for')
    .addOptions(options);

  return new ActionRowBuilder().addComponents(taskSelectMenu);
}