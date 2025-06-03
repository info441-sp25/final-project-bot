import { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from 'discord.js';

export function buildReminderFrequencyMenu(taskId) {
  const freqOptions = [
    new StringSelectMenuOptionBuilder()
      .setLabel('Once a day')
      .setValue('daily')
    // can add more here for future work but needs more a lot more logic to implement
    // array of times
    // probably a new field for weekly date
  ];

  const freqMenu = new StringSelectMenuBuilder()
    .setCustomId(`select_frequency:${taskId}`)
    .setPlaceholder('How often do you want to be reminded?')
    .addOptions(freqOptions);

  return new ActionRowBuilder().addComponents(freqMenu);
}