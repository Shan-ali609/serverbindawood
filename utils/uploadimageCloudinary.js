import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config()


cloudinary.config({ 
    cloud_name: process.env.CLODINARY_CLOUD_NAME, 
    api_key: process.env.CLODINARY_API_KEY, 
    api_secret: process.env.CLODINARY_SECRET_KEY   // Click 'View API Keys' above to copy your API secret
});

const uploadImageClodinary = async (image) => {
  const buffer = image?.buffer || Buffer.from(await image.arrayBuffer());  // Convert to buffer if necessary.

  const uploadImage = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream( { folder: 'Blankkit'},(error, uploadResult) => {
       return resolve(uploadResult);
      }
    ).end(buffer);  // End the stream with the buffer (image data).
  });

  return uploadImage;
};


export default uploadImageClodinary

