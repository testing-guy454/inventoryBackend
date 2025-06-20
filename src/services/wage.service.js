const logger = require('../utils/logger')

const CONTEXT = 'WageService'

class WageService {
  constructor(UserRepository, WageRepository) {
    this.UserRepository = UserRepository,
    this.WageRepository = WageRepository
  }

  async getAllWageEntries () {
    logger.info(`[${CONTEXT}] Fetching all wage entries`)
    const wages = await this.WageRepository.getAllWage()
    logger.info(`[${CONTEXT}] Fetched all wage entries successfully. Count: ${wages.length}`)
    return wages
  }

  async calculateWage (wagePerHour, hoursThisMonth) {
    logger.info(`[${CONTEXT}] Calculating wage for wagePerHour: ${wagePerHour} and hoursThisMonth: ${hoursThisMonth}`)
    const wage = wagePerHour * hoursThisMonth
    logger.info(`[${CONTEXT}] Calculated wage successfully. Result: ${wage}`)
    return wage
  }

  async getWage (userId) {
    logger.info(`[${CONTEXT}] Fetching and updating wage for user: ${userId}`)
    const { wagePerHour, hoursThisMonth } = await this.UserRepository.getUser({ userId })
    const totalSalary = wagePerHour * hoursThisMonth

    await this.WageRepository.updateUserWage(userId, { totalSalary })
    logger.info(`[${CONTEXT}] Wage updated and fetched successfully for user: ${userId}. Total Salary: ${totalSalary}`)
    return totalSalary
  }
}

module.exports = WageService