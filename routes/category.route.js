import { Router } from 'express'
import auth from '../middleware/auth.js'
import { addCategoryController, DeleteCategory, getCategoryController, updateCategoryControlller } from '../controllers/category.controller.js'

const categoryRouter  = Router()

categoryRouter.post("/add-category",auth,addCategoryController)
categoryRouter.get("/get-category-data",getCategoryController)
categoryRouter.put("/update-category",auth,updateCategoryControlller)
categoryRouter.delete("/delete-category",auth,DeleteCategory)



export default categoryRouter