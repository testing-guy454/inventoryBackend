const Wage = require('../models/wages.model')
const logger = require('../utils/logger')

const CONTEXT = 'WageRepository'

class WagesRepository {
  async createWage(wageDetails) {
    try {
      logger.info(`[${CONTEXT}] Creating new wage with details: ${JSON.stringify(wageDetails)}`)
      const wage = await Wage.create(wageDetails)
      logger.info(`[${CONTEXT}] Wage created successfully: ${wage._id}`)
      return wage

    } catch (error) {
      logger.error(`[${CONTEXT}][createWage] :: ${error.message}`, error)
      throw error
    }
  }

  async getAllWage() {
    try {
      logger.info(`[${CONTEXT}] Fetching all wages`)
      const wages = await Wage.find()
      logger.info(`[${CONTEXT}] Fetched all wages successfully. Count: ${wages.length}`)
      return wages

    } catch (error) {
      logger.error(`[${CONTEXT}][getAllWage] :: ${error.message}`, error)
      throw error
    }
  }

  async getWageById(wageId) {
    try {
      logger.info(`[${CONTEXT}] Fetching wage by ID: ${wageId}`)
      const wage = await Wage.findById(wageId).populate('user')
      logger.info(`[${CONTEXT}] Wage fetched successfully: ${wage._id}`)
      return wage

    } catch (error) {
      logger.error(`[${CONTEXT}][getWageById] :: ${error.message}`, error)
      throw error
    }
  }

  async getWagesByUserId(userId) {
    try {
      logger.info(`[${CONTEXT}] Fetching wages for user ID: ${userId}`)
      const wages = await Wage.find({ userId }).populate('user')
      logger.info(`[${CONTEXT}] Fetched wages for user ID ${userId} successfully. Count: ${wages.length}`)
      return wages

    } catch (error) {
      logger.error(`[${CONTEXT}][getWagesByUserId] :: ${error.message}`, error)
      throw error
    }
  }

  async getWagesByMonth(year, month) {
    try {
      logger.info(`[${CONTEXT}] Fetching wages for month: ${year}-${month}`)
      const startDate = new Date(year, month - 1, 1)
      const endDate = new Date(year, month, 1)
      const wages = await Wage.find({
        month: {
          $gte: startDate,
          $lt: endDate
        }
      }).populate('user')
      logger.info(`[${CONTEXT}] Fetched wages for month ${year}-${month} successfully. Count: ${wages.length}`)
      return wages

    } catch (error) {
      logger.error(`[${CONTEXT}][getWagesByMonth] :: ${error.message}`, error)
      throw error
    }
  }

  async getOverworkedWages() {
    try {
      logger.info(`[${CONTEXT}] Fetching overworked wages`)
      const wages = await Wage.find({ overworked: true })
      logger.info(`[${CONTEXT}] Fetched overworked wages successfully. Count: ${wages.length}`)
      return wages

    } catch (error) {
      logger.error(`[${CONTEXT}][getOverworkedWages] :: ${error.message}`, error)
      throw error
    }
  }

  async updateWage(wageId, wageDetails) {
    try {
      logger.info(`[${CONTEXT}] Updating wage: ${wageId}`)
      const updatedWage = await Wage.findByIdAndUpdate(wageId, wageDetails, { new: true }).populate('user')
      logger.info(`[${CONTEXT}] Wage updated successfully: ${updatedWage._id}`)
      return updatedWage

    } catch (error) {
      logger.error(`[${CONTEXT}][updateWage] :: ${error.message}`, error)
      throw error
    }
  }

  async updateUserWage(userId, wageDetails) {
    try {
      logger.info(`[${CONTEXT}] Updating wage: ${wageId}`)
      const updatedWage = await Wage.findOneAndUpdate({ userId }, wageDetails, { new: true }).populate('user')
      logger.info(`[${CONTEXT}] Wage updated successfully: ${updatedWage._id}`)
      return updatedWage

    } catch (error) {
      logger.error(`[${CONTEXT}][updateWage] :: ${error.message}`, error)
      throw error
    }
  }

  async deleteWage(wageId) {
    try {
      logger.info(`[${CONTEXT}] Deleting wage: ${wageId}`)
      const deletedWage = await Wage.findByIdAndDelete(wageId)
      logger.info(`[${CONTEXT}] Wage deleted successfully: ${deletedWage._id}`)
      return deletedWage
      
    } catch (error) {
      logger.error(`[${CONTEXT}][deleteWage] :: ${error.message}`, error)
      throw error
    }
  }
}

module.exports =  WagesRepository