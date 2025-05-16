import ProductModel from "../models/product.model.js";


export const createProductController = async(request,response)=>{

    try {
        
    const {
        name ,
        image ,
        category ,
        subCategory ,
        unit ,
        stock ,
        price ,
        discount ,
        description ,
        more_details ,
    }=request.body

    if (!name || !image[0] || !category[0] || !subCategory[0] || !unit || !price || !description ) {
        return response.status(400).json({
            message : "Enter the required fields",
            error : true,
            success : false
        })
    }

   const Product = new ProductModel({
    name ,
    image ,
    category ,
    subCategory ,
    unit ,
    stock ,
    price ,
    discount ,
    description ,
    more_details ,
   })

   const saveproduct = await Product.save()

   return response.status(200).json({
    message : "Product Added successfully",
    data : saveproduct,
    error : false,
    success : true
   })

}
 catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
}
}


export const getProductController = async (request, response) => {
    try {
      let { page, limit, search } = request.body;
  
      // Set default values if not provided
      page = page || 1;
      limit = limit || 10;
  
      const query = search
        ? {
            $text: {
              $search: search,
            },
          }
        : {};
  
      const skip = (page - 1) * limit;
  
      const [data, totalcount] = await Promise.all([
        ProductModel.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        ProductModel.countDocuments(query),
      ]);
  
      return response.status(200).json({
        message: "Data Processed Successfully",
        error: false,
        success: true,
        totalcount,
        totalNoPage: Math.ceil(totalcount / limit),
        data,
      });
    } catch (error) {
      return response.status(500).json({
        message: error.message || error,
        error: true,
        success: false,
      });
    }
  };
  

export const getCategorywiseproduct = async (request, response) => {
  
  try {

    const { id } = request.body;

    if (!id) {
      return response.status(400).json({
        message: "Category ID is required",
        error: true,
        success: false,
      });
    }

    const product = await ProductModel.find({ 
      category : {$in : id} 
    }).limit(6);

    return response.status(200).json({
      message: "Categorywise product fetched successfully",
      data : product,
      error: false,
      success: true
     
    });
    
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
    
  }



}



export const getProductByCategoryAndSubCategory  = async(request,response)=>{
    try {
        const { category,subCategory,page,limit } = request.body



        if(!category || !subCategory){
            return response.status(400).json({
                message : "Provide categoryId and subCategoryId",
                error : true,
                success : false
            })
        }

        if(!page){
            page = 1
        }

        if(!limit){
            limit = 10
        }

        const query = {
            category : { $in :category  },
            subCategory : { $in : subCategory }
        }

        const skip = (page - 1) * limit

        const [data,dataCount] = await Promise.all([
            ProductModel.find(query).sort({createdAt : -1 }).skip(skip).limit(limit),
            ProductModel.countDocuments(query)
        ])

        return response.json({
            message : "Product list",
            data : data,
            totalCount : dataCount,
            page : page,
            limit : limit,
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


export const getProductDetails = async(request,response)=>{
    try {
        const { productId } = request.body 

        const product = await ProductModel.findOne({ _id : productId })


        return response.json({
            message : "product details",
            data : product,
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