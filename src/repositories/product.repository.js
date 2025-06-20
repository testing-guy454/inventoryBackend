const logger = require('../utils/logger')
const { Product } = require('../models')
const { BadRequestError } = require('../errors/client.error')

const CONTEXT = 'ProductRepository'

class ProductRepository {
  async createProduct(productDetails) {
    try {
      logger.info(`[${CONTEXT}] Creating product with name: ${productDetails.productName}`)
      const product = await Product.create(productDetails)

      logger.info(`[${CONTEXT}] Product created successfully: ${product._id}`)
      return product

    } catch (error) {
      logger.error(`[${CONTEXT}][createProduct] :: ${error.message}`, error)
      throw new BadRequestError('Error creating product.')
    }
  }

  async getProductById(productId) {
    logger.info(`[${CONTEXT}] Fetching product by ID: ${productId}`)
    return await Product.findById(productId).populate('storage').populate('supplierId')
  }

  async getProductBySku(sku) {
    logger.info(`[${CONTEXT}] Fetching product by SKU: ${sku}`)
    return await Product.findOne({ sku }).populate('storage').populate('supplierId')
  }

  async getAllProducts() {
    logger.info(`[${CONTEXT}] Fetching all products`)
    return await Product.find().populate('storage').populate('supplierId')
  }

  async updateProduct(productId, productDetails) {
    try {
      logger.info(`[${CONTEXT}] Updating product: ${productId}`)
      const updatedProduct = await Product.findByIdAndUpdate(productId, productDetails, { new: true })

      logger.info(`[${CONTEXT}] Product updated successfully: ${productId}`)
      return updatedProduct

    } catch (error) {
        logger.error(`[${CONTEXT}][updateProduct] :: ${error.message}`, error)
        throw error
    }
  }

  async deleteProduct(productId) {
    try {
      logger.info(`[${CONTEXT}] Deleting product: ${productId}`)
      const deletedProduct = await Product.findByIdAndDelete(productId)

      logger.info(`[${CONTEXT}] Product deleted successfully: ${productId}`)
      return deletedProduct

    } catch (error) {
      logger.error(`[${CONTEXT}][deleteProduct] :: ${error.message}`, error)
      throw error
    }
  }

  async getProductsByCategory(category) {
    logger.info(`[${CONTEXT}] Fetching products by category: ${category}`)
    return Product.find({ productCategory: category })
  }

  async getProductsBySupplier(supplierId) {
    logger.info(`[${CONTEXT}] Fetching products by supplier: ${supplierId}`)
    return Product.find({ supplierId })
  }

  async getProductsNeedingRestock() {
    logger.info(`[${CONTEXT}] Fetching products that need restock`)
    return Product.find({ restockRecommended: true })
  }

  async getExpiringProducts(daysUntilExpiry) {
    try {
      logger.info(`[${CONTEXT}] Fetching products expiring within ${daysUntilExpiry} days`)
      const today = new Date()
      const expiryLimitDate = new Date(today.setDate(today.getDate() + daysUntilExpiry))

      return Product.find({
        expiryDate: { $lte: expiryLimitDate }
      })

    } catch (error) {
      logger.error(`[${CONTEXT}][getExpiringProducts] :: ${error.message}`, error)
      throw error
    }
  }

  async getExpiredProducts() {
    try {
      logger.info(`[${CONTEXT}] Fetching expired products`)
      const today = new Date()

      return Product.find({
        expiryDate: { $lt: today }
      })

    } catch (error) {
      logger.error(`[${CONTEXT}][getExpiredProducts] :: ${error.message}`, error)
      throw error
    }
  }

  async getProductsNearLocation(coordinates, maxDistanceInMeters = 10000) {
    try {
      logger.info(`[${CONTEXT}] Fetching products near location: ${coordinates}`)
      return Product.find({
        supplierLocation: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: coordinates
            },
            $maxDistance: maxDistanceInMeters
          }
        }
      })

    } catch (error) {
      logger.error(`[${CONTEXT}][getProductsNearLocation] :: ${error.message}`, error)
      throw error
    }
  }

  async getLowStockProducts() {
    try {
      logger.info(`[${CONTEXT}] Fetching products with low stock`)
      return Product.find({
        $expr: { $lte: ["$quantity", "$thresholdLimit"] }
      })

    } catch (error) {
      logger.error(`[${CONTEXT}][getLowStockProducts] :: ${error.message}`, error)
      throw error
    }
  }
}

module.exports = ProductRepository