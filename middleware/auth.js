import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()
const auth = async (request, response , next)=>{
    try {
        const token = request.cookies.accesstoken || request?.headers?.authorization?.split(" ")[1]

          if (!token) {
            return response.status(401).json({
                message: 'provide token',
                error: true,
                success: false
            })
          }

          const decode = await  jwt.verify(token,process.env.SECRET_KEY_ACCESS_TOKEN)
          if (!decode) {
            return response.status(401).json({
                message: 'unAuthorized access',
                error: true,
                success: false
            })
          }

          request.userid = decode.id 

            //    console.log("token :", request.userid);
        next();

              
    } catch (error) {
        return response.status(400).json({
            message: " unAuthorized access user ",
            error: true,
            success: false
        })
    }
}


export default auth
