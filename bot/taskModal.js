import { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, UserSelectMenuBuilder } from 'discord.js';

/**
 * Creates a user select menu to pass a given user for tasks to modals below
 * @returns {UserSelectMenuBuilder} The configured user select menu
 */
export function createUserSelect() {
    const userSelect = new UserSelectMenuBuilder()
        .setCustomId('user_select')
        .setPlaceholder('select a user to assign this task to!')
        .setMaxValues(1)

    return new ActionRowBuilder().addComponents(userSelect);
}

/**
 * Creates a modal for task creation
 * @param {String} assignedUser The user the task is being assigned to, gathered from user select menu
 * @returns {ModalBuilder} The configured modal
 */
export function createTaskModal(assignedUser) {

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

    const assignedUserText = new TextInputBuilder()
        .setCustomId('assigned_user')
        .setLabel('username of assignee -- DO NOT EDIT')
        .setStyle(TextInputStyle.Short)
        .setValue(assignedUser)
        .setRequired(true);

    const dueDateInput = new TextInputBuilder()
        .setCustomId('due_date')
        .setLabel('Due Date')
        .setStyle(TextInputStyle.Short)
        .setPlaceholder('YYYY-MM-DD')
        .setRequired(false);

    // Add inputs to action rows
    const firstActionRow = new ActionRowBuilder().addComponents(taskNameInput);
    const secondActionRow = new ActionRowBuilder().addComponents(descriptionInput);
    const thirdActionRow = new ActionRowBuilder().addComponents(dueDateInput);
    const fourthActionRow = new ActionRowBuilder().addComponents(assignedUserText);

    // Add action rows to the modal
    modal.addComponents(firstActionRow, secondActionRow, thirdActionRow, fourthActionRow);

    return modal;
}

/**
 * Processes task modal submissions
 * @param {ModalSubmitInteraction} interaction The modal submit interaction
 * @returns {Object} The name, description (optional), and user assigned of the task
 */
export function processTaskModal(interaction) {

    try {
        const taskName = interaction.fields.getTextInputValue('name');
        const description = interaction.fields.getTextInputValue('description');
        const assignedUser = interaction.fields.getTextInputValue('assigned_user');
        const dueDate = interaction.fields.getTextInputValue('due_date');

        return {
            taskName,
            description,
            assignedUser,
            dueDate
        };

    } catch (err) {
        console.log(err)
    }
}
