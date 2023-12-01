import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { ReferenceData } from '../../../../models/reference-data.model';

/**
 * Component used in the card-modal-settings for configuring some display settings.
 */
@Component({
  selector: 'shared-display-tab',
  templateUrl: './display-tab.component.html',
  styleUrls: ['./display-tab.component.scss'],
})
export class DisplayTabComponent implements OnInit {
  @Input() form!: UntypedFormGroup;
  @Input() referenceData: ReferenceData | null = null;
  public showDataSourceForm = true;

  ngOnInit(): void {
    this.showDataSourceForm = this.referenceData ? false : true;
  }
}
