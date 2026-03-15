const Task = require('../models/Task.model')
const logger = require('../utils/logger')

const getCompletedLastWeek = async (req, res, next) => {
    try {
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

        const tasks = await Task.find({
            status: 'Completed',
            updatedAt: { $gte: sevenDaysAgo }
        })

        logger.info(`Found ${tasks.length} tasks completed in last 7 days`)

        res.status(200).json({
            count: tasks.length,
            tasks: tasks
        })
    } catch (error) {
        next(error)
    }
}

const getPendingWork = async (req, res, next) => {
    try {
        const tasks = await Task.find({ status: { $ne: 'Completed' } })

        const totalDays = tasks.reduce((sum, task) => {
            return sum + (task.timeToComplete || 0)
        }, 0)

        logger.info(`Calculated total pending work: ${totalDays} days`)

        res.status(200).json({
            totalTasks: tasks.length,
            totalDaysPending: totalDays
        })
    } catch (error) {
        next(error)
    }
}

const getClosedByTeam = async (req, res, next) => {
    try {
        const tasks = await Task.find({ status: 'Completed' }).populate('team', 'name')

        const stats = {}

        tasks.forEach(task => {
            const teamName = task.team ? task.team.name : 'Unassigned'
            if (stats[teamName]) {
                stats[teamName] += 1
            } else {
                stats[teamName] = 1
            }
        })

        logger.info(`Generated Team Completion Stats`)
        res.status(200).json(stats)
    } catch (error) {
        next(error)
    }
}

const getClosedByOwner = async (req, res, next) => {
    try {
        const tasks = await Task.find({ status: 'Completed' }).populate('owners', 'name')
        const stats = {}

        tasks.forEach(task => {
            if (task.owners && task.owners.length > 0) {
                task.owners.forEach(owner => {
                    const ownerName = owner.name
                    if (stats[ownerName]) {
                        stats[ownerName] += 1
                    } else {
                        stats[ownerName] = 1
                    }
                })
            } else {
                stats['Unassigned'] = (stats['Unassigned'] || 0) + 1
            }
        })
        logger.info(`Generated Owner Completion Stats`)
        res.status(200).json(stats)
    }catch(error){
        next(error)
    }
}

module.exports = { getCompletedLastWeek, getPendingWork, getClosedByTeam, getClosedByOwner }