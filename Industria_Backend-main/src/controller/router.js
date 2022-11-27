const express = require('express');
const router = express.Router();
const multer = require("../config/multer.config");

//LICENCIA Y FUNCIONES DE INICIO
const inicio = require('../modules/m0_inicio');
router.get('/getAllPaises', inicio.getAllPaises);
router.post('/getToken', inicio.getTokenWeb);
//LICENCIA
router.get('/checkUserLicencia/:usuarioId', inicio.checkUserLicencia)
router.get('/payAndSave/:usuarioId', inicio.pagoLicencia);
router.get('/licencia/success/:token', inicio.success)
router.get('/licencia/cancel', inicio.cancel)
//test
router.get('/strip', inicio.test_pagoLicencia);

//MODULO 1 USUARIOS
const usuario = require('../modules/m1_usuarios');
router.post('/nuevoUsuario', usuario.nuevoUsuario);
router.get('/verificarUsuario/:token', usuario.verificarUsuario);
router.post('/actualizarImagenPerfil/:id', multer.loadFile.single('imagen'), usuario.actualizarImagenPerfil);
router.post('/inicioSesion', usuario.inicioSesion);
router.post('/solicitudNuevaContrasenia', usuario.solicitudNuevaContrasenia);
//POSIBLEMENTE CAMBIE A UN POST 
router.get('/nuevaContraseniaForm/:token', usuario.nuevaContraseniaForm);
//
router.post('/guardarNuevaContrasenia', usuario.guardarNuevaContrasenia)

router.get('/testToken', usuario.testToken);


//MODULO 1 ADMINISTRACION
const admin = require('../modules/m1_administracion');
router.get('/getDatosEmpresa/:usuarioId', admin.getDatosEmpresa);
router.post('/updateDatosEmpresa/:empresaId', admin.updateDatosEmpresa);
router.post('/actualizarImagenEmpresa/:empresaId', multer.loadFile.single('imagen'), admin.actualizarImagenEmpresa);
//
router.get('/getDepto/:deptoId', admin.getDepto);
router.get('/getAllDeptos/:empresaId', admin.getAllDeptos);
router.post('/createDepto/:empresaId', admin.createDepto);
router.post('/updateDepto/:deptoId', admin.updateDepto);
router.get('/deleteDepto/:deptoId', admin.deleteDepto);
//EMPLEADOS
router.post('/createEmpleado/:empresaId', admin.createEmpleado);
router.get('/getDatosEmpleado/:empleadoId', admin.getDatosEmpleado);
router.get('/getAllEmpleadosEmpresa/:empresaId', admin.getAllEmpleadosEmpresa);
router.get('/getAllEmpleadosDepto/:deptoId', admin.getAllEmpleadosDepto);
router.post('/updateDatosEmpleado/:empleadoId', admin.updateDatosEmpleado);
router.post('/actualizarImagenEmpleado/:empleadoId', multer.loadFile.single('imagenPerfilEmpleado'), admin.actualizarImagenEmpleado);
router.get('/deleteEmpleado/:empleadoId', admin.deleteEmpleado);
//ACCIONES EMPLEADO
router.get('/empleadoInOut/:empleadoId', admin.empleadoInOut);
router.get('/empleadoHorasLaboradas/:empresaId', admin.empleadoHorasLaboradas);
router.post('/addEmpleadoDepto', admin.addEmpleadoDepto);
router.post('/removeEmpleadoDepto', admin.removeEmpleadoDepto);

//MODULO 2 INVENTARIO
//CATEGORIAS DE PRODUCTO
const inv = require('../modules/m2_inventario');
router.post('/createCategoria/:empresaId', inv.createCategoria);
router.post('/updateCategoria/:categoriaId', inv.updateCategoria);
router.get('/deleteCategoria/:categoriaId', inv.deleteCategoria);
router.get('/getCategoria/:categoriaId', inv.getCategoria);
router.get('/getAllCategoria/:empresaId', inv.getAllCategoria);
//PRODUCTO
router.post('/createProducto/:empresaId', inv.createProducto);
router.post('/updateProducto/:productoId', inv.updateProducto);
router.get('/deleteProducto/:productoId', inv.deleteProducto);
router.get('/getProducto/:productoId', inv.getProducto);
router.get('/getAllProducto/:empresaId', inv.getAllProducto);
router.get('/getProductoCategoria/:categoriaId', inv.getProductoCategoria);

