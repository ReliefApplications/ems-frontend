import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Application } from '../../models/application.model';
import { SafeApplicationService } from '../../services/application/application.service';

/**
 * Page to view distribution lists within app.
 */
@Component({
  selector: 'safe-application-distribution-lists',
  templateUrl: './application-distribution-lists.component.html',
  styleUrls: ['./application-distribution-lists.component.scss'],
})
export class SafeApplicationDistributionListsComponent
  implements OnInit, OnDestroy
{
  // === DATA ===
  public loading = true;
  public templates = new MatTableDataSource<any>([]);
  private applicationSubscription?: Subscription;

  /**
   * Page to view distribution lists within app.
   *
   * @param applicationService application service
   */
  constructor(public applicationService: SafeApplicationService) {}

  ngOnInit(): void {
    this.applicationSubscription =
      this.applicationService.application$.subscribe(
        (application: Application | null) => {
          if (application) {
            this.templates.data = application.templates || [];
            this.loading = false;
          } else {
            this.templates.data = [];
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
