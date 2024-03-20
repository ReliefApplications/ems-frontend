import { moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { UntypedFormArray } from '@angular/forms';
import { UnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs/operators';

/**
 * List of query styles.
 */
@Component({
  selector: 'shared-query-style-list',
  templateUrl: './query-style-list.component.html',
  styleUrls: ['./query-style-list.component.scss'],
})
export class QueryStyleListComponent
  extends UnsubscribeComponent
  implements OnInit
{
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

  /**
   * Constructor for the query style list component
   */
  constructor() {
    super();
  }

  ngOnInit(): void {
    this.styles = this.form.value;
    this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
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
