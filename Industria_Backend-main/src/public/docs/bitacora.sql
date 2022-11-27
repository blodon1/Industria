/*-------------------------------------------------------------------
BitacoraEmpresa
-------------------------------------------------------------------*/
CREATE TABLE IF NOT EXISTS bitacora(
id SERIAL PRIMARY KEY,
tabla VARCHAR(300) NOT NULL,
accion VARCHAR(100) NOT NULL ,
fecha TIMESTAMP DEFAULT NOW(),
valorAnterior VARCHAR(5000) ,
valorActual VARCHAR(5000),
empresaid integer NOT NULL
);
/*-------------------------------------------------------------------
BitacoraUsuario
-------------------------------------------------------------------*/
CREATE TABLE IF NOT EXISTS bitacorausuario(
id SERIAL PRIMARY KEY,
tabla VARCHAR(300) NOT NULL,
accion VARCHAR(100) NOT NULL ,
fecha TIMESTAMP DEFAULT NOW(),
valorAnterior VARCHAR(5000) ,
valorActual VARCHAR(5000),
usuarioid integer NOT NULL
);
/*-------------------------------------------------------------------
TRIGGER EMPLEADOS INSERT
-------------------------------------------------------------------*/


CREATE FUNCTION insert_empleado() RETURNS TRIGGER
AS
$$
BEGIN

INSERT INTO "bitacora" (tabla, accion, fecha, valorActual,empresaid)
 VALUES ('Empleado', 'INSERT', NOW(), CONCAT('id:',new.id, ' ',
											 ', identidad:',new.identidad,' ',
											 ', nombre:', new.nombre,' ',
											 ', telefono:', new.telefono,' ',
											 ', email:',new.email,' ',
											 ', direccion:',new.direccion,' ',
											 ', activo:',new.activo,' ',
											 ', salariobase:', new.salariobase,' ',
											 ', empresaid:',new.empresaid,' ',
											 ', deptoempresaid:',new.deptoempresaid),new.empresaid);

RETURN NEW;

END
$$
LANGUAGE plpgsql;

CREATE TRIGGER tr_insert BEFORE INSERT ON empleados
FOR EACH ROW
EXECUTE PROCEDURE insert_empleado();

/*-------------------------------------------------------------------
TRIGGER EMPLEADOS UPDATE
-------------------------------------------------------------------*/


CREATE FUNCTION update_empleado() RETURNS TRIGGER
AS
$$
BEGIN

INSERT INTO "bitacora" (tabla, accion, fecha,valorAnterior, valorActual,empresaid)
 VALUES ('Empleado', 'UPDATE', NOW(), CONCAT('id:',old.id, ' ',
											 ', identidad:',old.identidad,' ',
											 ', nombre:', old.nombre,' ',
											 ', telefono:', old.telefono,' ',
											 ', email:',old.email,' ',
											 ', direccion:',old.direccion,' ',
											 ', activo:',old.activo,' ',
											 ', salariobase:', old.salariobase,' ',
											 ', empresaid:',old.empresaid,' ',
											 ', deptoempresaid:',old.deptoempresaid),
		                              CONCAT('id:',new.id, ' ',
											 ', identidad:',new.identidad,' ',
											 ', nombre:', new.nombre,' ',
											 ', telefono:', new.telefono,' ',
											 ', email:',new.email,' ',
											 ', direccion:',new.direccion,' ',
											 ', activo:',new.activo,' ',
											 ', salariobase:', new.salariobase,' ',
											 ', empresaid:',new.empresaid,' ',
											 ', deptoempresaid:',new.deptoempresaid), old.empresaid);

RETURN NEW;

END
$$
LANGUAGE plpgsql;

CREATE TRIGGER tr_update BEFORE UPDATE ON empleados
FOR EACH ROW
EXECUTE PROCEDURE update_empleado();


/*-------------------------------------------------------------------
TRIGGER EMPLEADOS DELETE
-------------------------------------------------------------------*/


CREATE FUNCTION delete_empleado() RETURNS TRIGGER
AS
$$
BEGIN

