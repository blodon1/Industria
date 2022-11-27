const { pg } = require('../config/pg.config');

//CATEGORIAS
const createCategoria = async (req, res) => {
    const { empresaId } = req.params;
    const { nombre, descripcion } = req.body;
    pg.connect((err, client, release) => {
        let querySQL = 'INSERT INTO categoriaProducto(nombre,descripcion,empresaId) VALUES ($1,$2,$3)';
        let values = [nombre, descripcion, empresaId];
        client.query(querySQL, values, (err, categoriaRes) => {
            if (err) { res.send({ mensaje: 'Error al añadir Categoria de Productos', err, exito: 0 }) }
            else {
                res.send({ mensaje: 'Categoria de Productos Añadido', exito: 1 });
            }
        })
        release()
    })

}
const updateCategoria = async (req, res) => {
    const { categoriaId } = req.params;
    const { nombre, descripcion } = req.body;

    pg.connect((err, client, release) => {
        let querySQL = 'UPDATE categoriaProducto SET nombre=$1,descripcion=$2 WHERE id =$3';
        let values = [nombre, descripcion, categoriaId];
        client.query(querySQL, values, (err, categoriaRes) => {
            if (err) { res.send({ mensaje: 'Error al actualizar Categoria', err, exito: 0 }) }
            else {
                res.send({ mensaje: 'Categoría actualizada', exito: 1 });
            }
        })
        release()
    })
}

const deleteCategoria = async (req, res) => {
    const { categoriaId } = req.params;

    pg.connect((err, client, release) => {
        let querySQL = 'UPDATE  producto  SET categoriaId = null WHERE categoriaId = $1;';
        let values = [categoriaId];
        client.query(querySQL, values, (err, CategoriaRes) => {
            if (err) { res.send({ mensaje: 'Error al borrar Categoria', err, exito: 0 }) }
            else {
                querySQL = 'DELETE FROM producto  WHERE id =$1;';
                client.query(querySQL, values, (err, categoriaRes) => {
                    if (err) { res.send({ mensaje: 'Error al borrar Categoria', err, exito: 0 }) }
                    else {
                        res.send({ mensaje: 'Categoria Borrado', exito: 1 });
                    }
                })
            }
        })
        release()
    })
}
const getCategoria = async (req, res) => {

    const { categoriaId } = req.params;
    pg.connect((err, client, release) => {
        let querySQL = 'SELECT * FROM categoriaProducto WHERE id = $1';
        let values = [categoriaId];
        client.query(querySQL, values, (err, categoriaRes) => {
            if (err) { res.send({ mensaje: 'Error al buscar Categoria', err, exito: 0 }) }
            else {
                res.send({ mensaje: 'Categoria Encontrado', categoria: categoriaRes.rows[0], exito: 1 });
            }
        })
        release()
    })
}

const getAllCategoria = async (req, res) => {
    const { empresaId } = req.params;
    pg.connect((err, client, release) => {
        let querySQL = 'SELECT * FROM categoriaProducto WHERE empresaId = $1';
        let values = [empresaId];
        client.query(querySQL, values, (err, categoriaRes) => {
            if (err) { res.send({ mensaje: 'Error al buscar Categorias', err, exito: 0 }) }
            else {
                res.send({ mensaje: 'Categorias Encontrados', categorias: categoriaRes.rows, exito: 1 });
            }
        })
        release()
    })
}

