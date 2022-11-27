const { pg } = require('../config/pg.config');

//PROYECTOS
const createProyecto = async (req, res) => {
    const { empresaId } = req.params;
    const { nombre, descripcion, inicio, fin, teamWorkId } = req.body;
    pg.connect((err, client, release) => {
        let querySQL = 'INSERT INTO proyectos( nombre,descripcion,inicio,fin,teamWorkId,empresaId) VALUES ($1,$2,$3,$4,$5,$6)';
        let values = [nombre, descripcion, inicio, fin, teamWorkId, empresaId];
        client.query(querySQL, values, (err, proyectoRes) => {
            if (err) { res.send({ mensaje: 'Error al añadir Proyecto', err, exito: 0 }) }
            else {
                res.send({ mensaje: 'Proyecto Añadido', exito: 1 });
            }
        })
        release()
    })
}
const updateProyecto = async (req, res) => {
    const { proyectoId } = req.params;
    const { nombre, descripcion, inicio, fin, teamWorkId } = req.body;
    pg.connect((err, client, release) => {
        let querySQL = 'UPDATE proyectos SET nombre=$1,descripcion=$2,inicio=$3,fin=$4,teamWorkId=$5 WHERE id = $6';
        let values = [nombre, descripcion, inicio, fin, teamWorkId, proyectoId];
        client.query(querySQL, values, (err, proyectoRes) => {
            if (err) { res.send({ mensaje: 'Error al añadir actualizar Proyecto', err, exito: 0 }) }
            else {
                res.send({ mensaje: 'Proyecto  Actualizado', exito: 1 });
            }
        })
        release()
    })
}
const deleteProyecto = async (req, res) => {

    const { proyectoId } = req.params;

    pg.connect((err, client, release) => {
        let querySQL = 'UPDATE proyectos SET activo=False WHERE id = $1';
        let values = [proyectoId];
        client.query(querySQL, values, (err, proyectoRes) => {
            if (err) { res.send({ mensaje: 'Error al borrar Proyecto', err, exito: 0 }) }
            else {
                res.send({ mensaje: 'Proyecto borrado', exito: 1 });
            }
        })
        release()
    })
}
const estadoProyecto = async (req, res) => {
    const { proyectoId } = req.params;
    const { estado } = req.body;
    pg.connect((err, client, release) => {
        let querySQL = 'UPDATE proyectos SET estado=$1 WHERE id = $2';
        let values = [estado, proyectoId];
        client.query(querySQL, values, (err, proyectoRes) => {
            if (err) { res.send({ mensaje: 'Error al añadir actualizar Proyecto', err, exito: 0 }) }
            else {
                res.send({ mensaje: 'Proyecto  Actualizado', exito: 1 });
            }
        })
        release()
    })
}
const getProyecto = async (req, res) => {
    const { proyectoId } = req.params;
    pg.connect((err, client, release) => {
        let querySQL = 'SELECT * FROM proyectos WHERE id = $1';
        let values = [proyectoId];
        client.query(querySQL, values, (err, proyectoRes) => {
            if (err) { res.send({ mensaje: 'Error al buscar proyecto', err, exito: 0 }) }
            else {
                res.send({ mensaje: 'proyecto Encontrado', proyecto: proyectoRes.rows[0], exito: 1 });
            }
        })
        release()
    })
}
const getALLProyecto = async (req, res) => {

    const { empresaId } = req.params;
    pg.connect((err, client, release) => {
        let querySQL = 'SELECT * FROM proyectos WHERE empresaId = $1 AND activo = TRUE';
        let values = [empresaId];
        client.query(querySQL, values, (err, proyectoRes) => {
            if (err) { res.send({ mensaje: 'Error al buscar proyectos', err, exito: 0 }) }
            else {
                res.send({ mensaje: 'proyectos Encontrados', proyectos: proyectoRes.rows, exito: 1 });
            }
        })
        release()
    })
}

