const fs = require('fs')
const path = require('path')
const { pg } = require('../config/pg.config');

//MI EMPRESA
const getDatosEmpresa = async (req, res) => {
    const { usuarioId } = req.params;
    pg.connect((err, client, release) => {
        let querySQL = 'SELECT empre.*, imagen.perfilimagen as imagen, imagen.contenttype as tipoImagen FROM empresas empre LEFT JOIN imagenEmpresa imagen on empre.id = imagen.empresaId WHERE usuarioId = $1';
        let values = [usuarioId];
        client.query(querySQL, values, (err, empRes) => {
            if (empRes.rows[0].imagen) {
                empRes.rows[0].imagen = empRes.rows[0].imagen.toString('base64');
            }
            if (err) { res.send({ mensaje: 'Error al buscar la empresa', err, exito: 0 }) }
            else {
                res.send({ mensaje: 'Empresa Encontrada', empresa: empRes.rows[0], exito: 1 });
            }
        })
        release()
    })
}
const updateDatosEmpresa = async (req, res) => {
    const { empresaId } = req.params;
    const { nombre, email, telefono, direccion, paisId } = req.body;

    pg.connect((err, client, release) => {
        let querySQL = 'UPDATE empresas SET nombre=$1,email=$2,telefono=$3,direccion=$4,paisId = $5 WHERE  id = $6';
        let values = [nombre, email, telefono, direccion, paisId, empresaId];
        client.query(querySQL, values, (err, empRes) => {
            if (err) { res.send({ mensaje: 'Error al actualizar datos', err, exito: 0 }) }
            else {
                res.send({ mensaje: 'Datos actualizados', exito: 1 });
            }
        })
        release()
    })
}

const actualizarImagenEmpresa = async (req, res) => {

    const { empresaId } = req.params;
    const imagen = req.file;
    if (imagen) {

        const img = fs.readFileSync(path.join(__dirname, '..', 'public', 'uploads', imagen.filename));

        pg.connect((err, client, release) => {

            let querySQL = 'SELECT * FROM imagenEmpresa  WHERE empresaId = $1 ';
            let values = [empresaId];
            client.query(querySQL, values, (err, imagenRes) => {


                if (!imagenRes.rows.length) {

                    querySQL = 'INSERT INTO imagenEmpresa(perfilImagen,contentType,empresaId ) VALUES ($1,$2,$3);';
                } else {
                    querySQL = 'UPDATE imagenEmpresa SET perfilImagen = $1,contentType = $2 WHERE empresaId = $3';
                }

                values = [img, imagen.mimetype, empresaId];
                client.query(querySQL, values, (err, imagenRes) => {
                    if (err) {

                        res.send({ mensaje: 'Error al actualizar imagen de empresa', exito: 0 });
                    } else {
                        res.send({ mensaje: 'Imagen de empresa actualizada', exito: 1 });
                    }
                })

            })

            release()
            fs.unlinkSync((path.join(__dirname, '..', 'public', 'uploads', imagen.filename)));
        })

    } else {
        res.send({ mensaje: 'Error al actualizar imagen de empresa', exito: 0 });
    }
}

