import { Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as SurveyCreator from 'survey-creator';
import * as SurveyKo from 'survey-knockout';
import { initCreatorSettings } from '../../survey/creator';
import { initCustomWidgets } from '../../survey/init';
import { WhoFormModalComponent } from '../form-modal/form-modal.component';

// === CUSTOM WIDGETS / COMPONENTS ===
initCustomWidgets(SurveyKo);

// === STYLE ===
SurveyCreator.StylesManager.applyTheme('darkblue');

// === CREATOR SETTINGS ===
initCreatorSettings(SurveyKo);

@Component({
  selector: 'who-form-builder',
  templateUrl: './form-builder.component.html',
  styleUrls: ['./form-builder.component.scss']
})
export class WhoFormBuilderComponent implements OnInit, OnChanges {

  @Input() structure: any;
  @Output() save: EventEmitter<any> = new EventEmitter();

  // === CREATOR ===
  surveyCreator: SurveyCreator.SurveyCreator;
  public json: any;

  constructor(
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    const options = {
      showEmbededSurveyTab: false,
      showJSONEditorTab: false,
      generateValidJSON: true,
      showTranslationTab: true
    };
    this.surveyCreator = new SurveyCreator.SurveyCreator(
      'surveyCreatorContainer',
      options
    );
    this.surveyCreator.haveCommercialLicense = true;
    this.surveyCreator.text = this.structure;
    this.surveyCreator.saveSurveyFunc = this.saveMySurvey;
    this.surveyCreator.showToolbox = 'right';
    this.surveyCreator.showPropertyGrid = 'right';
    this.surveyCreator.rightContainerActiveItem('toolbox');
  }

  ngOnChanges(): void {
    if (this.surveyCreator) {
      this.surveyCreator.text = this.structure;
    }
  }

  /*  Custom SurveyJS method, save the form when edited.
  */
  saveMySurvey = () => {
    this.save.emit(this.surveyCreator.text);
  }

  /*  Event listener to trigger embedded forms.
  */
  @HostListener('document:openForm', ['$event'])
  onOpenEmbeddedForm(event: any): void {
    const dialogRef = this.dialog.open(WhoFormModalComponent, {
      data: {
        template: event.detail.template,
        locale: event.locale
      }
    });
    // dialogRef.afterClosed().subscribe(() => {});
  }

}
