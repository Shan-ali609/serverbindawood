import uploadImageClodinary from "../utils/uploadimageCloudinary.js"

export async function uploadCategoryImage(request , response) {

    try {
         const file = request.file
         const uploadimage = await uploadImageClodinary(file)

         return response.status(200).json({
            message : 'Upload image',
            data : uploadimage,
            success : true,
            error : false
         })
          
    } catch (error) {
        return response.status(500).json({
            message : error.message,
            success : false,
            error : true
        })
    }
    
}