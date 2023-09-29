import { Component, Input } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Form } from '../../../../models/form.model';
import { ReferenceData } from '../../../../models/reference-data.model';
import { GET_RESOURCES, GET_REFERENCE_DATAS } from '../graphql/queries';
import { Resource } from '../../../../models/resource.model';

/**
 * Main tab of widget grid configuration modal.
 */
@Component({
  selector: 'shared-tab-main',
  templateUrl: './tab-main.component.html',
  styleUrls: ['./tab-main.component.scss'],
})
export class TabMainComponent {
  @Input() formGroup!: UntypedFormGroup;
  @Input() form: Form | null = null;
  @Input() resource: Resource | null = null;
  @Input() referenceData: ReferenceData | null = null;
  @Input() queries: any[] = [];
  @Input() templates: Form[] = [];

  getResources = GET_RESOURCES;
  getReferenceDatas = GET_REFERENCE_DATAS;
}