const createDepto = async (req, res) => {
    const { empresaId } = req.params;
    const { nombre, descripcion } = req.body;
    pg.connect((err, client, release) => {
        let querySQL = 'INSERT INTO deptoEmpresa(nombre,descripcion,empresaId) VALUES ($1,$2,$3)';
        let values = [nombre, descripcion, empresaId];
        client.query(querySQL, values, (err, deptoRes) => {
            if (err) { res.send({ mensaje: 'Error al añadir departamento', err, exito: 0 }) }
            else {
                res.send({ mensaje: 'Departamento Añadido', exito: 1 });
            }
        })
        release()
    })


}
const getDepto = async (req, res) => {
    const { deptoId } = req.params;
    pg.connect((err, client, release) => {
        let querySQL = 'SELECT * FROM deptoEmpresa WHERE id = $1';
        let values = [deptoId];
        client.query(querySQL, values, (err, deptoRes) => {
            if (err) { res.send({ mensaje: 'Error al buscar departamento', err, exito: 0 }) }
            else {
                res.send({ mensaje: 'Departamento Encontrado', depto: deptoRes.rows[0], exito: 1 });
            }
        })
        release()
    })
}
const getAllDeptos = async (req, res) => {
    const { empresaId } = req.params;
    pg.connect((err, client, release) => {
        let querySQL = 'SELECT * FROM deptoEmpresa WHERE empresaId = $1';
        let values = [empresaId];
        client.query(querySQL, values, (err, deptoRes) => {
            if (err) { res.send({ mensaje: 'Error al buscar departamentos', err, exito: 0 }) }
            else {
                res.send({ mensaje: 'Departamentos Encontrados', deptos: deptoRes.rows, exito: 1 });
            }
        })
        release()
    })
}
const updateDepto = async (req, res) => {
    const { deptoId } = req.params;
    const { nombre, descripcion } = req.body;

    pg.connect((err, client, release) => {
        let querySQL = 'UPDATE deptoEmpresa SET nombre=$1,descripcion=$2 WHERE id =$3';
        let values = [nombre, descripcion, deptoId];
        client.query(querySQL, values, (err, deptoRes) => {
            if (err) { res.send({ mensaje: 'Error al actualizar departamento', err, exito: 0 }) }
            else {
                res.send({ mensaje: 'Departamento Actualizado', exito: 1 });
            }
        })
        release()
    })
}
const deleteDepto = async (req, res) => {
    const { deptoId } = req.params;

    pg.connect((err, client, release) => {
        let querySQL = 'UPDATE  empleados  SET deptoempresaid = null WHERE deptoempresaid = $1;';
        let values = [deptoId];
        client.query(querySQL, values, (err, empleadoRes) => {
            if (err) { res.send({ mensaje: 'Error al borrar departamento', err, exito: 0 }) }
            else {
                querySQL = 'DELETE FROM deptoempresa  WHERE id =$1;';
                client.query(querySQL, values, (err, deptoRes) => {
                    if (err) { res.send({ mensaje: 'Error al borrar departamento', err, exito: 0 }) }
                    else {
                        res.send({ mensaje: 'Departamento Borrado', exito: 1 });
                    }
                })
            }
        })
        release()
    })
}

//EMPLEADOS
const createEmpleado = async (req, res) => {
    const { empresaId } = req.params;
    const { identidad, nombre, telefono, email, direccion, salarioBase } = req.body;
    pg.connect((err, client, release) => {
        let querySQL = `INSERT INTO empleados(identidad,
            nombre,
            telefono,
            email,
            direccion,
            salarioBase,
            empresaId) VALUES ($1,$2,$3,$4,$5,$6,$7)`;
        let values = [identidad, nombre, telefono, email, direccion, salarioBase, empresaId];
        client.query(querySQL, values, (err, empleadoRes) => {
            console.log(err);
            if (err) { res.send({ mensaje: 'Error al añadir empleado', err, exito: 0 }) }
            else {
                res.send({ mensaje: 'Empleado Añadido', exito: 1 });
            }
        })
        release()
    })
}
const getDatosEmpleado = async (req, res) => {
    const { empleadoId } = req.params;
    pg.connect((err, client, release) => {
        let querySQL = 'SELECT * FROM empleados WHERE id = $1';
        let values = [empleadoId];
        client.query(querySQL, values, (err, empleadoRes) => {
            if (err) { res.send({ mensaje: 'Error al buscar empleado', err, exito: 0 }) }
            else {
                res.send({ mensaje: 'Empleado Encontrado', empleado: empleadoRes.rows[0], exito: 1 });
            }
        })
        release()
    })
}
const getAllEmpleadosEmpresa = async (req, res) => {
    const { empresaId } = req.params;
    pg.connect((err, client, release) => {
        let querySQL = 'SELECT * FROM empleados WHERE empresaId = $1 AND activo = TRUE';
        let values = [empresaId];
        client.query(querySQL, values, (err, empleadoRes) => {
            if (err) { res.send({ mensaje: 'Error al buscar empleados', err, exito: 0 }) }
            else {
                res.send({ mensaje: 'Empleados Encontrados', empleados: empleadoRes.rows, exito: 1 });
            }
        })
        release()
    })
}

