import { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from 'discord.js';

/**
 * Builds a dropdown menu to choose between team vs personal upcoming tasks
 * @returns {ActionRowBuilder} Dropdown component row
 */
export function buildUpcomingDropdown() {
    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId('upcoming_task_scope')
      .setPlaceholder('Choose which upcoming tasks to view')
      .addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel('All Team')
          .setValue('team'),
        new StringSelectMenuOptionBuilder()
          .setLabel('My Tasks')
          .setValue('personal')
      );
  
    return new ActionRowBuilder().addComponents(selectMenu);
  }