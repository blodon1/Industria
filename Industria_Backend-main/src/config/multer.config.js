const multer = require('multer');
const path =require('path');
//Format Storage
const storage = multer.diskStorage({
  destination: (req,file,cb)=>{
    cb(null,path.join( __dirname,'..','public','uploads'));
  },
  filename: (req,file,cb)=>{
    cb(null,+ Date.now()+'_'+file.originalname);//+'-'+ Date.now() 
  }
});

const loadFile = multer({
  storage : storage
}); //<--nombre del imput imagen


module.exports = {

  loadFile
};