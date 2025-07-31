import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';

/**
 * Application roles page component.
 */
@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss'],
})
export class RolesComponent {
  /** If application view would be displayed or not */
  inApplication = true;
  /** Component destroy ref */
  private destroyRef = inject(DestroyRef);

  /**
   * Role list constructor
   * Display role list in case it's an application related role list or a main role list view
   *
   * @param {ActivatedRoute} router Activated route containing the route data
   */
  constructor(private router: ActivatedRoute) {
    this.router.data
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.inApplication = Boolean(data.inApplication);
      });
  }
}
