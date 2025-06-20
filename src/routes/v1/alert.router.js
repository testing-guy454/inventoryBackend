/**
 * Alerts & Notifications
 * 
 * GET    /api/v1/alerts/             Get all active alerts
 * POST   /api/v1/alerts/trigger      Manually trigger an alert (for testing)
 * POST   /api/v1/alerts/send         Send alert to subscribed users
 * 
*/

const express = require('express')

const { alertController } = require('../../controllers')
const alertRouter = express.Router()

alertRouter.get('/', alertController.getAllActiveAlerts)
alertRouter.post('/trigger', alertController.triggerAlert)
alertRouter.post('/send', alertController.sendAlert)


module.exports = alertRouter