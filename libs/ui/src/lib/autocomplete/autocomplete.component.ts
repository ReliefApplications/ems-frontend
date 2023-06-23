import {
  Component,
  ContentChildren,
  Input,
  OnDestroy,
  OnInit,
  QueryList,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { OptionComponent } from './components/option.component';
import { FormControl } from '@angular/forms';
import {
  Subject,
  debounceTime,
  distinctUntilChanged,
  takeUntil,
  tap,
} from 'rxjs';

/**
 * UI Autocomplete component
 */
@Component({
  selector: 'ui-autocomplete',
  templateUrl: './autocomplete.component.html',
})
export class AutocompleteComponent implements OnInit, OnDestroy {
  @Input() filterable = false;
  @ViewChild(TemplateRef) templateRef!: TemplateRef<any>;
  @ContentChildren(OptionComponent, { descendants: true })
  options!: QueryList<OptionComponent>;

  searchControl = new FormControl<string>('');
  loading = false;
  openPanel = false;
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    if (this.filterable) {
      this.searchControl.valueChanges
        .pipe(
          debounceTime(500),
          distinctUntilChanged(),
          tap(() => (this.loading = true)),
          takeUntil(this.destroy$)
        )
        .subscribe((value) => {
          this.options.forEach((option) => {
            if (option.label.includes(value?.toLowerCase())) {
              option.display = true;
            } else {
              option.display = false;
            }
          });
          this.loading = false;
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
