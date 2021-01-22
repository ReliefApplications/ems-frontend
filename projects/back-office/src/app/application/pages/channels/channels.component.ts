import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Application, Channel, WhoApplicationService, WhoConfirmModalComponent} from '@who-ems/builder';
import { Subscription } from 'rxjs';
import { AddChannelComponent } from './components/add-channel/add-channel.component';

@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.scss']
})
export class ChannelsComponent implements OnInit, OnDestroy {

  // === DATA ===
  public channels: Channel[];
  public loading = true;
  public displayedColumns: string[] = ['title', 'subscribedRoles', 'actions'];

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
        this.channels = application.channels;
      } else {
        this.channels = [];
      }
    });
  }

  ngOnDestroy(): void {
    this.applicationSubscription.unsubscribe();
  }

  /* Display the AddChannel modal.
    Create a new channel linked to this application on close.
  */
  onAdd(): void {
    const dialogRef = this.dialog.open(AddChannelComponent);
    dialogRef.afterClosed().subscribe((value: {title: string}) => {
      if (value) {
        this.applicationService.addChannel(value);
      }
    });
  }

  /* Display a modal to confirm the deletion of the channel.
    If confirmed, the channel is removed from the system with all notifications linked to it.
  */
  onDelete(channel: Channel): void {
    const dialogRef = this.dialog.open(WhoConfirmModalComponent, {
      data: {
        title: 'Delete channel',
        content: `Do you confirm the deletion of the channel ${channel.title} ?`,
        confirmText: 'Delete',
        confirmColor: 'warn'
      }
    });
    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        this.applicationService.deleteChannel(channel);
      }
    });
  }
}
