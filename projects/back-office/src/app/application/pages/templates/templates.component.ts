import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {
  Application,
  User,
  Role,
  SafeApplicationService,
  PositionAttributeCategory,
} from '@safe/builder';
import { Subscription } from 'rxjs';

/**
 * Application templates page component.
 */
@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.scss'],
})
export class TemplatesComponent implements OnInit, OnDestroy {
  // === DATA ===
  public loading = true;
  public templates = new MatTableDataSource<User>([]);
  public roles: Role[] = [];
  public positionAttributeCategories: PositionAttributeCategory[] = [];
  private applicationSubscription?: Subscription;

  /**
   * Application templates page component
   *
   * @param applicationService Shared application service
   */
  constructor(public applicationService: SafeApplicationService) {}

  ngOnInit(): void {
    this.applicationSubscription =
      this.applicationService.application$.subscribe(
        (application: Application | null) => {
          if (application) {
            this.templates.data = application.templates || [];
            this.roles = application.roles || [];
            this.positionAttributeCategories =
              application.positionAttributeCategories || [];
            this.loading = false;
          } else {
            this.templates.data = [];
            this.roles = [];
          }
        }
      );
  }

  ngOnDestroy(): void {
    if (this.applicationSubscription) {
      this.applicationSubscription.unsubscribe();
    }
  }
}
