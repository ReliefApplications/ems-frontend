import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationService } from '../../../services/application.service';

@Component({
  selector: 'app-preview-toolbar',
  templateUrl: './preview-toolbar.component.html',
  styleUrls: ['./preview-toolbar.component.scss']
})
export class PreviewToolbarComponent implements OnInit {

  @Input() title: string;

  constructor(
    private router: Router,
    private applicationService: ApplicationService
  ) { }

  ngOnInit(): void {
  }

  onClose(): void {
    this.applicationService.setRole(null);
    this.router.navigate(['/applications']);
  }
}
