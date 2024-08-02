import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TriggersType } from '../../triggers.types';
import { CustomNotification } from '@oort-front/shared';

type TriggerTableElement = {
  name: string;
  trigger: CustomNotification;
};

/**
 * Triggers list component.
 */
@Component({
  selector: 'app-triggers-list',
  templateUrl: './triggers-list.component.html',
  styleUrls: ['./triggers-list.component.scss'],
})
export class TriggersListComponent implements OnInit {
  /** Trigger list type */
  @Input() triggerType!: TriggersType;
  /** Triggers list */
  @Input() triggersList: CustomNotification[] = [];
  /** Disabled flag */
  @Input() disabled = false;

  /** Event emitter for edit trigger */
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onEdit = new EventEmitter<{
    trigger: CustomNotification;
    type: TriggersType;
  }>();
  /** Event emitter for delete trigger */
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onDelete = new EventEmitter<{
    trigger: CustomNotification;
    type: TriggersType;
  }>();
  /** Event emitter for add new trigger */
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onAdd = new EventEmitter<{ type: TriggersType }>();

  /** Triggers */
  public triggers = new Array<TriggerTableElement>();
  /** Displayed columns */
  public displayedColumns: string[] = ['name', 'actions'];

  ngOnInit(): void {
    console.log('on init ', this.triggersList);
    this.triggers = this.setTableElements(this.triggersList);
  }

  /**
   * Serialize list of table elements from triggers
   *
   * @param triggersList triggers to serialize
   * @returns serialized elements
   */
  private setTableElements(
    triggersList: CustomNotification[]
  ): TriggerTableElement[] {
    return triggersList.map((x: CustomNotification) => this.setTableElement(x));
  }

  /**
   * Serialize single table element from trigger
   *
   * @param trigger resource to serialize
   * @returns serialized element
   */
  private setTableElement(trigger: CustomNotification): TriggerTableElement {
    return {
      name: trigger.name ?? 'Nameless trigger',
      trigger,
    };
  }
}
