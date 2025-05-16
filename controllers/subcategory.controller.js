import SubCategoryModel from "../models/subcategory.model.js";


export async function addSubCategory (request, response){
       try {
        const { name , image , Category} = request.body
        if (!name && !image && !Category[0]) {
            return response.status(400).json({
                message : "Please provide name ,image , category",
                error: true,
                success : false
            })
        }

        const payload = {
            name,
            image,
            Category
        }

        const addsubcateory = new SubCategoryModel(payload)
        const save = await addsubcateory.save()

        return response.status(200).json({
            message : "SubCategory created Successfully",
            data : save,
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


export async function getSubCategoryController(request , response) {
    try {
           const data  = await SubCategoryModel.find().sort({createdAt : -1}).populate('Category', 'name')
           
           return response.json({
            message : "Sub Category Data",
            data : data,
            success : true,
            error : false
           })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            success : false,
            error : true
        })
    }
}

export async function editSubCategoryController(request , response) {
    try {
          const {_id , name , image , Category} = request.body

          const chksub = await SubCategoryModel.findById(_id)

          if (!chksub) {
            return response.status(400).json({
                message : " Check your Subcategory_id",
                error : true,
                success : false
            })
          }


          const updateSubcate = await SubCategoryModel.findByIdAndUpdate(_id,{
            name,
            image,
            Category
          })
          
       return response.json({
        message : 'Updated Successfully',
        data : updateSubcate,
        success : true,
        error : false
       })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            success : false,
            error : true
        })
    }
}

export async function delSubcategory(request , response) {
    try {
        const { _id } = request.body

        const delsubcategory = await SubCategoryModel.findByIdAndDelete(_id)

        return response.json({
            message : "Deleted Successfully",
            data : delsubcategory,
            error : false,
            success : true 
        })
        
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            success : false,
            error : true
        })
    }
}