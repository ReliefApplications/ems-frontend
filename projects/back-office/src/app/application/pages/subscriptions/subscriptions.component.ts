import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Application, Subscription as ApplicationSubscription, WhoApplicationService } from '@who-ems/builder';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss']
})
export class SubscriptionsComponent implements OnInit, OnDestroy {

  // === DATA ===
  public subscriptions: ApplicationSubscription[];
  public loading = true;
  public displayedColumns: string[] = ['routingKey', 'convertTo', 'channel'];

  // === SUBSCRIPTIONS ===
  private applicationSubscription: Subscription;

  constructor(
    private applicationService: WhoApplicationService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.loading = false;
    this.applicationSubscription = this.applicationService.application.subscribe((application: Application) => {
      if (application) {
        this.subscriptions = application.subscriptions;
      } else {
        this.subscriptions = [];
      }
    });
  }

  ngOnDestroy(): void {
    this.applicationSubscription.unsubscribe();
  }

  /* Display the AddChannel modal.
    Create a new channel linked to this application on close.
  */
  // onAdd(): void {
  //   const dialogRef = this.dialog.open(AddChannelComponent);
  //   dialogRef.afterClosed().subscribe((value: {title: string}) => {
  //     if (value) {
  //       this.applicationService.addChannel(value);
  //     }
  //   });
  // }

}
