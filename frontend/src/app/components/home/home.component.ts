import { Component, OnInit } from '@angular/core';
//formulario reactivo, lo cambian si ven necesario
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
//SERVICIOS
import { NodeServerService } from 'src/app/services/node-server.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  mensaje = {}
  datos = {}
  loginForm!: FormGroup;

  constructor(private _server: NodeServerService) { }



  crearRegistroForm(): void {

  }
  ngOnInit(): void {

  }
  logIn() {

    var usuario = this.loginForm.value;


  }

  // postPrueba(){

  //    this._server.postInsertNewUser({
  //     "email":"rotir44042@lankew.com",
  //     "user":"Albert"
  // }).subscribe(data =>{

  //   if(data.exito){
  //     Swal.fire({
  //       title: 'Usuario registrado',
  //       text: "Puede activar su usuario desde el enlace enviado a su correo electronico"+data.mensaje,
  //       icon: 'success',
  //       confirmButtonColor: '#3085d6',
  //       confirmButtonText: 'OK'
  //     }).then((result) => {

  //     });
  //   }else{
  //     Swal.fire(
  //       'Error!',
  //       'dsds',
  //       'warning',
  //     );


  //   }
  //   },err =>{
  //     console.log(err)
  //      Swal.fire(
  //       'Error!',
  //       'dsds',
  //       'warning',
  //     );
  //   });
  // }

}