//TAREAS DE PROYECTO
const createTareaProyecto = async (req, res) => {
    const { proyectoId } = req.params;
    const { nombre, descripcion, observacion, empleadoId, inicio, fin } = req.body;

    pg.connect((err, client, release) => {
        let querySQL = `INSERT INTO tareasProyecto(
            nombre,
            descripcion,
            observacion,
            empleadoId,
            inicio,
            fin,
            proyectoId) VALUES ($1,$2,$3,$4,$5,$6,$7)`;
        let values = [nombre, descripcion, observacion, empleadoId, inicio, fin, proyectoId];
        client.query(querySQL, values, (err, tareaRes) => {
            if (err) { res.send({ mensaje: 'Error al añadir tarea', err, exito: 0 }) }
            else {
                res.send({ mensaje: 'tarea Añadido', exito: 1 });
            }
        })
        release()
    })
}
const updateTareaProyecto = async (req, res) => {

    const { tareaId } = req.params;
    const { nombre, descripcion, observacion, empleadoId, inicio, fin } = req.body;
    pg.connect((err, client, release) => {
        let querySQL = `UPDATE tareasProyecto SET 
            nombre = $1,
            descripcion = $2,
            observacion = $3,
            empleadoId = $4,
            inicio = $5,
            fin = $6
            WHERE id = $7`;
        let values = [nombre, descripcion, observacion, empleadoId, inicio, fin, tareaId];
        client.query(querySQL, values, (err, tareaRes) => {
            if (err) { res.send({ mensaje: 'Error al actualizar tarea', err, exito: 0 }) }
            else {
                res.send({ mensaje: 'Tarea Actualizada', exito: 1 });
            }
        })
        release()
    })
}
const deleteTareaProyecto = async (req, res) => {
    const { tareaId } = req.params;

    pg.connect((err, client, release) => {
        let querySQL = 'DELETE FROM tareasProyecto  WHERE id =$1;';
        let values = [tareaId];

        client.query(querySQL, values, (err, tareaRes) => {
            if (err) { res.send({ mensaje: 'Error al borrar tarea', err, exito: 0 }) }
            else {
                res.send({ mensaje: 'Tarea Borrada', exito: 1 });
            }
        })
        release()
    })

}
const estadoTareaProyecto = async (req, res) => {
    const { tareaId } = req.params;
    const { estado } = req.body;
    pg.connect((err, client, release) => {
        let querySQL = 'UPDATE tareasProyecto SET estado=$1 WHERE id = $2';
        let values = [estado, tareaId];
        client.query(querySQL, values, (err, tareaRes) => {
            if (err) { res.send({ mensaje: 'Error al añadir actualizar tarea', err, exito: 0 }) }
            else {
                res.send({ mensaje: 'Tarea  Actualizada', exito: 1 });
            }
        })
        release()
    })
}
const getTareaProyecto = async (req, res) => {
    const { tareaId } = req.params;
    pg.connect((err, client, release) => {
        let querySQL = 'SELECT * FROM tareasProyecto WHERE id = $1';
        let values = [tareaId];
        client.query(querySQL, values, (err, tareaRes) => {
            if (err) { res.send({ mensaje: 'Error al buscar tarea', err, exito: 0 }) }
            else {
                res.send({ mensaje: 'tarea Encontrada', tarea: tareaRes.rows[0], exito: 1 });
            }
        })
        release()
    })
}
const getALLTareaProyecto = async (req, res) => {
    const { proyectoId } = req.params;
    pg.connect((err, client, release) => {
        let querySQL = 'SELECT * FROM tareasProyecto WHERE proyectoId = $1';
        let values = [proyectoId];
        client.query(querySQL, values, (err, tareaRes) => {
            if (err) { res.send({ mensaje: 'Error al buscar Tareas', err, exito: 0 }) }
            else {
                res.send({ mensaje: 'Tareas Encontrados', tareas: tareaRes.rows, exito: 1 });
            }
        })
        release()
    })
}

//EQUIPOS DE TRABAJO

const createTeamWork = async (req, res) => {
    const { empresaId } = req.params;
    const { nombre } = req.body;
    pg.connect((err, client, release) => {
        let querySQL = 'INSERT INTO teamWork( nombre,empresaId) VALUES ($1,$2) RETURNING id';
        let values = [nombre, empresaId];
        client.query(querySQL, values, (err, teamwRes) => {
            if (err) { res.send({ mensaje: 'Error al añadir TeamWork', err, exito: 0 }) }
            else {
                res.send({ mensaje: 'TeamWork Añadido', exito: 1, teamwork: teamwRes.rows[0].id });
            }
        })
        release()
    })
}
const updateTeamWork = async (req, res) => {
    const { teamWorkId } = req.params;
    const { nombre } = req.body;
    pg.connect((err, client, release) => {
        let querySQL = 'UPDATE teamWork SET nombre=$1 WHERE id = $2)';
        let values = [nombre, teamWorkId];
        client.query(querySQL, values, (err, teamwRes) => {
            if (err) { res.send({ mensaje: 'Error al actualizar TeamWork', err, exito: 0 }) }
            else {
                res.send({ mensaje: 'TeamWork actualizado', exito: 1 });
            }
        })
        release()
    })
}
const deleteTeamWork = async (req, res) => {

    const { teamWorkId } = req.params;

    pg.connect((err, client, release) => {
        let querySQL = 'DELETE FROM empleadosTeamWork  WHERE teamWorkId =$1;';
        let values = [teamWorkId];
        client.query(querySQL, values, (err, teamwRes) => {
            if (err) { res.send({ mensaje: 'Error al borrar TeamWork', err, exito: 0 }) }
            else {
                querySQL = 'DELETE FROM teamWork  WHERE id =$1;';
                client.query(querySQL, values, (err, teamwRes) => {
                    if (err) { res.send({ mensaje: 'Error al borrar TeamWork', err, exito: 0 }) }
                    else {
                        res.send({ mensaje: 'TeamWork Borrado', exito: 1 });
                    }
                })
            }
        })
        release()
    })
}
const getTeamWork = async (req, res) => {
    const { teamWorkId } = req.params;
    pg.connect((err, client, release) => {
        let querySQL = 'SELECT * FROM teamWork WHERE id = $1';
        let values = [teamWorkId];
        client.query(querySQL, values, (err, teamWorkRes) => {
            if (err) { res.send({ mensaje: 'Error al buscar teamWork', err, exito: 0 }) }
            else {
                res.send({ mensaje: 'teamWork Encontrado', teamWork: teamWorkRes.rows[0], exito: 1 });
            }
        })
        release()
    })
}
const getALLTeamWork = async (req, res) => {

    const { empresaId } = req.params;
    pg.connect((err, client, release) => {
        let querySQL = 'SELECT * FROM teamWork WHERE empresaId = $1';
        let values = [empresaId];
        client.query(querySQL, values, (err, teamWorkRes) => {
            if (err) { res.send({ mensaje: 'Error al buscar teamWorks', err, exito: 0 }) }
            else {
                res.send({ mensaje: 'teamWorks Encontrados', teamWorks: teamWorkRes.rows, exito: 1 });
            }
        })
        release()
    })
}


