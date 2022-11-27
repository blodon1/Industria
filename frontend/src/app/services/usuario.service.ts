import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
    providedIn: 'root'
})

export class UsuarioService {

    constructor(private _sanitizer: DomSanitizer) { }

    logged(): boolean {
        return localStorage.getItem('usuario') != null;
    }

    conLicencia(): boolean {
        let licencia = this.getLicencia();
        return licencia.activa != null && licencia.activa;
    }

    getUsuario(): Usuario {
        let data = localStorage.getItem('usuario');
        return data != null ? JSON.parse(data) : {};
    }

    getImagenUsuario() {
        let user = this.getUsuario();
        return this._sanitizer.bypassSecurityTrustResourceUrl('data:' + user?.tipoimagen + ';base64,'
            + user?.imagen);
    }

    getImagenEmpresa() {
        let empresa = this.getEmpresa();
        return this._sanitizer.bypassSecurityTrustResourceUrl('data:' + empresa?.tipoimagen + ';base64,'
            + empresa?.imagen);
    }

    getEmpresa(): Empresa {
        let data = localStorage.getItem('empresa');
        return data != null ? JSON.parse(data) : {};
    }

    getLicencia(): Licencia {
        let data = localStorage.getItem('licencia');
        return data != null ? JSON.parse(data) : {};
    }

    actualizarUsuario(usuario: any) {
        localStorage.setItem('usuario', JSON.stringify(usuario));
    }

    actualizarEmpresa(empresa: any) {
        localStorage.setItem('empresa', JSON.stringify(empresa));
    }

    actualizarLicencia(licencia: any) {
        localStorage.setItem('licencia', JSON.stringify(licencia));
    }

    salir(): void {
        localStorage.removeItem('usuario');
        localStorage.removeItem('empresa');
    }

    canActivate() {
        return this.logged();
    }

    getLinks(): any[] {
        if (this.logged()) {
            let links = [
                { title: 'Administración', fragment: 'admin' },
                { title: 'Productos', fragment: 'productos' },
                { title: 'Categorias', fragment: 'categorias' },
            ]

            if (this.conLicencia()) {
                links.push(
                    { title: 'Proyectos', fragment: 'proyectos' })
            }

            return links;
        }
        return [];
    }
}

export interface Usuario {
    id: number;
    nombre: string;
    email: string;
    telefono: string;
    paisid: number;
    creacion: string;
    tipo: number;
    imagen: any;
    tipoimagen: string;
}

export interface Empresa {
    id: number;
    creacion: string;
    email: string;
    direccion: string;
    nombre: string;
    paisid: number;
    telefono: string;
    imagen: any;
    tipoimagen: string;
}

export interface Licencia {
    id: number;
    descripcion: string;
    temporal: boolean;
    activa: boolean;
    fecha_referencia: string;
}
