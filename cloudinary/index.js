((cloudinary, {CloudinaryStorage})=>{

    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_KEY,
        api_secret: process.env.CLOUDINARY_SECRET
    });
    const storage = new CloudinaryStorage({
        cloudinary, folder:'LBCamp',
        allowedFormats: ['jpeg', 'png', 'gif', 'jpg']
    });

    module.exports ={
        cloudinary, storage
    }

})(
    require('cloudinary').v2,
    require('multer-storage-cloudinary')
)