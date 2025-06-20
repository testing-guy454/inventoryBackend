const { StatusCodes } = require("http-status-codes")

const { UserService } = require("../services")
const { WagesRepository, UserRepository } = require("../repositories")
const { cookieOptions } = require("../config/auth.config")
const logger = require("../utils/logger")
const ApiResponse = require("../dto/response.dto")

const CONTEXT = 'UserController'

const userService = new UserService(new UserRepository, new WagesRepository)

const register = async (req, res) => {
  logger.info(`[${CONTEXT}] Registering new user with data: ${JSON.stringify(req.userData)}`)
  const { user, token } = await userService.register(req.userData)

  res.cookie('token', token, cookieOptions)
  res.setHeader('Authorization', `Bearer ${token}`)
  res.status(StatusCodes.CREATED).json(ApiResponse.success("User Created Successfully", { user }))
  logger.info(`[${CONTEXT}] User registered successfully: ${user._id}`)
}

const login = async (req, res) => {
  logger.info(`[${CONTEXT}] Logging in user with data: ${JSON.stringify(req.userData)}`)
  const { user, token } = await userService.login(req.userData)

  res.cookie('token', token, cookieOptions)
  res.setHeader('Authorization', `Bearer ${token}`)
  res.status(StatusCodes.OK).json(ApiResponse.success("User Login Successful", { user }))
  logger.info(`[${CONTEXT}] User login successful: ${user._id}`)
}

const getUser = async (req, res) => {
  logger.info(`[${CONTEXT}] Fetching user with ID: ${req.userId}`)
  const user = await userService.getUser({ userId: req.userId })
  res.status(StatusCodes.OK).json(ApiResponse.success("Data Fetched successfully", { user }))
  logger.info(`[${CONTEXT}] User fetched successfully: ${user._id}`)
}

const getAllUsers = async (req, res) => {
  logger.info(`[${CONTEXT}] Fetching all users`)
  const users = await userService.getAllUsers()
  res.status(StatusCodes.OK).json(ApiResponse.success("All Users Fetched Successfully", { length: users.length, users }))
  logger.info(`[${CONTEXT}] All users fetched successfully. Total: ${users.length}`)
}

const updateProfile = async (req, res) => {
  logger.info(`[${CONTEXT}] Updating profile for user ID: ${req.userId} with data: ${JSON.stringify(req.userData)}`)
  const updatedUser = await userService.updateProfile(req.userId, req.userData)
  res.status(StatusCodes.OK).json(ApiResponse.success("Profile Updated Successfully!", { user }))
  logger.info(`[${CONTEXT}] Profile updated successfully for user: ${updatedUser._id}`)
}

const updatePassword = async (req, res) => {
  logger.info(`[${CONTEXT}] Updating password for user ID: ${req.userId}`)
  const user = await userService.updatePassword(req.userId, req.userData)
  res.status(StatusCodes.OK).json(ApiResponse.success("Password Successfully Updated", { user }))
  logger.info(`[${CONTEXT}] Password updated successfully for user: ${user._id}`)
}

const logout = async (req, res) => {
  logger.info(`[${CONTEXT}] Logging out user ID: ${req.userId}`)
  res.clearCookie('token', cookieOptions)
  res.setHeader('Authorization', '')
  res.status(StatusCodes.OK).json(ApiResponse.success("Logged out successfully", null))
  logger.info(`[${CONTEXT}] User logged out successfully: ${req.userId}`)
}

const ADdeleteProfile = async (req, res) => {
  logger.info(`[${CONTEXT}] Admin deleting profile for user ID: ${req.params.id}`)
  const user = await userService.ADdeleteProfile(req.params.id)
  res.status(StatusCodes.OK).json(ApiResponse.success("User Deleted Successfully", { user }))
  logger.info(`[${CONTEXT}] Admin deleted profile successfully for user: ${req.params.id}`)
}

const ADupdateProfile = async (req, res) => {
  logger.info(`[${CONTEXT}] Admin updating profile for user ID: ${req.params.id} with data: ${JSON.stringify(req.userData)}`)
  const user = await userService.ADupdateProfile(req.params.id, req.userData)
  res.status(StatusCodes.OK).json(ApiResponse.success("User Updated Successfully", { user }))
  logger.info(`[${CONTEXT}] Admin updated profile successfully for user: ${user._id}`)
}

module.exports = {
  register,
  login,
  getUser,
  getAllUsers,
  updateProfile,
  ADdeleteProfile,
  updatePassword,
  logout,
  ADupdateProfile
}