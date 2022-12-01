import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Application } from '../../models/application.model';
import { SafeApplicationService } from '../../services/application.service';

/**
 * Application templates page component.
 */
@Component({
  selector: 'safe-application-templates',
  templateUrl: './application-templates.component.html',
  styleUrls: ['./application-templates.component.scss'],
})
export class SafeApplicationTemplatesComponent implements OnInit, OnDestroy {
  // === DATA ===
  public loading = true;
  public templates = new MatTableDataSource<any>([]);
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
