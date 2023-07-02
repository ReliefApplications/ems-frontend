import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  Renderer2,
  Inject,
} from '@angular/core';
import { AbstractControl, UntypedFormControl } from '@angular/forms';
import { isMongoId } from '../../../../utils/is-mongo-id';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Form } from '../../../../models/form.model';
import { SafeUnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';

/**
 * This component is used to display a dropdown where the user chan choose a form
 */
@Component({
  selector: 'safe-forms-dropdown',
  templateUrl: './forms-dropdown.component.html',
  styleUrls: ['./forms-dropdown.component.scss'],
})
export class SafeFormsDropdownComponent
  extends SafeUnsubscribeComponent
  implements OnInit
{
  // === DATA ===
  @Input() public forms$!: Observable<Form[]>;
  @Input() public loadingMore = true;
  private currentForms: Form[] = [];
  public filteredForms: Form[] = [];
  private loading = true;

  // === REACTIVE FORM ===
  @Input() sourceControl!: AbstractControl;
  private sourceFilter = '';

  // === LABEL ===
  @Input() label!: string;

  // === SCROLL DETECTION ===
  private scrollListenerHandler!: any;
  private panel?: HTMLElement;
  @Output() scrolled = new EventEmitter<boolean>();

  // === FILTER ===
  @Output() filter = new EventEmitter<string>();

  /**
   * Constructor for the dropdown of forms
   *
   * @param renderer Renderer2
   * @param document Document
   */
  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {
    super();
  }

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
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: string) => {
        // If not an ID
        if (!isMongoId(value)) {
          this.sourceFilter = value;
          this.filter.emit(value);
          this.filteredForms = this.filterForms(value);
          this.sourceFormControl.setErrors({ pattern: true });
        } else {
          this.sourceFormControl.setErrors({ pattern: false });
        }
      });
  }

  /**
   * Getter for the source control
   *
   * @returns the source control
   */
  get sourceFormControl(): UntypedFormControl {
    return this.sourceControl as UntypedFormControl;
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
   * Trigger add scroll listener to autocomplete.
   *
   */
  public onOpen() {
    const panel = this.document.getElementById('autocompleteList');
    if (panel) {
      this.panel = panel;
      if (this.scrollListenerHandler) {
        this.scrollListenerHandler();
      }
      this.scrollListenerHandler = this.renderer.listen(
        this.panel,
        'scroll',
        (event: any) => this.scrollListener(event)
      );
    }
  }

  /**
   * Remove scroll listener to autocomplete.
   *
   */
  public onClose() {
    if (this.panel) {
      if (this.scrollListenerHandler) {
        this.scrollListenerHandler();
      }
    }
    this.loading = false;
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
