import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { cilChevronLeft, cilChevronRight, cilPlus } from "@coreui/icons";
import { IconSetService } from "@coreui/icons-angular";
import { Subject } from "rxjs";
import { NodeServerService } from "src/app/services/node-server.service";
import { UsuarioService } from "src/app/services/usuario.service";

@Component({
    selector: 'app-proyectos',
    templateUrl: './proyectos.component.html',
    styleUrls: ['./proyectos.component.css']
})
export class ProyectosComponent implements OnInit {
    actualizar: Subject<boolean> = new Subject();
    
    proyectos: any[] = [];
    index: any = null;
    proyecto: number | null = null;
    state: State = State.NONE;

    constructor(public _user: UsuarioService, private _server: NodeServerService, private _router: Router, public icons: IconSetService) {
        icons.icons = { cilPlus, cilChevronRight, cilChevronLeft }
    }

    ngOnInit(): void {
        this._server.getALLProyecto(this._user.getEmpresa().id).subscribe(data => {
            console.log(data);
            this.proyectos = data.proyectos;
            if (this.proyectos.length > 0) {
                this.index = 0;
            }
        })
    }

    save() {
        this.goBack();
        this.actualizar.next(true);
    }

    newTask() {
        this.state = State.TASK;
    }

    newProject() {
        this.state = State.PROJECT;
    }

    newTeam() {
        this.state = State.TEAM;
    }

    isMain() {
        return this.state === State.NONE;
    }

    isTask() {
        return this.state === State.TASK;
    }

    isProject() {
        return this.state === State.PROJECT;
    }

    isTeam() {
        return this.state === State.TEAM;
    }

    goBack() {
        this.state = State.NONE;
        console.log(this.state);
    }

    next() {
        if (this.index + 1 < this.proyectos.length) {
            this.index++;
        } else {
            this.index = 0;
        }
    }

    previous() {
        if (this.index - 1 >= 0) {
            this.index--;
        } else {
            this.index = this.proyectos.length;
        }
    }
}

export enum State {
    NONE,
    PROJECT,
    TASK,
    TEAM
}
