const { StatusCodes } = require('http-status-codes')
const { ProductService } = require('../services')
const { ProductRepository } = require('../repositories')
const logger = require('../utils/logger')
const ApiResponse = require('../dto/response.dto')

const CONTEXT = 'ProductController'

const productService = new ProductService(new ProductRepository())

const createProduct = async (req, res) => {
  logger.info(`[${CONTEXT}] Creating new product with data: ${JSON.stringify(req.body)}`)
  const product = await productService.createProduct(req.body)
  res.status(StatusCodes.CREATED).json(ApiResponse.success('Product created successfully', { product }))
  logger.info(`[${CONTEXT}] Product created successfully: ${product._id}`)
}

const getProduct = async (req, res) => {
  logger.info(`[${CONTEXT}] Fetching product with ID: ${req.params.id}`)
  const product = await productService.getProduct({ productId: req.params.id })
  res.status(StatusCodes.OK).json(ApiResponse.success('Product fetched successfully', { product }))
  logger.info(`[${CONTEXT}] Product fetched successfully: ${product._id}`)
}

const getAllProducts = async (req, res) => {
  logger.info(`[${CONTEXT}] Fetching all products`)
  const products = await productService.getAllProducts()
  res.status(StatusCodes.OK).json(ApiResponse.success('All products fetched successfully', { length: products.length, products }))
  logger.info(`[${CONTEXT}] All products fetched successfully. Total: ${products.length}`)
}

const updateProduct = async (req, res) => {
  logger.info(`[${CONTEXT}] Updating product ID: ${req.params.id} with data: ${JSON.stringify(req.body)}`)
  const updatedProduct = await productService.updateProduct(req.params.id, req.body)
  res.status(StatusCodes.OK).json(ApiResponse.success('Product updated successfully', { product: updatedProduct }))
  logger.info(`[${CONTEXT}] Product updated successfully: ${updatedProduct._id}`)
}

const deleteProduct = async (req, res) => {
  logger.info(`[${CONTEXT}] Deleting product ID: ${req.params.id}`)
  const deletedProduct = await productService.deleteProduct(req.params.id)
  res.status(StatusCodes.OK).json(ApiResponse.success('Product deleted successfully', { product: deletedProduct }))
  logger.info(`[${CONTEXT}] Product deleted successfully: ${deletedProduct._id}`)
}

const getProductsByCategory = async (req, res) => {
    logger.info(`[${CONTEXT}] Fetching products for category: ${req.params.category}`)
    const products = await productService.getProductsByCategory(req.params.category)
    res.status(StatusCodes.OK).json(ApiResponse.success('Products fetched successfully', { products }))
    logger.info(`[${CONTEXT}] Products fetched for category ${req.params.category}. Count: ${products.length}`)
}

const getProductsBySupplier = async (req, res) => {
    logger.info(`[${CONTEXT}] Fetching products for supplier: ${req.params.supplierId}`)
    const products = await productService.getProductsBySupplier(req.params.supplierId)
    res.status(StatusCodes.OK).json(ApiResponse.success('Products fetched successfully', { products }))
    logger.info(`[${CONTEXT}] Products fetched for supplier ${req.params.supplierId}. Count: ${products.length}`)
}

const getProductsNeedingRestock = async (req, res) => {
    logger.info(`[${CONTEXT}] Fetching products that need restock`)
    const products = await productService.getProductsNeedingRestock()
    res.status(StatusCodes.OK).json(ApiResponse.success('Products needing restock fetched successfully', { products }))
    logger.info(`[${CONTEXT}] Products needing restock fetched. Count: ${products.length}`)
}

module.exports = {
  createProduct,
  getProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  getProductsBySupplier,
  getProductsNeedingRestock
}
