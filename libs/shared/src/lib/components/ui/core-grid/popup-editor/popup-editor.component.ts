import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule, DialogModule } from '@oort-front/ui';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { StylesManager, SurveyModel } from 'survey-core';
import { FormBuilderService } from '../../../../services/form-builder/form-builder.service';
import { TranslateModule } from '@ngx-translate/core';

/** Dialog data interface */
interface DialogData {
  field: any;
  value: any;
}

/**
 * Popup component to edit reference data field, while doing inline edition in the grid.
 */
@Component({
  selector: 'shared-popup-editor',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule, TranslateModule],
  templateUrl: './popup-editor.component.html',
  styleUrls: ['../../../../style/survey.scss', './popup-editor.component.scss'],
})
export class PopupEditorComponent implements OnInit, AfterViewInit {
  public survey!: SurveyModel;
  @ViewChild('formContainer') formContainer!: ElementRef;

  /**
   * Popup editor, used by reference data fields in the grid
   *
   * @param {DialogRef} dialogRef Dialog reference of the component
   * @param {DialogData} data Data passed to the dialog when opened.
   * @param {FormBuilderService} formBuilderService Shared form builder service
   */
  constructor(
    private dialogRef: DialogRef<any>,
    @Inject(DIALOG_DATA) public data: DialogData,
    private formBuilderService: FormBuilderService
  ) {}

  ngOnInit(): void {
    const structure = {
      pages: [
        {
          elements: [
            {
              type: this.data.field.type,
              name: this.data.field.name,
              titleLocation: 'hidden',
              valueName: this.data.field.name,
              referenceData: this.data.field.referenceData.id,
              referenceDataDisplayField:
                this.data.field.referenceData.displayField,
              isPrimitiveValue: true,
            },
          ],
        },
      ],
    };
    StylesManager.applyTheme();
    this.survey = this.formBuilderService.createSurvey(
      JSON.stringify(structure),
      []
    );
    this.survey.setValue(this.data.field.name, this.data.value);
  }

  ngAfterViewInit(): void {
    this.survey.render(this.formContainer.nativeElement);
  }

  /** Close edition, without saving */
  onClose() {
    this.dialogRef.close();
  }

  /** Close edition and confirm changes */
  onConfirm() {
    this.dialogRef.close({
      value: this.survey.getValue(this.data.field.name),
    });
  }
}
