const { pg } = require('../config/pg.config');

const getALLBitacoraEmpresa = async (req, res) => { 
    const {empresaId} = req.params;
    pg.connect((err, client, release) => {
        let querySQL = 'SELECT * FROM bitacora WHERE empresaid=$1 ORDER BY fecha DESC';
        let values = [empresaId]
        client.query(querySQL,values, (err, bitacoraRes) => {
            if (err) { res.send({ mensaje: 'Error al buscar bitacoras', err, exito: 0 }) }
            else {
                res.send({ mensaje: 'Bitacoras Encontradas', bitacoras: bitacoraRes.rows, exito: 1 });
            }
        })
        release()
    })
}

const getALLBitacoraUsuario = async (req, res) => { 
    const {usuarioId} = req.params;
    pg.connect((err, client, release) => {
        let querySQL = 'SELECT * FROM bitacorausuario WHERE usuarioid=$1 ORDER BY fecha DESC';
        let values = [usuarioId]
        client.query(querySQL,values, (err, bitacoraRes) => {
            if (err) { res.send({ mensaje: 'Error al buscar bitacoras', err, exito: 0 }) }
            else {
                res.send({ mensaje: 'Bitacoras Encontradas', bitacoras: bitacoraRes.rows, exito: 1 });
            }
        })
        release()
    })
}

module.exports = {
    getALLBitacoraEmpresa,
    getALLBitacoraUsuario
}