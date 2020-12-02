import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationService } from '../../../services/application.service';

@Component({
  selector: 'app-application-toolbar',
  templateUrl: './application-toolbar.component.html',
  styleUrls: ['./application-toolbar.component.scss']
})
export class ApplicationToolbarComponent implements OnInit {

  constructor(
    private applicationService: ApplicationService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onClose(): void {
    this.router.navigate(['/applications']);
  }

  onPublish(): void {
    this.applicationService.publish();
  }
}
