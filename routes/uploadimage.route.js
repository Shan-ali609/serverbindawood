import { Router } from 'express'
import auth from '../middleware/auth.js'
import { uploadCategoryImage } from '../controllers/uploadimage.controller.js'
import upload from '../middleware/multer.js'


const uploadRouterImage = Router()

uploadRouterImage.post("/uploadimage",auth,upload.single("image"),uploadCategoryImage )


export default uploadRouterImage