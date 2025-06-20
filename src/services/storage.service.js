const logger = require('../utils/logger')
const { NotFoundError, BadRequestError } = require('../errors/client.error')
const { InventoryRepository } = require('../repositories')

const CONTEXT = 'StorageService'

class StorageService {
  constructor(StorageRepository, ProductRepository) {
    this.StorageRepository = StorageRepository
    this.ProductRepository = ProductRepository
  }

  async createStorageLocation(storageDetails) {
    logger.info(`[${CONTEXT}] Creating new storage location with details: ${JSON.stringify(storageDetails)}`)
    const { length, width, height } = storageDetails.dimensions
    storageDetails.Volume = length * width * height
    
    const storage = await this.StorageRepository.createStorageLocation(storageDetails)
    if (storageDetails.inventory) {
      const inventoryRepo = new InventoryRepository()
      await inventoryRepo.addStorageToInventory(storageDetails.inventory, storage._id)
    }
    
    logger.info(`[${CONTEXT}] Storage location created successfully: ${storage._id}`)
    return storage
  }

  async getStorage(identifier) {
    logger.info(`[${CONTEXT}] Fetching storage with identifier: ${JSON.stringify(identifier)}`)
    let storage
    if (identifier.storageId) {
      storage = await this.StorageRepository.getStorageById(identifier.storageId)
    } else if (identifier.locationId) {
      storage = await this.StorageRepository.getStorageByLocationId(identifier.locationId)
    }

    if (!storage) {
      logger.warn(`[${CONTEXT}] Storage not found with identifier: ${JSON.stringify(identifier)}`)
      throw new NotFoundError('Storage location not found')
    }

    logger.info(`[${CONTEXT}] Fetched storage successfully: ${storage._id}`)
    return storage
  }

  async getAllStorages() {
    logger.info(`[${CONTEXT}] Fetching all storage locations`)
    const storages = await this.StorageRepository.getAllStorages()
    logger.info(`[${CONTEXT}] Fetched all storage locations successfully. Count: ${storages.length}`)
    return storages
  }

  async updateStorage(storageId, storageDetails) {
    logger.info(`[${CONTEXT}] Updating storage location: ${storageId}`)
    if (storageDetails.dimensions) {
        const { length, width, height } = storageDetails.dimensions
        storageDetails.Volume = length * width * height
    }
    const updatedStorage = await this.StorageRepository.updateStorage(storageId, storageDetails)
    if (!updatedStorage) {
      throw new NotFoundError('Storage location not found')
    }
    logger.info(`[${CONTEXT}] Storage location updated successfully: ${storageId}`)
    return updatedStorage
  }

  async deleteStorage(storageId) {
    logger.info(`[${CONTEXT}] Deleting storage location: ${storageId}`)
    const storage = await this.StorageRepository.getStorageById(storageId)
    if (!storage) {
        throw new NotFoundError('Storage location not found')
    }
    if (storage.products.length > 0) {
        throw new BadRequestError('Cannot delete storage location with products inside.')
    }
    const deletedStorage = await this.StorageRepository.deleteStorage(storageId)
    logger.info(`[${CONTEXT}] Storage location deleted successfully: ${storageId}`)
    return deletedStorage
  }

  async addProductToStorage(storageId, productId, quantity = 1, inventoryId = null) {
    logger.info(`[${CONTEXT}] Adding ${quantity} pieces of product ${productId} to storage ${storageId}`)
    const product = await this.ProductRepository.getProductById(productId)
    if (!product) {
      throw new NotFoundError('Product not found')
    }

    const storage = await this.StorageRepository.getStorageById(storageId)
    if (!storage) {
      throw new NotFoundError('Storage location not found')
    }

    const productVolume = ((product.dimensions?.length * product.dimensions?.width * product.dimensions?.height) || 0) * quantity
    const productWeight = (product.weight || 0) * quantity
    const productCost = (product.price || 0) * quantity

    if (storage.capacityOccupied + productWeight > storage.holdingCapacity) {
      throw new BadRequestError(`Product weight (${productWeight}) exceeds available storage capacity (${storage.holdingCapacity - storage.capacityOccupied})`)
    }
    if (storage.VolumeOccupied + productVolume > storage.Volume) {
      throw new BadRequestError(`Product volume (${productVolume}) exceeds available storage volume (${storage.Volume - storage.VolumeOccupied})`)
    }

    if (product.quantity < quantity) {
      throw new BadRequestError(`Insufficient stock. Available: ${product.quantity}, Requested: ${quantity}`)
    }

    const targetInventoryId = inventoryId || storage.inventory
    if (!targetInventoryId) {
      throw new BadRequestError('No inventory specified for this storage location')
    }

    if (!inventoryId) {
      const inventoryRepo = new InventoryRepository()
      
      const inventory = await inventoryRepo.getInventoryById(targetInventoryId)
      if (!inventory) {
        throw new NotFoundError('Inventory not found')
      }

      if (inventory.capacityOccupied + productWeight > inventory.totalCapacity) {
        throw new BadRequestError('Product weight exceeds inventory capacity - too heavy!')
      }
      if (inventory.volumeOccupied + productVolume > inventory.totalVolume) {
        throw new BadRequestError('Product volume exceeds inventory capacity - too big!')
      }

      await inventoryRepo.addProductToInventory(targetInventoryId, productId, quantity)
      await inventoryRepo.updateInventory(targetInventoryId, { 
        $inc: { 
          capacityOccupied: productWeight,
          volumeOccupied: productVolume,
          costPrice: productCost
        } 
      })
    }

    const updatedStorage = await this.StorageRepository.addProductToStorage(storageId, productId, quantity)

    await this.StorageRepository.updateStorage(storageId, {
      $inc: { 
        capacityOccupied: productWeight,
        VolumeOccupied: productVolume,
        totalCost: productCost
      }
    })

    await this.ProductRepository.updateProduct(productId, { 
      $inc: { quantity: -quantity },
      storage: storageId 
    })

    logger.info(`[${CONTEXT}] Product ${productId} (${quantity} pieces) added to storage ${storageId} successfully. Cost: ${productCost}`)
    return updatedStorage
  }

