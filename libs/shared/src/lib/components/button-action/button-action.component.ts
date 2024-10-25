import { Component, Input } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { DataTemplateService } from '../../services/data-template/data-template.service';
import { Dashboard } from '../../models/dashboard.model';
import { ButtonActionT } from './button-action-type';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

/** Component for display action buttons */
@Component({
  selector: 'shared-button-action',
  templateUrl: './button-action.component.html',
  styleUrls: ['./button-action.component.scss'],
})
export class ButtonActionComponent {
  /** Button actions */
  @Input() buttonActions: ButtonActionT[] = [];
  /** Dashboard */
  @Input() dashboard?: Dashboard;
  /** Can update dashboard or not */
  @Input() canUpdate = false;

  /**
   * Action buttons
   *
   * @param dialog Dialog service
   * @param dataTemplateService DataTemplate service
   * @param router Angular router
   * @param location Angular location
   */
  constructor(
    public dialog: Dialog,
    private dataTemplateService: DataTemplateService,
    private router: Router,
    private location: Location
  ) {}

  /**
   * Opens link of button action.
   *
   * @param button Button action to be executed
   */
  public onButtonActionClick(button: ButtonActionT) {
    console.log('Button action clicked', button);
    if (button.href) {
      const href = this.dataTemplateService.renderLink(button.href);
      if (button.openInNewTab) {
        window.open(href, '_blank');
      } else {
        if (href?.startsWith('./')) {
          // Navigation inside the app builder
          this.router.navigateByUrl(href.substring(1));
        } else {
          window.location.href = href;
        }
      }
    }
    if (button.previousPage) {
      this.location.back();
    }
  }
}
