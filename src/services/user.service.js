/**
 * This Handles all the business Logic
 * Independent of the Repository Layer
 * Dependency Injection in the Controller Layer
 */

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const logger = require('../utils/logger')
const { JWT_SECRET_KEY } = require('./../config/server.config')
const { jwtOptions } = require('../config/auth.config')
const { NotFoundError } = require('../errors/client.error')

const CONTEXT = 'UserService'

class UserService {
  constructor(UserRepository, WageRepository) {
    this.UserRepository = UserRepository,
    this.WageRepository = WageRepository
  }

  register = async (userDetails) => {
    logger.info(`[${CONTEXT}] Registering user with details: ${JSON.stringify(userDetails)}`)
    userDetails.password = await bcrypt.hash(userDetails.password, 10)
    const user = await this.UserRepository.registerUser(userDetails)

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET_KEY, jwtOptions)
    user.password = undefined
    logger.info(`[${CONTEXT}] User registered successfully: ${user._id}`)
    
    logger.info(`[${CONTEXT}] Registering Wage Entry for the User: ${user._id}`)
    const wage = await this.WageRepository.createWage({ userId: user._id })
    logger.info(`[${CONTEXT}] Wage registered Successfully for: ${user._id}, WageId: ${wage._id}`)
    
    logger.info(`[${CONTEXT}] Adding Wage Entry in the User: ${wage._id}`)
    await this.UserRepository.updateUser(user._id, { wage: wage._id })
    logger.info(`[${CONTEXT}] Wage Entry Added in the User: ${user._id}`)

    return { user, token }
  }

  login = async (userDetails) => {
    logger.info(`[${CONTEXT}] Attempting login for user: ${userDetails.email || userDetails.phone}`)
    const user = await this.UserRepository.getUser(userDetails)
    if(!user) {
      logger.warn(`[${CONTEXT}] User not found: ${userDetails.email || userDetails.phone}`)
      throw new NotFoundError('Incorrect Credentials')
    }

    const isPassword = await bcrypt.compare(userDetails.password, user.password)
    if(!isPassword) {
      logger.warn(`[${CONTEXT}] Incorrect password for user: ${user._id}`)
      throw new NotFoundError('Incorrect Credentials')
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET_KEY, jwtOptions)
    user.password = undefined
    logger.info(`[${CONTEXT}] User logged in successfully: ${user._id}`)
    return { user, token }
  }

  getUser = async (userDetails) => {
    logger.info(`[${CONTEXT}] Fetching user with details: ${JSON.stringify(userDetails)}`)
    const user = await this.UserRepository.getUser(userDetails)
    if (!user) {
      logger.warn(`[${CONTEXT}] User not found with details: ${JSON.stringify(userDetails)}`)
      throw new NotFoundError('User not found')
    }

    user.password = undefined
    logger.info(`[${CONTEXT}] Fetched user successfully: ${user._id}`)
    return user
  }

  getAllUsers = async () => {
    logger.info(`[${CONTEXT}] Fetching all users`)
    const users = await this.UserRepository.getAllUsers()

    logger.info(`[${CONTEXT}] Fetched ${users.length} users`)
    return users
  }

  updateProfile = async (userId, updateData) => {
    logger.info(`[${CONTEXT}] Updating profile for user: ${userId}`)
    const updatedUser = await this.UserRepository.updateUser(userId, updateData)

    logger.info(`[${CONTEXT}] Profile updated successfully for user: ${userId}`)
    return updatedUser
  }

  updatePassword = async (userId, updateData) => {
    logger.info(`[${CONTEXT}] Updating password for user: ${userId}`)
    updateData.password = await bcrypt.hash(updateData.password, 10)
    const user = await this.UserRepository.updateUser(userId, updateData)

    logger.info(`[${CONTEXT}] Password updated successfully for user: ${userId}`)
    return user
  }

  ADdeleteProfile = async (userId) => {
    logger.info(`[${CONTEXT}] Admin deleting profile for user: ${userId}`)
    const deletedUser = await this.UserRepository.deleteUserWithId(userId)

    logger.info(`[${CONTEXT}] Admin deleted profile successfully for user: ${userId}`)
    return deletedUser
  }

  ADupdateProfile = async (userId, updateData) => {
    logger.info(`[${CONTEXT}] Admin updating profile for user: ${userId}`)
    const updatedUser = await this.UserRepository.updateUser(userId, updateData)
    
    logger.info(`[${CONTEXT}] Admin updated profile successfully for user: ${userId}`)
    return updatedUser
  }

}

module.exports = UserService