const express = require('express')
const router = express.Router()
const { getCompletedLastWeek, getPendingWork, getClosedByTeam, getClosedByOwner } = require('../controllers/report.controller')
const {protect} = require('../middleware/auth.middleware')

router.get('/last-week', protect, getCompletedLastWeek)
router.get('/pending', protect, getPendingWork)
router.get('/closed-by-team', protect, getClosedByTeam)
router.get('/closed-by-owner', protect, getClosedByOwner)

module.exports = router