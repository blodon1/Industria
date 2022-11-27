const fs = require('fs')
const path = require('path')
const { pg } = require('../config/pg.config');
const bcrypt = require('bcrypt');

const { getToken, getTokenData } = require('../config/jwt.config')
const { getVerifyTemplate, sendEmailVerify, getCambioPassTemplate, sendEmailSolicitudCambioPass } = require('../config/send.mail.config');


const nuevoUsuario = async (req, res) => {
    const { nombre, email, telefono, direccion, contrasenia, paisId } = req.body;

    pg.connect((err, client, release) => {
        (err) ? res.send({ mensaje: 'Error de conexion', err, exito: 0 }) : console.log('conexion exitosa');

        let querySQL = 'INSERT INTO usuarios(nombre,email,telefono,direccion,paisId) VALUES ($1,$2,$3,$4,$5) RETURNING id';
        let values = [nombre, email, telefono, direccion, paisId];

        client.query(querySQL, values, (err, usuarioRes) => {

            (!usuarioRes) ? res.send({ mensaje: 'Usuario existe', err, exito: 0 }) :
                //ENCRIPTAR CONTRASEÑA
                bcrypt.hash(contrasenia, 10, (err, hashedPassword) => {
                    (err) ? res.send({ mensaje: 'Error en contraseña', err, exito: 0 }) :
                        querySQL = 'INSERT INTO datosInicioSesion(contrasenia,usuarioId) VALUES ($1,$2) RETURNING id;';
                    values = [hashedPassword, usuarioRes.rows[0].id];
                    client.query(querySQL, values, (err, passRes) => {
                        (err) ? res.send({ mensaje: 'Error en contraseña', err, exito: 0 }) :
                            console.log('empresa insertado')
                        /*/EMPRESA DEFAULT
                    querySQL = 'INSERT INTO empresas(paisId,usuarioId) VALUES ($1,$2) RETURNING id;';
                    values = [paisId, usuarioRes.rows[0].id];
                    client.query(querySQL, values, (err, empresaRes) => {
                        (err) ? res.send({ mensaje: 'Error al crear empresa', err, exito: 0 }) :
                            console.log('empresa insertado')*/
                        const token = getToken(email);
                        const template = getVerifyTemplate(nombre, token);
                        sendEmailVerify(email, 'Confirmar Cuenta', template);
                        res.send({ mensaje: 'Usuario insertado', exito: 1 });

                        // })

                    })


                })

        })
        release()
    })
}

const verificarUsuario = async (req, res) => {
    //OPTENER TOKEN
    const { token } = req.params;
    //VERIFICAR DATA
    const data = getTokenData(token);
    if (!data) { res.send({ mensaje: 'Error en data token', exito: 0 }) }
    else {
        //OPTENER CORREO DEL USUARIO
        console.log('token aceptado')
        const email = data.data;
        pg.connect((err, client, release) => {
            let querySQL = 'SELECT * FROM usuarios WHERE email = $1 AND estadoHabilitacion= false';
            let values = [email];
            client.query(querySQL, values, (err, usuarioRes) => {
                (!usuarioRes) ? res.send({ mensaje: 'Usuario no existe o ya se encuntra habilitado', err, exito: 0 }) :
                    console.log('Usuario existe,no habilitado')
                querySQL = 'UPDATE usuarios SET estadoHabilitacion=$1 WHERE email = $2';
                values = [true, email];
                client.query(querySQL, values, (err, usuarioRes) => {
                    (err) ? res.send({ mensaje: 'Error al habilitar', err, exito: 0 }) :
                        console.log('usuario habilitado')
                    res.send({ mensaje: 'Usuario Habilitado', exito: 1 });
                })


            })
            release()
        })
    }
}

const actualizarImagenPerfil = async (req, res) => {
    const usuarioId = req.params.id;
    const imagen = req.file;
    if (imagen) {

        const img = fs.readFileSync(path.join(__dirname, '..', 'public', 'uploads', imagen.filename));

        pg.connect((err, client, release) => {

            let querySQL = 'SELECT * FROM imagenPerfil  WHERE usuarioId = $1 ';
            let values = [usuarioId];
            client.query(querySQL, values, (err, imagenRes) => {


                if (!imagenRes.rows.length) {

                    querySQL = 'INSERT INTO imagenPerfil(perfilImagen,contentType,usuarioId ) VALUES ($1,$2,$3);';
                } else {
                    querySQL = 'UPDATE imagenPerfil SET perfilImagen = $1,contentType = $2 WHERE usuarioId = $3';
                }

                values = [img, imagen.mimetype, usuarioId];
                client.query(querySQL, values, (err, imagenRes) => {
                    if (err) {

                        res.send({ mensaje: 'Error al actualizar', exito: 0 });
                    } else {
                        res.send({ mensaje: 'Perfil Actualizado', exito: 1 });
                    }
                })

            })

            release()
            fs.unlinkSync((path.join(__dirname, '..', 'public', 'uploads', imagen.filename)));
        })

    }
}

