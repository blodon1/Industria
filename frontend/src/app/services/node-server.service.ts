import {
    Injectable
} from "@angular/core";

import {
    HttpClient,
    HttpClientModule
} from "@angular/common/http";
import {
    Observable
} from "rxjs";

@Injectable({
    providedIn: "root",
})
export class NodeServerService {
    url = "http://localhost:3000";

    constructor(private http: HttpClient) { }
    //router.get('/getAllPaises',inicio.getAllPaises);

    getAllPaises(): Observable<any> {
        return this.http.get(this.url + "/getAllPaises");
    }

    postGetToken(req_body: any): Observable<any> {
        return this.http.post(this.url + "/getToken", req_body);
    }

    getPagoLicencia(token: any): Observable<any> {
        return this.http.get(this.url + "/licencia/success/" + token);
    }

    getCheckUserLicencia(usuarioId: any): Observable<any> {
        return this.http.get(this.url + "/checkUserLicencia/" + usuarioId);
    }

    getPrueba(): Observable<any> {
        return this.http.get(this.url + "/f");
    }

    postInsertNewUser(req_body: any): Observable<any> {
        return this.http.post(this.url + "/newUser", req_body);
    }

    // REGISTRO Y LOGIN
    postNuevoUsuario(req_body: any): Observable<any> {
        return this.http.post(this.url + "/nuevoUsuario", req_body);
    }

    postInicioSesion(req_body: any): Observable<any> {
        return this.http.post(this.url + "/inicioSesion", req_body);
    }

    // USUARIO
    getVerificarUsuario(token: any): Observable<any> {
        return this.http.get(this.url + "/verificarUsuario/" + token);
    }
    postActualizarImagenPerfil(imagen: File, id: any): Observable<any> {
        const uploadData = new FormData();
        uploadData.append('imagen', imagen);
        return this.http.post(this.url + "/actualizarImagenPerfil/" + id, uploadData);
    }

    // CONTRASEÑAS
    postSolicitudNuevaContrasenia(req_body: any): Observable<any> {
        return this.http.post(this.url + "/solicitudNuevaContrasenia", req_body);
    }
    getNuevaContraseniaForm(token: any): Observable<any> {
        return this.http.get(this.url + "/nuevaContraseniaForm/" + token);
    }
    postGuardarNuevaContrasenia(req_body: any): Observable<any> {
        return this.http.post(this.url + "/guardarNuevaContrasenia", req_body);
    }

    // EMPRESA
    getDatosEmpresa(usuarioId: any): Observable<any> {
        return this.http.get(this.url + "/getDatosEmpresa/" + usuarioId);
    }
    postUpdateDatosEmpresa(req_body: any, empresaId: any): Observable<any> {
        return this.http.post(
            this.url + "/updateDatosEmpresa/" + empresaId,
            req_body
        );
    }
    postActualizarImagenEmpresa(imagen: File, empresaId: any): Observable<any> {
        const uploadData = new FormData();
        uploadData.append('imagen', imagen);
        return this.http.post(
            this.url + "/actualizarImagenEmpresa/" + empresaId,
            uploadData
        );
    }

    getDepto(deptoId: any): Observable<any> {
        return this.http.get(this.url + "/getDepto/" + deptoId);
    }
    getAllDeptos(empresaId: any): Observable<any> {
        return this.http.get(this.url + "/getAllDeptos/" + empresaId);
    }
    postCreateDepto(req_body: any, empresaId: any): Observable<any> {
        return this.http.post(this.url + "/createDepto/" + empresaId, req_body);
    }
    postUpdateDepto(req_body: any, deptoId: any): Observable<any> {
        return this.http.post(this.url + "/updateDepto/" + deptoId, req_body);
    }
    getDeleteDepto(deptoId: any): Observable<any> {
        return this.http.get(this.url + "/deleteDepto/" + deptoId);
    }

    // EMPLEADOS
    postCreateEmpleado(req_body: any, empresaId: any): Observable<any> {
        return this.http.post(this.url + "/createEmpleado/" + empresaId, req_body);
    }
    getDatosEmpleado(empleadoId: any): Observable<any> {
        return this.http.get(this.url + "/getDatosEmpleado/" + empleadoId);
    }
    getAllEmpleadosEmpresa(empresaId: any): Observable<any> {
        return this.http.get(this.url + "/getAllEmpleadosEmpresa/" + empresaId);
    }
    getAllEmpleadosDepto(deptoId: any): Observable<any> {
        return this.http.get(this.url + "/getAllEmpleadosDepto/" + deptoId);
    }
    postUpdateDatosEmpleado(req_body: any, empleadoId: any): Observable<any> {
        return this.http.post(
            this.url + "/updateDatosEmpleado/" + empleadoId,
            req_body
        );
    }
    postActualizarImagenEmpleado(
        req_body: any,
        empleadoId: any
    ): Observable<any> {
        return this.http.post(
            this.url + "/actualizarImagenEmpleado/" + empleadoId,
            req_body
        );
    }
    getDeleteEmpleado(empleadoId: any): Observable<any> {
        return this.http.get(this.url + "/deleteEmpleado/" + empleadoId);
    }
    getEmpleadoInOut(empleadoId: any): Observable<any> {
        return this.http.get(this.url + "/empleadoInOut/" + empleadoId);
    }
    getEmpleadoHorasLaboradas(empresaId: any): Observable<any> {
        return this.http.get(this.url + "/empleadoHorasLaboradas/" + empresaId);
    }
    postAddEmpleadoDepto(req_body: any): Observable<any> {
        return this.http.post(this.url + "/addEmpleadoDepto", req_body);
    }
    postRemoveEmpleadoDepto(req_body: any): Observable<any> {
        return this.http.post(this.url + "/removeEmpleadoDepto", req_body);
    }

