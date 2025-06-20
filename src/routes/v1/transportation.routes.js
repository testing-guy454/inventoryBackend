/**
 * Transportation Management
 * 
 * GET    /api/v1/transports/         Get all transports
 * POST   /api/v1/transports/         Create a new transportation
 * GET    /api/v1/transports/:id      Get transportation status
 * PUT    /api/v1/transports/:id      Update transportation status/location
 * POST   /api/v1/transports/assign   Assign transportation to personnel
 * GET    /api/v1/transports/eta      Get predicted ETA
 * 
*/ 

const express = require('express')

const { transportationController } = require('../../controllers')
const { authMiddleware, adminMiddleware } = require('../../middlewares')
const transportationRouter = express.Router()

transportationRouter.get('/', transportationController.getAllTransportation)
// transportationRouter.post('/', transportationController.createTransportation)
transportationRouter.get('/status/:status', transportationController.getDeliveriesByStatus)
transportationRouter.get('/overdue', transportationController.getDeliveriesByStatus)
transportationRouter.get('/:id', authMiddleware, transportationController.getTransportation)
// transportationRouter.put('/:id', authMiddleware, transportationController.updateTransportation)
transportationRouter.delete('/:id', adminMiddleware, transportationController.cancelTransportation)
// transportationRouter.post('/assign', transportationController.assignTransportation)
// transportationRouter.get('/eta', transportationController.getEta)

module.exports = transportationRouter