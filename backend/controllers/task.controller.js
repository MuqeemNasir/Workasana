const Task = require('../models/Task.model')
const Project = require('../models/Project.model')
const Team = require('../models/Team.model')
const User = require('../models/User.model')
const { z } = require('zod')
const logger = require('../utils/logger')

const taskSchema = z.object({
    name: z.string().min(1, "Task name is required."),
    project: z.string().min(1, "Project ID is required."),
    team: z.string().min(1, "Team ID is required."),
    owners: z.array(z.string()).min(1, "At least one owner is required."),
    tags: z.array(z.string()).optional(),
    timeToComplete: z.number().min(0, "Time must be a positive number."),
    status: z.enum(['To Do', 'In Progress', 'Completed', 'Blocked']).optional(),
    dueDate: z.string().optional()
})

const createTask = async (req, res, next) => {
    try {
        const validatedData = taskSchema.parse(req.body)

        const projectExists = await Project.findById(validatedData.project)
        if (!projectExists) {
            return res.status(404).json({ message: "Project not found." })
        }

        const teamExists = await Team.findById(validatedData.team)
        if (!teamExists) {
            return res.status(404).json({ message: "Team not found." })
        }

        const ownersFound = await User.find({ '_id': { $in: validatedData.owners } })
        if (ownersFound.length !== validatedData.owners.length) {
            return res.status(400).json({ message: "One or more Owner IDs are invalid." })
        }

        const newTask = await Task.create(validatedData)

        logger.success(`Task Created: ${newTask.name}`)
        res.status(201).json(newTask)
    } catch (error) {
        next(error)
    }
}

const getAllTasks = async (req, res, next) => {
    try {
        const filter = {}

        if (req.query.status) filter.status = req.query.status
        if (req.query.project) filter.project = req.query.project
        if (req.query.team) filter.team = req.query.team
        if (req.query.owner) filter.owners = req.query.owner

        logger.info(`Fetching tasks with filter: ${JSON.stringify(filter)}`)

        const tasks = await Task.find(filter)
            .populate('project', 'name')
            .populate('team', 'name')
            .populate('owners', 'name email')
            .sort({ createdAt: -1 })

        res.status(200).json({ count: tasks.length, data: tasks })
    } catch (error) {
        next(error)
    }
}

const updateTask = async (req, res, next) => {
    try {
        const { id } = req.params
        const updatedTask = await Task.findByIdAndUpdate(id, req.body, { returnDocument: 'after' })

        if (!updatedTask) {
            return res.status(404)
        }

        logger.info(`Task Updated: ${updatedTask.name}`)
        res.status(200).json(updatedTask)
    } catch (error) {
        next(error)
    }
}

const deleteTask = async (req, res, next) => {
    try {
        const { id } = req.params

        const deletedTask = await Task.findByIdAndDelete(id)
        if (!deletedTask) {
            return res.status(404).json({ message: 'Task not found.' })
        }

        logger.success(`Task Deleted: ${deletedTask.name}`)
        res.status(200).json({ message: 'Task deleted successfully.' })
    } catch (error) {
        next(error)
    }
}

const getTaskById = async (req, res, next) => {
    try {
        const { id } = req.params
        const task = await Task.findById(id).populate('project', 'name').populate('team', 'name').populate('owners', 'name email')

        if(!task){
            return res.status(404).json({message: 'Task not found.'})
        }

        res.status(200).json(task)
    }catch(error){
        next(error)
    }
}

module.exports = { createTask, getAllTasks, updateTask, deleteTask, getTaskById }