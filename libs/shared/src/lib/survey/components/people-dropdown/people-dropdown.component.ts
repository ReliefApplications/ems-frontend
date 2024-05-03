import { Component, OnInit } from '@angular/core';
import { GraphQLSelectModule } from '@oort-front/ui';
import { UnsubscribeComponent } from '../../../components/utils/unsubscribe/unsubscribe.component';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { PeopleSelectComponent } from '../people-select/people-select.component';

/**
 * Component to pick people from the list of people
 */
@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    GraphQLSelectModule,
    PeopleSelectComponent,
  ],
  selector: 'shared-people-dropdown',
  templateUrl: './people-dropdown.component.html',
  styleUrls: ['./people-dropdown.component.scss'],
})
export class PeopleDropdownComponent
  extends UnsubscribeComponent
  implements OnInit
{
  /** Placeholder */
  public placeholder = '';
  /** Multiselect */
  public multiselect = true;
  /** IDs of the initial people selection */
  public initialSelectionIDs!: string[] | string;
  /** Form control that has selected people */
  public control = new FormControl<string[] | string>([]);

  /**
   * Component to pick people from the list of people
   */
  constructor() {
    super();
  }

  ngOnInit() {
    // Sets the form value
    if (this.initialSelectionIDs) {
      this.control.setValue(this.initialSelectionIDs);
    }
  }
}
