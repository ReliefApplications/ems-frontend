import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-application-toolbar',
  templateUrl: './application-toolbar.component.html',
  styleUrls: ['./application-toolbar.component.scss']
})
export class ApplicationToolbarComponent implements OnInit {

  @Input() title: string;

  constructor() { }

  ngOnInit(): void {
  }

}