const getAllEmpleadosDepto = async (req, res) => {
    const { deptoId } = req.params;
    pg.connect((err, client, release) => {
        let querySQL = 'SELECT * FROM empleados WHERE deptoEmpresaId = $1';
        let values = [deptoId];
        client.query(querySQL, values, (err, empleadoRes) => {
            if (err) { res.send({ mensaje: 'Error al buscar empleados', err, exito: 0 }) }
            else {
                res.send({ mensaje: 'Empleados Encontrados', empleados: empleadoRes.rows, exito: 1 });
            }
        })
        release()
    })
}
const updateDatosEmpleado = async (req, res) => {
    const { empleadoId } = req.params;
    const { identidad, nombre, telefono, email, direccion, salarioBase } = req.body;
    pg.connect((err, client, release) => {
        let querySQL = `UPDATE empleados SET identidad = $1,
            nombre = $2,
            telefono = $3 ,
            email =$4,
            direccion = $5,
            salarioBase = $6,
            WHERE id = $7`;
        let values = [identidad, nombre, telefono, email, direccion, salarioBase, empleadoId];
        client.query(querySQL, values, (err, empleadoRes) => {
            if (err) { res.send({ mensaje: 'Error al actualizar empleado', err, exito: 0 }) }
            else {
                res.send({ mensaje: 'Empleado Actualizado', exito: 1 });
            }
        })
        release()
    })
}

const actualizarImagenEmpleado = async (req, res) => {
    const { empleadoId } = req.params;
    const imagen = req.file;
    if (imagen) {

        const img = fs.readFileSync(path.join(__dirname, '..', 'public', 'uploads', imagen.filename));

        pg.connect((err, client, release) => {

            let querySQL = 'SELECT * FROM imagenEmpleado  WHERE empleadoId = $1 ';
            let values = [empleadoId];
            client.query(querySQL, values, (err, imagenRes) => {


                if (!imagenRes.rows.length) {

                    querySQL = 'INSERT INTO imagenEmpleado(perfilImagen,contentType,empleadoId ) VALUES ($1,$2,$3);';
                } else {
                    querySQL = 'UPDATE imagenEmpleado SET perfilImagen = $1,contentType = $2 WHERE empleadoId = $3';
                }

                values = [img, imagen.mimetype, empleadoId];
                client.query(querySQL, values, (err, imagenRes) => {
                    if (err) {

                        res.send({ mensaje: 'Error al actualizar imagen de empleado', exito: 0 });
                    } else {
                        res.send({ mensaje: 'Imagen de empleado actualizada', exito: 1 });
                    }
                })

            })

            release()
            fs.unlinkSync((path.join(__dirname, '..', 'public', 'uploads', imagen.filename)));
        })

    }
}

const deleteEmpleado = async (req, res) => {
    const { empleadoId } = req.params;
    pg.connect((err, client, release) => {
        let querySQL = 'UPDATE empleados SET activo= FALSE WHERE id= $1';
        let values = [empleadoId];
        client.query(querySQL, values, (err, empleadoRes) => {
            if (err) { res.send({ mensaje: 'Error al eliminar empleado', err, exito: 0 }) }
            else {
                res.send({ mensaje: 'Empleado cambio a Inactivo', exito: 1 });
            }
        })
        release()
    })
}

