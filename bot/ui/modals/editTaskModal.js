import { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';

// build the edit task modal
export function buildEditTaskModal(taskId, taskToEdit) {
  const editModal = new ModalBuilder()
    .setCustomId(`edit_task_modal:${taskId}`)
    .setTitle('Edit Task Fields');

  const nameInput = new TextInputBuilder()
    .setCustomId('taskName')
    .setLabel('New Name')
    .setStyle(TextInputStyle.Short)
    .setValue(taskToEdit.taskName || '');

  const descInput = new TextInputBuilder()
    .setCustomId('description')
    .setLabel('New Description')
    .setStyle(TextInputStyle.Paragraph)
    .setValue(taskToEdit.taskDescription || '');

  const dueDateInput = new TextInputBuilder()
    .setCustomId('due_date')
    .setLabel('New Due Date (YYYY-MM-DD)')
    .setStyle(TextInputStyle.Short)
    .setValue(taskToEdit.due_date ? taskToEdit.due_date.toISOString().split('T')[0] : '');

  const assignedUserInput = new TextInputBuilder()
    .setCustomId('assignedUser')
    .setLabel('New Assigned User')
    .setStyle(TextInputStyle.Short)
    .setValue(taskToEdit.assignedUser || '');

  editModal.addComponents(
    new ActionRowBuilder().addComponents(nameInput),
    new ActionRowBuilder().addComponents(descInput),
    new ActionRowBuilder().addComponents(dueDateInput),
    new ActionRowBuilder().addComponents(assignedUserInput)
  );

  return editModal;
}