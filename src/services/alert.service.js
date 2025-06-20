const logger = require('../utils/logger')
const { NotFoundError } = require('../errors/client.error')

const CONTEXT = 'AlertService'

class AlertService {
  constructor(AlertRepository) {
    this.AlertRepository = AlertRepository
  }

  async createAlert(alertDetails) {
    logger.info(`[${CONTEXT}] Creating new alert with details: ${JSON.stringify(alertDetails)}`)
    const alert = await this.AlertRepository.createAlert(alertDetails)
    logger.info(`[${CONTEXT}] Alert created successfully: ${alert._id}`)
    return alert
  }

  async getAlert(alertId) {
    logger.info(`[${CONTEXT}] Fetching alert by ID: ${alertId}`)
    const alert = await this.AlertRepository.getAlertById(alertId)
    if (!alert) {
      logger.warn(`[${CONTEXT}] Alert not found with ID: ${alertId}`)
      throw new NotFoundError('Alert not found')
    }
    logger.info(`[${CONTEXT}] Fetched alert successfully: ${alert._id}`)
    return alert
  }

  async getAllAlerts() {
    logger.info(`[${CONTEXT}] Fetching all alerts`)
    const alerts = await this.AlertRepository.getAllAlerts()
    logger.info(`[${CONTEXT}] Fetched all alerts successfully. Count: ${alerts.length}`)
    return alerts
  }

  async getUnresolvedAlerts() {
    logger.info(`[${CONTEXT}] Fetching unresolved alerts`)
    const alerts = await this.AlertRepository.getUnresolvedAlerts()
    logger.info(`[${CONTEXT}] Fetched unresolved alerts successfully. Count: ${alerts.length}`)
    return alerts
  }

  async updateAlert(alertId, alertDetails) {
    logger.info(`[${CONTEXT}] Updating alert: ${alertId}`)
    const updatedAlert = await this.AlertRepository.updateAlert(alertId, alertDetails)
    if (!updatedAlert) {
      throw new NotFoundError('Alert not found')
    }
    logger.info(`[${CONTEXT}] Alert updated successfully: ${alertId}`)
    return updatedAlert
  }

  async deleteAlert(alertId) {
    logger.info(`[${CONTEXT}] Deleting alert: ${alertId}`)
    const deletedAlert = await this.AlertRepository.deleteAlert(alertId)
    if (!deletedAlert) {
      throw new NotFoundError('Alert not found')
    }
    logger.info(`[${CONTEXT}] Alert deleted successfully: ${alertId}`)
    return deletedAlert
  }
  
  async resolveAlert(alertId) {
    logger.info(`[${CONTEXT}] Resolving alert: ${alertId}`)
    const updatedAlert = await this.AlertRepository.updateAlert(alertId, { resolved: true })
    if (!updatedAlert) {
        throw new NotFoundError('Alert not found')
    }
    logger.info(`[${CONTEXT}] Alert resolved successfully: ${alertId}`)
    return updatedAlert
  }
}

module.exports = AlertService
