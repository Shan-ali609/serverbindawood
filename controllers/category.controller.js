import CategoryModel from "../models/category.model.js";
import ProductModel from "../models/product.model.js";
import SubCategoryModel from "../models/subcategory.model.js";


export async function addCategoryController(request , response) {
    try {
        const {name , image} = request.body

        if (!image && !name) {
            return response.status(400).json({
                message : "Plesae provide the required fields",
                error : true,
                success : false
            })
        }

        const addcategory = new CategoryModel({
            name ,
            image
        })
      
        const savecategory =  await addcategory.save()

        if (!savecategory) {
            return response.status(500).json({
                message : "Not Created",
                error : true,
                success : false
            })
        }
        
        return response.json({
            message: "Add category",
            success : true,
            error : false
        })
    } catch (error) {
        return response.status(500).json({
            message : error.mesage || error,
            success : false,
            error : true
        })
    }
}


export async function getCategoryController(request , response) {
      try {
        const data = await CategoryModel.find().sort({ createdAt : -1 })
        return response.status(200).json({
            data : data,
            error : false,
            success : true
        })
      } catch (error) {
         return response.status(500).json({
            mesage : error.message || error,
            error : true,
            success : false
         })        
      }
}


export async function updateCategoryControlller(request , response) {

    try {

        const { _id , name , image} = request.body
        

        const updatecategory = await CategoryModel.updateOne({
            _id : _id
        },{
            name ,
            image
        })

        return response.status(200).json({
            message : "Category updated Successfully",
            data : updatecategory,
            error : false,
            success : true
        })
        
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
    
}

export async function DeleteCategory(request , response) {
    
    try {
         const { _id } = request.body
 
         const checkSubCategory = await SubCategoryModel.find({
            Category : {
                "$in" : [ _id ]
            }
         }).countDocuments()

         const checkProduct = await ProductModel.find({
            Category : {
                "$in" : [ _id ]
            }
         }).countDocuments()

         if (checkSubCategory > 0 || checkProduct > 0 ) {
            return response.status(400).json({
                message : "Category is already in use not deleted",
                error: true,
                success : false
            })
         }

         const deleteCategory = await CategoryModel.deleteOne({ _id : _id })
    
     return response.status(200).json({
        message : " Category Delete Successfully",
        data : deleteCategory,
        success : true,
        error : false
     })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}