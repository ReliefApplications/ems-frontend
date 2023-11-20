import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { ICreatorPlugin, SurveyCreatorModel } from 'survey-creator-core';
import { AngularComponentFactory, BaseAngular } from 'survey-angular-ui';
import { TranslateService } from '@ngx-translate/core';
import { SnackbarService } from '@oort-front/ui';
import { FormControl } from '@angular/forms';

// Documentation:
// https://surveyjs.io/survey-creator/examples/modify-tab-bar/angular#

/**
 * Class used as a plugin to load the custom JSON editor for the survey builder
 */
export class SurveyCustomJSONEditorPlugin implements ICreatorPlugin {
  public model: SurveyCreatorModel;

  /**
   * Adds the custom JSON editor tab to the survey builder
   *
   * @param creator Survey creator instance
   */
  constructor(private creator: SurveyCreatorModel) {
    this.model = creator;
    creator.addPluginTab('customJSONEditor', this, 'JSON Editor', undefined, 2);
  }

  /**
   * Runs on tab activation, mandatory for plugins
   */
  public activate(): void {
    return;
  }
}

/**
 * Custom JSON editor component, we use it to replace the default JSON editor in the survey builder
 * so we can manage its different behaviors.
 */
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'svc-tab-customJSONEditor',
  templateUrl: './custom-json-editor.component.html',
  styleUrls: ['./custom-json-editor.component.scss'],
})
export class customJSONEditorComponent
  extends BaseAngular<SurveyCreatorModel>
  implements OnInit
{
  @Input() model!: SurveyCreatorModel;

  public JSONtext = '';
  public formControl = new FormControl(this.JSONtext);

  // === MONACO EDITOR ===
  public editorOptions = {
    language: 'json',
    formatOnPaste: true,
  };

  /**
   * Custom JSON editor component
   *
   * @param ref Change detector reference
   * @param snackBar Shared snackbar service
   * @param translate Angular translate service
   */
  constructor(
    private ref: ChangeDetectorRef,
    private snackBar: SnackbarService,
    private translate: TranslateService
  ) {
    super(ref);
  }

  override ngOnInit() {
    this.JSONtext = this.model.text;
    this.formControl.setValue(this.JSONtext, { emitEvent: false });
  }

  /**
   * Gets the updated survey creator model, used to update the survey creator instance.
   *
   */
  protected getModel(): any {
    if (this.formControl.value) {
      this.JSONtext = this.formControl.value;
    }
    if (this.model.text !== this.JSONtext) {
      //Set the survey as modified, in order to be able to save
      this.model.setModified({});
      if (this.isJsonString(this.JSONtext)) {
        this.model.text = this.JSONtext;
      } else {
        this.snackBar.openSnackBar(
          this.translate.instant('components.formBuilder.errors.incorrectJSON'),
          { error: true }
        );
      }
    }
  }

  /**
   * Temporal JSON format check
   *
   * @param str JSON string
   * @returns A boolean indicating if the string is a JSON or not
   */
  private isJsonString(str: string) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }
}
AngularComponentFactory.Instance.registerComponent(
  'svc-tab-customJSONEditor',
  customJSONEditorComponent
);
