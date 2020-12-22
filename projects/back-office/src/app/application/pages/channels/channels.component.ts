import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Application, Channel, WhoApplicationService, WhoConfirmModalComponent, WhoSnackBarService} from '@who-ems/builder';
import { Apollo } from 'apollo-angular';
import { Subscription } from 'rxjs';
import { AddChannelMutationResponse, ADD_CHANNEL, DeleteChannelMutationResponse, DELETE_CHANNEL  } from '../../../graphql/mutations';
import { AddChannelComponent } from './components/add-channel/add-channel.component';

@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.scss']
})
export class ChannelsComponent implements OnInit, OnDestroy {

  // === DATA ===
  private application: string;
  public channels: Channel[];
  public loading = true;
  public displayedColumns: string[] = ['title', 'subscribedRoles', 'actions'];

  // === SUBSCRIPTIONS ===
  private applicationSubscription: Subscription;

  constructor(
    private applicationService: WhoApplicationService,
    public dialog: MatDialog,
    private apollo: Apollo,
    private snackBar: WhoSnackBarService
  ) { }

  ngOnInit(): void {
    this.loading = false;
    this.applicationSubscription = this.applicationService.application.subscribe((application: Application) => {
      if (application) {
        this.channels = application.channels;
        this.application = application.id;
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
        this.loading = true;
        this.apollo.mutate<AddChannelMutationResponse>({
          mutation: ADD_CHANNEL,
          variables: {
            title: value.title,
            application: this.application
          }
        }).subscribe(res => {
          this.snackBar.openSnackBar(`${value.title} channel created`);
          this.channels.push(res.data.addChannel);
          this.loading = res.data.loading;
        })
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
        this.loading = true;
        this.apollo.mutate<DeleteChannelMutationResponse>({
          mutation: DELETE_CHANNEL,
          variables: {
            id: channel.id
          }
        }).subscribe(res => {
          this.snackBar.openSnackBar(`${channel.title} channel deleted.`);
          this.channels = this.channels.filter(x => x.id !== res.data.deleteChannel.id);
          this.loading = res.data.loading;
        });
      }
    });
  }
}