  async removeProductFromStorage(storageId, productId, quantity = 1, inventoryId = null) {
    logger.info(`[${CONTEXT}] Removing ${quantity} pieces of product ${productId} from storage ${storageId}`)
    const product = await this.ProductRepository.getProductById(productId)
    if (!product) {
      throw new NotFoundError('Product not found')
    }

    const storage = await this.StorageRepository.getStorageById(storageId)
    if (!storage) {
      throw new NotFoundError('Storage location not found')
    }

    const productVolume = ((product.dimensions?.length * product.dimensions?.width * product.dimensions?.height) || 0) * quantity
    const productWeight = (product.weight || 0) * quantity
    const productCost = (product.price || 0) * quantity

    const targetInventoryId = inventoryId || storage.inventory
    if (targetInventoryId) {
      const inventoryRepo = new InventoryRepository()
      await inventoryRepo.removeProductFromInventory(targetInventoryId, productId, quantity)
      await inventoryRepo.updateInventory(targetInventoryId, { 
        $inc: { 
          capacityOccupied: -productWeight,
          volumeOccupied: -productVolume,
          costPrice: -productCost
        } 
      })
    }

    const updatedStorage = await this.StorageRepository.removeProductFromStorage(storageId, productId, quantity)

    await this.StorageRepository.updateStorage(storageId, {
      $inc: { 
        capacityOccupied: -productWeight,
        VolumeOccupied: -productVolume,
        totalCost: -productCost
      }
    })

    await this.ProductRepository.updateProduct(productId, { 
      $inc: { quantity: quantity },
      $unset: { storage: "" }
    })

    logger.info(`[${CONTEXT}] Product ${productId} (${quantity} pieces) removed from storage ${storageId} successfully. Cost deducted: ${productCost}`)
    return updatedStorage
  }

  async getStorageUtilization(storageId) {
    logger.info(`[${CONTEXT}] Calculating storage utilization for storage: ${storageId}`)
    const result = await this.StorageRepository.getStorageUtilization(storageId)
    logger.info(`[${CONTEXT}] Storage utilization calculated successfully for: ${storageId}`)
    return result
  }

  async getStorageCostSummary(storageId) {
    logger.info(`[${CONTEXT}] Calculating cost summary for storage: ${storageId}`)
    const storage = await this.StorageRepository.getStorageById(storageId)
    if (!storage) {
      throw new NotFoundError('Storage location not found')
    }

    const totalStorageValue = storage.totalCost || 0
    const capacityUtilization = ((storage.capacityOccupied || 0) / (storage.holdingCapacity || 1) * 100).toFixed(2) + '%'
    const volumeUtilization = ((storage.VolumeOccupied || 0) / (storage.Volume || 1) * 100).toFixed(2) + '%'

    const summary = {
      holdingCapacity: storage.holdingCapacity || 0,
      capacityUsed: storage.capacityOccupied || 0,
      totalVolume: storage.Volume || 0,
      volumeUsed: storage.VolumeOccupied || 0,
      totalValue: totalStorageValue
    }

    const result = {
      totalStorageValue,
      capacityUtilization,
      volumeUtilization,
      summary
    }

    logger.info(`[${CONTEXT}] Storage cost summary calculated successfully for: ${storageId}`)
    return result
  }
}

module.exports = StorageService
