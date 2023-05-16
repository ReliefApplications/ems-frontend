import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PreviewService } from '../../../services/preview.service';
import { Variant } from '@oort-front/ui';

/**
 * Displays preview actions on top of the application content, when showing the app with preview capacity.
 */
@Component({
  selector: 'app-preview-toolbar',
  templateUrl: './preview-toolbar.component.html',
  styleUrls: ['./preview-toolbar.component.scss'],
})
export class PreviewToolbarComponent {
  public variant = Variant;

  /**
   * Displays preview actions on top of the application content, when showing the app with preview capacity.
   *
   * @param router Angular router service
   * @param previewService Custom preview service
   */
  constructor(private router: Router, private previewService: PreviewService) {}

  /**
   * Closes the preview toolbar and navigates to main page.
   */
  onClose(): void {
    this.previewService.setRole('');
    this.router.navigate(['/']);
  }
}
