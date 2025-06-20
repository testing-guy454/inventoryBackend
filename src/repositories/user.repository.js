/**
 * In this Layer we write only the Operations to perform on DB
 * NOT the LOGIC behind our main Business -> So it's like our CRUD Manager for DB
 */

const { BadRequestError } = require("../errors/client.error")
const { Users } = require("../models")
const logger = require('../utils/logger')

const CONTEXT = 'UserRepository'

class UserRepository {
  async registerUser (userDetails) {
    try {
      logger.info(`[${CONTEXT}] Registering user with details: ${JSON.stringify(userDetails)}`)
      const user = await Users.create(userDetails)
      logger.info(`[${CONTEXT}] User registered successfully: ${user._id}`)
      return user

    } catch (error) {
      logger.error(`[${CONTEXT}][registerUser] :: ${error.message}`, error)
      throw new BadRequestError('User Already Exists, Kindly Login!')
    }
  }

  async getUser(userDetails) {
    try {
      const fieldMap = { userId: '_id', email: 'email', phone: 'phone' }
      const key = Object.keys(fieldMap).find(k => userDetails[k])

      if (!key) throw new BadRequestError('No valid identifier provided. Expected email, phone, or userId.')

      const query = { [fieldMap[key]]: userDetails[key] }
      logger.info(`[${CONTEXT}] Fetching user with query: ${JSON.stringify(query)}`)
      const user = await Users.findOne(query).select('+password +email').populate('wage')
      if (user) {
        logger.info(`[${CONTEXT}] Found user: ${user._id}`)
      } else {
        logger.warn(`[${CONTEXT}] User not found with query: ${JSON.stringify(query)}`)
      }
      return user
    } catch (error) {
      logger.error(`[${CONTEXT}][getUser] :: ${error.message}`, error)
      throw error
    }
  }
  
  async getUserByEmail (email) {
    logger.info(`[${CONTEXT}] Fetching user by email: ${email}`)
    return Users.findOne({ email }).select('+password +email')
  }

  async getUserByPhone(phone) {
    logger.info(`[${CONTEXT}] Fetching user by phone: ${phone}`)
    return Users.findOne({ phone }).select('+password +email')
  }
  
  async getUserById(userId) {
    logger.info(`[${CONTEXT}] Fetching user by ID: ${userId}`)
    return Users.findById(userId).select('+password +email')
  }

  async getUsersByRole(role) {
    logger.info(`[${CONTEXT}] Fetching users by role: ${role}`)
    return Users.find({ role })
  }

  async getUsersByShift(shift) {
    logger.info(`[${CONTEXT}] Fetching users by shift: ${shift}`)
    return Users.find({ shift })
  }

  async getActiveUsers() {
    logger.info(`[${CONTEXT}] Fetching active users`)
    return Users.find({ active: true })
  }

  async getInactiveUsers() {
    logger.info(`[${CONTEXT}] Fetching inactive users`)
    return Users.find({ active: false })
  }

  async getUsersWithExtraShift() {
    logger.info(`[${CONTEXT}] Fetching users with extra shift`)
    return Users.find({ extraShift: true })
  }

  async getAllUsers () {
    logger.info(`[${CONTEXT}] Fetching all users`)
    return Users.find()
  }

  async updateUser (userId, userDetails) {
    try {
      logger.info(`[${CONTEXT}] Updating user: ${userId}`)
      const updatedUser = await Users.findByIdAndUpdate(userId, userDetails, { new: true }).select('+email')
      logger.info(`[${CONTEXT}] User updated successfully: ${userId}`)
      return updatedUser
    } catch (error) {
      logger.error(`[${CONTEXT}][updateUser] :: ${error.message}`, error)
      throw error
    }
  }

  async deleteUserWithId (userId) {
    try {
      logger.info(`[${CONTEXT}] Deleting user: ${userId}`)
      const deletedUser = await Users.findByIdAndDelete(userId)
      logger.info(`[${CONTEXT}] User deleted successfully: ${userId}`)
      return deletedUser
    } catch (error) {
      logger.error(`[${CONTEXT}][deleteUserWithId] :: ${error.message}`, error)
      throw error
    }
  }

  async getUsersWithHoursThisMonthGreaterThan(hours) {
    logger.info(`[${CONTEXT}] Fetching users with hours greater than: ${hours}`)
    return Users.find({ hoursThisMonth: { $gt: hours } })
  }

  async getUsersWithHoursThisMonthLessThan(hours) {
    logger.info(`[${CONTEXT}] Fetching users with hours less than: ${hours}`)
    return Users.find({ hoursThisMonth: { $lt: hours } })
  }
}

module.exports = UserRepository