INSERT INTO "bitacora" (tabla, accion, fecha, valorAnterior, empresaid)
 VALUES ('Empleado', 'DELETE', NOW(), CONCAT('id:',old.id, ' ',
											 ', identidad:',old.identidad,' ',
											 ', nombre:', old.nombre,' ',
											 ', telefono:', old.telefono,' ',
											 ', email:',old.email,' ',
											 ', direccion:',old.direccion,' ',
											 ', activo:',old.activo,' ',
											 ', salariobase:', old.salariobase,' ',
											 ', empresaid:',old.empresaid,' ',
											 ', deptoempresaid:',old.deptoempresaid),old.empresaid);

RETURN NEW;

END
$$
LANGUAGE plpgsql;

CREATE TRIGGER tr_delete AFTER DELETE ON empleados
FOR EACH ROW
EXECUTE PROCEDURE delete_empleado();


/*-------------------------------------------------------------------
TRIGGER PRODUCTO INSERT
-------------------------------------------------------------------*/


CREATE FUNCTION insert_producto() RETURNS TRIGGER
AS
$$
BEGIN

INSERT INTO "bitacora" (tabla, accion, fecha, valorActual,empresaid)
 VALUES ('Producto', 'INSERT', NOW(), CONCAT('id:',new.id, ' ',
											 ', nombre:', new.nombre,' ',
											 ', descripcion:', new.descripcion,' ',
											 ', precio:',new.precio,' ',
											 ', unidades:',new.unidades,' ',
											 ', finito:',new.finito,' ',
											 ', empresaid:',new.empresaid,' ',
											 ', activo:',new.activo,' ',
											 ', categoriaid:',new.categoriaid),new.empresaid);

RETURN NEW;

END
$$
LANGUAGE plpgsql;

CREATE TRIGGER tr_insert BEFORE INSERT ON producto
FOR EACH ROW
EXECUTE PROCEDURE insert_producto();

/*-------------------------------------------------------------------
TRIGGER PRODUCTO UPDATE
-------------------------------------------------------------------*/


CREATE FUNCTION update_producto() RETURNS TRIGGER
AS
$$
BEGIN

INSERT INTO "bitacora" (tabla, accion, fecha,valorAnterior, valorActual,empresaid)
 VALUES ('Producto', 'UPDATE', NOW(), CONCAT('id:',old.id, ' ',
											 ', nombre:', old.nombre,' ',
											 ', descripcion:', old.descripcion,' ',
											 ', precio:',old.precio,' ',
											 ', unidades:',old.unidades,' ',
											 ', finito:',old.finito,' ',
											 ', empresaid:',old.empresaid,' ',
											 ', activo:',old.activo,' ',
											 ', categoriaid:',old.categoriaid),
		                              CONCAT('id:',new.id, ' ',
											 ', nombre:', new.nombre,' ',
											 ', descripcion:', new.descripcion,' ',
											 ', precio:',new.precio,' ',
											 ', unidades:',new.unidades,' ',
											 ', finito:',new.finito,' ',
											 ', empresaid:',new.empresaid,' ',
											 ', activo:',new.activo,' ',
											 ', categoriaid:',new.categoriaid), old.empresaid);

RETURN NEW;

END
$$
LANGUAGE plpgsql;

CREATE TRIGGER tr_update BEFORE UPDATE ON producto
FOR EACH ROW
EXECUTE PROCEDURE update_producto();


/*-------------------------------------------------------------------
TRIGGER PRODUCTO DELETE
-------------------------------------------------------------------*/


CREATE FUNCTION delete_producto() RETURNS TRIGGER
AS
$$
BEGIN

INSERT INTO "bitacora" (tabla, accion, fecha, valorAnterior,empresaid)
 VALUES ('Producto', 'DELETE', NOW(), CONCAT('id:',old.id, ' ',
											 ', nombre:', old.nombre,' ',
											 ', descripcion:', old.descripcion,' ',
											 ', precio:',old.precio,' ',
											 ', unidades:',old.unidades,' ',
											 ', finito:',old.finito,' ',
											 ', empresaid:',old.empresaid,' ',
											 ', activo:',old.activo,' ',
											 ', categoriaid:',old.categoriaid),old.empresaid);

RETURN NEW;

END
$$
LANGUAGE plpgsql;

CREATE TRIGGER tr_delete AFTER DELETE ON producto
FOR EACH ROW
EXECUTE PROCEDURE delete_producto();


/*-------------------------------------------------------------------
TRIGGER CATEGORIA PRODUCTO INSERT
-------------------------------------------------------------------*/


CREATE FUNCTION insert_categorias() RETURNS TRIGGER
AS
$$
BEGIN

