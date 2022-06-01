import { moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormArray } from '@angular/forms';

/**
 * List of query styles.
 */
@Component({
  selector: 'safe-query-style-list',
  templateUrl: './query-style-list.component.html',
  styleUrls: ['./query-style-list.component.scss'],
})
export class SafeQueryStyleListComponent implements OnInit {
  @Input() form!: FormArray;
  public styles: any[] = [];
  columns: string[] = ['name', 'preview', '_actions'];

  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  /**
   * Constructor for the query style list component
   */
  constructor() {}

  ngOnInit(): void {
    this.styles = this.form.value;
    this.form.valueChanges.subscribe((value) => {
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
