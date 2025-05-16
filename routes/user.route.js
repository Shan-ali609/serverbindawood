import {Router} from 'express'
import { fetchUserDetails, forgotPasswordController, loginController, logoutcontroller, refreshToken, registerUserController, resetPassword, updateUserdetail, uploadAvatar, verifyEmailController, verifyForgotPasswordOtp } from '../controllers/user.controller.js'
import auth from '../middleware/auth.js';
import upload from '../middleware/multer.js';

const userRouter = Router()

userRouter.post('/register',registerUserController);
userRouter.post('/verify-email',verifyEmailController)
userRouter.post('/login',loginController)
userRouter.get('/logout',auth,logoutcontroller)
userRouter.get('/user-details',auth,fetchUserDetails)
userRouter.put('/profile-avatar',auth,upload.single('avatar'), uploadAvatar)
userRouter.put('/update-user',auth,updateUserdetail)
userRouter.post('/forgot-password-otp',forgotPasswordController)
userRouter.put('/verify-password-expiry-otp',verifyForgotPasswordOtp)
userRouter.post('/reset-password',resetPassword)
userRouter.post('/refresh-token',refreshToken)



export default userRouter