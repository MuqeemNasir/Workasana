const express = require('express')
const router = express.Router()
const { createTask, getAllTasks, updateTask, deleteTask, getTaskById } = require('../controllers/task.controller')
const { protect } = require('../middleware/auth.middleware')

router.use(protect)

router.post('/', createTask)
router.get('/', getAllTasks)
router.get('/:id', getTaskById)
router.patch('/:id', updateTask)
router.delete('/:id', deleteTask)

module.exports = router