INSERT INTO "bitacora" (tabla, accion, fecha, valorActual,empresaid)
 VALUES ('Categorias', 'INSERT', NOW(), CONCAT('id:',new.id, ' ',
											 ', nombre:', new.nombre,' ',
											 ', descripcion:', new.descripcion,' ',
											 ', empresaid:',new.empresaid,' ',
											 ', activo:',new.activo,' ',
											 ', categoriaid:',new.categoriaid),new.empresaid);

RETURN NEW;

END
$$
LANGUAGE plpgsql;

CREATE TRIGGER tr_insert BEFORE INSERT ON categoriaproducto
FOR EACH ROW
EXECUTE PROCEDURE insert_categorias();

/*-------------------------------------------------------------------
TRIGGER CATEGORIAS UPDATE
-------------------------------------------------------------------*/


CREATE FUNCTION update_categorias() RETURNS TRIGGER
AS
$$
BEGIN

INSERT INTO "bitacora" (tabla, accion, fecha,valorAnterior, valorActual,empresaid)
 VALUES ('Categorias', 'UPDATE', NOW(), CONCAT('id:',old.id, ' ',
											 ', nombre:', old.nombre,' ',
											 ', descripcion:', old.descripcion,' ',
											 ', empresaid:',old.empresaid,' ',
											 ', activo:',old.activo,' ',
											 ', categoriaid:',old.categoriaid),
		                              CONCAT('id:',new.id, ' ',
											 ', nombre:', new.nombre,' ',
											 ', descripcion:', new.descripcion,' ',
											 ', empresaid:',new.empresaid,' ',
											 ', activo:',new.activo,' ',
											 ', categoriaid:',new.categoriaid),old.empresaid);

RETURN NEW;

END
$$
LANGUAGE plpgsql;

CREATE TRIGGER tr_update BEFORE UPDATE ON categoriaproducto
FOR EACH ROW
EXECUTE PROCEDURE update_categorias();


/*-------------------------------------------------------------------
TRIGGER CATEGORIAS DELETE
-------------------------------------------------------------------*/


CREATE FUNCTION delete_categorias() RETURNS TRIGGER
AS
$$
BEGIN

INSERT INTO "bitacora" (tabla, accion, fecha, valorAnterior,empresaid)
 VALUES ('Categorias', 'DELETE', NOW(), CONCAT('id:',old.id, ' ',
											 ', nombre:', old.nombre,' ',
											 ', descripcion:', old.descripcion,' ',
											 ', empresaid:',old.empresaid,' ',
											 ', activo:',old.activo,' ',
											 ', categoriaid:',old.categoriaid),old.empresaid);

RETURN NEW;

END
$$
LANGUAGE plpgsql;

CREATE TRIGGER tr_delete AFTER DELETE ON categoriaproducto
FOR EACH ROW
EXECUTE PROCEDURE delete_categorias();	


/*-------------------------------------------------------------------
TRIGGER EMPRESAS INSERT
-------------------------------------------------------------------*/


CREATE FUNCTION insert_empresas() RETURNS TRIGGER
AS
$$
BEGIN

INSERT INTO "bitacora" (tabla, accion, fecha, valorActual,empresaid)
 VALUES ('Empresas', 'INSERT', NOW(), CONCAT('id:',new.id, ' ',
											 ', nombre:', new.nombre,' ',
											 ', email:', new.email,' ',
											 ', telefono:',new.telefono,' ',
											 ', direccion:',new.direccion,' ',
											 ', paisid:',new.paisid,' ',
											 ', usuarioid:',new.usuarioid), new.id);

RETURN NEW;

END
$$
LANGUAGE plpgsql;

CREATE TRIGGER tr_insert BEFORE INSERT ON empresas
FOR EACH ROW
EXECUTE PROCEDURE insert_empresas();

/*-------------------------------------------------------------------
TRIGGER EMPRESAS UPDATE
-------------------------------------------------------------------*/


CREATE FUNCTION update_empresas() RETURNS TRIGGER
AS
$$
BEGIN

