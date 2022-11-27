
CREATE TABLE IF NOT EXISTS paises (
  id INTEGER PRIMARY KEY,
  codigo varchar(11) ,
  iso3166a1 varchar(5) default NULL,
  iso3166a2 varchar(5) default NULL,
  nombre varchar(100) NOT NULL
);


CREATE TABLE IF NOT EXISTS tipoUsuario(
  id INTEGER PRIMARY KEY,
  descripcion VARCHAR(100)
);



CREATE TABLE IF NOT EXISTS usuarios(
 id SERIAL PRIMARY KEY,
 nombre       VARCHAR(200) DEFAULT 'Administrador'   ,
 email         VARCHAR(30)  UNIQUE  ,
 telefono varchar(16) ,
 direccion     VARCHAR(200) ,
 paisId INTEGER NOT NULL REFERENCES paises(id),
 tipo INTEGER NOT NULL REFERENCES tipoUsuario(id) DEFAULT 1,
 estadoHabilitacion BOOLEAN DEFAULT FALSE,
 creacion TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS datosInicioSesion (
  id SERIAL PRIMARY KEY,
  contrasenia varchar(200) NOT NULL,
  estado BOOLEAN DEFAULT TRUE,
  usuarioId INTEGER NOT NULL REFERENCES usuarios(id),
   creacion TIMESTAMP DEFAULT NOW()
) ;

CREATE TABLE IF NOT EXISTS imagenPerfil(
id SERIAL PRIMARY KEY,
perfilImagen BYTEA,
contentType VARCHAR(30),
usuarioId INTEGER NOT NULL REFERENCES usuarios(id),
 creacion TIMESTAMP DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS empresas(
  id SERIAL PRIMARY KEY,
  nombre   VARCHAR(200) DEFAULT 'Mi Empresa'  ,
  email    VARCHAR(30)  UNIQUE,
  telefono varchar(16) ,
  direccion  VARCHAR(200) ,
  paisId INTEGER NOT NULL REFERENCES paises(id),
  usuarioId INTEGER NOT NULL REFERENCES usuarios(id),
   creacion TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS imagenEmpresa(
id SERIAL PRIMARY KEY,
perfilImagen BYTEA,
contentType VARCHAR(30),
empresaId INTEGER NOT NULL REFERENCES empresas(id),
 creacion TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS deptoEmpresa(
id SERIAL PRIMARY KEY,
nombre VARCHAR(100) DEFAULT 'GENERAL',
descripcion VARCHAR(300) DEFAULT 'GENERAL',
empresaId INTEGER NOT NULL REFERENCES empresas(id),
creacion TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS empleados(
 id SERIAL PRIMARY KEY,
 identidad VARCHAR(200) UNIQUE,
 nombre        VARCHAR(200) ,
 telefono      VARCHAR(30) ,
 email         VARCHAR(30)UNIQUE,
 direccion     VARCHAR(200) ,
 salarioBase DOUBLE PRECISION,
 empresaId INTEGER NOT NULL REFERENCES empresas(id),
 creacion TIMESTAMP DEFAULT NOW(),
 activo BOOLEAN DEFAULT TRUE,
 deptoEmpresaId INTEGER REFERENCES deptoEmpresa(id)
);

CREATE TABLE IF NOT EXISTS imagenEmpleado(
id SERIAL PRIMARY KEY,
perfilImagen BYTEA,
contentType VARCHAR(30),
empleadoId INTEGER NOT NULL REFERENCES empleados(id),
creacion TIMESTAMP DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS InOutEmpleado(
id SERIAL PRIMARY KEY,
entrada TIMESTAMP DEFAULT NOW(),
salida TIMESTAMP,
activo BOOLEAN DEFAULT TRUE,
empleadoId INTEGER NOT NULL REFERENCES empleados(id)
);

---Licencias
CREATE TABLE IF NOT EXISTS licencia(
 id SERIAL PRIMARY KEY,
 descripcion     VARCHAR(300),
 temporal BOOLEAN DEFAULT TRUE,
 activa BOOLEAN DEFAULT TRUE,
 fecha_referencia TIMESTAMP,
 usuarioId INTEGER NOT NULL REFERENCES usuarios(id),
 creacion TIMESTAMP DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS pagoLicencia(
 id SERIAL PRIMARY KEY,
 pago DOUBLE PRECISION,
 licenciaId INTEGER NOT NULL REFERENCES  licencia(id),
 fechaPago TIMESTAMP DEFAULT NOW()
);
--- PRODUCTOS

CREATE TABLE IF NOT EXISTS categoriaProducto(
 id SERIAL PRIMARY KEY,
 nombre        VARCHAR(30) ,
 descripcion     VARCHAR(300),
 empresaId INTEGER NOT NULL REFERENCES empresas(id),
 creacion TIMESTAMP DEFAULT NOW(),
 activo BOOLEAN DEFAULT TRUE,
 categoriaId INTEGER REFERENCES categoriaProducto(id)
);


CREATE TABLE IF NOT EXISTS producto(
 id SERIAL PRIMARY KEY,
 nombre        VARCHAR(30) ,
 descripcion     VARCHAR(300) ,
 precio DOUBLE PRECISION,
 unidades INTEGER DEFAULT 0,
 finito BOOLEAN DEFAULT TRUE,
 empresaId INTEGER NOT NULL REFERENCES empresas(id),
 creacion TIMESTAMP DEFAULT NOW(),
 activo BOOLEAN DEFAULT TRUE,
 categoriaId INTEGER REFERENCES categoriaProducto(id)
);

CREATE TABLE IF NOT EXISTS imagenProducto(
id SERIAL PRIMARY KEY,
perfilImagen BYTEA,
contentType VARCHAR(30),
productoId INTEGER NOT NULL REFERENCES producto(id),
creacion TIMESTAMP DEFAULT NOW()
);

---PROYECTOS/EQUIPOS DE TRABAJO JENIFER
CREATE TYPE prEstado AS ENUM ('POR INICIAR', 'EN PROCESO', 'FINALIZADO') ;
CREATE TABLE IF NOT EXISTS teamWork(
  id SERIAL PRIMARY KEY NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  empresaId INTEGER NOT NULL REFERENCES empresas(id)
);


CREATE TABLE IF NOT EXISTS proyectos
(
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(500) NOT NULL,
    inicio DATE NOT NULL,
    fin DATE NOT NULL,
    teamWorkId INTEGER REFERENCES teamWork(id),
    empresaId INTEGER NOT NULL REFERENCES empresas(id),
    activo BOOLEAN DEFAULT TRUE,
    estado prEstado DEFAULT 'POR INICIAR'
);

CREATE TABLE IF NOT EXISTS tareasProyecto
(
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(500) NOT NULL,
    observacion VARCHAR(500),
    proyectoId INTEGER NOT NULL REFERENCES proyectos(id),
    empleadoId INTEGER NOT NULL REFERENCES empleados(id),
    inicio DATE NOT NULL,
    fin DATE NOT NULL,
    estado prEstado DEFAULT 'POR INICIAR'
);


CREATE TABLE IF NOT EXISTS empleadosTeamWork(
  id SERIAL PRIMARY KEY NOT NULL,
  teamWorkId INTEGER NOT NULL REFERENCES teamWork(id),
  empleadoId INTEGER NOT NULL REFERENCES empleados(id)
);

---GASTOS Y REPORTES DE GASTOS

CREATE TYPE gtEstado AS ENUM ('PENDIENTE', 'PAGADO') ;
CREATE TABLE IF NOT EXISTS tipoGasto(
  id SERIAL PRIMARY KEY NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  descripcion VARCHAR(200) NOT NULL,
  empresaId INTEGER NOT NULL REFERENCES empresas(id),
  activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS gastos
(
    id SERIAL PRIMARY KEY,
    descripcion VARCHAR(200) NOT NULL,
    detalle VARCHAR(500),
    tipoId INTEGER NOT NULL REFERENCES tipoGasto(id),
    empresaId INTEGER NOT NULL REFERENCES empresas(id),
    totalGasto DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    estado gtEstado DEFAULT 'PENDIENTE'
);

CREATE TABLE IF NOT EXISTS infoGasto(
id SERIAL PRIMARY KEY,
nombre VARCHAR(200) NOT NULL,
informe BYTEA,
fecha_ini DATE NOT NULL,
fecha_fin DATE NOT NULL,
empresaId INTEGER NOT NULL REFERENCES empresas(id),
creacion TIMESTAMP DEFAULT NOW()
);

--TRIGGER EMPRESA Y LICENCIA
CREATE  FUNCTION  insert_empresa_licencia() RETURNS TRIGGER
AS
$$
BEGIN

INSERT INTO "empresas" (paisId,usuarioId) VALUES (new.paisId,new.id);
INSERT INTO "licencia" (descripcion,fecha_referencia,usuarioId) VALUES ('temporal',(NOW() + interval '1 hour'),new.id);

RETURN NEW;

END
$$
LANGUAGE plpgsql;


CREATE TRIGGER tr_new_user AFTER INSERT ON usuarios
FOR EACH ROW
EXECUTE PROCEDURE insert_empresa_licencia();


INSERT INTO tipoUsuario(id,descripcion) VALUES 
(1,'Administrador'),
(2,'Empleado');

INSERT INTO paises(id,iso3166a1,iso3166a2,nombre) VALUES (1, '4', 'AFG', 'Afganistán');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (2, '2AX', 'ALA', 'Islas Gland');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (3, '8', 'ALB', 'Albania');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (4, '2DE', 'DEU', 'Alemania');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (5, '2D', 'AND', 'Andorra');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (6, '2O', 'AGO', 'Angola');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (7, '6AI', 'AIA', 'Anguilla');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (8, '1Q', 'ATA', 'Antártida');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (9, '2G', 'ATG', 'Antigua y Barbuda');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (10, 'AN', 'ANT', 'Antillas Holandesas');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (11, 'SA', 'SAU', 'Arabia Saudí');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (12, 'DZ', 'DZA', 'Argelia');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (13, 'AR', 'ARG', 'Argentina');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (14, 'AM', 'ARM', 'Armenia');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (15, 'AW', 'ABW', 'Aruba');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (16, 'AU', 'AUS', 'Australia');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (17, 'AT', 'AUT', 'Austria');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (18, 'AZ', 'AZE', 'Azerbaiyán');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (19, 'BS', 'BHS', 'Bahamas');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (20, 'BH', 'BHR', 'Bahréin');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (21, 'BD', 'BGD', 'Bangladesh');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (22, 'BB', 'BRB', 'Barbados');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (23, 'BY', 'BLR', 'Bielorrusia');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (24, 'BE', 'BEL', 'Bélgica');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (25, 'BZ', 'BLZ', 'Belice');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (26, 'BJ', 'BEN', 'Benin');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (27, 'BM', 'BMU', 'Bermudas');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (28, 'BT', 'BTN', 'Bhután');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (29, 'BO', 'BOL', 'Bolivia');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (30, 'BA', 'BIH', 'Bosnia y Herzegovina');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (31, 'BW', 'BWA', 'Botsuana');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (32, 'BV', 'BVT', 'Isla Bouvet');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (33, 'BR', 'BRA', 'Brasil');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (34, 'BN', 'BRN', 'Brunéi');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (35, 'BG', 'BGR', 'Bulgaria');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (36, 'BF', 'BFA', 'Burkina Faso');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (37, 'BI', 'BDI', 'Burundi');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (38, 'CV', 'CPV', 'Cabo Verde');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (39, 'KY', 'CYM', 'Islas Caimán');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (40, 'KH', 'KHM', 'Camboya');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (41, 'CM', 'CMR', 'Camerún');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (42, 'CA', 'CAN', 'Canadá');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (43, 'CF', 'CAF', 'República Centroafricana');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (44, 'TD', 'TCD', 'Chad');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (45, 'CZ', 'CZE', 'República Checa');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (46, 'CL', 'CHL', 'Chile');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (47, 'CN', 'CHN', 'China');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (48, 'CY', 'CYP', 'Chipre');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (49, 'CX', 'CXR', 'Isla de Navidad');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (50, 'VA', 'VAT', 'Ciudad del Vaticano');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (51, 'CC', 'CCK', 'Islas Cocos');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (52, 'CO', 'COL', 'Colombia');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (53, 'KM', 'COM', 'Comoras');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (54, 'CD', 'COD', 'República Democrática del Congo');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (55, 'CG', 'COG', 'Congo');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (56, 'CK', 'COK', 'Islas Cook');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (57, 'KP', 'PRK', 'Corea del Norte');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (58, 'KR', 'KOR', 'Corea del Sur');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (59, 'CI', 'CIV', 'Costa de Marfil');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (60, 'CR', 'CRI', 'Costa Rica');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (61, 'HR', 'HRV', 'Croacia');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (62, 'CU', 'CUB', 'Cuba');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (63, 'DK', 'DNK', 'Dinamarca');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (64, 'DM', 'DMA', 'Dominica');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (65, 'DO', 'DOM', 'República Dominicana');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (66, 'EC', 'ECU', 'Ecuador');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (67, 'EG', 'EGY', 'Egipto');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (68, 'SV', 'SLV', 'El Salvador');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (69, 'AE', 'ARE', 'Emiratos Árabes Unidos');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (70, 'ER', 'ERI', 'Eritrea');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (71, 'SK', 'SVK', 'Eslovaquia');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (72, 'SI', 'SVN', 'Eslovenia');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (73, 'ES', 'ESP', 'España');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (74, 'UM', 'UMI', 'Islas ultramarinas de Estados Unidos');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (75, 'US', 'USA', 'Estados Unidos');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (76, 'EE', 'EST', 'Estonia');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (77, 'ET', 'ETH', 'Etiopía');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (78, 'FO', 'FRO', 'Islas Feroe');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (79, 'PH', 'PHL', 'Filipinas');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (80, 'FI', 'FIN', 'Finlandia');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (81, 'FJ', 'FJI', 'Fiyi');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (82, 'FR', 'FRA', 'Francia');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (83, 'GA', 'GAB', 'Gabón');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (84, 'GM', 'GMB', 'Gambia');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (85, 'GE', 'GEO', 'Georgia');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (86, 'GS', 'SGS', 'Islas Georgias del Sur y Sandwich del Sur');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (87, 'GH', 'GHA', 'Ghana');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (88, 'GI', 'GIB', 'Gibraltar');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (89, 'GD', 'GRD', 'Granada');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (90, 'GR', 'GRC', 'Grecia');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (91, 'GL', 'GRL', 'Groenlandia');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (92, 'GP', 'GLP', 'Guadalupe');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (93, 'GU', 'GUM', 'Guam');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (94, 'GT', 'GTM', 'Guatemala');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (95, 'GF', 'GUF', 'Guayana Francesa');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (96, 'GN', 'GIN', 'Guinea');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (97, 'GQ', 'GNQ', 'Guinea Ecuatorial');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (98, 'GW', 'GNB', 'Guinea-Bissau');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (99, 'GY', 'GUY', 'Guyana');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (100, 'HT', 'HTI', 'Haití');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (101, 'HM', 'HMD', 'Islas Heard y McDonald');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (102, 'HN', 'HND', 'Honduras');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (103, 'HK', 'HKG', 'Hong Kong');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (104, 'HU', 'HUN', 'Hungría');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (105, 'IN', 'IND', 'India');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (106, 'ID', 'IDN', 'Indonesia');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (107, 'IR', 'IRN', 'Irán');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (108, 'IQ', 'IRQ', 'Iraq');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (109, 'IE', 'IRL', 'Irlanda');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (110, 'IS', 'ISL', 'Islandia');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (111, 'IL', 'ISR', 'Israel');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (112, 'IT', 'ITA', 'Italia');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (113, 'JM', 'JAM', 'Jamaica');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (114, 'JP', 'JPN', 'Japón');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (115, 'JO', 'JOR', 'Jordania');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (116, 'KZ', 'KAZ', 'Kazajstán');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (117, 'KE', 'KEN', 'Kenia');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (118, 'KG', 'KGZ', 'Kirguistán');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (119, 'KI', 'KIR', 'Kiribati');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (120, 'KW', 'KWT', 'Kuwait');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (121, 'LA', 'LAO', 'Laos');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (122, 'LS', 'LSO', 'Lesotho');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (123, 'LV', 'LVA', 'Letonia');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (124, 'LB', 'LBN', 'Líbano');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (125, 'LR', 'LBR', 'Liberia');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (126, 'LY', 'LBY', 'Libia');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (127, 'LI', 'LIE', 'Liechtenstein');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (128, 'LT', 'LTU', 'Lituania');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (129, 'LU', 'LUX', 'Luxemburgo');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (130, 'MO', 'MAC', 'Macao');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (131, 'MK', 'MKD', 'ARY Macedonia');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (132, 'MG', 'MDG', 'Madagascar');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (133, 'MY', 'MYS', 'Malasia');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (134, 'MW', 'MWI', 'Malawi');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (135, 'MV', 'MDV', 'Maldivas');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (136, 'ML', 'MLI', 'Malí');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (137, 'MT', 'MLT', 'Malta');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (138, 'FK', 'FLK', 'Islas Malvinas');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (139, 'MP', 'MNP', 'Islas Marianas del Norte');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (140, 'MA', 'MAR', 'Marruecos');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (141, 'MH', 'MHL', 'Islas Marshall');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (142, 'MQ', 'MTQ', 'Martinica');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (143, 'MU', 'MUS', 'Mauricio');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (144, 'MR', 'MRT', 'Mauritania');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (145, 'YT', 'MYT', 'Mayotte');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (146, 'MX', 'MEX', 'México');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (147, 'FM', 'FSM', 'Micronesia');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (148, 'MD', 'MDA', 'Moldavia');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (149, 'MC', 'MCO', 'Mónaco');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (150, 'MN', 'MNG', 'Mongolia');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (151, 'MS', 'MSR', 'Montserrat');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (152, 'MZ', 'MOZ', 'Mozambique');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (153, 'MM', 'MMR', 'Myanmar');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (154, 'NA', 'NAM', 'Namibia');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (155, 'NR', 'NRU', 'Nauru');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (156, 'NP', 'NPL', 'Nepal');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (157, 'NI', 'NIC', 'Nicaragua');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (158, 'NE', 'NER', 'Níger');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (159, 'NG', 'NGA', 'Nigeria');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (160, 'NU', 'NIU', 'Niue');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (161, 'NF', 'NFK', 'Isla Norfolk');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (162, 'NO', 'NOR', 'Noruega');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (163, 'NC', 'NCL', 'Nueva Caledonia');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (164, 'NZ', 'NZL', 'Nueva Zelanda');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (165, 'OM', 'OMN', 'Omán');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (166, 'NL', 'NLD', 'Países Bajos');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (167, 'PK', 'PAK', 'Pakistán');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (168, 'PW', 'PLW', 'Palau');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (169, 'PS', 'PSE', 'Palestina');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (170, 'PA', 'PAN', 'Panamá');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (171, 'PG', 'PNG', 'Papúa Nueva Guinea');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (172, 'PY', 'PRY', 'Paraguay');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (173, 'PE', 'PER', 'Perú');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (174, 'PN', 'PCN', 'Islas Pitcairn');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (175, 'PF', 'PYF', 'Polinesia Francesa');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (176, 'PL', 'POL', 'Polonia');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (177, 'PT', 'PRT', 'Portugal');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (178, 'PR', 'PRI', 'Puerto Rico');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (179, 'QA', 'QAT', 'Qatar');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (180, 'GB', 'GBR', 'Reino Unido');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (181, 'RE', 'REU', 'Reunión');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (182, 'RW', 'RWA', 'Ruanda');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (183, 'RO', 'ROU', 'Rumania');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (184, 'RU', 'RUS', 'Rusia');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (185, 'EH', 'ESH', 'Sahara Occidental');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (186,'SB', 'SLB', 'Islas Salomón');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (187, 'WS', 'WSM', 'Samoa');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (188,'AS', 'ASM', 'Samoa Americana');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (189, 'KN', 'KNA', 'San Cristóbal y Nevis');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (190, 'SM', 'SMR', 'San Marino');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (191, 'PM', 'SPM', 'San Pedro y Miquelón');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (192, 'VC', 'VCT', 'San Vicente y las Granadinas');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (193, 'SH', 'SHN', 'Santa Helena');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (194, 'LC', 'LCA', 'Santa Lucía');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (195, 'ST', 'STP', 'Santo Tomé y Príncipe');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (196, 'SN', 'SEN', 'Senegal');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (197, 'CS', 'SCG', 'Serbia y Montenegro');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (198, 'SC', 'SYC', 'Seychelles');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (199, 'SL', 'SLE', 'Sierra Leona');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (200, 'SG', 'SGP', 'Singapur');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (201, 'SY', 'SYR', 'Siria');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (202, 'SO', 'SOM', 'Somalia');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (203, 'LK', 'LKA', 'Sri Lanka');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (204, 'SZ', 'SWZ', 'Suazilandia');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (205, 'ZA', 'ZAF', 'Sudáfrica');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (206, 'SD', 'SDN', 'Sudán');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (207, 'SE', 'SWE', 'Suecia');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (208, 'CH', 'CHE', 'Suiza');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (209, 'SR', 'SUR', 'Surinam');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (210, 'SJ', 'SJM', 'Svalbard y Jan Mayen');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (211, 'TH', 'THA', 'Tailandia');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (212, 'TW', 'TWN', 'Taiwán');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (213, 'TZ', 'TZA', 'Tanzania');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (214, 'TJ', 'TJK', 'Tayikistán');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (215,'IO', 'IOT', 'Territorio Británico del Océano Índico');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (216, 'TF', 'ATF', 'Territorios Australes Franceses');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (217, 'TL', 'TLS', 'Timor Oriental');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (218, 'TG', 'TGO', 'Togo');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (219, 'TK', 'TKL', 'Tokelau');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (220, 'TO', 'TON', 'Tonga');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (221, 'TT', 'TTO', 'Trinidad y Tobago');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (222, 'TN', 'TUN', 'Túnez');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (223, 'TC', 'TCA', 'Islas Turcas y Caicos');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (224, 'TM', 'TKM', 'Turkmenistán');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (225, 'TR', 'TUR', 'Turquía');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (226, 'TV', 'TUV', 'Tuvalu');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (227, 'UA', 'UKR', 'Ucrania');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (228, 'UG', 'UGA', 'Uganda');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (229, 'UY', 'URY', 'Uruguay');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (230, 'UZ', 'UZB', 'Uzbekistán');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (231, 'VU', 'VUT', 'Vanuatu');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (232, 'VE', 'VEN', 'Venezuela');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (233, 'VN', 'VNM', 'Vietnam');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (234,'VG', 'VGB', 'Islas Vírgenes Británicas');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (235, 'VI', 'VIR', 'Islas Vírgenes de los Estados Unidos');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (236, 'WF', 'WLF', 'Wallis y Futuna');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (237, 'YE', 'YEM', 'Yemen');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (238, 'DJ', 'DJI', 'Yibuti');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (239, 'ZM', 'ZMB', 'Zambia');
INSERT INTO paises (id,iso3166a1,iso3166a2,nombre)  VALUES (240, 'ZW', 'ZWE', 'Zimbabue');