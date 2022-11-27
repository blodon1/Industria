import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario, UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {
  constructor(private _router: Router, public _user: UsuarioService) {

  }

  ngOnInit(): void {

  }
}
