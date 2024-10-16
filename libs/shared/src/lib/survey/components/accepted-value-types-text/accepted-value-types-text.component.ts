import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewContainerRef,
} from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {
  ButtonModule,
  FormWrapperModule,
  SelectMenuModule,
  TooltipModule,
} from '@oort-front/ui';
import { Subject, takeUntil } from 'rxjs';
import { QuestionAngular } from 'survey-angular-ui';
import { QuestionAcceptedValueTypesTextModel } from './accepted-value-types-text.model';

/**
 * Default accepted types
 */
const DEFAULT_ACCEPTED_TYPES = [
  '.BMP',
  '.CSV',
  '.DOC',
  '.DOCM',
  '.DOCX',
  '.EML',
  '.EPUB',
  '.GIF',
  '.GZ',
  '.HTM',
  '.HTML',
  '.JPG',
  '.JPEG',
  '.MSG',
  '.ODP',
  '.ODT',
  '.ODS',
  '.PDF',
  '.PNG',
  '.PPT',
  '.PPTX',
  '.PPTM',
  '.RTF',
  '.TXT',
  '.XLS',
  '.XLSX',
  '.XPS',
  '.ZIP',
  '.XLSM',
  '.XML',
];

/**
 * This component is used to select accepted file types for a file question
 */
@Component({
  selector: 'shared-accepted-value-text',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    FormWrapperModule,
    SelectMenuModule,
    TooltipModule,
    ReactiveFormsModule,
    ButtonModule,
    FormsModule,
  ],
  template: ` <form [formGroup]="formGroup">
    <div uiFormFieldDirective [outline]="false">
      <ui-select-menu
        formControlName="valueTypes"
        [filterable]="true"
        [multiselect]="true"
      >
        <ui-select-option
          *ngFor="let value of acceptedValueTypes"
          [value]="value.value"
        >
          {{ value.text }}
        </ui-select-option>
      </ui-select-menu>
      <ui-button
        uiSuffix
        variant="danger"
        [isIcon]="true"
        icon="close"
        class="mr-1 pl-0"
        (click)="clearSelection()"
        [uiTooltip]="
          'components.formBuilder.propertyGrid.file.acceptedFiles.clear'
            | translate
        "
      ></ui-button>
    </div>
  </form>`,
})
export class AcceptedValueTypesTextComponent
  extends QuestionAngular<QuestionAcceptedValueTypesTextModel>
  implements OnInit, OnDestroy
{
  /** Accepted value types for file questions */
  public acceptedValueTypes = [
    { value: '.7Z', text: '7z' },
    { value: '.BMP', text: 'bmp' },
    { value: '.CSV', text: 'csv' },
    { value: '.DOC', text: 'doc' },
    { value: '.DOCM', text: 'docm' },
    { value: '.DOCX', text: 'docx' },
    { value: '.EMF', text: 'emf' },
    { value: '.EML', text: 'eml' },
    { value: '.EPUB', text: 'epub' },
    { value: '.GIF', text: 'gif' },
    { value: '.GZ', text: 'gz' },
    { value: '.HTM', text: 'htm' },
    { value: '.HTML', text: 'html' },
    { value: '.JPG', text: 'jpg' },
    { value: '.JPEG', text: 'jpeg' },
    { value: '.JSON', text: 'json' },
    { value: '.KML', text: 'kml' },
    { value: '.KMZ', text: 'kmz' },
    { value: '.MDI', text: 'mdi' },
    { value: '.MHT', text: 'mht' },
    { value: '.MSG', text: 'msg' },
    { value: '.MSGT', text: 'msgt' },
    { value: '.ODP', text: 'odp' },
    { value: '.ODS', text: 'ods' },
    { value: '.ODT', text: 'odt' },
    { value: '.OFT', text: 'oft' },
    { value: '.PDF', text: 'pdf' },
    { value: '.PNG', text: 'png' },
    { value: '.PPT', text: 'ppt' },
    { value: '.PPTM', text: 'pptm' },
    { value: '.PPTX', text: 'pptx' },
    { value: '.PUB', text: 'pub' },
    { value: '.RAR', text: 'rar' },
    { value: '.RTF', text: 'rtf' },
    { value: '.SVG', text: 'svg' },
    { value: '.TEXTCLIPPING', text: 'textclipping' },
    { value: '.TIF', text: 'tif' },
    { value: '.TMP', text: 'tmp' },
    { value: '.TXT', text: 'txt' },
    { value: '.URL', text: 'url' },
    { value: '.WEBARCHIVE', text: 'webarchive' },
    { value: '.WEBP', text: 'webp' },
    { value: '.WMF', text: 'wmf' },
    { value: '.XLS', text: 'xls' },
    { value: '.XLSM', text: 'xlsm' },
    { value: '.XLSX', text: 'xlsx' },
    { value: '.XML', text: 'xml' },
    { value: '.XPS', text: 'xps' },
    { value: '.XT', text: 'xt' },
    { value: '.ZIP', text: 'zip' },
  ];

  /** Form control for accepted value types */
  public formGroup = this.fb.group({
    valueTypes: [['']],
  });

  /** Destroy subject */
  private destroy$: Subject<void> = new Subject<void>();

  /**
   * The constructor function is a special function that is called when a new instance of the class is
   * created
   *
   * @param {ChangeDetectorRef} changeDetectorRef - Angular - This is angular change detector ref of the component instance needed for the survey AngularQuestion class
   * @param {ViewContainerRef} viewContainerRef - Angular - This is angular view container ref of the component instance needed for the survey AngularQuestion class
   * @param fb Angular form builder
   */
  constructor(
    changeDetectorRef: ChangeDetectorRef,
    viewContainerRef: ViewContainerRef,
    private fb: FormBuilder
  ) {
    super(changeDetectorRef, viewContainerRef);
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.formGroup
      .get('valueTypes')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (values) => {
          this.surveyModel.getQuestionByName('acceptedTypes').value =
            values?.length ? values.join(',') : '';
          this.changeDetectorRef.detectChanges();
        },
      });
    this.formGroup
      .get('valueTypes')
      ?.setValue(
        this.surveyModel.getQuestionByName('acceptedTypes').value?.split(',') ??
          DEFAULT_ACCEPTED_TYPES
      );
  }

  /**
   * Clear selection and reset control
   */
  public clearSelection() {
    this.formGroup.get('valueTypes')?.setValue([]);
    this.formGroup.get('valueTypes')?.reset();
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
