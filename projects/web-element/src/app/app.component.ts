import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public dashboardId: string = '60745912910c55004ccd79b3';

  constructor() { }

  ngOnInit(): void {
  }

}
