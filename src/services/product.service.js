const logger = require('../utils/logger')
const { NotFoundError } = require('../errors/client.error')

const CONTEXT = 'ProductService'

class ProductService {
  constructor(ProductRepository) {
    this.ProductRepository = ProductRepository
  }

  async createProduct(productDetails) {
    logger.info(`[${CONTEXT}] Creating new product with details: ${JSON.stringify(productDetails)}`)
    if (productDetails.quantity <= productDetails.thresholdLimit) {
      productDetails.restockRecommended = true
    }
    const product = await this.ProductRepository.createProduct(productDetails)
    logger.info(`[${CONTEXT}] Product created successfully: ${product._id}`)
    return product
  }

  async getProduct(identifier) {
    logger.info(`[${CONTEXT}] Fetching product with identifier: ${JSON.stringify(identifier)}`)
    let product
    if (identifier.productId) {
      product = await this.ProductRepository.getProductById(identifier.productId)
    } else if (identifier.sku) {
      product = await this.ProductRepository.getProductBySku(identifier.sku)
    }

    if (!product) {
      logger.warn(`[${CONTEXT}] Product not found with identifier: ${JSON.stringify(identifier)}`)
      throw new NotFoundError('Product not found')
    }

    logger.info(`[${CONTEXT}] Fetched product successfully: ${product._id}`)
    return product
  }

  async getAllProducts() {
    logger.info(`[${CONTEXT}] Fetching all products`)
    const products = await this.ProductRepository.getAllProducts()
    logger.info(`[${CONTEXT}] Fetched all products successfully. Count: ${products.length}`)
    return products
  }

  async updateProduct(productId, productDetails) {
    logger.info(`[${CONTEXT}] Updating product: ${productId}`)
    const product = await this.ProductRepository.getProductById(productId)
    if (!product) {
      throw new NotFoundError('Product not found')
    }

    const newQuantity = productDetails.quantity !== undefined ? productDetails.quantity : product.quantity
    const newThreshold = productDetails.thresholdLimit !== undefined ? productDetails.thresholdLimit : product.thresholdLimit

    if (newQuantity <= newThreshold) {
      productDetails.restockRecommended = true
    } else {
      productDetails.restockRecommended = false
    }

    const updatedProduct = await this.ProductRepository.updateProduct(productId, productDetails)
    logger.info(`[${CONTEXT}] Product updated successfully: ${productId}`)
    return updatedProduct
  }

  async deleteProduct(productId) {
    logger.info(`[${CONTEXT}] Deleting product: ${productId}`)
    const deletedProduct = await this.ProductRepository.deleteProduct(productId)
    if (!deletedProduct) {
      throw new NotFoundError('Product not found')
    }
    logger.info(`[${CONTEXT}] Product deleted successfully: ${productId}`)
    return deletedProduct
  }

  async getProductsByCategory(category) {
    logger.info(`[${CONTEXT}] Fetching products by category: ${category}`)
    const products = await this.ProductRepository.getProductsByCategory(category)
    logger.info(`[${CONTEXT}] Fetched products for category ${category} successfully. Count: ${products.length}`)
    return products
  }

  async getProductsBySupplier(supplierId) {
    logger.info(`[${CONTEXT}] Fetching products by supplier: ${supplierId}`)
    const products = await this.ProductRepository.getProductsBySupplier(supplierId)
    logger.info(`[${CONTEXT}] Fetched products for supplier ${supplierId} successfully. Count: ${products.length}`)
    return products
  }

  async getProductsNeedingRestock() {
    logger.info(`[${CONTEXT}] Fetching products needing restock`)
    const products = await this.ProductRepository.getProductsNeedingRestock()
    logger.info(`[${CONTEXT}] Fetched products needing restock successfully. Count: ${products.length}`)
    return products
  }

  async getExpiringProducts(daysUntilExpiry) {
    logger.info(`[${CONTEXT}] Fetching products expiring within ${daysUntilExpiry} days`)
    const products = await this.ProductRepository.getExpiringProducts(daysUntilExpiry)
    logger.info(`[${CONTEXT}] Fetched expiring products successfully. Count: ${products.length}`)
    return products
  }

  async getExpiredProducts() {
    logger.info(`[${CONTEXT}] Fetching expired products`)
    const products = await this.ProductRepository.getExpiredProducts()
    logger.info(`[${CONTEXT}] Fetched expired products successfully. Count: ${products.length}`)
    return products
  }

  async getProductsNearLocation(coordinates, maxDistanceInMeters) {
    logger.info(`[${CONTEXT}] Fetching products near location: ${coordinates}`)
    const products = await this.ProductRepository.getProductsNearLocation(coordinates, maxDistanceInMeters)
    logger.info(`[${CONTEXT}] Fetched products near location successfully. Count: ${products.length}`)
    return products
  }

  async getLowStockProducts() {
    logger.info(`[${CONTEXT}] Fetching low stock products`)
    const products = await this.ProductRepository.getLowStockProducts()
    logger.info(`[${CONTEXT}] Fetched low stock products successfully. Count: ${products.length}`)
    return products
  }
}

module.exports = ProductService