    // CATEGORIAS
    postCreateCategoria(req_body: any, empresaId: any): Observable<any> {
        return this.http.post(this.url + "/createCategoria/" + empresaId, req_body);
    }
    postUpdateCategoria(req_body: any, categoriaId: any): Observable<any> {
        return this.http.post(
            this.url + "/updateCategoria/" + categoriaId,
            req_body
        );
    }
    getDeleteCategoria(categoriaId: any): Observable<any> {
        return this.http.get(this.url + "/deleteCategoria/" + categoriaId);
    }
    getCategoria(categoriaId: any): Observable<any> {
        return this.http.get(this.url + "/getCategoria/" + categoriaId);
    }
    getAllCategoria(empresaId: any): Observable<any> {
        return this.http.get(this.url + "/getAllCategoria/" + empresaId);
    }

    // PRODUCTO
    postCreateProducto(req_body: any, empresaId: any): Observable<any> {
        return this.http.post(this.url + "/createProducto/" + empresaId, req_body);
    }
    postUpdateProducto(req_body: any, productoId: any): Observable<any> {
        return this.http.post(this.url + "/updateProducto/" + productoId, req_body);
    }
    getDeleteProducto(productoId: any): Observable<any> {
        return this.http.get(this.url + "/deleteProducto/" + productoId);
    }
    getProducto(productoId: any): Observable<any> {
        return this.http.get(this.url + "/getProducto/" + productoId);
    }
    getAllProducto(empresaId: any): Observable<any> {
        return this.http.get(this.url + "/getAllProducto/" + empresaId);
    }
    getProductoCategoria(categoriaId: any): Observable<any> {
        return this.http.get(this.url + "/getProductoCategoria/" + categoriaId);
    }

    //PWA
    getNotificaciones(): Observable<any> {
        return this.http.get(this.url + "/notificaciones");
    }

    //PROYECTOS
    postCreateProyecto(req_body: any, empresaId: any): Observable<any> {
        return this.http.post(this.url + '/createProyecto/' + empresaId, req_body);
    }
    postUpdateProyecto(req_body: any, proyectoId: any): Observable<any> {
        return this.http.post(this.url + '/updateProyecto/' + proyectoId, req_body);
    }
    getDeleteProyecto(proyectoId: any): Observable<any> {
        return this.http.get(this.url + '/deleteProyecto/' + proyectoId);
    }
    postEstadoProyecto(req_body: any, proyectoId: any): Observable<any> {
        return this.http.post(this.url + '/estadoProyecto/' + proyectoId, req_body);
    }
    getProyecto(proyectoId: any): Observable<any> {
        return this.http.get(this.url + '/getProyecto/' + proyectoId);
    }
    getALLProyecto(empresaId: any): Observable<any> {
        return this.http.get(this.url + '/getALLProyecto/' + empresaId);
    }
    postCreateTareaProyecto(req_body: any, proyectoId: any): Observable<any> {
        return this.http.post(this.url + '/createTareaProyecto/' + proyectoId, req_body);
    }
    postUpdateTareaProyecto(req_body: any, tareaId: any): Observable<any> {
        return this.http.post(this.url + '/updateTareaProyecto/' + tareaId, req_body);
    }
    getDeleteTareaProyecto(tareaId: any): Observable<any> {
        return this.http.get(this.url + '/deleteTareaProyecto/' + tareaId);
    }
    postEstadoTareaProyecto(req_body: any, tareaId: any): Observable<any> {
        return this.http.post(this.url + '/estadoTareaProyecto/' + tareaId, req_body);
    }
    getTareaProyecto(tareaId: any): Observable<any> {
        return this.http.get(this.url + '/getTareaProyecto/' + tareaId);
    }
    getALLTareaProyecto(proyectoId: any): Observable<any> {
        return this.http.get(this.url + '/getALLTareaProyecto/' + proyectoId);
    }
    postCreateTeamWork(req_body: any, empresaId: any): Observable<any> {
        return this.http.post(this.url + '/createTeamWork/' + empresaId, req_body);
    }
    postUpdateTeamWork(req_body: any, teamWorkId: any): Observable<any> {
        return this.http.post(this.url + '/updateTeamWork/' + teamWorkId, req_body);
    }
    getDeleteTeamWork(teamWorkId: any): Observable<any> {
        return this.http.get(this.url + '/deleteTeamWork/' + teamWorkId);
    }
    getTeamWork(teamWorkId: any): Observable<any> {
        return this.http.get(this.url + '/getTeamWork/' + teamWorkId);
    }
    getALLTeamWork(empresaId: any): Observable<any> {
        return this.http.get(this.url + '/getALLTeamWork/' + empresaId);
    }
    postAddEmpleadoTW(req_body: any, teamWorkId: any): Observable<any> {
        return this.http.post(this.url + '/addEmpleadoTW/' + teamWorkId, req_body);
    }
    postRemoveEmpleadoTW(req_body: any, teamWorkId: any): Observable<any> {
        return this.http.post(this.url + '/removeEmpleadoTW/' + teamWorkId, req_body);
    }
    getEmpleadoTW(teamWorkId: any): Observable<any> {
        return this.http.get(this.url + '/getEmpleadoTW/' + teamWorkId);
    }
    postAddTWProyecto(req_body: any, proyectokId: any): Observable<any> {
        return this.http.post(this.url + '/addTWProyecto/' + proyectokId, req_body);
    }
    postRemoveTWProyecto(req_body: any, proyectokId: any): Observable<any> {
        return this.http.post(this.url + '/removeTWProyecto/' + proyectokId, req_body);
    }