INSERT INTO "bitacora" (tabla, accion, fecha,valorAnterior, valorActual,empresaid)
 VALUES ('Empresas', 'UPDATE', NOW(), CONCAT('id:',old.id, ' ',
											 ', nombre:', old.nombre,' ',
											 ', email:', old.email,' ',
											 ', telefono:',old.telefono,' ',
											 ', direccion:',old.direccion,' ',
											 ', paisid:',old.paisid,' ',
											 ', usuarioid:',old.usuarioid),
		                              CONCAT('id:',new.id, ' ',
											 ', nombre:', new.nombre,' ',
											 ', email:', new.email,' ',
											 ', telefono:',new.telefono,' ',
											 ', direccion:',new.direccion,' ',
											 ', paisid:',new.paisid,' ',
											 ', usuarioid:',new.usuarioid),old.id);

RETURN NEW;

END
$$
LANGUAGE plpgsql;

CREATE TRIGGER tr_update BEFORE UPDATE ON empresas
FOR EACH ROW
EXECUTE PROCEDURE update_empresas();


/*-------------------------------------------------------------------
TRIGGER EMPRESAS DELETE
-------------------------------------------------------------------*/


CREATE FUNCTION delete_empresas() RETURNS TRIGGER
AS
$$
BEGIN

INSERT INTO "bitacora" (tabla, accion, fecha, valorAnterior,empresaid)
 VALUES ('Empresas', 'DELETE', NOW(), CONCAT('id:',old.id, ' ',
											 ', nombre:', old.nombre,' ',
											 ', email:', old.email,' ',
											 ', telefono:',old.telefono,' ',
											 ', direccion:',old.direccion,' ',
											 ', paisid:',old.paisid,' ',
											 ', usuarioid:',old.usuarioid),old.id);

RETURN NEW;

END
$$
LANGUAGE plpgsql;

CREATE TRIGGER tr_delete AFTER DELETE ON empresas
FOR EACH ROW
EXECUTE PROCEDURE delete_empresas();



/*-------------------------------------------------------------------
TRIGGER TAREAS PROYECTO INSERT
-------------------------------------------------------------------*/


CREATE FUNCTION insert_tareas() RETURNS TRIGGER
AS
$$
BEGIN

INSERT INTO "bitacora" (tabla, accion, fecha, valorActual,empresaid)
 VALUES ('Tareas Proyecto', 'INSERT', NOW(), CONCAT('id:',new.id, ' ',
											 ', nombre:', new.nombre,' ',
											 ', descripcion:', new.descripcion,' ',
											 ', observacion:',new.observacion,' ',
											 ', proyectoid:',new.proyectoid,' ',
											 ', empleadoid:',new.empleadoid,' ',
											 ', inicio:',new.inicio,' ',
											 ', fin:',new.fin,' ',
											 ', estado:',new.estado), 
		 (SELECT empleados.empresaid FROM tareasproyecto INNER JOIN proyectos 
		 ON proyectos.id=tareasproyecto.proyectoid 
		 INNER JOIN empleados ON tareasproyecto.empleadoid=empleados.id 
		 WHERE proyectos.id=new.proyectoid LIMIT 1));

RETURN NEW;

END
$$
LANGUAGE plpgsql;

CREATE TRIGGER tr_insert BEFORE INSERT ON tareasproyecto
FOR EACH ROW
EXECUTE PROCEDURE insert_tareas();

/*-------------------------------------------------------------------
TRIGGER TAREAS PROYECTO UPDATE
-------------------------------------------------------------------*/


CREATE FUNCTION update_tareas() RETURNS TRIGGER
AS
$$
BEGIN

INSERT INTO "bitacora" (tabla, accion, fecha,valorAnterior, valorActual,empresaid)
 VALUES ('Tareas Proyecto', 'UPDATE', NOW(), CONCAT('id:',old.id, ' ',
											 ', nombre:', old.nombre,' ',
											 ', descripcion:', old.descripcion,' ',
											 ', observacion:',old.observacion,' ',
											 ', proyectoid:',old.proyectoid,' ',
											 ', empleadoid:',old.empleadoid,' ',
											 ', inicio:',old.inicio,' ',
											 ', fin:',old.fin,' ',
											 ', estado:',old.estado),
		                              CONCAT('id:',new.id, ' ',
											 ', nombre:', new.nombre,' ',
											 ', descripcion:', new.descripcion,' ',
											 ', observacion:',new.observacion,' ',
											 ', proyectoid:',new.proyectoid,' ',
											 ', empleadoid:',new.empleadoid,' ',
											 ', inicio:',new.inicio,' ',
											 ', fin:',new.fin,' ',
											 ', estado:',new.estado),
		(SELECT empleados.empresaid FROM proyectos INNER JOIN tareasproyecto 
		 ON proyectos.id=tareasproyecto.proyectoid 
		 INNER JOIN empleados ON tareasproyecto.empleadoid=empleados.id 
		 WHERE proyectos.id=old.proyectoid LIMIT 1));

