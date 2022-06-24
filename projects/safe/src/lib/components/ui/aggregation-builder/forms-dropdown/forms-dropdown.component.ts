import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  DoCheck,
  ElementRef,
} from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { isMongoId } from '../../../../utils/is-mongo-id';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Form } from '../../../../models/form.model';

/**
 * This component is used to display a dropdown where the user chan choose a form
 */
@Component({
  selector: 'safe-forms-dropdown',
  templateUrl: './forms-dropdown.component.html',
  styleUrls: ['./forms-dropdown.component.scss'],
})
export class SafeFormsDropdownComponent implements OnInit, DoCheck {
  // === DATA ===
  @Input() public forms$!: Observable<Form[]>;
  @Input() public loadingMore: boolean = true;
  private currentForms: Form[] = [];
  public filteredForms: Form[] = [];
  private loading = true;

  // === REACTIVE FORM ===
  @Input() sourceControl!: AbstractControl;
  private sourceFilter = '';

  // === LABEL ===
  @Input() label!: string;

  // === SCROLL DETECTION ===
  @ViewChild('auto') autocomplete?: MatAutocomplete;
  private initializeScrollListener = false;
  private panel?: ElementRef;
  @Output() scrolled = new EventEmitter<boolean>();

  // === FILTER ===
  @Output() filter = new EventEmitter<string>();

  /**
   * Constructor for the dropdown of forms
   */
  constructor() {}

  ngOnInit(): void {
    this.sourceFilter =
      this.sourceControl.value && !isMongoId(this.sourceControl.value)
        ? this.sourceControl.value
        : '';
    this.forms$.subscribe((forms) => {
      this.currentForms = forms;
      this.filteredForms = this.filterForms(this.sourceFilter);
      this.loading = false;
    });
    this.sourceControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value: string) => {
        // If not an ID
        if (!isMongoId(value)) {
          this.sourceFilter = value;
          this.filter.emit(value);
          this.filteredForms = this.filterForms(value);
        }
      });
  }

  /**
   * Getter for the source control
   *
   * @returns the source control
   */
  get sourceFormControl(): FormControl {
    return this.sourceControl as FormControl;
  }

  /**
   * Filter forms by name using passed parameters.
   *
   * @param value string used to filter.
   * @returns an array of forms
   */
  private filterForms(value: string): Form[] {
    return this.currentForms.filter((form) =>
      form.name?.toLowerCase().includes(value.toLowerCase())
    );
  }

  /**
   * Display function necessary for the autocomplete in order to display selected choice.
   *
   * @param formId the ID of the form
   * @returns the name of the form with matching ID if currentForms exists and has a length,
   * otherwise returns the formId
   */
  public displayName(formId: string): string {
    return this.currentForms && this.currentForms.length
      ? this.currentForms.find((x) => x.id === formId)?.name || formId
      : formId;
  }

  /**
   * Trigger add scroll listener to autocomplete.
   *
   * @param e open autocomplete event.
   */
  public onOpen(e: void) {
    this.initializeScrollListener = true;
  }

  /**
   * Remove scroll listener to autocomplete.
   *
   * @param e close autocomplete event.
   */
  public onClose(e: void) {
    if (this.panel) {
      this.panel.nativeElement.removeEventListener('scroll', (event: any) =>
        this.scrollListener(event)
      );
    }
    this.loading = false;
  }

  /**
   * Needs to use a DoCheck directive in order to access the autocomplete panel
   * because it is not yet initialized in the opened event.
   */
  ngDoCheck() {
    if (this.initializeScrollListener) {
      const panel = this.autocomplete?.panel;
      if (panel) {
        this.panel = panel;
        this.panel.nativeElement.addEventListener('scroll', (event: any) =>
          this.scrollListener(event)
        );
        this.initializeScrollListener = false;
      }
    }
  }

  /**
   * Scroll listener to emit when more forms are needed to load.
   *
   * @param event The event that implies that more forms are needed
   */
  private scrollListener(event: any): void {
    if (
      !this.loading &&
      event.target.scrollHeight -
        (event.target.clientHeight + event.target.scrollTop) <
        50
    ) {
      this.loading = true;
      this.scrolled.emit(true);
    }
  }
}
