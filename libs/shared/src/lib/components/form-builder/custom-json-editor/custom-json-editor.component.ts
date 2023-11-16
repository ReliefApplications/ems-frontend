import { Component, OnInit, Input } from "@angular/core";
import { ICreatorPlugin, SurveyCreatorModel } from "survey-creator-core";
import { AngularComponentFactory, BaseAngular } from "survey-angular-ui";
import { FormControl } from "@angular/forms";

/**
 * Class used as a plugin to load the custom JSON editor for the survey builder
 */
export class SurveyCustomJSONEditorPlugin implements ICreatorPlugin {
    constructor(private creator: SurveyCreatorModel) {
        this.model = creator;
        creator.addPluginTab(
            "customJSONEditor",
            this,
            "JSON Editor",
            undefined,
            0
        );
    }
    public activate(): void { }
    public deactivate(): boolean {
        return true;
    }
    public model: SurveyCreatorModel;
  }

/**
 * Custom JSON editor component, we use it to replace the default JSON editor in the survey builder
 * so we can manage all its behaviours.
 */
@Component({
    // tslint:disable-next-line:component-selector
    selector: "svc-tab-customJSONEditor",
    templateUrl: "./custom-json-editor.component.html",
    styleUrls: ['./custom-json-editor.component.scss'],
})
export class customJSONEditorComponent extends BaseAngular<SurveyCreatorModel> implements OnInit {
    @Input() model!: SurveyCreatorModel;

    public JSONtext = '';

    // === MONACO EDITOR ===
    public editorOptions = {
      language: 'json',
      formatOnPaste: true,
    };
    
    override ngOnInit() {
        console.log(this.model);
        this.JSONtext = this.model.text;
    }
    
    protected getModel(): any {
        if (this.model.text !== this.JSONtext) {
            if (this.isJsonString(this.JSONtext)) {
                this.model.text = this.JSONtext;
            } else {
                alert("JSON is invalid, changes haven't been saved");
            }
        }
        return null;
    }

    /**
     * Temporal JSON parser
     * 
     * @param str 
     * @returns 
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
    "svc-tab-customJSONEditor",
    customJSONEditorComponent
);