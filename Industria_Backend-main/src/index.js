const express= require('express');
const bodyParser= require('body-parser');
const path = require('path');

//integracion backend - frontend
const cors = require('cors');



const app = express();


//MIDDLEWARE

//CORS-> INTEGRACION CON AGULAR
app.use(cors());

//INTERPRESTE DE JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));



//HTML-> TRATAR COMO PLANTILLA EJS
app.engine('html',require('ejs').renderFile);
app.set('view engine', 'ejs');

//VIEWS FOLDER->
app.set('views',path.join(__dirname,'views'));

//STATIC FOLDER
app.use(express.static(path.join(__dirname,'public')));

//ROUTES
app.use(require('./controller/router'));
    //MODIFICADA





//SETTINGS

const port = process.env.PORT || 3000;
app.listen(port,()=>{
    console.log(`Servidor iniciado\nPuerto: http://ec2-54-86-240-60.compute-1.amazonaws.com:${port}`);
});