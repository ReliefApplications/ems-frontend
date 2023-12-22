import { Apollo } from 'apollo-angular';
import { Component, OnInit } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import {
  Application,
  Channel,
  Subscription as ApplicationSubscription,
  ApplicationService,
  UnsubscribeComponent,
} from '@oort-front/shared';
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
  extends UnsubscribeComponent
  implements OnInit
{
  // === DATA ===
  /** Application subscriptions */
  public subscriptions: ApplicationSubscription[] = [];
  /** Loading state */
  public loading = true;
  /** Table columns */
  public displayedColumns: string[] = [
    'title',
    'convertTo',
    'channel',
    'actions',
  ];

  // === SUBSCRIPTIONS ===
  /** Channels list */
  private channels: Channel[] = [];

  /**
   * Application subscriptions page component
   *
   * @param applicationService Shared application service
   * @param dialog Dialog service
   * @param apollo Apollo service
   */
  constructor(
    private applicationService: ApplicationService,
    public dialog: Dialog,
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
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value) {
        this.applicationService.addSubscription(value);
      }
    });
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
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value) {
        this.applicationService.editSubscription(value, element.routingKey);
      }
    });
  }
}
