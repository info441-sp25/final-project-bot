import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';


import { fileURLToPath } from 'url';
import { dirname } from 'path';

import models from './models.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    req.models = models;
    next();
})


// post task endpoint, not using route currently but can swap if needed
app.post('/tasks/create', async (req, res) => {
    console.log("post task endpoint called")
    const username = req.body.username
    const taskName = req.body.taskName
    const taskDescription = req.body.taskDescription
    const assignedUser = req.body.assignedUser
    const dueDate = req.body.due_date
    try {
        console.log("on api post attempt" + dueDate)
        let newTask = new req.models.Task({
            username: username,
            assignedUser: assignedUser,
            taskName: taskName,
            taskDescription: taskDescription,
            status: "incomplete",
            due_date: new Date(dueDate),
            created_date: new Date()
        })
        console.log("saving")
        await newTask.save()
        console.log("new task saved!")
        res.json({status: "success"})
    } catch (error) {
        console.log(error)
        res.json({status: "error"})
    }

})

// update task
app.post('/tasks/update', async(req, res) => {
    console.log("update task endpoint called")
    const taskId = req.body.taskId
    const taskStatus = req.body.status
    try {   
        let updatedTask = await req.models.Task.findByIdAndUpdate(
            taskId,
            { status: taskStatus },
            { new: true }
        );

        if (!updatedTask) {
            return res.status(404).json({status: "error", message: "Task not found"})
        }

        console.log("task status updated!")
        res.json({status: "success"})

    } catch (error) {
        console.log(error)
        res.json({status: "error"})
    }
});

// delete
app.post('/tasks/delete', async (req, res) => {
    console.log("delete endpoint called");
    const { taskId } = req.body;
    try {
        await req.models.Task.findByIdAndDelete(taskId);
        console.log("task deleted!!!!!!!");
        return res.json({ status: "success" });
    } catch (error) {
        console.log("error deleting task:", error);
        return res.json({ status: "error" });
    }
});

app.post('/tasks/remind', async (req, res) => {
    const { taskId, frequency, reminderTime } = req.body;
    try {
        const updatedTask = await req.models.Task.findByIdAndUpdate(
            taskId,
            { reminderFrequency: frequency, reminderTime: reminderTime },
            { new: true }
        );
        if (!updatedTask) {
            return res.status(404).json({ status: 'error', message: 'Task not found' });
        }
        return res.json({ status: 'success', updatedTask });
    } catch (error) {
        console.log('Error setting reminder frequency:', error);
        return res.json({ status: 'error' });
    }
});

app.post('/tasks/edit', async (req, res) => {
  const { taskId, taskName, description, due_date, assignedUser } = req.body;
  try {
    const updatedTask = await req.models.Task.findByIdAndUpdate(
      taskId,
      { 
        taskName, 
        taskDescription: description,
        due_date,
        assignedUser
      },
      { new: true }
    );
    if (!updatedTask) {
      return res.status(404).json({ status: 'error', message: 'Task not found' });
    }
    res.json({ status: 'success', updatedTask });
  } catch (error) {
    console.log('Error editing task:', error);
    res.json({ status: 'error' });
  }
});

// endpoint to get all tasks
app.get('/tasks/all', async (req, res) => {
  try {
    const tasks = await req.models.Task.find();
    return res.json({ 
      status: 'success', 
      tasks 
    });
  } catch (error) {
    console.log('Error fetching all tasks:', error);
    return res.json({ 
      status: 'error', 
      message: error.message,
      tasks: [] 
    });
  }
});

// endpoint to get active tasks (filtered by status and optionally assignedUser)
app.post('/tasks/active', async (req, res) => {  
    const { assignedUser } = req.body;
  
    // Filter: only 'incomplete' or 'in progress'
    const query = {
      status: { $in: ['incomplete', 'in progress'] }
    };
  
    // If assignedUser is specified, filter by it
    if (assignedUser) {
      query.assignedUser = assignedUser;
    }
  
    try {
      const activeTasks = await req.models.Task.find(query);
      return res.json({
        status: 'success',
        tasks: activeTasks
      });
    } catch (error) {
      console.log('Error fetching active tasks:', error);
      return res.json({
        status: 'error',
        message: error.message,
        tasks: []
      });
    }
  });
export default app;