//PRODUCTOS
const createProducto = async (req, res) => {
    const { empresaId } = req.params;
    const { nombre, descripcion, precio, unidades, finito, categoriaid } = req.body;

    pg.connect((err, client, release) => {
        let querySQL = `INSERT INTO producto(
            nombre,
            descripcion,
            precio,
            unidades,
            finito,
            categoriaId,
            empresaId) VALUES ($1,$2,$3,$4,$5,$6,$7)`;
        let values = [nombre, descripcion, precio, unidades, finito, categoriaid, empresaId];
        client.query(querySQL, values, (err, productoRes) => {
            if (err) { res.send({ mensaje: 'Error al añadir producto', err, exito: 0 }) }
            else {
                res.send({ mensaje: 'Producto Añadido', exito: 1 });
            }
        })
        release()
    })
}
const updateProducto = async (req, res) => {
    const { productoId } = req.params;
    const { nombre, descripcion, precio, unidades, finito, categoriaid } = req.body;

    pg.connect((err, client, release) => {
        let querySQL = `UPDATE producto SET
            nombre = $1,
            descripcion = $2,
            precio = $3,
            unidades = $4,
            finito = $5,
            categoriaId = $6 WHERE id = $7`;
        let values = [nombre, descripcion, precio, unidades, finito, categoriaid, productoId];
        client.query(querySQL, values, (err, productoRes) => {
            if (err) { res.send({ mensaje: 'Error al añadir producto', err, exito: 0 }) }
            else {
                res.send({ mensaje: 'Producto actualizado', exito: 1 });
            }
        })
        release()
    })
}
const deleteProducto = async (req, res) => {
    const { productoId } = req.params;
    pg.connect((err, client, release) => {
        let querySQL = 'UPDATE producto SET activo= FALSE WHERE id= $1';
        let values = [productoId];
        client.query(querySQL, values, (err, productoRes) => {
            if (err) { res.send({ mensaje: 'Error al eliminar producto', err, exito: 0 }) }
            else {
                res.send({ mensaje: 'Producto eliminado', exito: 1 });
            }
        })
        release()
    })
}
const getProducto = async (req, res) => {

    const { productoId } = req.params;
    pg.connect((err, client, release) => {
        let querySQL = 'SELECT * FROM producto WHERE id = $1';
        let values = [productoId];
        client.query(querySQL, values, (err, productoRes) => {
            if (err) { res.send({ mensaje: 'Error al buscar producto', err, exito: 0 }) }
            else {
                res.send({ mensaje: 'producto Encontrado', producto: productoRes.rows[0], exito: 1 });
            }
        })
        release()
    })
}
const getAllProducto = async (req, res) => {
    const { empresaId } = req.params;
    pg.connect((err, client, release) => {
        let querySQL = 'SELECT * FROM producto WHERE empresaId = $1 AND activo = TRUE ORDER BY ID ASC';
        let values = [empresaId];
        client.query(querySQL, values, (err, productoRes) => {
            if (err) { res.send({ mensaje: 'Error al buscar productos', err, exito: 0 }) }
            else {
                res.send({ mensaje: 'productos Encontrados', productos: productoRes.rows, exito: 1 });
            }
        })
        release()
    })
}
const getProductoCategoria = async (req, res) => {
    const { categoriaId } = req.params;
    pg.connect((err, client, release) => {
        let querySQL = 'SELECT * FROM producto WHERE categoriaId = $1';
        let values = [categoriaId];
        client.query(querySQL, values, (err, productoRes) => {
            if (err) { res.send({ mensaje: 'Error al buscar productos', err, exito: 0 }) }
            else {
                res.send({ mensaje: 'productos Encontrados', productos: productoRes.rows[0], exito: 1 });
            }
        })
        release()
    })
}

const actualizarImagenProducto = async (req, res) => {
    const { productoId } = req.params;
    const imagen = req.file;
    if (imagen) {

        const img = fs.readFileSync(path.join(__dirname, '..', 'public', 'uploads', imagen.filename));

        pg.connect((err, client, release) => {

            let querySQL = 'SELECT * FROM imagenProducto  WHERE productoId = $1 ';
            let values = [productoId];
            client.query(querySQL, values, (err, imagenRes) => {


                if (!imagenRes.rows.length) {

                    querySQL = 'INSERT INTO imagenProducto(perfilImagen,contentType,productoId ) VALUES ($1,$2,$3);';
                } else {
                    querySQL = 'UPDATE imagenProducto SET perfilImagen = $1,contentType = $2 WHERE productoId = $3';
                }

                values = [img, imagen.mimetype, productoId];
                client.query(querySQL, values, (err, imagenRes) => {
                    if (err) {

                        res.send({ mensaje: 'Error al actualizar imagen de Producto', exito: 0 });
                    } else {
                        res.send({ mensaje: 'Imagen de Producto actualizada', exito: 1 });
                    }
                })

            })

            release()
            fs.unlinkSync((path.join(__dirname, '..', 'public', 'uploads', imagen.filename)));
        })

    }
}


module.exports = {
    //CATEGORIA
    createCategoria,
    updateCategoria,
    deleteCategoria,
    getCategoria,
    getAllCategoria,
    //PRODUCTO
    createProducto,
    updateProducto,
    deleteProducto,
    getProducto,
    getAllProducto,
    getProductoCategoria

}