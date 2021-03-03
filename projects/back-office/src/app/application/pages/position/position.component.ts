import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Application, WhoApplicationService, PositionAttributeCategory } from '@who-ems/builder';
import { Subscription } from 'rxjs';
import { AddPositionComponent } from './components/add-position/add-position.component';

@Component({
  selector: 'app-position',
  templateUrl: './position.component.html',
  styleUrls: ['./position.component.scss']
})
export class PositionComponent implements OnInit, OnDestroy {

  // === DATA ===
  public loading = true;
  public positionCategories = [];
  public displayedColumns = ['title', 'actions'];
  private applicationSubscription: Subscription;

  constructor(
    public dialog: MatDialog,
    private applicationService: WhoApplicationService
  ) { }

  ngOnInit(): void {
    this.loading = false;
    this.applicationSubscription = this.applicationService.application.subscribe((application: Application) => {
      if (application) {
        this.positionCategories = application.positionAttributeCategories;
      } else {
        this.positionCategories = [];
      }
    });
  }

  ngOnDestroy(): void {
    if (this.applicationSubscription) {
      this.applicationSubscription.unsubscribe();
    }
  }

  onAdd(): void {
    const dialogRef = this.dialog.open(AddPositionComponent);
    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        this.applicationService.addPositionAttributeCategory(value);
      }
    });
  }

  onEdit(positionCategory: PositionAttributeCategory): void {
    console.log('edit');
  }

  onDelete(positionCategory: PositionAttributeCategory): void {
    console.log('delete');
  }
}
