import { Component, OnInit } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { TranslateService } from '@ngx-translate/core';
import {
  Application,
  Channel,
  ChannelDisplay,
  Role,
  ApplicationService,
  ConfirmService,
  UnsubscribeComponent,
} from '@oort-front/shared';
import { takeUntil } from 'rxjs/operators';

/**
 * Channels page component.
 */
@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.scss'],
})
export class ChannelsComponent extends UnsubscribeComponent implements OnInit {
  /** Channels list */
  private channels: Channel[] = [];
  /** Channels data */
  public channelsData: ChannelDisplay[] = [];
  /** Loading state */
  public loading = true;
  /** Table columns */
  public displayedColumns: string[] = ['title', 'subscribedRoles', 'actions'];

  /**
   * Channels page component
   *
   * @param applicationService Shared application service
   * @param confirmService Shared confirm service
   * @param dialog Dialog service
   * @param translate Angular translate service
   */
  constructor(
    private applicationService: ApplicationService,
    private confirmService: ConfirmService,
    public dialog: Dialog,
    private translate: TranslateService
  ) {
    super();
  }

  ngOnInit(): void {
    this.loading = false;
    this.applicationService.application$
      .pipe(takeUntil(this.destroy$))
      .subscribe((application: Application | null) => {
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
      });
  }

  /**
   * Display the AddChannel modal.
   * Create a new channel linked to this application on close.
   */
  async onAdd(): Promise<void> {
    const { ChannelModalComponent } = await import(
      './components/channel-modal/channel-modal.component'
    );
    const dialogRef = this.dialog.open(ChannelModalComponent);
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value) {
        this.applicationService.addChannel(value);
      }
    });
  }

  /**
   * Edit channel, opening channel modal
   *
   * @param channel channel to edit
   */
  async onEdit(channel: Channel): Promise<void> {
    const { ChannelModalComponent } = await import(
      './components/channel-modal/channel-modal.component'
    );
    const dialogRef = this.dialog.open(ChannelModalComponent, {
      data: {
        channel,
      },
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value) {
        this.applicationService.editChannel(channel, value.title);
      }
    });
  }

  /**
   * Display a modal to confirm the deletion of the channel.
   * If confirmed, the channel is removed from the system with all notifications linked to it.
   *
   * @param channel channel to delete
   */
  onDelete(channel: Channel): void {
    const dialogRef = this.confirmService.openConfirmModal({
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
      confirmVariant: 'danger',
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value) {
        this.applicationService.deleteChannel(channel);
      }
    });
  }
}