RETURN NEW;

END
$$
LANGUAGE plpgsql;

CREATE TRIGGER tr_update BEFORE UPDATE ON tareasproyecto
FOR EACH ROW
EXECUTE PROCEDURE update_tareas();


/*-------------------------------------------------------------------
TRIGGER TAREAS PROYECTO DELETE
-------------------------------------------------------------------*/


CREATE FUNCTION delete_tareas() RETURNS TRIGGER
AS
$$
BEGIN

INSERT INTO "bitacora" (tabla, accion, fecha, valorAnterior,empresaid)
 VALUES ('Tareas Proyecto', 'DELETE', NOW(), CONCAT('id:',old.id, ' ',
											 ', nombre:', old.nombre,' ',
											 ', descripcion:', old.descripcion,' ',
											 ', observacion:',old.observacion,' ',
											 ', proyectoid:',old.proyectoid,' ',
											 ', empleadoid:',old.empleadoid,' ',
											 ', inicio:',old.inicio,' ',
											 ', fin:',old.fin,' ',
											 ', estado:',old.estado),
		(SELECT empleados.empresaid FROM proyectos INNER JOIN tareasproyecto 
		 ON proyectos.id=tareasproyecto.proyectoid 
		 INNER JOIN empleados ON tareasproyecto.empleadoid=empleados.id 
		 WHERE proyectos.id=old.proyectoid LIMIT 1));

RETURN NEW;

END
$$
LANGUAGE plpgsql;

CREATE TRIGGER tr_delete AFTER DELETE ON tareasproyecto
FOR EACH ROW
EXECUTE PROCEDURE delete_tareas();

/*-------------------------------------------------------------------
BITACORA USUARIOS
---------------------------------------------------------------------
TRIGGER USUARIOS INSERT
-------------------------------------------------------------------*/


CREATE FUNCTION insert_usuarios() RETURNS TRIGGER
AS
$$
BEGIN

INSERT INTO "bitacorausuario" (tabla, accion, fecha, valorActual,usuarioid)
 VALUES ('Usuarios', 'INSERT', NOW(), CONCAT('id:',new.id, ' ',
											 ', nombre:', new.nombre,' ',
											 ', email:', new.email,' ',
											 ', telefono:',new.telefono,' ',
											 ', direccion:',new.direccion,' ',
											 ', tipo:',new.tipo,' ',
											 ', estado:',new.estadohabilitacion,' ',
											 ', creacion:',new.creacion),new.id);

RETURN NEW;

END
$$
LANGUAGE plpgsql;

CREATE TRIGGER tr_insert BEFORE INSERT ON usuarios
FOR EACH ROW
EXECUTE PROCEDURE insert_usuarios();

/*-------------------------------------------------------------------
TRIGGER USUARIOS UPDATE
-------------------------------------------------------------------*/


CREATE FUNCTION update_usuarios() RETURNS TRIGGER
AS
$$
BEGIN

INSERT INTO "bitacorausuario" (tabla, accion, fecha,valorAnterior, valorActual,usuarioid)
 VALUES ('Usuarios', 'UPDATE', NOW(), CONCAT('id:',old.id, ' ',
											 ', nombre:', old.nombre,' ',
											 ', email:', old.email,' ',
											 ', telefono:',old.telefono,' ',
											 ', direccion:',old.direccion,' ',
											 ', tipo:',old.tipo,' ',
											 ', estado:',old.estadohabilitacion,' ',
											 ', creacion:',old.creacion),
		                              CONCAT('id:',new.id, ' ',
											 ', nombre:', new.nombre,' ',
											 ', email:', new.email,' ',
											 ', telefono:',new.telefono,' ',
											 ', direccion:',new.direccion,' ',
											 ', tipo:',new.tipo,' ',
											 ', estado:',new.estadohabilitacion,' ',
											 ', creacion:',new.creacion), old.id);

RETURN NEW;

END
$$
LANGUAGE plpgsql;

CREATE TRIGGER tr_update BEFORE UPDATE ON usuarios
FOR EACH ROW
EXECUTE PROCEDURE update_usuarios();


