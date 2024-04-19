const {v4:uuid}=require('uuid');
const multer=require('multer');

const storageAttr = multer.diskStorage({
    destination: function (req, file, cb) {
      if (file.mimetype.toLowerCase().includes('audio')) {
        console.log(`${process.cwd()}/upload/audio`)
        cb(null,  `${process.cwd()}/upload/audio`)
      } else if (file.mimetype.toLowerCase().includes('image')){
        cb(null, `${process.cwd()}/upload/image`)
      } else {
        console.log(file.mimetype)
        cb({ error: 'Mime type not supported' })
      }
    },
    filename: function (req, file, cb) {
        const fileArray=file.originalname.toLowerCase().split('.');
        const extension=fileArray[fileArray.length-1];  
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uuid().toString() + '-' + uniqueSuffix+'.'+ extension)
    }
  })

  const upload=multer({storage:storageAttr});
  module.exports={upload};