import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-application-toolbar',
  templateUrl: './application-toolbar.component.html',
  styleUrls: ['./application-toolbar.component.scss']
})
export class ApplicationToolbarComponent implements OnInit {

  @Input() title: string;

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onClose(): void {
    this.router.navigate(['/applications']);
  }
}
