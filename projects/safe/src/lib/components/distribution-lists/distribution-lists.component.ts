import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { SafeApplicationService } from '../../services/application/application.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { EditDistributionListsModalComponent } from './components/edit-distribution-lists-modal/edit-distribution-lists-modal.component';
import { SafeConfirmModalComponent } from '../confirm-modal/confirm-modal.component';

/**
 * Display the distribution Lists
 */
@Component({
  selector: 'safe-distribution-lists',
  templateUrl: './distribution-lists.component.html',
  styleUrls: ['./distribution-lists.component.scss'],
})
export class DistributionListsComponent implements OnInit, OnDestroy {
  @Input() applicationService!: SafeApplicationService;
  private applicationSubscritpion!: Subscription;
  public distributionLists: MatTableDataSource<any> =
    new MatTableDataSource<any>([]);

  // === DISPLAYED COLUMNS ===
  public displayedColumns = ['name', 'actions'];

  /**
   * Constructor of the distribution lists component
   *
   * @param dialog The material dialog service
   * @param translate The translation service
   */
  constructor(public dialog: MatDialog, private translate: TranslateService) {}

  ngOnInit(): void {
    this.applicationSubscritpion =
      this.applicationService.application$.subscribe((value) => {
        this.distributionLists.data = value?.distributionLists || [];
      })
  }

  ngOnDestroy(): void {
    if (this.applicationSubscritpion) {
      this.applicationSubscritpion.unsubscribe();
    }
  }

  /**
   * Open edit modal components with selected distribution list
   * and update changes.
   *
   * @param distributionList the distribution list to modify.
   */
  editDistributionList(distributionList: any): void {
    const dialogRef = this.dialog.open(EditDistributionListsModalComponent, {
      data: distributionList,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((value: any) => {
      if (value){
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
  addDistributionList(): void {
    const dialogRef = this.dialog.open(EditDistributionListsModalComponent, {
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

  // TODO delete function

  // TODO add distributionList{id, name, emails} in applicationService graphql query.
}
