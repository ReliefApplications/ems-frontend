import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
  ViewContainerRef,
} from '@angular/core';
import { Apollo } from 'apollo-angular';
import { ReferenceData } from '../../../models/reference-data.model';
import { FormControl } from '@angular/forms';
import { QuestionAngular } from 'survey-angular-ui';
import { QuestionReferenceDataDropdownModel } from './reference-data-dropdown.model';
import { ReferenceDataService } from '../../../services/reference-data/reference-data.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

/**
 * Reference data dropdown component.
 */
@Component({
  selector: 'shared-reference-data-dropdown',
  templateUrl: './reference-data-dropdown.component.html',
  styleUrls: ['./reference-data-dropdown.component.scss'],
})
export class ReferenceDataDropdownComponent
  extends QuestionAngular<QuestionReferenceDataDropdownModel>
  implements OnInit
{
  /** Control */
  public control = new FormControl<string | null>(null);
  /** Selected reference data */
  public selectedReferenceData: ReferenceData | null = null;
  /** Component destroy ref */
  private destroyRef = inject(DestroyRef);

  /**
   * The constructor function is a special function that is called when a new instance of the class is
   * created
   *
   * @param {ChangeDetectorRef} changeDetectorRef - Angular - This is angular change detector ref of the component instance needed for the survey AngularQuestion class
   * @param {ViewContainerRef} viewContainerRef - Angular - This is angular view container ref of the component instance needed for the survey AngularQuestion class
   * @param {Apollo} apollo - Apollo - This is the Apollo service that we'll use to make our GraphQL queries.
   * @param {ReferenceDataService} referenceDataService Shared reference data service
   */
  constructor(
    changeDetectorRef: ChangeDetectorRef,
    viewContainerRef: ViewContainerRef,
    private apollo: Apollo,
    private referenceDataService: ReferenceDataService
  ) {
    super(changeDetectorRef, viewContainerRef);
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.control.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (value: string | null) => {
          this.model.value = value;
        },
      });
    if (this.model.obj.referenceData) {
      this.referenceDataService
        .loadReferenceData(this.model.obj.referenceData)
        .then((referenceData) => {
          this.selectedReferenceData = referenceData;
          this.model.obj.setPropertyValue('_referenceData', referenceData);
          this.control.setValue(this.model.obj.referenceData, {
            emitEvent: false,
          });
          this.changeDetectorRef.detectChanges();
        });
    }
  }

  /**
   * Reset control value if there is a value previously to avoid triggering
   * not necessary actions
   *
   * @param event click event
   */
  clearFormField(event: Event) {
    if (this.control.value) {
      this.control.setValue(null);
    }
    event.stopPropagation();
  }
}
