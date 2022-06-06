import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import {
  Application,
  Channel,
  ChannelDisplay,
  Role,
  SafeApplicationService,
  SafeConfirmModalComponent,
} from '@safe/builder';
import { Subscription } from 'rxjs';
import { AddChannelComponent } from './components/add-channel/add-channel.component';
import { EditChannelComponent } from './components/edit-channel/edit-channel.component';

@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.scss'],
})
export class ChannelsComponent implements OnInit, OnDestroy {
  // === DATA ===
  private channels: Channel[] = [];
  public channelsData: ChannelDisplay[] = [];
  public loading = true;
  public displayedColumns: string[] = ['title', 'subscribedRoles', 'actions'];

  // === SUBSCRIPTIONS ===
  private applicationSubscription?: Subscription;

  constructor(
    private applicationService: SafeApplicationService,
    public dialog: MatDialog,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.loading = false;
    this.applicationSubscription =
      this.applicationService.application$.subscribe(
        (application: Application | null) => {
          if (application) {
            this.channels = application.channels || [];
          } else {
            this.channels = [];
          }
          // Move roles in an array under corresponding applications under corresponding channels
          this.channelsData = this.channels.map((channel: ChannelDisplay) => {
            const subscribedApplications = Array.from(
              new Set(channel.subscribedRoles?.map((x) => x.application?.name))
            ).map((name?: string) => ({
              name: name ? name : 'Global',
              roles: channel.subscribedRoles
                ? channel.subscribedRoles.reduce((o: Role[], role: Role) => {
                    if (role?.application?.name === name) {
                      o.push(role);
                    }
                    return o;
                  }, [])
                : [],
            }));
            return { ...channel, subscribedApplications };
          });
        }
      );
  }

  /** Display the AddChannel modal.
    Create a new channel linked to this application on close. */
  onAdd(): void {
    const dialogRef = this.dialog.open(AddChannelComponent);
    dialogRef.afterClosed().subscribe((value: { title: string }) => {
      if (value) {
        this.applicationService.addChannel(value);
      }
    });
  }

  onEdit(channel: Channel): void {
    const dialogRef = this.dialog.open(EditChannelComponent, {
      data: {
        channel,
      },
    });
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        this.applicationService.editChannel(channel, value.title);
      }
    });
  }

  /** Display a modal to confirm the deletion of the channel.
    If confirmed, the channel is removed from the system with all notifications linked to it. */
  onDelete(channel: Channel): void {
    const dialogRef = this.dialog.open(SafeConfirmModalComponent, {
      data: {
        title: this.translate.instant('common.deleteObject', {
          name: this.translate.instant('common.channel.one'),
        }),
        content: this.translate.instant(
          'components.channel.delete.confirmationMessage',
          {
            name: channel.title,
          }
        ),
        confirmText: this.translate.instant('components.confirmModal.delete'),
        cancelText: this.translate.instant('components.confirmModal.cancel'),
        confirmColor: 'warn',
      },
    });
    dialogRef.afterClosed().subscribe((value) => {
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
