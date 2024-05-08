import { Component, Input } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

/** Component that handles the configuration for the user stage of the aggregation builder */
@Component({
  selector: 'shared-user-stage',
  templateUrl: './user-stage.component.html',
  styleUrls: ['./user-stage.component.scss'],
})
export class UserStageComponent {
  /** Form group to handle form behavior */
  @Input() form: UntypedFormGroup = new UntypedFormGroup({});
  /** List of fields to choose from */
  @Input() fields: any[] = [];

  /** List of available fields that could have choices */
  public userProperties = [
    { value: 'name', label: 'common.name' },
    { value: 'email', label: 'common.email.one' },
    { value: 'firstName', label: 'components.user.summary.firstName' },
    { value: 'lastName', label: 'components.user.summary.lastName' },
  ] as const;
}
