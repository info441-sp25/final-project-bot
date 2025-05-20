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
app.post('/tasks', async (req, res) => {
    console.log("post task endpoint called")
    const username = req.body.username
    const taskName = req.body.taskName
    const taskDescription = req.body.taskDescription
    try {
        let newTask = new req.models.Task({
            username: username,
            taskName: taskName,
            taskDescription: taskDescription,
            status: "incomplete",
            created_date: Date()
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

export default app;
