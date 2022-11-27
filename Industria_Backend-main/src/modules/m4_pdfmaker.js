const { pg } = require('../config/pg.config');
const pdfprinter = require('pdfmake');
const fs = require('fs');
const path = require('path');
const { styles, contenido, fonts } = require('../config/pdf.config');



const createInforme = async (req, res) => {
    const { empresaId } = req.params;
    const { fecha_ini, fecha_fin } = req.body;

    let nombre = '___';

    pg.connect((err, client, release) => {
        let querySQL = 'SELECT * FROM empresas WHERE id = $1';
        let values = [empresaId];
        client.query(querySQL, values, (err, empresaRes) => {
            const emps = empresaRes.rows;

            if (emps.length) {
                nombre = emps[0].nombre;
            }
            querySQL = `SELECT g.*,t.nombre  FROM  gastos g 
            INNER JOIN  tipogasto t ON t.id = g.tipoid         
            AND g.empresaid  = $1 AND (fecha >= $2 AND fecha <= $3)`;
            values = [empresaId, fecha_ini, fecha_fin];

            client.query(querySQL, values, (err, gastoRes) => {
                let gastos = [];
                if (gastoRes.rows) {
                    gastos = gastoRes.rows;
                    const content = contenido(
                        `INFORME DE GASTOS`,
                        `DEL ${fecha_ini} AL ${fecha_fin}
                    [${nombre}]`,
                        gastos);

                    let docDefinition = {
                        content,
                        styles
                    };

                    const printer = new pdfprinter(fonts);
                    const name = 'Informe_Gastos_' + Date.now() + '.pdf';

                    let pdfdoc = printer.createPdfKitDocument(docDefinition);
                    pdfdoc.pipe(fs.createWriteStream(path.join(__dirname, '..', 'public', 'docs', name)));
                    pdfdoc.end();

                    setTimeout(() => {
                        console.log("wait for save")

                        const pd = fs.readFileSync(path.join(__dirname, '..', 'public', 'docs', name));
                        querySQL = 'INSERT INTO infoGasto(informe,nombre,fecha_ini,fecha_fin,empresaId) VALUES ($1,$2,$3,$4,$5) RETURNING id;';
                        values = [pd,name, fecha_ini, fecha_fin, empresaId];

                        client.query(querySQL, values, (err, infoRes) => {

                            if (err) {
                                res.send({ mensaje: 'Error crear informe', err, exito: 0 })
                            } else {
                                querySQL = 'SELECT * FROM infoGasto WHERE id = $1';
                                values = [infoRes.rows[0].id];
                                client.query(querySQL, values, (err, infoRes) => {

                                    //res.contentType('application/pdf');
                                    if (err) {
                                        res.send({ mensaje: 'Error al optener informe', err, exito: 0 })
                                    } else {
                                        res.send({ mensaje: 'Informe Creado', informe: infoRes.rows[0], exito: 1 });
                                    }
                                })
                            }
                        })

                        fs.unlinkSync(path.join(__dirname, '..', 'public', 'docs', name));
                    }, 100)
                }
                else {

                    res.send('no hay gastos')
                }
            })


        })
        release()
    })





};

const deleteInforme = async (req, res) => {
    const { informeId } = req.params;

    pg.connect((err, client, release) => {
        let querySQL = 'DELETE FROM infoGasto  WHERE id =$1;';
        let values = [informeId];

        client.query(querySQL, values, (err, informeRes) => {
            if (err) { res.send({ mensaje: 'Error al borrar informe', err, exito: 0 }) }
            else {
                res.send({ mensaje: 'informe Borrada', exito: 1 });
            }
        })
        release()
    })

}

const getInforme = async (req, res) => { 
    const { informeId } = req.params;
    pg.connect((err, client, release) => {
        let querySQL = 'SELECT * FROM infoGasto WHERE id = $1';
        let values = [informeId];
        client.query(querySQL, values, (err, informeRes) => {
            if (err) { res.send({ mensaje: 'Error al buscar informe', err, exito: 0 }) }
            else {
                res.send({ mensaje: 'informe Encontrada', informe: informeRes.rows[0], exito: 1 });
            }
        })
        release()
    })
}


const getListInforme= async (req, res) => { 
    const { empresaId } = req.params;
    pg.connect((err, client, release) => {
        let querySQL = 'SELECT id,nombre,fecha_ini,fecha_fin,creacion FROM infoGasto WHERE empresaId = $1';
        let values = [empresaId];
        client.query(querySQL, values, (err, informeRes) => {
            if (err) { res.send({ mensaje: 'Error al buscar informes', err, exito: 0 }) }
            else {
                res.send({ mensaje: 'informes Encontrados', informes: informeRes.rows, exito: 1 });
            }
        })
        release()
    })
}

const test = async (req, res) => {


    res.render('pdf.html', {

        doc: { link: '/docs/pdfTest1659278524705.pdf' }
    });

}



module.exports = {
    createInforme,
    deleteInforme,
    getInforme,
    getListInforme,
    test
}