import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LocalizedString } from '../../models/localized-string.model';

/**
 * Localized variant of the editable-text component. Displays projected
 * content (caller-controlled, typically piped through `sharedLocalize`) and,
 * on click, swaps in a `<shared-localized-input>` with EN/FR/UK tabs so the
 * user can edit per-locale values. Emits the full {@link LocalizedString} on
 * save and `null` on cancel — mirrors the parent's existing `onChange`
 * contract.
 */
@Component({
  selector: 'shared-editable-localized-text',
  templateUrl: './editable-localized-text.component.html',
  styleUrls: ['./editable-text.component.scss'],
})
export class EditableLocalizedTextComponent {
  /** Current value (locale map or legacy plain string). */
  @Input() value: LocalizedString | undefined = '';

  /** Edit permission control. */
  @Input() canEdit = false;

  /** Emits the new {@link LocalizedString} on save, or null on cancel. */
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onChange = new EventEmitter<LocalizedString | null>();

  /** Emits true when the inline editor is open. */
  @Output() formActiveEvent = new EventEmitter<boolean>();

  /** Whether the editor is currently open. */
  editing = false;

  /** Working draft mirrored to the localized input. */
  draft: LocalizedString = '';

  /** Open the editor, seeding the draft from the current value. */
  open(): void {
    if (!this.canEdit) return;
    this.draft = this.value ?? '';
    this.editing = true;
    this.formActiveEvent.emit(true);
  }

  /** Confirm the change and emit the draft. */
  save(): void {
    this.editing = false;
    this.formActiveEvent.emit(false);
    this.onChange.emit(this.draft);
  }

  /** Discard the draft and close the editor. */
  cancel(): void {
    this.editing = false;
    this.formActiveEvent.emit(false);
    this.onChange.emit(null);
  }

  /**
   * @returns True when the draft has at least one non-empty locale.
   */
  get hasContent(): boolean {
    if (typeof this.draft === 'string') return this.draft.length > 0;
    return Object.values(this.draft).some((v) => !!v);
  }
}
