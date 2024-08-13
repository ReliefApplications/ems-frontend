import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { triggers, Triggers, TriggersType } from '../../triggers.types';
import { CustomNotification } from '@oort-front/shared';

type TriggerTableElement = {
  name: string;
  type: Triggers;
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
export class TriggersListComponent implements OnChanges {
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
  }>();
  /** Event emitter for add new trigger */
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onAdd = new EventEmitter<{ type: TriggersType }>();

  /** Triggers */
  public triggers = new Array<TriggerTableElement>();
  /** Triggers types */
  public TriggersTypes = triggers;
  /** Displayed columns */
  public displayedColumns: string[] = ['name', 'type', 'actions'];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.triggersList) {
      this.triggers = this.setTableElements(this.triggersList);
    }
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
      type: trigger.onRecordCreation
        ? Triggers.onRecordCreation
        : trigger.onRecordUpdate
        ? Triggers.onRecordUpdate
        : Triggers.cronBased,
      trigger,
    };
  }
}
