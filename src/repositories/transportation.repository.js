const Transportation = require('../models/transportation.model')
const logger = require('../utils/logger')

const CONTEXT = 'TransportationRepository'

class TransportationRepository {
  async createTransportation(transportationDetails) {
    try {
      logger.info(`[${CONTEXT}] Creating new transportation with details: ${JSON.stringify(transportationDetails)}`)
      const transportation = await Transportation.create(transportationDetails)
      logger.info(`[${CONTEXT}] Transportation created successfully: ${transportation._id}`)
      return transportation

    } catch (error) {
      logger.error(`[${CONTEXT}][createTransportation] :: ${error.message}`, error)
      throw error
    }
  }

  async getTransportationById(transportationId) {
    try {
      logger.info(`[${CONTEXT}] Fetching transportation by ID: ${transportationId}`)
      const transportation = await Transportation.findById(transportationId)
      logger.info(`[${CONTEXT}] Transportation fetched successfully: ${transportation._id}`)
      return transportation

    } catch (error) {
      logger.error(`[${CONTEXT}][getTransportationById] :: ${error.message}`, error)
      throw error
    }
  }

  async getAllDeliveries() {
    try {
      logger.info(`[${CONTEXT}] Fetching all deliveries`)
      const deliveries = await Transportation.find()
      logger.info(`[${CONTEXT}] Fetched all deliveries successfully. Count: ${deliveries.length}`)
      return deliveries

    } catch (error) {
      logger.error(`[${CONTEXT}][getAllDeliveries] :: ${error.message}`, error)
      throw error
    }
  }

  async getTransportationByAssignee(assignedTo) {
    try {
      logger.info(`[${CONTEXT}] Fetching deliveries assigned to: ${assignedTo}`)
      const deliveries = await Transportation.find({ assignedTo })
      logger.info(`[${CONTEXT}] Fetched deliveries for assignee ${assignedTo} successfully. Count: ${deliveries.length}`)
      return deliveries

    } catch (error) {
      logger.error(`[${CONTEXT}][getTransportationByAssignee] :: ${error.message}`, error)
      throw error
    }
  }

  async getDeliveriesByPackageId(packageId) {
    try {
      logger.info(`[${CONTEXT}] Fetching deliveries for package ID: ${packageId}`)
      const deliveries = await Transportation.find({ packageId })
      logger.info(`[${CONTEXT}] Fetched deliveries for package ID ${packageId} successfully. Count: ${deliveries.length}`)
      return deliveries

    } catch (error) {
      logger.error(`[${CONTEXT}][getDeliveriesByPackageId] :: ${error.message}`, error)
      throw error
    }
  }

  async getDeliveriesByDestination(destination) {
    try {
      logger.info(`[${CONTEXT}] Fetching deliveries with destination: ${destination}`)
      const deliveries = await Transportation.find({ destination })
      logger.info(`[${CONTEXT}] Fetched deliveries for destination ${destination} successfully. Count: ${deliveries.length}`)
      return deliveries

    } catch (error) {
      logger.error(`[${CONTEXT}][getDeliveriesByDestination] :: ${error.message}`, error)
      throw error
    }
  }

  async getDeliveriesByOrigin(startLocation) {
    try {
      logger.info(`[${CONTEXT}] Fetching deliveries with origin: ${startLocation}`)
      const deliveries = await Transportation.find({ startLocation })
      logger.info(`[${CONTEXT}] Fetched deliveries for origin ${startLocation} successfully. Count: ${deliveries.length}`)
      return deliveries

    } catch (error) {
      logger.error(`[${CONTEXT}][getDeliveriesByOrigin] :: ${error.message}`, error)
      throw error
    }
  }

  async getDeliveriesByCurrentLocation(currentLocation) {
    try {
      logger.info(`[${CONTEXT}] Fetching deliveries with current location: ${currentLocation}`)
      const deliveries = await Transportation.find({ currentLocation })
      logger.info(`[${CONTEXT}] Fetched deliveries for current location ${currentLocation} successfully. Count: ${deliveries.length}`)
      return deliveries

    } catch (error) {
      logger.error(`[${CONTEXT}][getDeliveriesByCurrentLocation] :: ${error.message}`, error)
      throw error
    }
  }

  async getDeliveriesByStatus(status) {
    try {
      logger.info(`[${CONTEXT}] Fetching deliveries with status: ${status}`)
      const deliveries = await Transportation.find({ status })
      logger.info(`[${CONTEXT}] Fetched deliveries for status ${status} successfully. Count: ${deliveries.length}`)
      return deliveries

    } catch (error) {
      logger.error(`[${CONTEXT}][getDeliveriesByStatus] :: ${error.message}`, error)
      throw error
    }
  }

  async getDeliveriesByTransportMode(transportMode) {
    try {
      logger.info(`[${CONTEXT}] Fetching deliveries with transport mode: ${transportMode}`)
      const deliveries = await Transportation.find({ transportMode })
      logger.info(`[${CONTEXT}] Fetched deliveries for transport mode ${transportMode} successfully. Count: ${deliveries.length}`)
      return deliveries

    } catch (error) {
      logger.error(`[${CONTEXT}][getDeliveriesByTransportMode] :: ${error.message}`, error)
      throw error
    }
  }

  async getOverdueDeliveries() {
    try {
      logger.info(`[${CONTEXT}] Fetching overdue deliveries`)
      const deliveries = await Transportation.find({
        eta: { $lt: new Date() },
        status: { $ne: 'delivered' }
      })
      logger.info(`[${CONTEXT}] Fetched overdue deliveries successfully. Count: ${deliveries.length}`)
      return deliveries

    } catch (error) {
      logger.error(`[${CONTEXT}][getOverdueDeliveries] :: ${error.message}`, error)
      throw error
    }
  }

  async updateTransportation(transportationId, transportationDetails) {
    try {
      logger.info(`[${CONTEXT}] Updating transportation: ${transportationId}`)
      const updatedTransportation = await Transportation.findByIdAndUpdate(transportationId, transportationDetails, { new: true })
      logger.info(`[${CONTEXT}] Transportation updated successfully: ${updatedTransportation._id}`)
      return updatedTransportation

    } catch (error) {
      logger.error(`[${CONTEXT}][updateTransportation] :: ${error.message}`, error)
      throw error
    }
  }

  async deleteTransportation(transportationId) {
    try {
      logger.info(`[${CONTEXT}] Deleting transportation: ${transportationId}`)
      const deletedTransportation = await Transportation.findByIdAndDelete(transportationId)
      logger.info(`[${CONTEXT}] Transportation deleted successfully: ${deletedTransportation._id}`)
      return deletedTransportation
      
    } catch (error) {
      logger.error(`[${CONTEXT}][deleteTransportation] :: ${error.message}`, error)
      throw error
    }
  }
}

module.exports = TransportationRepository
