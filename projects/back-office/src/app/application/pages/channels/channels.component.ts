import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Application, Channel, SafeApplicationService, SafeConfirmModalComponent } from '@safe/builder';
import { Subscription } from 'rxjs';
import { AddChannelComponent } from './components/add-channel/add-channel.component';
import { EditChannelComponent } from './components/edit-channel/edit-channel.component';

@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.scss']
})
export class ChannelsComponent implements OnInit, OnDestroy {

  // === DATA ===
  public channels: Channel[] = [];
  public loading = true;
  public displayedColumns: string[] = ['title', 'subscribedRoles', 'actions'];
  public applications: any[] = [];
  public lastEntry: any[] = [];
  public application: any;

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
        this.channels = application.channels || [];
      } else {
        this.channels = [];
      }
      // store all application name with unicity
      this.channels.forEach(channel => {
        channel.subscribedRoles?.forEach(role => {
          if (!this.lastEntry.includes(role.application?.name)) {
            this.applications.push({ name: role.application?.name, roles: [] });
            this.lastEntry.push(role.application?.name);
          }
        });
      });
      // store roles linked to applications
      this.applications.forEach(app => {
        this.channels.forEach(channel => {
          channel.subscribedRoles?.forEach(role => {
            if (!this.lastEntry.includes(role.id) && role.application?.name === app.name) {
              app.roles.push(role);
              this.lastEntry.push(role.id);
            }
          });
        });
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
