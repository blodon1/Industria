const { pg } = require('../config/pg.config');
const infoPDF = require('../modules/m4_pdfmaker')

//TIPOS DE GASTO
const createTipoGasto = async (req, res) => {
    const { empresaId } = req.params;
    const { nombre, descripcion} = req.body;
    pg.connect((err, client, release) => {
        let querySQL = 'INSERT INTO tipoGasto( nombre,descripcion,empresaId) VALUES ($1,$2,$3,)';
        let values = [nombre, descripcion, empresaId];
        client.query(querySQL, values, (err, gastoRes) => {
            if (err) { res.send({ mensaje: 'Error al insertar tipo de gasto', err, exito: 0 }) }
            else {
                res.send({ mensaje: 'Tipo de Gasto Añadido', exito: 1 });
            }
        })
        release()
    })
}

const updateTipoGasto = async (req, res) => {
    const { tipoGastoId } = req.params;
    const { nombre, descripcion } = req.body;
    pg.connect((err, client, release) => {
        let querySQL = 'UPDATE tipoGasto SET nombre=$1,descripcion=$2 WHERE id = $3';
        let values = [nombre, descripcion,tipoGastoId];
        client.query(querySQL, values, (err, gastoRes) => {
            if (err) { res.send({ mensaje: 'Error al añadir actualizar TipoGasto', err, exito: 0 }) }
            else {
                res.send({ mensaje: 'TipoGasto  Actualizado', exito: 1 });
            }
        })
        release()
    })
}
const deleteTipoGasto = async (req, res) => {

    const { tipoGastoId } = req.params;

    pg.connect((err, client, release) => {
        let querySQL = 'UPDATE tipoGasto SET activo=False WHERE id = $1';
        let values = [tipoGastoId];
        client.query(querySQL, values, (err, gastoRes) => {
            if (err) { res.send({ mensaje: 'Error al borrar TipoGasto', err, exito: 0 }) }
            else {
                res.send({ mensaje: 'TipoGasto desactivado', exito: 1 });
            }
        })
        release()
    })
}

const getTipoGasto= async (req, res) => { 
    const { tipoGastoId } = req.params;
    pg.connect((err, client, release) => {
        let querySQL = 'SELECT * FROM tipoGasto WHERE id = $1';
        let values = [tipoGastoId];
        client.query(querySQL, values, (err, tipoGastoRes) => {
            if (err) { res.send({ mensaje: 'Error al buscar tipoGasto', err, exito: 0 }) }
            else {
                res.send({ mensaje: 'tipoGasto Encontrada', tipoGasto: tipoGastoRes.rows[0], exito: 1 });
            }
        })
        release()
    })
}

const getALLTipoGasto = async (req, res) => { 
    const { empresaId } = req.params;
    pg.connect((err, client, release) => {
        let querySQL = 'SELECT * FROM tipoGasto WHERE empresaId = $1 AND activo = TRUE';
        let values = [empresaId];
        client.query(querySQL, values, (err, tipogastoRes) => {
            if (err) { res.send({ mensaje: 'Error al buscar tipoGastos', err, exito: 0 }) }
            else {
                res.send({ mensaje: 'tipoGastos Encontrados', tipoGastos: tipogastoRes.rows, exito: 1 });
            }
        })
        release()
    })
}


///GASTOS
const createGasto = async (req, res) => {
    const { empresaId } = req.params;
    const {descripcion,detalle,tipoId,totalGasto,fecha} = req.body;
    pg.connect((err, client, release) => {
        let querySQL = 'INSERT INTO gastos(descripcion,detalle,tipoId,totalGasto,fecha,empresaId) VALUES ($1,$2,$3,$4,$5,$6)';
        let values = [descripcion,detalle,tipoId,totalGasto,fecha, empresaId];
        client.query(querySQL, values, (err, gastoRes) => {
            if (err) { res.send({ mensaje: 'Error al insertar tipo de gasto', err, exito: 0 }) }
            else {
                res.send({ mensaje: 'Tipo de Gasto Añadido', exito: 1 });
            }
        })
        release()
    })
}

const updateGasto = async (req, res) => {
    const { gastoId } = req.params;
    const {descripcion,detalle,tipoId,totalGasto,fecha} = req.body;
    pg.connect((err, client, release) => {
        let querySQL = `UPDATE gastos SET 
                        descripcion=$1,
                        detalle = $2,
                        tipoId = $3,
                        totalGasto = $4,
                        fecha = $5
                        WHERE id =$6`;
        
        let values = [descripcion,detalle,tipoId,totalGasto,fecha, gastoId];
        client.query(querySQL, values, (err, gastoRes) => {
            if (err) { res.send({ mensaje: 'Error al actualizar gasto', err, exito: 0 }) }
            else {
                res.send({ mensaje: 'Gasto Actualizado', exito: 1 });
            }
        })
        release()
    })
}

const deleteGasto = async (req, res) => {
    const { gastoId } = req.params;

    pg.connect((err, client, release) => {
        let querySQL = 'DELETE FROM gastos  WHERE id =$1;';
        let values = [gastoId];

        client.query(querySQL, values, (err, gastoRes) => {
            if (err) { res.send({ mensaje: 'Error al borrar gasto', err, exito: 0 }) }
            else {
                res.send({ mensaje: 'gasto Borrada', exito: 1 });
            }
        })
        release()
    })

}

const estadoGasto = async (req, res) => {
    const { gastoId } = req.params;
    const { estado } = req.body;
    pg.connect((err, client, release) => {
        let querySQL = 'UPDATE gastos SET estado=$1 WHERE id = $2';
        let values = [estado,gastoId];
        client.query(querySQL, values, (err, gastoRes) => {
            if (err) { res.send({ mensaje: 'Error al añadir actualizar gasto', err, exito: 0 }) }
            else {
                res.send({ mensaje: 'gasto  Actualizada', exito: 1 });
            }
        })
        release()
    })
 }

 const getGasto= async (req, res) => { 
    const { gastoId } = req.params;
    pg.connect((err, client, release) => {
        let querySQL = 'SELECT * FROM gastos WHERE id = $1';
        let values = [gastoId];
        client.query(querySQL, values, (err, gastoRes) => {
            if (err) { res.send({ mensaje: 'Error al buscar Gasto', err, exito: 0 }) }
            else {
                res.send({ mensaje: 'Gasto Encontrada', gasto: gastoRes.rows[0], exito: 1 });
            }
        })
        release()
    })
}

const getALLGasto = async (req, res) => { 
    const { empresaId } = req.params;
    pg.connect((err, client, release) => {
        let querySQL = 'SELECT * FROM gastos WHERE empresaId = $1';
        let values = [empresaId];
        client.query(querySQL, values, (err, gastoRes) => {
            if (err) { res.send({ mensaje: 'Error al buscar Gastos', err, exito: 0 }) }
            else {
                res.send({ mensaje: 'Gastos Encontrados', gastos: gastoRes.rows, exito: 1 });
            }
        })
        release()
    })
}




module.exports={
//TIPO GASTOS
createTipoGasto,
updateTipoGasto,
deleteTipoGasto,
getTipoGasto,
getALLTipoGasto,
//GATOS
createGasto,
updateGasto,
deleteGasto,
estadoGasto,
getGasto,
getALLGasto,
getALLTipoGasto



}