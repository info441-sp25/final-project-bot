export function formatTaskList(tasks) {
  if (!tasks || tasks.length === 0) {
    return "No tasks yet";
  }

  const incompleteTask = tasks.filter(t => t.status === 'incomplete');
  const inprogressTask = tasks.filter(t => t.status === 'in progress');
  const completedTask = tasks.filter(t => t.status == 'complete');
  
  const formatTasks = (taskList) =>
    taskList.map(t =>
      `- ${t.taskName}${t.taskDescription ? ` — ${t.taskDescription}` : ''}`
    ).join('\n');

  const replyMessage = [
    `**All Tasks:**`,
    `**Incomplete Tasks:**\n${formatTasks(incompleteTask) || '- none'}`,
    `**In-Progress Tasks:**\n${formatTasks(inprogressTask) || '- none'}`,
    `**Completed Tasks:**\n${formatTasks(completedTask) || '- none'}`,
  ].join('\n\n');

  return replyMessage;
}