const inicioSesion = async (req, res) => {

    const { email, contrasenia } = req.body;
    pg.connect((err, client, release) => {
        let querySQL = 'SELECT usua.*, imagen.perfilimagen as imagen, imagen.contenttype as tipoImagen FROM usuarios usua LEFT JOIN imagenperfil imagen on usua.id = imagen.usuarioid WHERE  email = $1 AND estadoHabilitacion= True ';
        let values = [email];
        client.query(querySQL, values, (err, usuarioRes) => {
            if (usuarioRes.rows.length) {
                querySQL = 'SELECT * FROM datosInicioSesion WHERE usuarioId = $1 AND estado = True ';
                values = [usuarioRes.rows[0].id];
                client.query(querySQL, values, (err, contraseniaRes) => {
                    bcrypt.compare(contrasenia, contraseniaRes.rows[0].contrasenia, (err, result) => {
                        if (result) {
                            if (usuarioRes.rows[0].imagen) {
                                usuarioRes.rows[0].imagen = usuarioRes.rows[0].imagen.toString('base64');
                            }
                            res.send({ "mensaje": "Contraseña correcta", usuario: usuarioRes.rows[0], exito: 1 });

                        } else {
                            res.send({ "mensaje": "Contraseña incorrecta", exito: 0 });
                        };
                    })
                })

            } else {

                res.send({ mensaje: 'El usuario no existe o no se encuentra habilitado', exito: 0 });
            }
        })


        release()
    })


}

const solicitudNuevaContrasenia = async (req, res) => {
    const { email } = req.body;
    pg.connect((err, client, release) => {
        let querySQL = 'SELECT * FROM usuarios WHERE email = $1 AND estadoHabilitacion= True ';
        let values = [email];
        client.query(querySQL, values, (err, usuarioRes) => {
            if (usuarioRes.rows.length) {

                //GENERAR TOKEN DE IDENTIFICACION
                const token = getToken(email);
                //TEMPLATE -> ESTRUCUTRA DEL CORREO DE CONFIRMACION
                const template = getCambioPassTemplate(usuarioRes.rows[0].nombre, token);

                //ENVIAR EMAIL
                sendEmailSolicitudCambioPass(email, 'CAMBIO DE CONTRASEÑA', template);

                res.send({ mensaje: 'Solicitud de cambio de contraseña enviada', exito: 1 });

            } else {

                res.send({ mensaje: 'El usuario no existe o no se encuentra habilitado', exito: 0 });
            }

        })

        release()
    })

}

const nuevaContraseniaForm = async (req, res) => {
    //OPTENER TOKEN
    const { token } = req.params;
    //VERIFICAR DATA
    const data = getTokenData(token);
    if (!data) { res.send({ mensaje: 'Error en data token', exito: 0 }) }
    else {
        const email = data.data;
        pg.connect((err, client, release) => {
            let querySQL = 'SELECT * FROM usuarios WHERE email = $1 AND estadoHabilitacion= true';
            let values = [email];
            client.query(querySQL, values, (err, usuarioRes) => {
                if (usuarioRes.rows.length) {

                    res.send({ "mensaje": "Usuario Encontrado", usuario: usuarioRes.rows[0], exito: 1 });

                } else {

                    res.send({ mensaje: 'El usuario no existe o no se encuentra habilitado', exito: 0 });
                }

            })

            release()
        })
    }
}
const guardarNuevaContrasenia = async (req, res) => {
    const { nuevaContrasenia, usuarioId } = req.body;
    pg.connect((err, client, release) => {
        let querySQL = 'UPDATE datosInicioSesion SET estado = false  WHERE usuarioId = $1';
        let values = [usuarioId];
        client.query(querySQL, values, (err, usuarioRes) => {
            if (err) { res.send({ mensaje: 'Error al cambiar contraseña', exito: 0 }); }
            else {
                bcrypt.hash(nuevaContrasenia, 10, (err, hashedPassword) => {
                    (err) ? res.send({ mensaje: err.message, err, exito: 0 }) :
                        querySQL = 'INSERT INTO datosInicioSesion(contrasenia,usuarioId) VALUES ($1,$2)';
                    values = [hashedPassword, usuarioId];
                    client.query(querySQL, values, (err, passRes) => {
                        (err) ? res.send({ mensaje: 'Error en contraseña', err, exito: 0 }) :
                            res.send({ mensaje: 'Contraseña cambiada', exito: 1 });

                    })


                })

            }

        })

        release()
    })


}

const testToken = async (req, res) => {
    const token = getToken("adelslive@outlook.es");
    const template = getVerifyTemplate("Victor", token);
    sendEmailVerify("adelslive@outlook.es", 'Confirmar Cuenta', template);
    res.send({ mensaje: 'Usuario insertado', exito: 1 });
}


module.exports = {
    testToken,
    nuevoUsuario,
    verificarUsuario,
    actualizarImagenPerfil,
    inicioSesion,
    solicitudNuevaContrasenia,
    nuevaContraseniaForm,
    guardarNuevaContrasenia
}

/*
const nuevoUsuario = async (req,res)=>{
    const {nombre,email,telefono, direccion,} = req.body;

    pg.connect((err, client, release) => {
        (err)? res.send({mensaje:'Error de conexion',err,exito:0}):console.log('conexion exitosa');
        client.querySQL('', (err, result) => {

            release();
        });
    })


}*/