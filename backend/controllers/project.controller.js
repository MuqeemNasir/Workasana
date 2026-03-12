const Project = require('../models/Project.model')
const Task = require('../models/Task.model')
const { z } = require('zod')
const logger = require('../utils/logger')

const projectSchema = z.object({
    name: z.string().min(1, "Project name is required"),
    description: z.string().optional()
})

const createProject = async (req, res, next) => {
    try {
        const validatedData = projectSchema.parse(req.body)

        const existingProject = await Project.findOne({ name: validatedData.name })
        if (existingProject) {
            return res.status(400).json({ message: "Project with this name already exists." })
        }

        const project = await Project.create(validatedData)

        logger.success(`Project Created: ${project.name}`)
        res.status(201).json({ success: true, data: project })
    } catch (error) {
        next(error)
    }
}

const getAllProjects = async (req, res, next) => {
    try {
        let filter = {}

        const projects = await Project.find(filter).lean()

        const populatedProjects = await Promise.all(projects.map(async(project) => {
            const tasks = await Task.find({project: project._id}).populate('owners', 'name')

            let dynamicStatus = 'To Do'
            if(tasks.length > 0){
                const allCompleted = tasks.every(t => t.status === 'Completed')

                if(allCompleted){
                    dynamicStatus = 'Completed'
                }else{
                    dynamicStatus = 'In Progress'
                }
            }

            const allOwners = tasks.flatMap(t => t.owners)
            const uniqueOwners = [...new Map(allOwners.map(o => [o._id.toString(), o])).values()]

            return {
                ...project,
                status: dynamicStatus,
                teamMembers: uniqueOwners
            }
        }))
        logger.info(`Fetched ${populatedProjects.length} projects with dynamic stats`)
        res.status(200).json({ success: true, count: populatedProjects.length, data: populatedProjects })
    } catch (error) {
        next(error)
    }
}

const getProjectById = async (req, res, next) => {
    try{
        const { id } = req.params

        const project = await Project.findById(id)
        if(!project){
            return res.status(404).json({message: "Project not found."})
        }

        const tasks = await Task.find({ project: id }).populate('owners', 'name email').sort({ createdAt: -1 })

        logger.info(`Fetched Project details: ${project.name}`)
        res.status(200).json({success: true, data: project, tasks: tasks})
    }catch(error){
        next(error)
    }
}

module.exports = { createProject, getAllProjects, getProjectById }