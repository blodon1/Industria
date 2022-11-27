import { Component } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { NodeServerService } from './services/node-server.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'front_Industria';

  readonly VAPID_PUBLIC_KEY = '';

  constructor(
    private swPush: SwPush,
    private _server: NodeServerService) { }

  subscribeNotificaciones() {

    this.swPush.requestSubscription({
      serverPublicKey: this.VAPID_PUBLIC_KEY
    })
      .then(sub => this._server.getNotificaciones().subscribe())
      .catch(err => console.error("Fallo al iniciar las notificaciones", err));
  }
}
