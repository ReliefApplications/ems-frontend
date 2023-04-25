import { Apollo } from 'apollo-angular';
import { Component, OnInit } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import {
  Application,
  Channel,
  Subscription as ApplicationSubscription,
  SafeApplicationService,
  SafeUnsubscribeComponent,
} from '@oort-front/safe';
import { takeUntil } from 'rxjs/operators';

/**
 * Application subscriptions page component.
 */
@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss'],
})
export class SubscriptionsComponent
  extends SafeUnsubscribeComponent
  implements OnInit
{
  // === DATA ===
  public subscriptions: ApplicationSubscription[] = [];
  public loading = true;
  public displayedColumns: string[] = [
    'title',
    'convertTo',
    'channel',
    'actions',
  ];

  // === SUBSCRIPTIONS ===
  private channels: Channel[] = [];

  /**
   * Application subscriptions page component
   *
   * @param applicationService Shared application service
   * @param dialog Material dialog service
   * @param apollo Apollo service
   */
  constructor(
    private applicationService: SafeApplicationService,
    public dialog: MatDialog,
    private apollo: Apollo
  ) {
    super();
  }

  ngOnInit(): void {
    this.loading = false;
    this.applicationService.application$
      .pipe(takeUntil(this.destroy$))
      .subscribe((application: Application | null) => {
        if (application) {
          this.subscriptions = application.subscriptions || [];
          this.channels = application.channels || [];
        } else {
          this.subscriptions = [];
        }
      });
  }

  /**
   * Display the AddSubscription modal.
   * Create a new subscription linked to this application on close.
   */
  async onAdd(): Promise<void> {
    const { SubscriptionModalComponent } = await import(
      './components/subscription-modal/subscription-modal.component'
    );
    const dialogRef = this.dialog.open(SubscriptionModalComponent, {
      data: {
        channels: this.channels,
      },
    });
    dialogRef
      .afterClosed()
      .subscribe(
        (value: {
          routingKey: string;
          title: string;
          convertTo: string;
          channel: string;
        }) => {
          if (value) {
            this.applicationService.addSubscription(value);
          }
        }
      );
  }

  /**
   * Delete subscription
   *
   * @param element subscription to delete
   */
  onDelete(element: any): void {
    if (element) {
      this.applicationService.deleteSubscription(element.routingKey);
    }
  }

  /**
   * Edit subscription
   *
   * @param element subscription to edit
   */
  async onEdit(element: any): Promise<void> {
    const { SubscriptionModalComponent } = await import(
      './components/subscription-modal/subscription-modal.component'
    );
    const dialogRef = this.dialog.open(SubscriptionModalComponent, {
      data: {
        channels: this.channels,
        subscription: element,
      },
    });
    dialogRef.afterClosed().subscribe((value: any) => {
      if (value) {
        this.applicationService.editSubscription(value, element.routingKey);
      }
    });
  }
}