/*-------------------------------------------------------------------
TRIGGER USUARIOS DELETE
-------------------------------------------------------------------*/


CREATE FUNCTION delete_usuarios() RETURNS TRIGGER
AS
$$
BEGIN

INSERT INTO "bitacorausuario" (tabla, accion, fecha, valorAnterior,usuarioid)
 VALUES ('Usuarios', 'DELETE', NOW(), CONCAT('id:',old.id, ' ',
											 ', nombre:', old.nombre,' ',
											 ', email:', old.email,' ',
											 ', telefono:',old.telefono,' ',
											 ', direccion:',old.direccion,' ',
											 ', tipo:',old.tipo,' ',
											 ', estado:',old.estadohabilitacion,' ',
											 ', creacion:',old.creacion),old.id);

RETURN NEW;

END
$$
LANGUAGE plpgsql;

CREATE TRIGGER tr_delete AFTER DELETE ON usuarios
FOR EACH ROW
EXECUTE PROCEDURE delete_usuarios();


/*-----------------------------------------------------------------
TRIGGER LICENCIA INSERT
-------------------------------------------------------------------*/


CREATE FUNCTION insert_licencia() RETURNS TRIGGER
AS
$$
BEGIN

INSERT INTO "bitacorausuario" (tabla, accion, fecha, valorActual,usuarioid)
 VALUES ('Licencia', 'INSERT', NOW(), CONCAT('id:',new.id, ' ',
											 ', descripcion:', new.descripcion,' ',
											 ', temporal:', new.temporal,' ',
											 ', activa:',new.activa,' ',
											 ', fecha:',new.fecha_referencia,' ',
											 ', usuarioid:',new.usuarioid,' ',
											 ', creacion:',new.creacion), new.usuarioid);

RETURN NEW;

END
$$
LANGUAGE plpgsql;

CREATE TRIGGER tr_insert BEFORE INSERT ON licencia
FOR EACH ROW
EXECUTE PROCEDURE insert_licencia();

/*-------------------------------------------------------------------
TRIGGER LICENCIA UPDATE
-------------------------------------------------------------------*/


CREATE FUNCTION update_licencia() RETURNS TRIGGER
AS
$$
BEGIN

INSERT INTO "bitacorausuario" (tabla, accion, fecha,valorAnterior, valorActual,usuarioid)
 VALUES ('Licencia', 'UPDATE', NOW(), CONCAT('id:',old.id, ' ',
											 ', descripcion:', old.descripcion,' ',
											 ', temporal:', old.temporal,' ',
											 ', activa:',old.activa,' ',
											 ', fecha:',old.fecha_referencia,' ',
											 ', usuarioid:',old.usuarioid,' ',
											 ', creacion:',old.creacion),
		                              CONCAT('id:',new.id, ' ',
											 ', descripcion:', new.descripcion,' ',
											 ', temporal:', new.temporal,' ',
											 ', activa:',new.activa,' ',
											 ', fecha:',new.fecha_referencia,' ',
											 ', usuarioid:',new.usuarioid,' ',
											 ', creacion:',new.creacion), old.usuarioid);

RETURN NEW;

END
$$
LANGUAGE plpgsql;

CREATE TRIGGER tr_update BEFORE UPDATE ON licencia
FOR EACH ROW
EXECUTE PROCEDURE update_licencia();


/*-------------------------------------------------------------------
TRIGGER LICENCIA DELETE
-------------------------------------------------------------------*/


CREATE FUNCTION delete_licencia() RETURNS TRIGGER
AS
$$
BEGIN

INSERT INTO "bitacorausuario" (tabla, accion, fecha, valorAnterior,usuarioid)
 VALUES ('Licencia', 'DELETE', NOW(), CONCAT('id:',old.id, ' ',
											 ', descripcion:', old.descripcion,' ',
											 ', temporal:', old.temporal,' ',
											 ', activa:',old.activa,' ',
											 ', fecha:',old.fecha_referencia,' ',
											 ', usuarioid:',old.usuarioid,' ',
											 ', creacion:',old.creacion),old.usuarioid);

RETURN NEW;

END
$$
LANGUAGE plpgsql;

CREATE TRIGGER tr_delete AFTER DELETE ON licencia
FOR EACH ROW
EXECUTE PROCEDURE delete_licencia();


