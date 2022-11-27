import { Component, OnInit } from '@angular/core';
//formulario reactivo, lo cambian si ven necesario
//service
import { cilIndustry, cilPeople, cilAvTimer, cilBuilding } from '@coreui/icons';
import { IconSetService } from '@coreui/icons-angular';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  active = 'empresa';

  constructor(public icons: IconSetService) {
    icons.icons = { cilIndustry, cilPeople, cilAvTimer, cilBuilding };
  }

  ngOnInit(): void {

  }

}
