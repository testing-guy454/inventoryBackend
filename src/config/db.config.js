const mongoose = require("mongoose")
const logger = require("../utils/logger")
const { MONGO_URI } = require("./server.config")

async function connectDB() {
  logger.info('Connecting to DB...')
  await mongoose.connect(MONGO_URI)
  logger.info('Connected to DB 🔥')
}

module.exports = connectDB