//ACCIONES EMPLEADO
const empleadoInOut = async (req, res) => {
    const { empleadoId } = req.params;
    let msj = 'Entrada Registrada';
    pg.connect((err, client, release) => {

        let querySQL = 'SELECT * FROM InOutEmpleado  WHERE empleadoId = $1 AND activo =TRUE ';
        let values = [empleadoId];
        client.query(querySQL, values, (err, inOutRes) => {


            if (!inOutRes.rows.length) {

                querySQL = 'INSERT INTO InOutEmpleado(empleadoId,entrada) VALUES ($1,$2);';
            } else {
                querySQL = 'UPDATE InOutEmpleado SET salida = $2,activo =FALSE WHERE empleadoId = $1 AND activo =TRUE ';
                msj = 'Salida Registrada';

            }

            values = [empleadoId, new Date().toLocaleString()];
            client.query(querySQL, values, (err, inOutRes) => {
                if (err) {

                    res.send({ mensaje: 'Error de registro ENTRADA/SALIDA', exito: 0 });
                } else {
                    res.send({ mensaje: msj, exito: 1 });
                }
            })

        })

        release()

    })
}
const empleadoHorasLaboradas = async (req, res) => {

    const { empresaId } = req.params;
    const { fecha_ini, fecha_fin } = req.body;
    pg.connect((err, client, release) => {
        let querySQL = `SELECT e.id,e.nombre,e.identidad,e.salariobase,(SUM(i.salida - i.entrada)::TIME) AS Horas FROM inoutempleado i 
        INNER JOIN empleados e ON e.id = i.empleadoid
        AND i.activo = FALSE
        AND e.empresaid = $1
        AND (i.entrada::DATE >= $2 AND i.entrada::DATE <=$3)
        GROUP BY e.id ;
        `
        let values = [empresaId, fecha_ini, fecha_fin];
        client.query(querySQL, values, (err, horasRes) => {
            if (err) { res.send({ mensaje: 'Error al recopilar informacion', err, exito: 0 }) }
            else {
                res.send({ mensaje: 'Horas laboradas por empleados', horas: horasRes.rows, exito: 1 });
            }
        })
        release()
    })
}

const addEmpleadoDepto = async (req, res) => {
    const { deptoId, empleadoId } = req.body;
    pg.connect((err, client, release) => {
        let querySQL = 'UPDATE empleados SET deptoEmpresaId= $1 WHERE id= $2';
        let values = [deptoId, empleadoId];
        client.query(querySQL, values, (err, empleadoRes) => {
            if (err) { res.send({ mensaje: 'Error al añadir Empleado al Departamento', err, exito: 0 }) }
            else {
                res.send({ mensaje: 'Empleado añadido al departemento', exito: 1 });
            }
        })
        release()
    })
}
const removeEmpleadoDepto = async (req, res) => {
    const { empleadoId } = req.body;
    pg.connect((err, client, release) => {
        let querySQL = 'UPDATE empleados SET deptoEmpresaId= null WHERE id= $1';
        let values = [empleadoId];
        client.query(querySQL, values, (err, empleadoRes) => {
            if (err) { res.send({ mensaje: 'Error al remover Empleado del Departamento', err, exito: 0 }) }
            else {
                res.send({ mensaje: 'Empleado removido del departemento', exito: 1 });
            }
        })
        release()
    })
}



//EMAIL POR SI ACASO
const inUpEmpresaEmial = async (req, res) => { }
const deleteEmpresaEmial = async (req, res) => { }
const sendEmpresaEmail = async (req, res) => { }
const getSendEmail = async (req, res) => { }//
const getAllSendEmail = async (req, res) => { }

module.exports = {
    getDatosEmpresa,
    updateDatosEmpresa,
    actualizarImagenEmpresa,
    //
    createDepto,
    getDepto,
    getAllDeptos,
    updateDepto,
    deleteDepto,
    //EMPLEADO
    createEmpleado,
    getDatosEmpleado,
    getAllEmpleadosDepto,
    getAllEmpleadosEmpresa,
    updateDatosEmpleado,
    actualizarImagenEmpleado,
    deleteEmpleado,
    addEmpleadoDepto,
    removeEmpleadoDepto,
    //ACCIONES EMPLEADO
    empleadoInOut,
    empleadoHorasLaboradas
}

/*
-EDITAR DATOS DE LA EMPRESA
-AÑADIR,EDITAR EMPLEADOS
-REGISTRO DE ENTRADA Y SALIDA EMPLEADOS
-CALCULO DE HORAS LABORADAS POR RANGO DE FECHAS
-PAGA POR HORAS
-CORREO DE LA EMPRESA PARA ENVIO DE EMAILS -> SI AÑADIMOS UN MODULO DE MENSAJERIA
*/
