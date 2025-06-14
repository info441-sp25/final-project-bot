import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const SERVER_API_URL = process.env.SERVER_API_URL;

// creates new task in teh db 
export async function createTask(username, taskName, taskDescription, assignedUser, dueDate) {
  try {
    const response = await fetch(`${SERVER_API_URL}/tasks/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username,
        assignedUser,
        taskName,
        taskDescription,
        due_date: dueDate,
      })
    });
    return await response.json();
  } catch (err) {
    console.log('Error creating task:', err);
    return { status: 'error', message: err.message };
  }
}

// updates fields of task in db
export async function updateTaskStatus(taskId, status) {
  try {
    const response = await fetch(`${SERVER_API_URL}/tasks/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId, status })
    });
    return await response.json();
  } catch (error) {
    console.log('Error updating task:', error);
    return { status: 'error', message: error.message };
  }
}

// deletes task
export async function deleteTask(taskId) {
  try {
    const response = await fetch(`${SERVER_API_URL}/tasks/delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId })
    });
    return await response.json();
  } catch (error) {
    console.log('Error deleting task:', error);
    return { status: 'error', message: error.message };
  }
}

// edit task fields
export async function editTask(taskId, taskName, description, due_date, assignedUser) {
  try {
    const response = await fetch(`${SERVER_API_URL}/tasks/edit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId, taskName, description, due_date, assignedUser })
    });
    return await response.json();
  } catch (error) {
    console.log('Error editing task:', error);
    return { status: 'error', message: error.message };
  }
}

// sets reminder for tasks
export async function setTaskReminder(taskId, frequency, reminderTime) {
  try {
    const response = await fetch(`${SERVER_API_URL}/tasks/remind`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId, frequency, reminderTime })
    });
    return await response.json();
  } catch (error) {
    console.log('Error setting reminder:', error);
    return { status: 'error', message: error.message };
  }
}

// get all tasks
export async function getAllTasks() {
  try {
    const response = await fetch(`${SERVER_API_URL}/tasks/all`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    return await response.json();
  } catch (error) {
    console.log('Error fetching all tasks:', error);
    return { status: 'error', message: error.message, tasks: [] };
  }
}

// get ALL active tasks
export async function getActiveTasks() {
  try {
    const response = await fetch(`${SERVER_API_URL}/tasks/active`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    return await response.json();
  } catch (error) {
    console.log('Error fetching active tasks:', error);
    return { status: 'error', tasks: [] };
  }
}

// get ONLY my active tasks
export async function getMyActiveTasks(username) {
  try {
    const response = await fetch(`${SERVER_API_URL}/tasks/active`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assignedUser: username })
    });
    return await response.json();
  } catch (error) {
    console.log('Error fetching my active tasks:', error);
    return { status: 'error', tasks: [] };
  }
}
