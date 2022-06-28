import { Apollo } from 'apollo-angular';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  Application,
  Channel,
  Subscription as ApplicationSubscription,
  SafeApplicationService,
} from '@safe/builder';
import { Subscription } from 'rxjs';

import { SubscriptionModalComponent } from './components/subscription-modal/subscription-modal.component';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss'],
})
export class SubscriptionsComponent implements OnInit, OnDestroy {
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
  private applicationSubscription?: Subscription;
  private channels: Channel[] = [];

  constructor(
    private applicationService: SafeApplicationService,
    public dialog: MatDialog,
    private apollo: Apollo
  ) {}

  ngOnInit(): void {
    this.loading = false;
    this.applicationSubscription =
      this.applicationService.application$.subscribe(
        (application: Application | null) => {
          if (application) {
            this.subscriptions = application.subscriptions || [];
            this.channels = application.channels || [];
          } else {
            this.subscriptions = [];
          }
        }
      );
  }

  /** Display the AddSubscription modal.
    Create a new subscription linked to this application on close. */
  onAdd(): void {
    const dialogRef = this.dialog.open(SubscriptionModalComponent, {
      width: '400px',
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

  onDelete(element: any): void {
    if (element) {
      this.applicationService.deleteSubscription(element.routingKey);
    }
  }

  onEdit(element: any): void {
    const dialogRef = this.dialog.open(SubscriptionModalComponent, {
      width: '400px',
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

  ngOnDestroy(): void {
    if (this.applicationSubscription) {
      this.applicationSubscription.unsubscribe();
    }
  }
}
