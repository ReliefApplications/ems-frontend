import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public dashboardId = '60745912910c55004ccd79b3';
  public formId = '60a60a044473cd002a9baed1';

  constructor() { }

  ngOnInit(): void {
  }

}
