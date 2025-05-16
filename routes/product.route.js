import { Router } from 'express'
import auth from '../middleware/auth.js'
import { createProductController, getCategorywiseproduct, getProductByCategoryAndSubCategory, getProductController, getProductDetails } from '../controllers/product.controller.js'

const productRouter  = Router()

productRouter.post("/create",auth,createProductController)
productRouter.post("/get",getProductController)
productRouter.post("/categorywise-product",getCategorywiseproduct)
productRouter.post("/categoryandsubCategorywise-product",getProductByCategoryAndSubCategory)
productRouter.post("/get-product-details",getProductDetails)

export default productRouter