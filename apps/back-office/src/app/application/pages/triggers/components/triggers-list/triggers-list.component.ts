import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { triggers, Triggers, TriggersType } from '../../triggers.types';
import {
  CustomNotification,
  Resource,
  UnsubscribeComponent,
  UpdateCustomNotificationMutationResponse,
} from '@oort-front/shared';
import { SnackbarService } from '@oort-front/ui';
import { Apollo } from 'apollo-angular';
import { Dialog } from '@angular/cdk/dialog';
import { takeUntil } from 'rxjs';
import { EDIT_CUSTOM_NOTIFICATION_FILTERS } from '../../graphql/mutations';

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
export class TriggersListComponent
  extends UnsubscribeComponent
  implements OnChanges
{
  /** Triggers list */
  @Input() triggersList: CustomNotification[] = [];
  /** Disabled flag */
  @Input() disabled = false;
  /** Current application id */
  @Input() applicationId!: string;
  /** Trigger resource */
  @Input() openedResource?: Resource;

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
  /** I updating data */
  @Output() updating = new EventEmitter<boolean>();
  /** Event emitter for handle trigger objet updated */
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() edited = new EventEmitter<{
    trigger: CustomNotification;
  }>();

  /** Triggers */
  public triggers = new Array<TriggerTableElement>();
  /** Triggers types */
  public TriggersTypes = triggers;
  /** Displayed columns */
  public displayedColumns: string[] = ['name', 'type', 'actions'];

  /**
   * Triggers list component.
   *
   * @param apollo Apollo client service
   * @param snackBar shared snackbar service
   * @param dialog Dialog service
   */
  constructor(
    private apollo: Apollo,
    private snackBar: SnackbarService,
    public dialog: Dialog
  ) {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.triggersList) {
      this.triggers = this.setTableElements(this.triggersList);
    }
  }

  /**
   * Open filter modal of the selected trigger
   *
   * @param trigger Selected trigger
   */
  public async onOpenFilter(trigger: CustomNotification): Promise<void> {
    const { TriggersResourceFiltersComponent } = await import(
      '../triggers-resource-filters/triggers-resource-filters.component'
    );
    const dialogRef = this.dialog.open(TriggersResourceFiltersComponent, {
      data: {
        trigger,
        resource: this.openedResource,
      },
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if (value) {
        this.updating.emit(true);
        this.apollo
          .mutate<UpdateCustomNotificationMutationResponse>({
            mutation: EDIT_CUSTOM_NOTIFICATION_FILTERS,
            variables: {
              id: trigger.id,
              triggersFilters: value,
              application: this.applicationId,
            },
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: ({ errors, data }) => {
              if (data?.editCustomNotification) {
                this.edited.emit({ trigger: data.editCustomNotification });
              }
              if (errors) {
                this.snackBar.openSnackBar(errors[0].message, { error: true });
              }
              this.updating.emit(false);
            },
            error: (err) => {
              this.snackBar.openSnackBar(err.message, { error: true });
              this.updating.emit(false);
            },
          });
      }
    });
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
