import { Component, Input, OnInit } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { TranslateService } from '@ngx-translate/core';
import { SafeApplicationService } from '../../services/application/application.service';
import { Variant } from '@oort-front/ui';

/**
 * Component to show the list of distribution lists of an application
 */
@Component({
  selector: 'safe-distribution-lists',
  templateUrl: './distribution-lists.component.html',
  styleUrls: ['./distribution-lists.component.scss'],
})
export class DistributionListsComponent implements OnInit {
  // === INPUT DATA ===
  public distributionLists: MatTableDataSource<any> =
    new MatTableDataSource<any>([]);
  @Input() applicationService!: SafeApplicationService;
  // === DISPLAYED COLUMNS ===
  public displayedColumns = ['name', 'actions'];
  // === COLOR VARIANT ===
  public colorVariant = Variant;

  public loading = false;
  /**
   * Constructor of the distribution lists component
   *
   * @param dialog The material dialog service
   * @param translate The translation service
   */
  constructor(public dialog: MatDialog, private translate: TranslateService) {}

  ngOnInit(): void {
    this.applicationService.application$.subscribe((value) => {
      this.distributionLists.data = value?.distributionLists || [];
    });
  }

  /**
   * Open edit modal components with selected distribution list
   * and update changes.
   *
   * @param distributionList the distribution list to modify.
   */
  async editDistributionList(distributionList: any): Promise<void> {
    const { EditDistributionListModalComponent } = await import(
      './components/edit-distribution-list-modal/edit-distribution-list-modal.component'
    );
    const dialogRef = this.dialog.open(EditDistributionListModalComponent, {
      data: distributionList,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((value: any) => {
      if (value) {
        this.applicationService.editDistributionList({
          id: distributionList.id,
          name: value.name,
          emails: value.emails,
        });
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
    dialogRef.afterClosed().subscribe((value: any) => {
      if (value) {
        this.applicationService.addDistributionList({
          name: value.name,
          emails: value.emails,
        });
      }
    });
  }

  /**
   * Show a dialog to confirm the deletion of a distribution list
   *
   * @param distributionList distribution list ot be deleted
   */
  async deleteDistributionList(distributionList: any): Promise<void> {
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
        confirmColor: 'warn',
      },
    });
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        this.applicationService.deleteDistributionList(distributionList.id);
      }
    });
  }
}