    // GASTOS
    postCreateTipoGasto(req_body: any, empresaId: any): Observable<any> {
        return this.http.post(this.url + '/createTipoGasto/' + empresaId, req_body);
    }
    postUpdateTipoGasto(req_body: any, tipoGastoId: any): Observable<any> {
        return this.http.post(this.url + '/updateTipoGasto/' + tipoGastoId, req_body);
    }
    getDeleteTipoGasto(tipoGastoId: any): Observable<any> {
        return this.http.get(this.url + '/deleteTipoGasto/' + tipoGastoId);
    }
    getTipoGasto(tipoGastoId: any): Observable<any> {
        return this.http.get(this.url + '/getTipoGasto/' + tipoGastoId);
    }
    getALLTipoGasto(empresaId: any): Observable<any> {
        return this.http.get(this.url + '/getALLTipoGasto/' + empresaId);
    }
    postCreateGasto(req_body: any, empresaId: any): Observable<any> {
        return this.http.post(this.url + '/createGasto/' + empresaId, req_body);
    }
    postUpdateGasto(req_body: any, gastoId: any): Observable<any> {
        return this.http.post(this.url + '/updateGasto/' + gastoId, req_body);
    }
    postEstadoGasto(req_body: any, gastoId: any): Observable<any> {
        return this.http.post(this.url + '/estadoGasto/' + gastoId, req_body);
    }
    getDeleteGasto(gastoId: any): Observable<any> {
        return this.http.get(this.url + '/deleteGasto/' + gastoId);
    }
    getGasto(gastoId: any): Observable<any> {
        return this.http.get(this.url + '/getGasto/' + gastoId);
    }
    getALLGasto(empresaId: any): Observable<any> {
        return this.http.get(this.url + '/getALLGasto/' + empresaId);
    }

    // INFORME
    postCreateInforme(req_body: any, empresaId: any): Observable<any> {
        return this.http.post(this.url + '/createInforme/' + empresaId, req_body);
    }
    getDeleteInforme(informeId: any): Observable<any> {
        return this.http.get(this.url + '/deleteInforme/' + informeId);
    }
    getInforme(informeId: any): Observable<any> {
        return this.http.get(this.url + '/getInforme/' + informeId);
    }
    getListInforme(empresaId: any): Observable<any> {
        return this.http.get(this.url + '/getListInforme/' + empresaId);
    }
    getBdpdf(): Observable<any> {
        return this.http.get(this.url + '/bdpdf');
    }
    getALLBitacoraEmpresa(empresaId: any): Observable<any> {
        return this.http.get(this.url + '/getALLBitacoraEmpresa/' + empresaId);
    }
    getALLBitacoraUsuario(usuarioId: any): Observable<any> {
        return this.http.get(this.url + '/getALLBitacoraUsuario/' + usuarioId);
    }
    getImg(): Observable<any> {
        return this.http.get(this.url + '/img');
    }
    postNewUser(req_body: any): Observable<any> {
        return this.http.post(this.url + '/newUser', req_body);
    }
    getVerifyUser(token: any): Observable<any> {
        return this.http.get(this.url + '/verifyUser/' + token);
    }
    postUpdateImageUser(req_body: any, id: any): Observable<any> {
        return this.http.post(this.url + '/updateImageUser/' + id, req_body);
    }
}