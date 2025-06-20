const Alert = require('../models/alert.model')
const logger = require('../utils/logger')

const CONTEXT = 'AlertRepository'

class AlertRepository {
  async createAlert(alertDetails) {
    try {
      logger.info(`[${CONTEXT}] Creating new alert with details: ${JSON.stringify(alertDetails)}`)
      const alert = await Alert.create(alertDetails)
      logger.info(`[${CONTEXT}] Alert created successfully: ${alert._id}`)
      return alert
      
    } catch (error) {
      logger.error(`[${CONTEXT}][createAlert] :: ${error.message}`, error)
      throw error
    }
  }

  async getAlertById(alertId) {
    try {
      logger.info(`[${CONTEXT}] Fetching alert by ID: ${alertId}`)
      const alert = await Alert.findById(alertId)
      logger.info(`[${CONTEXT}] Alert fetched successfully: ${alert._id}`)
      return alert

    } catch (error) {
      logger.error(`[${CONTEXT}][getAlertById] :: ${error.message}`, error)
      throw error
    }
  }

  async getAllAlerts() {
    try {
      logger.info(`[${CONTEXT}] Fetching all alerts`)
      const alerts = await Alert.find()
      logger.info(`[${CONTEXT}] Fetched all alerts successfully. Count: ${alerts.length}`)
      return alerts

    } catch (error) {
      logger.error(`[${CONTEXT}][getAllAlerts] :: ${error.message}`, error)
      throw error
    }
  }

  async getUnresolvedAlerts() {
    try {
      logger.info(`[${CONTEXT}] Fetching unresolved alerts`)
      const alerts = await Alert.find({ resolved: false })
      logger.info(`[${CONTEXT}] Fetched unresolved alerts successfully. Count: ${alerts.length}`)
      return alerts
    } catch (error) {
      logger.error(`[${CONTEXT}][getUnresolvedAlerts] :: ${error.message}`, error)
      throw error
    }
  }

  async updateAlert(alertId, alertDetails) {
    try {
      logger.info(`[${CONTEXT}] Updating alert: ${alertId}`)
      const updatedAlert = await Alert.findByIdAndUpdate(alertId, alertDetails, { new: true })
      logger.info(`[${CONTEXT}] Alert updated successfully: ${updatedAlert._id}`)
      return updatedAlert

    } catch (error) {
      logger.error(`[${CONTEXT}][updateAlert] :: ${error.message}`, error)
      throw error
    }
  }

  async deleteAlert(alertId) {
    try {
      logger.info(`[${CONTEXT}] Deleting alert: ${alertId}`)
      const deletedAlert = await Alert.findByIdAndDelete(alertId)
      logger.info(`[${CONTEXT}] Alert deleted successfully: ${deletedAlert._id}`)
      return deletedAlert

    } catch (error) {
      logger.error(`[${CONTEXT}][deleteAlert] :: ${error.message}`, error)
      throw error
    }
  }
}

module.exports = AlertRepository