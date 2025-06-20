const { StatusCodes } = require("http-status-codes")

const { WageService } = require("../services")
const { UserRepository, WagesRepository } = require("../repositories")
const ApiResponse = require("../dto/response.dto")
const logger = require('../utils/logger')

const CONTEXT = 'WageController'

const wageService = new WageService(new UserRepository, new WagesRepository)

const getWage = async(req, res) => {
  logger.info(`[${CONTEXT}] Fetching wage for user: ${req.body.UserId}`)
  const wage = await wageService.getWage(req.body.UserId)
  res.status(StatusCodes.OK).json(ApiResponse.success("Wage Fetched Successfully", { wage }))
  logger.info(`[${CONTEXT}] Wage fetched successfully for user: ${req.body.UserId}`)
}

const getWages = async(req, res) => {
  logger.info(`[${CONTEXT}] Fetching all wages`)
  const wages = await wageService.getAllWageEntries()
  res.status(StatusCodes.OK).json(ApiResponse.success("Wages Fetched Successfully", { wages }))
  logger.info(`[${CONTEXT}] All wages fetched successfully. Count: ${wages.length}`)
}

const calculateWage = async(req, res) => {
  logger.info(`[${CONTEXT}] Calculating wage with details: ${JSON.stringify(req.query)}`)
  const wage = await wageService.calculateWage(Number(req.query.wagePerHour), Number(req.query.hoursThisMonth))
  res.status(StatusCodes.OK).json(ApiResponse.success("Wage Calculated Successfully", { wage }))
  logger.info(`[${CONTEXT}] Wage calculated successfully. Result: ${wage}`)
}

const getOverworked = async(req, res) => {
  logger.info(`[${CONTEXT}] Fetching overworked employees`)
  res.status(StatusCodes.NOT_IMPLEMENTED).json({ message: "Not Implemented Yet "})
  logger.info(`[${CONTEXT}] Overworked employees fetched successfully`)
}

const updateWage = async(req, res) => {
  logger.info(`[${CONTEXT}] Updating wage with details: ${JSON.stringify(req.body)}`)
  res.status(StatusCodes.NOT_IMPLEMENTED).json({ message: "Not Implemented Yet "})
  logger.info(`[${CONTEXT}] Wage updated successfully`)
}


module.exports = {
  getWages,
  getWage,
  calculateWage,
  getOverworked,
  updateWage
}