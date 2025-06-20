const { StatusCodes } = require('http-status-codes')
const { AlertService } = require('../services')
const { AlertRepository } = require('../repositories')
const logger = require('../utils/logger')
const ApiResponse = require('../dto/response.dto')

const CONTEXT = 'AlertController'

const alertService = new AlertService(new AlertRepository())

const createAlert = async (req, res) => {
  logger.info(`[${CONTEXT}] Creating new alert with data: ${JSON.stringify(req.body)}`)
  const alert = await alertService.createAlert(req.body)
  res.status(StatusCodes.CREATED).json(ApiResponse.success('Alert created successfully', { alert }))
  logger.info(`[${CONTEXT}] Alert created successfully: ${alert._id}`)
}

const getAlert = async (req, res) => {
  logger.info(`[${CONTEXT}] Fetching alert with ID: ${req.params.id}`)
  const alert = await alertService.getAlert(req.params.id)
  res.status(StatusCodes.OK).json(ApiResponse.success('Alert fetched successfully', { alert }))
  logger.info(`[${CONTEXT}] Alert fetched successfully: ${alert._id}`)
}

const getAllAlerts = async (req, res) => {
  logger.info(`[${CONTEXT}] Fetching all alerts`)
  const alerts = await alertService.getAllAlerts()
  res.status(StatusCodes.OK).json(ApiResponse.success('All alerts fetched successfully', { length: alerts.length, alerts }))
  logger.info(`[${CONTEXT}] All alerts fetched successfully. Total: ${alerts.length}`)
}

const updateAlert = async (req, res) => {
  logger.info(`[${CONTEXT}] Updating alert ID: ${req.params.id} with data: ${JSON.stringify(req.body)}`)
  const updatedAlert = await alertService.updateAlert(req.params.id, req.body)
  res.status(StatusCodes.OK).json(ApiResponse.success('Alert updated successfully', { alert: updatedAlert }))
  logger.info(`[${CONTEXT}] Alert updated successfully: ${updatedAlert._id}`)
}

const deleteAlert = async (req, res) => {
  logger.info(`[${CONTEXT}] Deleting alert ID: ${req.params.id}`)
  const deletedAlert = await alertService.deleteAlert(req.params.id)
  res.status(StatusCodes.OK).json(ApiResponse.success('Alert deleted successfully', { alert: deletedAlert }))
  logger.info(`[${CONTEXT}] Alert deleted successfully: ${deletedAlert._id}`)
}

const getUnresolvedAlerts = async (req, res) => {
    logger.info(`[${CONTEXT}] Fetching all unresolved alerts`)
    const alerts = await alertService.getUnresolvedAlerts()
    res.status(StatusCodes.OK).json(ApiResponse.success('Unresolved alerts fetched successfully', { alerts }))
    logger.info(`[${CONTEXT}] Unresolved alerts fetched. Count: ${alerts.length}`)
}

const resolveAlert = async (req, res) => {
    logger.info(`[${CONTEXT}] Resolving alert ID: ${req.params.id}`)
    const resolvedAlert = await alertService.resolveAlert(req.params.id)
    res.status(StatusCodes.OK).json(ApiResponse.success('Alert resolved successfully', { alert: resolvedAlert }))
    logger.info(`[${CONTEXT}] Alert resolved successfully: ${resolvedAlert._id}`)
}

const getAllActiveAlerts = async(req, res) => {
  res.status(StatusCodes.NOT_IMPLEMENTED).json({ message: "Not Implemented Yet "})
}

const triggerAlert = async(req, res) => {
  res.status(StatusCodes.NOT_IMPLEMENTED).json({ message: "Not Implemented Yet "})
}

const sendAlert = async(req, res) => {
  res.status(StatusCodes.NOT_IMPLEMENTED).json({ message: "Not Implemented Yet "})
}

module.exports = {
  createAlert,
  getAlert,
  getAllAlerts,
  updateAlert,
  deleteAlert,
  getUnresolvedAlerts,
  resolveAlert,
  getAllActiveAlerts,
  triggerAlert,
  sendAlert
}