const stripe = require('stripe')('sk_test_51LXHMeFsEYLGCkERrPnOl3AixsMvNKXhHXg1f1vpcJzTfF7ypLeEzCs57cRRq45YrqwRKY6095SEOHQKADEfg5k2006AfxlpQ0');
const { pg } = require('../config/pg.config');
const { getToken, getTokenData } = require('../config/jwt.config')

const getAllPaises = async (req, res) => {
    console.log("Entro alaa peticion")
    pg.connect((err, client, release) => {
        console.log(client);
        
        let querySQL = 'SELECT * FROM paises ';
        client.query(querySQL, (err, paisRes) => {
            if (err) { res.send({ mensaje: 'Error al buscar pais', err, exito: 0 }) }
            else {
                res.send({ mensaje: 'pais Encontrados', paises: paisRes.rows, exito: 1 });
            }
        })
        release()
    })
}

const getTokenWeb = async (req, res) => {
    const { usuarioId } = req.body;
    const token = getToken(usuarioId);
    pg.connect((err, client, release) => {
        let querySQL = 'SELECT * FROM usuarios WHERE id = $1';
        let values = [usuarioId];
        client.query(querySQL, values, (err, licenRes) => {
            console.log(err);
            if (err) { res.send({ mensaje: 'Error al buscar Token', err, exito: 0 }) }
            else {
                res.send({ mensaje: 'Token Encontrada', token: token, exito: 1 });
            }
        })
        release()
    })
}

const checkUserLicencia = async (req, res) => {
    const { usuarioId } = req.params;
    pg.connect((err, client, release) => {
        let querySQL = 'SELECT * FROM licencia WHERE usuarioId = $1';
        let values = [usuarioId];
        client.query(querySQL, values, (err, licenRes) => {
            console.log(err);
            if (err) { res.send({ mensaje: 'Error al buscar licencia', err, exito: 0 }) }
            else {
                res.send({ mensaje: 'Licencia Encontrada', licencia: licenRes.rows[0], exito: 1 });
            }
        })
        release()
    })
}

const pagoLicencia = async (req, res) => {

    const { usuarioId } = req.params;
    const token = getToken(usuarioId);
    const url = 'http://ec2-54-86-240-60.compute-1.amazonaws.com:3000';
    const session = await stripe.checkout.sessions.create({

        line_items: [
            {
                // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
                price: 'price_1LUD1tHo1PPMSDIYHufJ6YXT',
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: `${url}/licencia/success/${token}`,
        cancel_url: `${url}/licencia/cancel`,
    });

    res.redirect(303, session.url);

    /**
     * payment.

Payment succeeds 
4242 4242 4242 4242

Payment requires authentication 
4000 0025 0000 3155

Payment is declined
4000 0000 0000 9995
     */
}


const test_pagoLicencia = async (req, res) => {
    res.render('pglic.html');
    //npm install --save stripe
}

const success = async (req, res) => {

    const url = 'http://ec2-54-86-240-60.compute-1.amazonaws.com:4200';
    const { token } = req.params;
    const data = getTokenData(token);
    if (!data) { res.redirect(303, `${url}/licenciaPago/nullDataTonken`) }
    else {
        //OPTENER CORREO DEL USUARIO
        console.log('token aceptado')
        const usuarioId = data.data;
        console.log(data);
        pg.connect((err, client, release) => {
            let querySQL = "UPDATE licencia SET temporal=FALSE, activa = true, descripcion = 'completa' WHERE usuarioId = $1 RETURNING id";
            let values = [usuarioId];
            client.query(querySQL, values, (err, licenRes) => {
                if (err) { res.redirect(303, `${url}/payError/${usuarioId}`) }
                else {
                    querySQL = "INSERT INTO pagoLicencia (pago,licenciaId) VALUES ($1,$2)";
                    values = [10.00, licenRes.rows[0].id];
                    client.query(querySQL, values, (err, licenRes) => {
                        // if (err) { res.redirect(303, `${url}/payError/${usuarioId}`) }
                        // else {
                        //     res.redirect(303, `${url}/paySuccess/${usuarioId}`)
                        // }
                        if (err) { res.send({ mensaje: 'Error al registrar el pago', err, exito: 0 }) }
                        else {
                            res.send({ mensaje: 'Pago registrado pago', err, exito: 1 })
                        }
                    })
                }
            })
            release()

        })

    }
    //res.render('success.html')
}
const cancel = async (req, res) => {

    res.render('cancel.html')
}

const RevisarLicencia = () => {

    pg.connect((err, client, release) => {
        let querySQL = 'select * from licencia l where temporal = true and activa = true and fecha_referencia <= now()';
        client.query(querySQL, (err, licenRes) => {
            if (err) { console.log(err) }
            else {

                if (licenRes.rows.length) {

                    licenRes.rows.forEach(el => {

                        querySQL = 'UPDATE licencia SET activa = FALSE WHERE id = $1';
                        let values = [el.id]
                        client.query(querySQL, values, (err, Res) => {

                            if (err) { console.log(err) }
                            else {
                                console.log('licencia suspendida')
                            }
                        })
                    })

                }
            }


        })
        release()
    })
}

module.exports = {

    getAllPaises,
    getTokenWeb,
    checkUserLicencia,
    pagoLicencia,
    //test
    test_pagoLicencia,
    success,
    cancel,
    RevisarLicencia
}