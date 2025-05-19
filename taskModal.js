const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

/**
 * Creates a modal for task creation
 * @returns {ModalBuilder} The configured modal
 */
function createTaskModal() {
    // Create the modal
    const modal = new ModalBuilder()
        .setCustomId('task_modal')
        .setTitle('Create Task');

    // Add text inputs to the modal
    const taskNameInput = new TextInputBuilder()
        .setCustomId('name')
        .setLabel('Task Name')
        .setStyle(TextInputStyle.Short)
        .setMinLength(1)
        .setMaxLength(100)
        .setPlaceholder('What is your task about?')
        .setRequired(true);

    const descriptionInput = new TextInputBuilder()
        .setCustomId('description')
        .setLabel('Description')
        .setStyle(TextInputStyle.Paragraph)
        .setMinLength(10)
        .setMaxLength(1000)
        .setPlaceholder('Please provide details...')
        .setRequired(false);

    // Add inputs to action rows
    const firstActionRow = new ActionRowBuilder().addComponents(taskNameInput);
    const secondActionRow = new ActionRowBuilder().addComponents(descriptionInput);

    // Add action rows to the modal
    modal.addComponents(firstActionRow, secondActionRow);

    return modal;
}

/**
 * Processes task modal submissions
 * @param {ModalSubmitInteraction} interaction The modal submit interaction
 * @returns {Object} The name and description (optional) of the task
 */
function processTaskModal(interaction) {
    const taskName = interaction.fields.getTextInputValue('name');
    const description = interaction.fields.getTextInputValue('description');

    return {
        taskName,
        description
    };
}

module.exports = {
    createTaskModal,
    processTaskModal
};