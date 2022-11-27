const fs = require('fs')
const path = require('path')
const {pg} = require('../config/pg.config');

const {getToken,getTokenData} = require('../config/jwt.config')
const {getVerifyTemplate,sendEmailVerify} = require('../config/send.mail.config');


const newUser = async (req,res)=>{

    const {email,user} = req.body;

    const token = getToken(email);
    const template = getVerifyTemplate(user,token);
  console.log({email,user})
    sendEmailVerify(email,'Confirmar Cuenta',template);
    res.send({mensaje:'Usuario insertado',exito:1});

}

const verifyUser = async (req, res) => {
         //OPTENER TOKEN
         const {token} = req.params;
         //VERIFICAR DATA
         const data = getTokenData(token);

         if(!data){
            res.send({mensaje:'Error en data token'});
            console.log("Error en data token");
          }else{
            const email = data.data;

            res.send({mensaje:'verificado',email,exito:1});

          }
}

const updateImageUser = async (req, res,next) => {

  const usuarioId= req.params.id;

  const imagen = req.file;
  if(imagen){

  const img=  fs.readFileSync(path.join( __dirname,'..','public','uploads',imagen.filename));

  pg.connect((err, client, release) => {
  let query = 'INSERT INTO imagen(perfilImagen,contentType) VALUES ($1,$2) RETURNING id;';
  let values= [img,imagen.mimetype];
  
  client.query(query, values, (err, res) => {
    if (err) {
     // console.log(err.stack)
    } else {
      console.log(res.rows[0].id)

     release()
    }
  })
  res.send('ya wey')
 fs.unlinkSync((path.join( __dirname,'..','public','uploads',imagen.filename)));
  })
  
}
};


module.exports ={
    newUser,
    verifyUser,
    updateImageUser
}