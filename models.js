import mongoose from 'mongoose'
import dotenv from 'dotenv';

dotenv.config();

const models = {}
const mongoString = process.env.MONGODB_STRING

console.log('Connecting to MongoDB...')

await mongoose.connect(mongoString)

console.log('Connected to MongoDB')

const taskSchema = new mongoose.Schema({
    username: String,
    assignedUser: String,
    taskName: String,
    taskDescription: String,
    status: String,
    due_date: Date,
    created_date: Date
})

console.log("creating task model")
models.Task = mongoose.model('Task', taskSchema)
console.log("finished creating task model")

export default models