import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UnsubscribeComponent } from '@oort-front/shared';
import { takeUntil } from 'rxjs';

/**
 * Application roles page component.
 */
@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss'],
})
export class RolesComponent extends UnsubscribeComponent {
  /** If application view would be displayed or not */
  inApplication = true;

  /**
   * Role list constructor
   * Display role list in case it's an application related role list or a main role list view
   *
   * @param {ActivatedRoute} router Activated route containing the route data
   */
  constructor(private router: ActivatedRoute) {
    super();
    this.router.data.pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.inApplication = Boolean(data.inApplication);
    });
  }
}