//ACCIONES

const addEmpleadoTW = async (req, res) => {
    const { teamWorkId } = req.params;
    const { empleadoId } = req.body;
    pg.connect((err, client, release) => {
        let querySQL = 'INSERT INTO empleadosTeamWork(teamWorkId,empleadoId) VALUES ($1,$2)';
        let values = [teamWorkId, empleadoId];
        client.query(querySQL, values, (err, teamwRes) => {
            console.log(err);
            if (err) { res.send({ mensaje: 'Error al añadir empleado a TeamWork', err, exito: 0 }) }
            else {
                res.send({ mensaje: 'Empleado añadido TeamWork', exito: 1 });
            }
        })
        release()
    })

}
const removeEmpleadoTW = async (req, res) => {
    const { teamWorkId } = req.params;
    const { empleadoId } = req.body;
    pg.connect((err, client, release) => {
        let querySQL = 'DELETE FROM empleadosTeamWork WHERE teamWorkId=$1 AND empleadoId=$2';
        let values = [teamWorkId, empleadoId];
        client.query(querySQL, values, (err, teamwRes) => {
            if (err) { res.send({ mensaje: 'Error al BORRAR empleado a TeamWork', err, exito: 0 }) }
            else {
                res.send({ mensaje: 'Empleado BORRADOTeamWork', exito: 1 });
            }
        })
        release()
    })
}
const getEmpleadoTW = async (req, res) => {
    const { teamWorkId } = req.params;
    pg.connect((err, client, release) => {
        let querySQL = `SELECT e.* FROM empleados e
                        inner join empleadosTeamWork tw on tw.empleadoid = e.id 
                        inner join teamwork t on t.id =tw.teamworkid 
                        and t.id = $1`;
        let values = [teamWorkId];
        client.query(querySQL, values, (err, teamWorkRes) => {
            if (err) { res.send({ mensaje: 'Error al buscar empleados teamWorks', err, exito: 0 }) }
            else {
                res.send({ mensaje: 'empleados teamWorks Encontrados', teamWorks: teamWorkRes.rows, exito: 1 });
            }
        })
        release()
    })
}

const addTWProyecto = async (req, res) => {
    const { proyectokId } = req.params;
    const { teamWorkId } = req.body;
    pg.connect((err, client, release) => {
        let querySQL = 'UPDATE proyectos SET teamWorkId=$1 WHERE id = $2';
        let values = [teamWorkId, proyectokId];
        client.query(querySQL, values, (err, proyectoRes) => {
            if (err) { res.send({ mensaje: 'Error al añadir teamwork a proyecto', err, exito: 0 }) }
            else {
                res.send({ mensaje: 'teamwork añadido a proyecto ', exito: 1 });
            }
        })
        release()
    })
}
const removeTWProyecto = async (req, res) => {

    const { proyectokId } = req.params;
    pg.connect((err, client, release) => {
        let querySQL = 'UPDATE proyectos SET teamWorkId=NULL WHERE id = $1';
        let values = [proyectokId];
        client.query(querySQL, values, (err, proyectoRes) => {
            if (err) { res.send({ mensaje: 'Error al ELIMINAR teamwork de proyecto', err, exito: 0 }) }
            else {
                res.send({ mensaje: 'teamwork eliminado de proyecto ', exito: 1 });
            }
        })
        release()
    })

}

//const getTWProyecto = async (req, res) => { } nota: el proyecto con tiene el id de teamWork por lo que se usaria la misma funcion getTeamEork


module.exports = {
    //PROYECTO
    createProyecto,
    updateProyecto,
    deleteProyecto,
    estadoProyecto,
    getProyecto,
    getALLProyecto,
    getALLProyecto,
    //TAREA
    createTareaProyecto,
    updateTareaProyecto,
    deleteTareaProyecto,
    estadoTareaProyecto,
    getTareaProyecto,
    getALLTareaProyecto,
    //EQUIPO DE TRABAJO
    createTeamWork,
    updateTeamWork,
    deleteTeamWork,
    getTeamWork,
    getALLTeamWork,
    //ACCIONES EXTRA
    addEmpleadoTW,
    removeEmpleadoTW,
    getEmpleadoTW,
    addTWProyecto,
    removeTWProyecto,


}