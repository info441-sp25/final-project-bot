import { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';

//builds gthe reminder time modal
export function buildRemindModal(taskId, frequency) {
  const timeModal = new ModalBuilder()
    .setCustomId(`time_modal:${taskId}:${frequency}`)
    .setTitle('Set Reminder Time');

  const timeInput = new TextInputBuilder()
    .setCustomId('reminder_time')
    .setLabel('Enter reminder time (24-hr format)')
    .setStyle(TextInputStyle.Short)
    .setPlaceholder('e.g. 12:00 or 18:30');

  const modalRow = new ActionRowBuilder().addComponents(timeInput);
  timeModal.addComponents(modalRow);

  return timeModal;
}
