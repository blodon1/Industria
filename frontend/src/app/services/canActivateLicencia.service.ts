import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { UsuarioService } from "./usuario.service";

@Injectable()
export class canActivateLicencia implements CanActivate {
    constructor(private _user : UsuarioService) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this._user.conLicencia();
    }
}