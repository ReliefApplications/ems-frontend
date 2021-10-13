import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Application, Channel, ChannelDisplay, Role, SafeApplicationService, SafeConfirmModalComponent } from '@safe/builder';
import { Subscription } from 'rxjs';
import { AddChannelComponent } from './components/add-channel/add-channel.component';
import { EditChannelComponent } from './components/edit-channel/edit-channel.component';

const ITEMS_PER_PAGE = 10;

@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.scss']
})
export class ChannelsComponent implements OnInit, OnDestroy {

  // === DATA ===
  private channels: Channel[] = [];
  public channelsData: ChannelDisplay[] = [];
  public cachedChannels: Channel[] = [];
  public loading = true;
  public displayedColumns: string[] = ['title', 'subscribedRoles', 'actions'];

  public pageInfo = {
    pageIndex: 0,
    pageSize: ITEMS_PER_PAGE,
    length: 0,
    endCursor: ''
  };

  // === SUBSCRIPTIONS ===
  private applicationSubscription?: Subscription;

  constructor(
    private applicationService: SafeApplicationService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.loading = false;
    this.applicationSubscription = this.applicationService.application.subscribe((application: Application | null) => {
      if (application) {
        this.cachedChannels = application.channels?.edges.map((x: { node: any; }) => x.node);
        this.channels = this.cachedChannels.slice(
        ITEMS_PER_PAGE * this.pageInfo.pageIndex, ITEMS_PER_PAGE * (this.pageInfo.pageIndex + 1));
        this.pageInfo.length = application.channels?.edges.totalCount;
        this.pageInfo.endCursor = application.channels?.edges.pageInfo.endCursor;
      } else {
        this.channels = [];
      }
      // Move roles in an array under corresponding applications under corresponding channels
      this.channelsData = this.channels.map((channel: ChannelDisplay) => {
        const subscribedApplications = Array.from(new Set(channel.subscribedRoles?.map((x: { application: { name: any; }; }) => x.application?.name)))
          .map((name?: string) => {
            return {
              name: name ? name : 'Global',
              roles: channel.subscribedRoles ? channel.subscribedRoles.reduce((o: Role[], role: Role) => {
                if (role?.application?.name === name) {
                  o.push(role);
                }
                return o;
              }, []) : []
            };
          });
        return {...channel, subscribedApplications};
      });
    });
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

  onEdit(channel: Channel): void {
    const dialogRef = this.dialog.open(EditChannelComponent, {
      data: {
        channel
      }
    });
    dialogRef.afterClosed().subscribe(value => {
      if (value) {
          this.applicationService.editChannel(channel, value.title);
      }
    });
  }

  /* Display a modal to confirm the deletion of the channel.
    If confirmed, the channel is removed from the system with all notifications linked to it.
  */
  onDelete(channel: Channel): void {
    const dialogRef = this.dialog.open(SafeConfirmModalComponent, {
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

  ngOnDestroy(): void {
    if (this.applicationSubscription) {
      this.applicationSubscription.unsubscribe();
    }
  }
}
