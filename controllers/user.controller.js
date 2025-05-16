import UserModel from "../models/user.model.js";
import bcryptjs from 'bcryptjs'
import sendEmail from "../config/sendEmail.js";
import verifyEmailTemplate from "../utils/verifyEmailTemplate.js";
import dotenv from 'dotenv'
import generatedAccessToken from "../utils/generatedAccessToken.js";
import generatedRefreshToken from "../utils/generatedRefreshToken.js";
import uploadImageClodinary from "../utils/uploadimageCloudinary.js";
import generatedOtp from '../utils/generatedOtp.js'
import forgotPasswordTemplate from "../utils/forgotPasswordTemplate.js";
import jwt from 'jsonwebtoken'
dotenv.config();
export async function registerUserController(request,response) {
    
   try {
       
    const {name , email , password } = request.body

    if (!name || !email || !password) {
        return response.status(400).json({message: "Please provide the required fields",
            error : true,
            success : false  
        })
    }

    const user = await UserModel.findOne({ email });
    if (user) {
        return response.json({message: "Email already taken",
            error: true,
            success: false 
        })
    }

    const salt = await bcryptjs.genSalt(10)
    const hashpassword = await bcryptjs.hash(password,salt)

    const payload = {
        name,
        email,
        password : hashpassword
    }
    
    const newUser = new UserModel(payload)
    const save = await newUser.save();
    
    const verifyEmailUrl= `${process.env.FRONTEND_URL}/verify-email?code=${save?._id}`

     const verifyEmail = await sendEmail({
            sendTo : email,
            subject : "Verify email from Shan jutt ",
            html : verifyEmailTemplate({
                name,
                url: verifyEmailUrl
            })
     })

      return response.json({
        message : " User created successfully",
        error: false,
        success: true,
        data : save
      })
    
    
   } catch (error) {
     return response.status(500).json({
        message: error.message || error,
        error: true,
        success : false
     })
   }
}

export async function verifyEmailController(request , response){

    const { code } = request.body

    const user = await UserModel.findOne({_id : code})

    if (!user) {
        return response.status(400).json({
            message: "Invalid Code",
            error:true,
            success: false
        })
    }



    const updateUser = await UserModel.findOne({_id : code},{
        verify_email : true
    })

    return response.json({
        message: "email verification done",
        error: false,
        success: true
    })
}


export async function loginController(request,response) {
    try {
        const { email , password } = request.body
         

            if (!email || !password) {
                return response.status(200).json({
                    message:"provide email and password",
                    error: true,
                    success: false
                })
            }


       const user = await UserModel.findOne({email})

       if (!user) {
         return response.status(400).json({
            message : " User not registered",
            error: true,
            success: false 
          })
       }

       if (user.status !== "Active") {
        return response.status(400).json({
            message: "contact to admin",
            error: true,
            success: false
        })
       }
     
       const checkPassword = await bcryptjs.compare(password,user.password)

       if (!checkPassword) {
        return response.status(400).json({
            message: " check your password",
            error: true,
            success: false
        })
       }



       const accesstoken = await generatedAccessToken(user._id)
       const refreshtoken = await generatedRefreshToken(user._id)
        const cookieoption={
            httpOnly : true,
            secure : true,
            sameSite : 'None'
        }
       response.cookie('accesstoken',accesstoken,cookieoption)
       response.cookie('refreshtoken',refreshtoken,cookieoption)

       return response.json({
        message : "loginsuccessfully",
        error: false,
        success: true,
        data : {
            accesstoken,
            refreshtoken
        }
       })
    } catch (error) {
       return response.status(400).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export async function fetchUserDetails(request, response) {
     try {
        const userid = request.userid
        console.log("user id",userid );

        const user = await UserModel.findById(userid).select('-password -refresh_token')

      return response.status(200).json({
        message: 'User Details',
        data : user,
        success : true,
        error : false
      })

        
     } catch (error) {
        return response.status(500).json({
          message: error.message || error,
          success: false,
          error : true
        })
     }
}


export async function logoutcontroller(request , response) {
    try {

      //  access userid from middleware to empty refreshtoken
         const userid  = request.userid

         const removerefreshtoken = await UserModel.findByIdAndUpdate(userid,{
            refresh_token : ' '
         })
        const cookieoption={
            httpOnly : true,
            secure : true,
            sameSite : 'None'
        }

        response.clearCookie("accesstoken",cookieoption)
        response.clearCookie("refreshtoken",cookieoption)
    
        

        return response.status(200).json({
            message: " logout successfullly",
            error: false,
            success: true
        })

        
    } catch (error) {
        return response.status(500).json({
            message : message.error || error,
            error: true,
            success : false
        })
    }
}

export async function uploadAvatar(request, response) {
    try {

        const userId = request.userid //this userid come from auth

      const image = request.file; //this come from malter
  
      
      if (!image) {
        return response.status(400).json({
          message: "No image file provided",
          error: true,
          success: false
        });
      }
        
      const upload = await uploadImageClodinary(image);
  
      const updateuser = await UserModel.findByIdAndUpdate(userId,
        {
        avatar: upload.url
      })
     
      
     
      return response.json({
        message: "Profile uploaded successfully",
        data: {
            _id : userId,
            avatar: upload.url
        }
      });
  
    } catch (error) {
      // console.log("Error in uploadAvatar:", error);
      
      return response.status(500).json({
        message: error.message || error,
        error: true,
        success: false
      });
    }
  }

  
export async function updateUserdetail(request, response) {
      try {
        const userId = request.userid 
         console.log(userId);

        const {name, email , number , password} = request.body
        console.log(request.body);

          let hashpassword = "";
        if(password){
            const salt = await bcryptjs.genSalt(10)
             hashpassword = await bcryptjs.hash(password,salt)
        }

         const updateUser = await UserModel.updateOne( {_id : userId } ,{
          //  this is bcz when user already provide and name email number or password to update it 
            ...(name && {name : name}),
            ...(email && {email : email}),
            ...(number && {number : number}),
            ...(password && {password : hashpassword}),
         })
      
          return response.json({
            message : "User details update successfully",
            error: false,
            success: true,
            data : updateUser
          })

      } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
      }
}


export async function forgotPasswordController(request, response) {
  try {
     
     const {email} = request.body

     const user = await UserModel.findOneAndUpdate({email})
     if (!user) {
      return response.status(400).json({
        message: ' user not register',
        error: true,
        success: false
      })
     }

   const otp = generatedOtp()
   const expireOpt = new Date()+ 60 * 60 * 60 + 1000   //1h

   const update = await UserModel.findByIdAndUpdate(user._id,{
    forgot_password_otp: otp,
    forgot_password_expiry : new Date(expireOpt).toISOString()
   })
   await sendEmail({
    sendTo: email,
    subject: " Forgot password Expiry",
    html: forgotPasswordTemplate({
      name: user.name,
      otp: otp
    })
  })
  
  return response.json({
    message : "check your email",
    error : false,
    success : true
})

  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    })
  }
}


