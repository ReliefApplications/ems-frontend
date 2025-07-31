import { moveItemInArray } from '@angular/cdk/drag-drop';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  DestroyRef,
  inject,
} from '@angular/core';
import { UntypedFormArray } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

/**
 * List of query styles.
 */
@Component({
  selector: 'shared-query-style-list',
  templateUrl: './query-style-list.component.html',
  styleUrls: ['./query-style-list.component.scss'],
})
export class QueryStyleListComponent implements OnInit {
  /** Form array */
  @Input() form!: UntypedFormArray;
  /** Styles array */
  public styles: any[] = [];
  /** List of displayed columns */
  columns: string[] = ['name', 'preview', '_actions'];
  /** Event emitter for edit event */
  @Output() edit = new EventEmitter<any>();
  /** Event emitter for delete event */
  @Output() delete = new EventEmitter<any>();
  /** Component destroy ref */
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.styles = this.form.value;
    this.form.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.styles = value;
      });
  }

  /**
   * Reorders the style list.
   *
   * @param event drop event
   */
  public drop(event: any): void {
    const styles = [...this.styles];
    moveItemInArray(styles, event.previousIndex, event.currentIndex);
    this.form.setValue(styles);
  }
}
