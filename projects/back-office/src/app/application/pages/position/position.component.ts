import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Application, SafeApplicationService, PositionAttributeCategory, SafeConfirmModalComponent } from '@safe/builder';
import { Subscription } from 'rxjs';
import { AddPositionComponent } from './components/position-modal/position-modal.component';

@Component({
  selector: 'app-position',
  templateUrl: './position.component.html',
  styleUrls: ['./position.component.scss']
})
export class PositionComponent implements OnInit, OnDestroy {

  // === DATA ===
  public loading = true;
  public positionCategories: any[] = [];
  public displayedColumns = ['title', 'actions'];
  private applicationSubscription?: Subscription;

  constructor(
    public dialog: MatDialog,
    private applicationService: SafeApplicationService
  ) { }

  ngOnInit(): void {
    this.loading = false;
    this.applicationSubscription = this.applicationService.application$.subscribe((application: Application | null) => {
      if (application) {
        this.positionCategories = application.positionAttributeCategories || [];
      } else {
        this.positionCategories = [];
      }
    });
  }

  onAdd(): void {
    const dialogRef = this.dialog.open(AddPositionComponent, {
      data: {
        add: true
      }
    });
    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        this.applicationService.addPositionAttributeCategory(value);
      }
    });
  }

  onEdit(positionCategory: PositionAttributeCategory): void {
    const dialogRef = this.dialog.open(AddPositionComponent, {
      width: '400px',
      data: {
        edit: true,
        title: positionCategory.title
      }
    });
    dialogRef.afterClosed().subscribe((value: any) => {
      if (value) {
        this.applicationService.editPositionAttributeCategory(value, positionCategory);
      }
    });
  }

  onDelete(positionCategory: PositionAttributeCategory): void {
    const dialogRef = this.dialog.open(SafeConfirmModalComponent, {
      data: {
        title: 'Delete position attribute',
        content: `Do you confirm the deletion of the position attribute ${positionCategory.title} ?`,
        confirmText: 'Delete',
        confirmColor: 'warn'
      }
    });
    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        this.applicationService.deletePositionAttributeCategory(positionCategory);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.applicationSubscription) {
      this.applicationSubscription.unsubscribe();
    }
  }
}
