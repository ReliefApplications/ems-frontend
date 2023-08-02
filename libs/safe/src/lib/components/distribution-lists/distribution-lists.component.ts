import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SafeApplicationService } from '../../services/application/application.service';
import { Dialog } from '@angular/cdk/dialog';
import { takeUntil } from 'rxjs';
import { SafeUnsubscribeComponent } from '../utils/unsubscribe/unsubscribe.component';
import { SnackbarService } from '@oort-front/ui';
import { DistributionList } from '../../models/distribution-list.model';

/**
 * Component to show the list of distribution lists of an application
 */
@Component({
  selector: 'safe-distribution-lists',
  templateUrl: './distribution-lists.component.html',
  styleUrls: ['./distribution-lists.component.scss'],
})
export class DistributionListsComponent
  extends SafeUnsubscribeComponent
  implements OnInit
{
  // === INPUT DATA ===
  public distributionLists: DistributionList[] = [];
  @Input() applicationService!: SafeApplicationService;
  // === DISPLAYED COLUMNS ===
  public displayedColumns = ['name', 'actions'];

  public loading = false;

  /**
   * Constructor of the distribution lists component
   *
   * @param dialog The Dialog service
   * @param translate The translation service
   * @param snackBar Shared snackbar service
   */
  constructor(
    public dialog: Dialog,
    private translate: TranslateService,
    private snackBar: SnackbarService
  ) {
    super();
  }

  ngOnInit(): void {
    this.applicationService.application$
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.distributionLists = value?.distributionLists || [];
      });
  }

  /**
   * Open edit modal components with selected distribution list
   * and update changes.
   *
   * @param distributionList the distribution list to modify.
   */
  async editDistributionList(
    distributionList: DistributionList
  ): Promise<void> {
    const { EditDistributionListModalComponent } = await import(
      './components/edit-distribution-list-modal/edit-distribution-list-modal.component'
    );
    const dialogRef = this.dialog.open(EditDistributionListModalComponent, {
      data: distributionList,
      disableClose: true,
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      // value: { name: string; emails: string[] }
      if (value) {
        this.applicationService.editDistributionList({
          id: distributionList.id,
          name: value.name,
          emails: value.emails,
        });
        this.snackBar.openSnackBar(
          this.translate.instant('common.notifications.objectUpdated', {
            value: value.name,
            type: this.translate.instant('common.distributionList.one'),
          })
        );
      }
    });
  }

  /**
   * Open edit modal components and create new distribution list
   */
  async addDistributionList(): Promise<void> {
    const { EditDistributionListModalComponent } = await import(
      './components/edit-distribution-list-modal/edit-distribution-list-modal.component'
    );
    const dialogRef = this.dialog.open(EditDistributionListModalComponent, {
      data: null,
      disableClose: true,
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value) {
        this.applicationService.addDistributionList({
          name: value.name,
          emails: value.emails,
        });
        this.snackBar.openSnackBar(
          this.translate.instant('common.notifications.objectCreated', {
            value: value.name,
            type: this.translate.instant('common.distributionList.one'),
          })
        );
      }
    });
  }

  /**
   * Show a dialog to confirm the deletion of a distribution list
   *
   * @param distributionList distribution list ot be deleted
   */
  async deleteDistributionList(
    distributionList: DistributionList
  ): Promise<void> {
    const { SafeConfirmModalComponent } = await import(
      '../confirm-modal/confirm-modal.component'
    );
    const dialogRef = this.dialog.open(SafeConfirmModalComponent, {
      data: {
        title: this.translate.instant('common.deleteObject', {
          name: this.translate.instant('common.distributionList.one'),
        }),
        content: this.translate.instant(
          'components.distributionLists.delete.confirmationMessage',
          {
            name: distributionList.name,
          }
        ),
        confirmText: this.translate.instant('components.confirmModal.delete'),
        cancelText: this.translate.instant('components.confirmModal.cancel'),
        confirmVariant: 'danger',
      },
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value) {
        this.applicationService.deleteDistributionList(
          distributionList.id || ''
        );
        this.snackBar.openSnackBar(
          this.translate.instant('common.notifications.objectDeleted', {
            value: distributionList.name,
          })
        );
      }
    });
  }
}
