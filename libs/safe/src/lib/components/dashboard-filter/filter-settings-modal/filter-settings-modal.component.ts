import { Component, Inject, OnInit } from '@angular/core';
import { FilterPosition } from '../enums/dashboard-filters.enum';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule, DialogModule } from '@oort-front/ui';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';

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
  imports: [DialogModule, ButtonModule, CommonModule, TranslateModule],
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
    private dialogRef: DialogRef<FilterSettingsModalComponent>,
    @Inject(DIALOG_DATA) public data: SettingsData
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
    this.dialogRef.close(this.defaultPosition as any);
  }
}
