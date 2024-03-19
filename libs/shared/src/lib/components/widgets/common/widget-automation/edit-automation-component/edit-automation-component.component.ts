import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ButtonModule,
  DialogModule,
  FormWrapperModule,
  SelectMenuModule,
} from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { createAutomationComponentForm } from '../../../../../forms/automation.forms';
import { DashboardService } from '../../../../../services/dashboard/dashboard.service';
import { UnsubscribeComponent } from '../../../../utils/unsubscribe/unsubscribe.component';
import { BehaviorSubject, map, takeUntil } from 'rxjs';
import { MapLayersService } from '../../../../../services/map/map-layers.service';
import { get, isNil } from 'lodash';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import {
  ActionType,
  ActionWithProperties,
} from '../../../../../models/automation.model';

/**
 * Edition of automation component.
 */
@Component({
  selector: 'shared-edit-automation-component',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    ButtonModule,
    TranslateModule,
    ReactiveFormsModule,
    FormWrapperModule,
    SelectMenuModule,
    MonacoEditorModule,
  ],
  templateUrl: './edit-automation-component.component.html',
  styleUrls: ['./edit-automation-component.component.scss'],
})
export class EditAutomationComponentComponent
  extends UnsubscribeComponent
  implements OnInit
{
  /** Automation component form */
  public formGroup!: ReturnType<typeof createAutomationComponentForm>;
  /** Available widgets */
  public widgets = new BehaviorSubject<any[]>([]);
  /** Current editor */
  public editor!: ActionWithProperties | undefined;
  /** Available editors */
  public editors: ActionWithProperties[] = [
    {
      component: 'trigger',
      type: ActionType.mapClick,
    },
    {
      component: 'action',
      type: ActionType.mapGetCountry,
    },
    {
      component: 'action',
      type: ActionType.addLayer,
      properties: [
        {
          name: 'widget',
          required: true,
          editor: 'select',
          multiselect: false,
          async: true,
          choices: this.getChoicesFromWidgets('map'),
          onValueChanged: (value: any) => {
            this.setPropertyChoices(value, 'layers');
          },
          onInit: (value: any) => {
            this.setPropertyChoices(value, 'layers');
          },
        },
        {
          name: 'layers',
          required: true,
          editor: 'select',
          multiselect: true,
          async: false,
          choices: [],
        },
      ],
    },
    {
      component: 'action',
      type: ActionType.removeLayer,
      properties: [
        {
          name: 'widget',
          required: true,
          editor: 'select',
          multiselect: false,
          async: true,
          choices: this.getChoicesFromWidgets('map'),
          onValueChanged: (value: any) => {
            this.setPropertyChoices(value, 'layers');
          },
          onInit: (value: any) => {
            this.setPropertyChoices(value, 'layers');
          },
        },
        {
          name: 'layers',
          required: true,
          editor: 'select',
          multiselect: true,
          async: false,
          choices: [],
        },
      ],
    },
    {
      component: 'action',
      type: ActionType.addTab,
      properties: [
        {
          name: 'widget',
          required: true,
          editor: 'select',
          multiselect: false,
          async: true,
          choices: this.getChoicesFromWidgets('tabs'),
          onValueChanged: (value: any) => {
            this.setPropertyChoices(value, 'tabs');
          },
          onInit: (value: any) => {
            this.setPropertyChoices(value, 'tabs');
          },
        },
        {
          name: 'tabs',
          required: true,
          editor: 'select',
          multiselect: true,
          async: false,
          choices: [],
        },
      ],
    },
    {
      component: 'action',
      type: ActionType.removeTab,
      properties: [
        {
          name: 'widget',
          required: true,
          editor: 'select',
          multiselect: false,
          async: true,
          choices: this.getChoicesFromWidgets('tabs'),
          onValueChanged: (value: any) => {
            this.setPropertyChoices(value, 'tabs');
          },
          onInit: (value: any) => {
            this.setPropertyChoices(value, 'tabs');
          },
        },
        {
          name: 'tabs',
          required: true,
          editor: 'select',
          multiselect: true,
          async: false,
          choices: [],
        },
      ],
    },
    {
      component: 'action',
      type: ActionType.openTab,
      properties: [
        {
          name: 'widget',
          required: true,
          editor: 'select',
          multiselect: false,
          async: true,
          choices: this.getChoicesFromWidgets('tabs'),
          onValueChanged: (value: any) => {
            this.setPropertyChoices(value, 'tab');
          },
          onInit: (value: any) => {
            this.setPropertyChoices(value, 'tab');
          },
        },
        {
          name: 'tab',
          required: true,
          editor: 'select',
          multiselect: false,
          async: false,
          choices: [],
        },
      ],
    },
    {
      component: 'action',
      type: ActionType.displayCollapse,
      properties: [
        {
          name: 'widget',
          required: true,
          editor: 'select',
          multiselect: false,
          async: true,
          choices: this.getChoicesFromWidgets(),
        },
      ],
    },
    {
      component: 'action',
      type: ActionType.displayExpand,
      properties: [
        {
          name: 'widget',
          required: true,
          editor: 'select',
          multiselect: false,
          async: true,
          choices: this.getChoicesFromWidgets(),
        },
      ],
    },
    {
      component: 'action',
      type: ActionType.setContext,
      properties: [
        {
          name: 'mapping',
          type: 'json',
          editor: 'json',
          options: {
            theme: 'vs-dark',
            language: 'json',
            fixedOverflowWidgets: true,
            formatOnPaste: true,
            automaticLayout: true,
          },
        },
      ],
    },
  ];

  /**
   * Sets the choices for a specific property based on the widget settings.
   *
   * @param id The ID of the widget
   * @param propertyName The name of the property whose choices are being set (e.g., 'layers', 'tabs')
   */
  private setPropertyChoices(id: string, propertyName: string) {
    const property = this.editor?.properties?.find(
      (x: any) => x.name === propertyName
    );
    if (!property) {
      return;
    }

    const widget = this.widgets.getValue().find((widget) => widget.id === id);
    if (widget) {
      switch (propertyName) {
        case 'layers':
          this.mapLayersService
            .getLayers(get(widget, 'settings.layers') || [])
            .pipe(takeUntil(this.destroy$))
            .subscribe((layers) => {
              property.choices = layers.map((layer) => ({
                value: layer.id,
                text: layer.name,
              }));
            });
          break;
        case 'tab':
        case 'tabs':
          const tabs: any[] = get(widget, 'settings.tabs') || [];
          property.choices = tabs.map((tab: any, index) => ({
            value: tab.id,
            text: tab.label || `Tab ${index}`,
          }));
          break;
      }
    } else {
      property.choices = [];
    }
  }

  /**
   * Retrieves choices from widgets based on the specified widget type.
   * If a widget type is provided, filters widgets by the specified type;
   * otherwise, returns choices from all widgets.
   *
   * @param widgetType Optional. The type of widget to filter by.
   * @returns An Observable that emits an array of choices in the format { value: string; text: string; }[].
   */
  private getChoicesFromWidgets(widgetType?: string) {
    return this.widgets.pipe(
      takeUntil(this.destroy$),
      map((widgets) => {
        if (widgetType) {
          widgets = widgets.filter((widget) => widget.component === widgetType);
        }
        return widgets.map((x) => ({
          value: x.id,
          text: x.name || `Widget #${x.id}`,
        }));
      })
    );
  }

  /**
   * Edition of automation component.
   *
   * @param dashboardService Dashboard service
   * @param mapLayersService Map layers service
   * @param data Dialog data, automation component to edit
   */
  constructor(
    private dashboardService: DashboardService,
    private mapLayersService: MapLayersService,
    @Inject(DIALOG_DATA) public data: any
  ) {
    super();
    this.formGroup = createAutomationComponentForm(data);
  }

  ngOnInit(): void {
    this.dashboardService.widgets$
      .pipe(takeUntil(this.destroy$))
      .subscribe((widgets: any[]) => {
        this.widgets.next(widgets || []);
      });
    this.editor = this.editors.find(
      (editor) =>
        editor.component === this.data.component &&
        editor.type === this.data.type
    );
    if (isNil(this.editor)) {
      return;
    }
    for (const key in this.editor.properties) {
      const property = get(this.editor.properties, key);
      if (property.onValueChanged) {
        (this.formGroup as any)
          .get(`value.${property.name}`)
          ?.valueChanges.pipe(takeUntil(this.destroy$))
          .subscribe((value: any) => property.onValueChanged(value));
      }
      if (property.onInit) {
        property.onInit(
          (this.formGroup as any).get(`value.${property.name}`).value
        );
      }
    }
  }
}
