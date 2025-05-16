import { Router } from "express";
import auth from "../middleware/auth.js";
import { addSubCategory, delSubcategory, editSubCategoryController, getSubCategoryController } from "../controllers/subcategory.controller.js";
const subcategoryRouter = Router()

subcategoryRouter.post("/add-subcategory",auth,addSubCategory)
subcategoryRouter.get("/get-subcategorydata",getSubCategoryController)
subcategoryRouter.put("/update-subCategory",auth,editSubCategoryController)
subcategoryRouter.delete("/delete-subCategory",auth,delSubcategory)



export default subcategoryRouter
