import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PreviewService } from '../../../services/preview.service';

@Component({
  selector: 'app-preview-toolbar',
  templateUrl: './preview-toolbar.component.html',
  styleUrls: ['./preview-toolbar.component.scss']
})
export class PreviewToolbarComponent implements OnInit {

  constructor(
    private router: Router,
    private previewService: PreviewService
  ) { }

  ngOnInit(): void {
  }

  /**
   * Closes the preview toolbar and navigates to main page.
   */
  onClose(): void {
    this.previewService.setRole('');
    this.router.navigate(['/']);
  }
}
