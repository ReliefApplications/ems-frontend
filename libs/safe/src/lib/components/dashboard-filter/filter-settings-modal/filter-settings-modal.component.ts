import { Component, Inject, OnInit } from '@angular/core';
import {
  MatLegacyDialogRef as MatDialogRef,
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
} from '@angular/material/legacy-dialog';
import { FilterPosition } from '../enums/dashboard-filters.enum';
import { SafeModalModule } from '../../ui/modal/modal.module';
import { CommonModule } from '@angular/common';

/**
 * Data for the settings modal
 */
interface SettingsData {
  positionList: FilterPosition[];
}

/**
 * Settings for the dashboard filter component
 */
@Component({
  standalone: true,
  selector: 'safe-filter-settings-modal',
  templateUrl: './filter-settings-modal.component.html',
  styleUrls: ['./filter-settings-modal.component.scss'],
  imports: [SafeModalModule, CommonModule],
})
export class FilterSettingsModalComponent implements OnInit {
  public positionList: FilterPosition[] = [];
  private defaultPosition: FilterPosition = FilterPosition.BOTTOM;

  /**
   * Settings modal for the dashboard component
   *
   * @param dialogRef Reference to the modal
   * @param data Data to use to configure the settings
   */
  constructor(
    private dialogRef: MatDialogRef<FilterSettingsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SettingsData
  ) {}

  ngOnInit(): void {
    this.positionList = this.data.positionList;
  }

  /**
   * Sets the default position for the dashboard filter component
   *
   * @param position Position to set
   */
  setDefaultPosition(position: FilterPosition) {
    this.defaultPosition = position;
    this.dialogRef.close(this.defaultPosition);
  }
}
