/**
 * Wage & Workforce Management
 * 
 * GET    /api/v1/wages/              List wage entries
 * POST   /api/v1/wages/calculate     Calculate wages for all employees
 * GET    /api/v1/wages/overworked    Get list of overworked employees
 * PUT    /api/v1/wages/:userId       Update wage info
 * 
*/

const express = require('express')

const { wageController } = require('../../controllers')
const wageRouter = express.Router()

wageRouter.get('/', wageController.getWages)
wageRouter.post('/calculate', wageController.calculateWage)
wageRouter.get('/overworked', wageController.getOverworked)
wageRouter.put('/:userId', wageController.updateWage)

module.exports = wageRouter