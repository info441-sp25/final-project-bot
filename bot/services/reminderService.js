import models from '../../models.js';

function normalize24HourTime(timeStr) {
  if (!timeStr || !timeStr.includes(':')) return timeStr;
  const [hours, minutes] = timeStr.split(':');
  
  // Add leading zeros if nneeded because 24hr format is 4 so like 9:30 is 09:30  or 13:14 with 4 chars
  return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
}

export async function processReminders(client) {
  try {
    // Find all tasks with reminders set up
    const reminderTasks = await models.Task.find({
      reminderFrequency: { $in: ['daily'] },
      reminderTime: { $exists: true, $ne: '' }
    });
    
    console.log(`Found ${reminderTasks.length} tasks with reminders`);
    
    // Get current time in 24-hour HH:MM format
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5); 
    console.log(`Current time: ${currentTime}`);
    
    // array collect tasks with reminders due now
    // then mostly same logic as before
    const dueReminders = [];
    for (const task of reminderTasks) {
      // time formatting is weird
      const normalizedReminderTime = normalize24HourTime(task.reminderTime);
      console.log(`Checking task: ${task.taskName}`);
      console.log(`Original time: ${task.reminderTime}`);
      console.log(`Converted to 24h: ${normalizedReminderTime}`);
      console.log(`Current time: ${currentTime}`);
      
      if (normalizedReminderTime === currentTime) {
        console.log(`Reminder found for task: ${task.taskName}!!!!!!!!`);
        dueReminders.push(task);
        
        try {
          const channel = await client.channels.fetch('1379499791305670736');
          if (channel) {
            const formattedDueDate = task.due_date 
              ? new Date(task.due_date).toLocaleDateString('en-US') 
              : 'No due date set';
              
            await channel.send(
              `⏰ Reminder: Task: **${task.taskName}** is still **${task.status}** for **${task.assignedUser}**\nand is due on: **${formattedDueDate}**.`
            );
            console.log('Reminder sent successfully');
          } else {
            console.log('Channel not found');
          }
        } catch (channelError) {
          console.log('Error sending to channel:', channelError);
        }
      }
    }
    
    return dueReminders;
  } catch (error) {
    console.log('Error processing reminders:', error);
    return [];
  }
}