import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { takeUntil } from 'rxjs';
import { UnsubscribeComponent } from '../utils/unsubscribe/unsubscribe.component';
import { UniquenessRule } from '../../models/resource.model';

/**
 * Trigger button opening the modal used to configure the scoped uniqueness
 * rules of a resource (fields that must be unique, alone or combined,
 * across all its records).
 */
@Component({
  selector: 'shared-uniqueness-rules',
  templateUrl: './uniqueness-rules.component.html',
  styleUrls: ['./uniqueness-rules.component.scss'],
})
export class UniquenessRulesComponent extends UnsubscribeComponent {
  /** Uniqueness rules currently configured on the resource */
  @Input() rules: UniquenessRule[] = [];
  /** Fields of the resource, used to populate the field pickers */
  @Input() fields: any[] = [];
  /** Emits the updated list of rules once the modal is saved */
  @Output() save: EventEmitter<UniquenessRule[]> = new EventEmitter();

  /**
   * UniquenessRulesComponent constructor.
   *
   * @param dialog Used to open the edit modal.
   */
  constructor(private dialog: Dialog) {
    super();
  }

  /**
   * Opens the modal used to configure the uniqueness rules. Once closed,
   * emits the result if the user saved the changes.
   */
  async onClick(): Promise<void> {
    const { EditUniquenessRulesComponent } = await import(
      './edit-uniqueness-rules/edit-uniqueness-rules.component'
    );
    const dialogRef = this.dialog.open<UniquenessRule[]>(
      EditUniquenessRulesComponent,
      {
        data: {
          rules: this.rules,
          fields: this.fields,
        },
      }
    );
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((res) => {
      if (res) {
        this.save.emit(res);
      }
    });
  }
}