//MODULO 3 PROYECTOS
//PROYECTO
const proy = require('../modules/m3_proyectos')
router.post('/createProyecto/:empresaId', proy.createProyecto);
router.post('/updateProyecto/:proyectoId', proy.updateProyecto);
router.get('/deleteProyecto/:proyectoId', proy.deleteProyecto);
router.post('/estadoProyecto/:proyectoId', proy.estadoProyecto);
router.get('/getProyecto/:proyectoId', proy.getProyecto);
router.get('/getALLProyecto/:empresaId', proy.getALLProyecto);
//TAREAS PROYECTO
router.post('/createTareaProyecto/:proyectoId', proy.createTareaProyecto);
router.post('/updateTareaProyecto/:tareaId', proy.updateTareaProyecto);
router.get('/deleteTareaProyecto/:tareaId', proy.deleteTareaProyecto);
router.post('/estadoTareaProyecto/:tareaId', proy.estadoTareaProyecto);
router.get('/getTareaProyecto/:tareaId', proy.getTareaProyecto);
router.get('/getALLTareaProyecto/:proyectoId', proy.getALLTareaProyecto);
//EQUIPOS DE TRABAJO
router.post('/createTeamWork/:empresaId', proy.createTeamWork);
router.post('/updateTeamWork/:teamWorkId', proy.updateTeamWork);
router.get('/deleteTeamWork/:teamWorkId', proy.deleteTeamWork);
router.get('/getTeamWork/:teamWorkId', proy.getTeamWork);
router.get('/getALLTeamWork/:empresaId', proy.getALLTeamWork);
//ACCIONES
router.post('/addEmpleadoTW/:teamWorkId', proy.addEmpleadoTW);
router.post('/removeEmpleadoTW/:teamWorkId', proy.removeEmpleadoTW);
router.get('/getEmpleadoTW/:teamWorkId', proy.getEmpleadoTW);

router.post('/addTWProyecto/:proyectokId', proy.addTWProyecto);
router.post('/removeTWProyecto/:proyectokId', proy.removeTWProyecto);

//MODULO 4 GASTOS
//TIPO DE GASTO
const gasto = require('../modules/m4_gastos')
router.post('/createTipoGasto/:empresaId', gasto.createTipoGasto);
router.post('/updateTipoGasto/:tipoGastoId', gasto.updateTipoGasto);
router.get('/deleteTipoGasto/:tipoGastoId', gasto.deleteTipoGasto);
router.get('/getTipoGasto/:tipoGastoId', gasto.getTipoGasto);
router.get('/getALLTipoGasto/:empresaId', gasto.getALLTipoGasto);
//GATOS
router.post('/createGasto/:empresaId', gasto.createGasto);
router.post('/updateGasto/:gastoId', gasto.updateGasto);
router.post('/estadoGasto/:gastoId', gasto.estadoGasto);
router.get('/deleteGasto/:gastoId', gasto.deleteGasto);
router.get('/getGasto/:gastoId', gasto.getGasto);
router.get('/getALLGasto/:empresaId', gasto.getALLGasto);
//INFORME PDF
const infoPDF = require('../modules/m4_pdfmaker')
router.post('/createInforme/:empresaId', infoPDF.createInforme)
router.get('/deleteInforme/:informeId', infoPDF.deleteInforme);
router.get('/getInforme/:informeId', infoPDF.getInforme);
router.get('/getListInforme/:empresaId', infoPDF.getListInforme);
//TEST PDF
router.get('/bdpdf', infoPDF.test)


//MODULO 5 BITACORA
const bitacora = require('../modules/m5_bitacora');
router.get('/getALLBitacoraEmpresa/:empresaId', bitacora.getALLBitacoraEmpresa);
router.get('/getALLBitacoraUsuario/:usuarioId', bitacora.getALLBitacoraUsuario);


/*Publicidad email,Prueba --->>>npm install cron
            # ┌────────────── second (optional)
            # │ ┌──────────── minute
            # │ │ ┌────────── hour
            # │ │ │ ┌──────── day of month
            # │ │ │ │ ┌────── month
            # │ │ │ │ │ ┌──── day of week
            # │ │ │ │ │ │
            # │ │ │ │ │ │
            # * * * * * *         */
var CronJob = require('cron').CronJob;
var job = new CronJob(
    '2 49 * * * *',
    function () {
        inicio.RevisarLicencia();
    },
    null,
    true,
    'America/Los_Angeles'
);

const home = require('../modules/home');


//pruebas
router.get('/', (req, res) => {
    res.send('hola mundo');
})
router.get('/img', home.img);


//USUARIOS
const users = require('../modules/users');
router.post('/newUser', users.newUser);
router.get('/verifyUser/:token', users.verifyUser)

router.post('/updateImageUser/:id', multer.loadFile.single('imageUser'), users.updateImageUser);


module.exports = router;