export async function verifyForgotPasswordOtp(request, response) {
    try {

      const {email , otp} = request.body

      if (!email || !otp) {
        return response.status(400).json({
          message: " please provide the email , Otp",
          error: true,
          success: false
        })
      }
      const user = await UserModel.findOneAndUpdate({email})
      if (!user) {
       return response.status(400).json({
         message: ' Email not register',
         error: true,
         success: false
       })
      }

      const currentTime = new Date().toISOString()

      if (user.forgot_password_expiry < currentTime) {
        return response.status(500).json({
          message: "Otp expired ",
          error: true,
          success: false
        })
      }
         
      if ( otp !== user.forgot_password_otp) {
            return response.status(400).json({
              message: " Invalid Otp",
              error: true,
              success: false
            })
      }
      const updateUser = await UserModel.findByIdAndUpdate(
        user._id,
        {
          forgot_password_otp: "",  // Empty the OTP field
          forgot_password_expiry: ""  // Empty the expiry field
        },
        { new: true }  // This returns the updated user document after the update
      );
      return response.status(200).json({
        message:"verify otp successfully",
        error: false,
        success: true
      })
    } catch (error) {
      return response.status(500).json({
        message: error.message || error,
        error: true,
        success: false
      })
    }
}


export async function resetPassword(request , response) {
    try {
      
      const {email, newPassword, confirmPassword} = request.body

        // console.log("Received email:", email);
        // console.log("Received password:", newPassword); 
        // console.log("Received confirmPassword:", confirmPassword);                                                      

      if (!email || !newPassword || !confirmPassword ) {
        return response.status(400).json({
          message: "provide the email Password and Confirm Passowrd",
          error: true ,
          success: false
        })
      }
      const user  =  await UserModel.findOne({email})

      if (!user) {
        return response.status(500).json({
          message: "Email is not availabel",
          error: true,
          success: false
        })
      }

      if (newPassword !== confirmPassword) {
        return response.status(400).json({
          message: "New Password and Confirm Password are not same",
          error: true,
          success: false
        })
      }
        const salt  =  await bcryptjs.genSalt(10)
        const hashpassword = await bcryptjs.hash(newPassword,salt)
      const update = await UserModel.findByIdAndUpdate(user._id,{
        password: hashpassword
      })

      return response.json({
        message: "password update successfully",
        error: false,
        success: true
      })

    } catch (error) {
      return response.status(500).json({
        message: error.message || error,
        error: true,
        success: false
      })
    }
}

export async function refreshToken(request , response) {
  try {
    const refreshToken = request.cookies.refreshtoken || request?.headers?.authorization?.split(" ")[1];

    if (!refreshToken) {
      return response.status(401).json({
          message: 'Invalid token',
          error: true,
          success: false
      });
    }

    const verifyToken = await jwt.verify(refreshToken,process.env.SECRET_KEY_REFRESH_TOKEN)

    if(!verifyToken){
        return response.status(401).json({
            message : "token is expired",
            error : true,
            success : false
        })
    }

    const userId = verifyToken?._id
    
    const newAccessToken = await generatedAccessToken(userId);
   
    const cookiesOption = {
        httpOnly : true,
        secure : true,
        sameSite : "None"
    }

    response.cookie('accesstoken',newAccessToken,cookiesOption)


    return response.json({
        message : "New Access token generated",
        error : false,
        success : true,
        data : {
          accesstoken : newAccessToken,
       
        }
    })


  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    });
  }
}

